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

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: securityHeaders
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: securityHeaders
        });
    }

    // Validate Content-Type
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
        return new Response(JSON.stringify({ 
            error: 'Content-Type must be application/json' 
        }), {
            status: 415,
            headers: securityHeaders
        });
    }

    // Check Content-Length to prevent large payloads (10KB limit)
    const contentLength = request.headers.get('Content-Length');
    const MAX_BODY_SIZE = 10 * 1024; // 10KB
    
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        return new Response(JSON.stringify({ 
            error: 'Request body too large' 
        }), {
            status: 413,
            headers: securityHeaders
        });
    }

    try {
        // Get client IP for rate limiting
        const clientIP = getClientIP(request);

        // Check rate limit
        const rateLimitResult = await checkRateLimit(clientIP, env);

        if (!rateLimitResult.allowed) {
            return new Response(JSON.stringify({
                error: 'Too many requests. Please try again later.',
                retryAfter: rateLimitResult.retryAfter
            }), {
                status: 429,
                headers: {
                    ...securityHeaders,
                    'Retry-After': rateLimitResult.retryAfter.toString()
                }
            });
        }

        // Read body with size check (in case Content-Length header is missing)
        const bodyText = await request.text();
        
        if (bodyText.length > MAX_BODY_SIZE) {
            return new Response(JSON.stringify({ 
                error: 'Request body too large' 
            }), {
                status: 413,
                headers: securityHeaders
            });
        }

        let body;
        try {
            body = JSON.parse(bodyText);
        } catch (parseError) {
            return new Response(JSON.stringify({ 
                error: 'Invalid JSON in request body' 
            }), {
                status: 400,
                headers: securityHeaders
            });
        }
        
        const { email, role, teamSize, useCase, honeypot, turnstileToken } = body;

        // Bot detection: reject if honeypot field is filled
        if (honeypot) {
            console.log('Bot detected via honeypot:', clientIP);
            // Return success to avoid revealing honeypot
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: securityHeaders
            });
        }

        // Verify Cloudflare Turnstile token
        const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIP, env);
        
        if (!turnstileResult.success) {
            console.log('Turnstile verification failed:', turnstileResult.error);
            return new Response(JSON.stringify({
                error: 'Security verification failed. Please try again.'
            }), {
                status: 403,
                headers: securityHeaders
            });
        }

        // Log warning if Turnstile verification had issues but passed
        if (turnstileResult.warning) {
            console.warn('Turnstile warning:', turnstileResult.warning);
        }

        // Validate email
        if (!email || !isValidEmail(email)) {
            return new Response(JSON.stringify({
                error: 'Please provide a valid email address'
            }), {
                status: 400,
                headers: securityHeaders
            });
        }

        // Validate field lengths
        const MAX_TEXT_LENGTH = 500;

        if (!validateFieldLength(email, 254) ||
            !validateFieldLength(role, MAX_TEXT_LENGTH) ||
            !validateFieldLength(teamSize, MAX_TEXT_LENGTH) ||
            !validateFieldLength(useCase, MAX_TEXT_LENGTH)) {
            return new Response(JSON.stringify({
                error: 'Input too long. Please use shorter text.'
            }), {
                status: 400,
                headers: securityHeaders
            });
        }

        // Sanitize inputs
        const sanitizedEmail = email.toLowerCase().trim();
        const sanitizedRole = sanitizeInput(role);
        const sanitizedTeamSize = sanitizeInput(teamSize);
        const sanitizedUseCase = sanitizeInput(useCase);

        // Insert into D1 database
        const db = env.DB;

        // Check for duplicate email
        const existingLead = await db
            .prepare('SELECT id FROM leads WHERE email = ?')
            .bind(sanitizedEmail)
            .first();

        if (existingLead) {
            return new Response(JSON.stringify({
                error: 'This email is already on the wishlist'
            }), {
                status: 409,
                headers: securityHeaders
            });
        }

        const result = await db
            .prepare('INSERT INTO leads (email, role, team_size, use_case) VALUES (?, ?, ?, ?)')
            .bind(
                sanitizedEmail,
                sanitizedRole || null,
                sanitizedTeamSize || null,
                sanitizedUseCase || null
            )
            .run();

        if (!result.success) {
            console.error('Database insert failed:', result);
            // Generic error message to avoid information leakage
            return new Response(JSON.stringify({
                error: 'Unable to process request. Please try again later.'
            }), {
                status: 500,
                headers: securityHeaders
            });
        }

        // Update rate limit counter after successful submission
        await updateRateLimit(clientIP, env);

        // Send confirmation email — fire-and-forget; a failure here never blocks signup
        const emailResult = await sendWaitlistConfirmation(sanitizedEmail, env);
        if (!emailResult.success) {
            console.warn('Confirmation email failed (signup still recorded):', emailResult.error);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully added to waitlist'
        }), {
            status: 200,
            headers: securityHeaders
        });

    } catch (err) {
        console.error('Function error:', err);
        // Generic error message - don't expose internal details
        return new Response(JSON.stringify({
            error: 'Unable to process request. Please try again later.'
        }), {
            status: 500,
            headers: securityHeaders
        });
    }
}
