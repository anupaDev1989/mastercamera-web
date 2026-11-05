import { getClientIP, checkRateLimit, updateRateLimit, getSecurityHeaders } from '../lib/security.js';

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

    try {
        const clientIP = getClientIP(request);
        const rateLimitResult = await checkRateLimit(clientIP, env, 'download');

        if (!rateLimitResult.allowed) {
            return new Response(JSON.stringify({ error: 'Too many requests' }), {
                status: 429,
                headers: securityHeaders
            });
        }

        await env.DB.prepare('INSERT INTO download_clicks DEFAULT VALUES').run();
        await updateRateLimit(clientIP, env, 'download');

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: securityHeaders
        });
    } catch (err) {
        console.error('track-download error:', err);
        return new Response(JSON.stringify({ error: 'Unable to process request' }), {
            status: 500,
            headers: securityHeaders
        });
    }
}
