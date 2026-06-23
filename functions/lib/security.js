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
    if (!ip) {
        console.error('No IP provided for rate limiting');
        return { allowed: false, error: 'Unable to verify request source' };
    }

    if (!env.RATE_LIMIT) {
        console.error('RATE_LIMIT KV namespace not configured');
        // Fail closed in production - KV is required for rate limiting
        return { allowed: false, error: 'Rate limiting unavailable' };
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
        // Fail closed on errors - better to block one request than allow abuse
        return { allowed: false, error: 'Rate limiting error' };
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

    if (!env.TURNSTILE_S_KEY) {
        console.error('TURNSTILE_S_KEY not configured - failing closed');
        return { success: false, error: 'Security verification unavailable' };
    }

    try {
        const formData = new FormData();
        formData.append('secret', env.TURNSTILE_S_KEY);
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

        if (!verifyResponse.ok) {
            console.error('Turnstile API returned non-OK status:', verifyResponse.status);
            return { success: false, error: 'Security verification failed' };
        }

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
        // Fail closed on errors - security checks must pass
        return { success: false, error: 'Security verification error' };
    }
}

// Generate security headers with proper CORS
export function getSecurityHeaders(origin, env) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };

    // CORS: Restrict to allowed origins only
    const allowedOrigins = env?.ALLOWED_ORIGINS 
        ? env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : [];

    // Check if origin is in allowed list
    if (origin && allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Vary'] = 'Origin';
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
        headers['Access-Control-Max-Age'] = '86400';
    }

    return headers;
}
