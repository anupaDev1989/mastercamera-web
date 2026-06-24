import {
    isValidEmail,
    sanitizeInput,
    validateFieldLength,
    checkRateLimit,
    updateRateLimit,
    getClientIP,
    getSecurityHeaders,
    verifyTurnstileToken
} from '../lib/security.js';
import { sendWaitlistConfirmation } from '../lib/email.js';

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

    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
            status: 415,
            headers: securityHeaders
        });
    }

    const contentLength = request.headers.get('Content-Length');
    const MAX_BODY_SIZE = 10 * 1024;

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
                headers: { ...securityHeaders, 'Retry-After': rateLimitResult.retryAfter.toString() }
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

        const { email, industry, honeypot, turnstileToken } = body;

        if (honeypot) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: securityHeaders
            });
        }

        const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIP, env);

        if (!turnstileResult.success) {
            return new Response(JSON.stringify({ error: 'Security verification failed. Please try again.' }), {
                status: 403,
                headers: securityHeaders
            });
        }

        if (!email || !isValidEmail(email)) {
            return new Response(JSON.stringify({ error: 'Please provide a valid email address' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        if (!validateFieldLength(email, 254) || !validateFieldLength(industry, 500)) {
            return new Response(JSON.stringify({ error: 'Input too long. Please use shorter text.' }), {
                status: 400,
                headers: securityHeaders
            });
        }

        const sanitizedEmail = email.toLowerCase().trim();
        const sanitizedIndustry = sanitizeInput(industry);

        const db = env.DB;

        const existingLead = await db
            .prepare('SELECT id FROM leads WHERE email = ?')
            .bind(sanitizedEmail)
            .first();

        if (existingLead) {
            return new Response(JSON.stringify({ error: 'This email is already on the waitlist' }), {
                status: 409,
                headers: securityHeaders
            });
        }

        const result = await db
            .prepare('INSERT INTO leads (email, industry) VALUES (?, ?)')
            .bind(sanitizedEmail, sanitizedIndustry || null)
            .run();

        if (!result.success) {
            return new Response(JSON.stringify({ error: 'Unable to process request. Please try again later.' }), {
                status: 500,
                headers: securityHeaders
            });
        }

        await updateRateLimit(clientIP, env);

        const emailResult = await sendWaitlistConfirmation(sanitizedEmail, env);
        if (!emailResult.success) {
            console.warn('Confirmation email failed (signup still recorded):', emailResult.error);
        }

        return new Response(JSON.stringify({ success: true, message: 'Successfully added to waitlist' }), {
            status: 200,
            headers: securityHeaders
        });

    } catch (err) {
        console.error('Function error:', err);
        return new Response(JSON.stringify({ error: 'Unable to process request. Please try again later.' }), {
            status: 500,
            headers: securityHeaders
        });
    }
}
