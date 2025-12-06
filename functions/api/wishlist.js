import {
    isValidEmail,
    sanitizeInput,
    validateFieldLength,
    checkRateLimit,
    updateRateLimit,
    getClientIP,
    getSecurityHeaders
} from '../lib/security.js';

export async function onRequest({ request, env }) {
    const securityHeaders = getSecurityHeaders();

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

        const body = await request.json();
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
        if (turnstileToken) {
            try {
                const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        secret: env.TURNSTILE_SECRET_KEY,
                        response: turnstileToken,
                        remoteip: clientIP
                    })
                });

                const turnstileData = await turnstileResponse.json();

                if (!turnstileData.success) {
                    console.log('Turnstile verification failed:', clientIP, turnstileData['error-codes']);
                    return new Response(JSON.stringify({
                        error: 'Verification failed. Please try again.'
                    }), {
                        status: 400,
                        headers: securityHeaders
                    });
                }
            } catch (error) {
                console.error('Turnstile verification error:', error);
                // Fail securely - reject if we can't verify
                return new Response(JSON.stringify({
                    error: 'Verification service unavailable. Please try again later.'
                }), {
                    status: 503,
                    headers: securityHeaders
                });
            }
        } else {
            // Reject if no Turnstile token provided
            return new Response(JSON.stringify({
                error: 'Verification required. Please complete the challenge.'
            }), {
                status: 400,
                headers: securityHeaders
            });
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

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully added to wishlist'
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
