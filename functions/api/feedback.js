import {
    sanitizeInput,
    validateFieldLength,
    isValidEmail,
    checkRateLimit,
    updateRateLimit,
    getClientIP,
    getSecurityHeaders,
    verifyAppKey
} from '../lib/security.js';

// Accepted feedback categories. Anything else is rejected.
const VALID_TYPES = ['bug', 'feature', 'general'];

const MAX_MESSAGE_LENGTH = 5000;
const MAX_BODY_SIZE = 16 * 1024; // 16 KB — feedback can be longer than a waitlist signup

export async function onRequest({ request, env }) {
    const origin = request.headers.get('Origin');
    const securityHeaders = getSecurityHeaders(origin, env);

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: securityHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: securityHeaders
        });
    }

    // Native client auth: shared app key (no Origin/Turnstile available in-app).
    if (!verifyAppKey(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: securityHeaders
        });
    }

    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
            status: 415,
            headers: securityHeaders
        });
    }

    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        return new Response(JSON.stringify({ error: 'Request body too large' }), {
            status: 413,
            headers: securityHeaders
        });
    }

    try {
        const clientIP = getClientIP(request);
        const rateLimitResult = await checkRateLimit(clientIP, env);

        if (!rateLimitResult.allowed) {
            return new Response(JSON.stringify({
                error: 'Too many requests. Please try again later.',
                retryAfter: rateLimitResult.retryAfter
            }), {
                status: 429,
                headers: { ...securityHeaders, 'Retry-After': (rateLimitResult.retryAfter || 3600).toString() }
            });
        }

        const bodyText = await request.text();

        if (bodyText.length > MAX_BODY_SIZE) {
            return new Response(JSON.stringify({ error: 'Request body too large' }), {
                status: 413,
                headers: securityHeaders
            });
        }

        let body;
        try {
            body = JSON.parse(bodyText);
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        const { type, message, contactEmail, appVersion, osVersion, deviceModel, honeypot } = body;

        // Silently accept bot submissions that fill the hidden honeypot field.
        if (honeypot) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: securityHeaders
            });
        }

        if (!type || !VALID_TYPES.includes(type)) {
            return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        if (!validateFieldLength(message, MAX_MESSAGE_LENGTH)) {
            return new Response(JSON.stringify({ error: 'Message is too long' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        // contactEmail is optional, but if present it must be valid.
        if (contactEmail && !isValidEmail(contactEmail)) {
            return new Response(JSON.stringify({ error: 'Please provide a valid email address' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        if (!validateFieldLength(contactEmail, 254) ||
            !validateFieldLength(appVersion, 64) ||
            !validateFieldLength(osVersion, 64) ||
            !validateFieldLength(deviceModel, 64)) {
            return new Response(JSON.stringify({ error: 'Input too long' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        const sanitizedMessage = sanitizeInput(message);
        const sanitizedEmail = contactEmail ? contactEmail.toLowerCase().trim() : null;
        const sanitizedAppVersion = appVersion ? sanitizeInput(appVersion) : null;
        const sanitizedOsVersion = osVersion ? sanitizeInput(osVersion) : null;
        const sanitizedDeviceModel = deviceModel ? sanitizeInput(deviceModel) : null;

        const db = env.DB;

        const result = await db
            .prepare(
                'INSERT INTO feedback (type, message, contact_email, app_version, os_version, device_model) VALUES (?, ?, ?, ?, ?, ?)'
            )
            .bind(type, sanitizedMessage, sanitizedEmail, sanitizedAppVersion, sanitizedOsVersion, sanitizedDeviceModel)
            .run();

        if (!result.success) {
            return new Response(JSON.stringify({ error: 'Unable to process request. Please try again later.' }), {
                status: 500,
                headers: securityHeaders
            });
        }

        await updateRateLimit(clientIP, env);

        return new Response(JSON.stringify({ success: true, message: 'Thanks for your feedback!' }), {
            status: 200,
            headers: securityHeaders
        });

    } catch (err) {
        console.error('Feedback function error:', err);
        return new Response(JSON.stringify({ error: 'Unable to process request. Please try again later.' }), {
            status: 500,
            headers: securityHeaders
        });
    }
}
