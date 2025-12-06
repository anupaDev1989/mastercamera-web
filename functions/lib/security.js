/**
 * Security utilities for input validation, sanitization, and rate limiting
 */

// Email validation using RFC 5322 standard regex (simplified)
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    // Basic email regex that covers most valid cases
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check format and length (max 254 chars per RFC 5321)
    return emailRegex.test(email) && email.length <= 254;
}

// Sanitize input to prevent XSS and injection attacks
export function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove any HTML tags and potentially dangerous characters
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/['"]/g, '') // Remove quotes
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers like onclick=
}

// Validate field length
export function validateFieldLength(field, maxLength) {
    if (!field) {
        return true; // Empty fields are okay (optional fields)
    }

    return typeof field === 'string' && field.length <= maxLength;
}

// Rate limiting using Cloudflare KV
export async function checkRateLimit(ip, env) {
    if (!ip || !env.RATE_LIMIT) {
        // If KV is not configured, allow request (graceful degradation)
        return { allowed: true };
    }

    try {
        const key = `ratelimit:${ip}`;
        const now = Date.now();
        const hourAgo = now - (60 * 60 * 1000); // 1 hour ago

        // Get existing rate limit data
        const data = await env.RATE_LIMIT.get(key, { type: 'json' });

        if (!data) {
            // First request from this IP
            return { allowed: true, isFirstRequest: true };
        }

        // Filter out old requests (older than 1 hour)
        const recentRequests = data.requests.filter(timestamp => timestamp > hourAgo);

        // Check if limit exceeded (5 requests per hour)
        const RATE_LIMIT_MAX = 5;

        if (recentRequests.length >= RATE_LIMIT_MAX) {
            const oldestRequest = Math.min(...recentRequests);
            const resetTime = new Date(oldestRequest + (60 * 60 * 1000));

            return {
                allowed: false,
                retryAfter: Math.ceil((resetTime - now) / 1000), // seconds until reset
                resetTime: resetTime.toISOString()
            };
        }

        return { allowed: true, requestCount: recentRequests.length };

    } catch (error) {
        console.error('Rate limit check error:', error);
        // On error, allow request (fail open)
        return { allowed: true };
    }
}

// Update rate limit counter
export async function updateRateLimit(ip, env) {
    if (!ip || !env.RATE_LIMIT) {
        return;
    }

    try {
        const key = `ratelimit:${ip}`;
        const now = Date.now();
        const hourAgo = now - (60 * 60 * 1000);

        // Get existing data
        const data = await env.RATE_LIMIT.get(key, { type: 'json' });

        let requests = data ? data.requests.filter(timestamp => timestamp > hourAgo) : [];
        requests.push(now);

        // Store with 2 hour expiration (cleanup old keys)
        await env.RATE_LIMIT.put(
            key,
            JSON.stringify({ requests }),
            { expirationTtl: 60 * 60 * 2 }
        );

    } catch (error) {
        console.error('Rate limit update error:', error);
    }
}

// Get client IP from request
export function getClientIP(request) {
    // Cloudflare provides the client IP in the CF-Connecting-IP header
    return request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For')?.split(',')[0] ||
        'unknown';
}

// Verify Cloudflare Turnstile token
export async function verifyTurnstileToken(token, clientIP, env) {
    if (!token) {
        return { success: false, error: 'Turnstile token is required' };
    }

    if (!env.TURNSTILE_SECRET_KEY) {
        console.error('TURNSTILE_SECRET_KEY not configured');
        // In production, you might want to fail closed (return false)
        // For now, we'll log and fail open to prevent breaking the app
        return { success: true, warning: 'Turnstile not configured' };
    }

    try {
        const formData = new FormData();
        formData.append('secret', env.TURNSTILE_SECRET_KEY);
        formData.append('response', token);
        if (clientIP && clientIP !== 'unknown') {
            formData.append('remoteip', clientIP);
        }

        const verifyResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                body: formData,
            }
        );

        const outcome = await verifyResponse.json();

        if (!outcome.success) {
            console.log('Turnstile verification failed:', outcome['error-codes']);
            return {
                success: false,
                error: 'Security check failed',
                errorCodes: outcome['error-codes']
            };
        }

        return { success: true };

    } catch (error) {
        console.error('Turnstile verification error:', error);
        // On error, fail open to prevent blocking legitimate users
        // In production, you may want to fail closed for security
        return { success: true, warning: 'Verification error, allowing request' };
    }
}

// Generate security headers
export function getSecurityHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        // CORS headers
        'Access-Control-Allow-Origin': '*', // Adjust if you want to restrict to specific domain
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };
}
