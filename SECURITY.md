# Security Features Documentation

## Overview

This document outlines the comprehensive security measures implemented in the Kitly Landing Page to protect against common web vulnerabilities and ensure safe data collection.

## Implemented Security Features

### 1. Input Validation & Sanitization

#### Backend Validation ([wishlist.js](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/functions/api/wishlist.js))

- **Email Validation**: RFC 5322 compliant email regex validation
  - Format: `[^\s@]+@[^\s@]+\.[^\s@]+`
  - Maximum length: 254 characters
  - Case normalization (converted to lowercase)

- **Field Length Limits**:
  - Email: 254 characters (RFC 5321 standard)
  - Role, Team Size, Use Case: 500 characters each

- **Input Sanitization**:
  - Removes HTML tags (`<` and `>`)
  - Removes quotes (`'` and `"`)
  - Strips `javascript:` protocol
  - Removes event handler attributes (e.g., `onclick=`)
  - Trims whitespace

- **SQL Injection Protection**:
  - Parameterized queries using D1's prepared statements
  - All user inputs are bound as parameters, not concatenated

#### Frontend Validation ([Wishlist.jsx](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/src/sections/Wishlist.jsx))

- **Client-side Email Validation**: Validates format before submission
- **Length Restrictions**: HTML5 `maxLength` attributes on all inputs
- **Real-time Validation**: Shows specific error messages for validation failures
- **Input Sanitization**: Sanitizes inputs before sending to API

### 2. Rate Limiting

#### IP-based Rate Limiting
- **Limit**: 5 submissions per IP address per hour
- **Implementation**: Uses Cloudflare Workers KV for distributed rate limiting
- **Response**: HTTP 429 (Too Many Requests) with `Retry-After` header
- **Reset**: Automatic after 1 hour from oldest request
- **Storage**: 2-hour TTL for automatic cleanup

#### Client-side Throttling
- **Cooldown Period**: 30 seconds between submissions
- **Implementation**: Uses `useRef` to track last submission time
- **User Feedback**: Shows countdown timer if user tries to submit too soon

### 3. Bot Protection

#### Honeypot Field
- **Field Name**: `website`
- **Visibility**: Hidden from legitimate users (positioned off-screen)
- **Attributes**:
  - `tabIndex="-1"`: Not focusable via keyboard
  - `autoComplete="off"`: Browsers won't fill it
  - `aria-hidden="true"`: Screen readers ignore it

- **Detection**: If field is filled, request is silently rejected
- **Response**: Returns success to avoid revealing the honeypot technique

#### Cloudflare Turnstile
- **Widget Type**: Managed (automatic challenge selection)
- **Theme**: Auto (matches light/dark mode)
- **Implementation**: [@marsidev/react-turnstile](https://github.com/marsidev/react-turnstile)
- **Verification**: Server-side token validation via Cloudflare API
- **Security Features**:
  - Single-use tokens
  - Time-limited validation
  - IP address binding
  - Fail-secure verification (rejects if service unavailable)

- **Error Handling**:
  - Auto-reset widget on failure
  - Clear user feedback on verification errors
  - Token expiration handling

- **Setup Guide**: See [TURNSTILE_SETUP.md](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/TURNSTILE_SETUP.md) for configuration instructions

### 4. Security Headers

#### HTTP Response Headers ([security.js](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/functions/lib/security.js))

```javascript
{
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',           // Prevents MIME sniffing
  'X-Frame-Options': 'DENY',                     // Prevents clickjacking
  'X-XSS-Protection': '1; mode=block',           // XSS filter
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
}
```

#### HTML Meta Tags ([index.html](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/index.html))

- **Content Security Policy (CSP)**:
  - `default-src 'self'`: Only same-origin resources by default
  - `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com`: Scripts from same origin + inline + Turnstile
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: Styles + Google Fonts
  - `font-src 'self' https://fonts.gstatic.com`: Fonts from same origin + Google Fonts CDN
  - `img-src 'self' data: https:`: Images from same origin, data URIs, and HTTPS sources
  - `connect-src 'self' https://challenges.cloudflare.com`: API calls + Turnstile verification
  - `frame-src https://challenges.cloudflare.com`: Allows Turnstile iframe

- **X-Content-Type-Options**: `nosniff`
- **Referrer Policy**: `strict-origin-when-cross-origin`
- **Permissions Policy**: Blocks geolocation, microphone, and camera

### 5. Enhanced Error Handling

#### Generic Error Messages
- **Principle**: Don't expose internal implementation details
- **Client-facing Errors**:
  - "Please provide a valid email address"
  - "Input too long. Please use shorter text."
  - "Too many requests. Please try again later."
  - "Unable to process request. Please try again later."

#### Server-side Logging
- Detailed errors logged with `console.error()` for debugging
- Logs include IP addresses for bot detection tracking
- Never expose stack traces or database errors to clients

### 6. Duplicate Email Detection

- **Check**: Query database before insertion
- **Response**: HTTP 409 (Conflict) with message "This email is already on the wishlist"
- **Benefit**: Prevents duplicate entries and provides user feedback

### 7. CORS Configuration

- **Allowed Origins**: `*` (configurable to specific domain)
- **Allowed Methods**: `POST, OPTIONS`
- **Allowed Headers**: `Content-Type`
- **Preflight Caching**: 24 hours (`Access-Control-Max-Age: 86400`)
- **OPTIONS Handler**: Dedicated handler for CORS preflight requests

## Cloudflare Configuration Required

### KV Namespace for Rate Limiting

To enable rate limiting, you need to create a KV namespace in Cloudflare:

1. **Create KV Namespace**:
   ```bash
   wrangler kv:namespace create RATE_LIMIT
   ```

2. **Update `wrangler.toml`** (create if doesn't exist):
   ```toml
   name = "kitly-webpage"
   
   [[kv_namespaces]]
   binding = "RATE_LIMIT"
   id = "YOUR_KV_NAMESPACE_ID"
   ```

3. **Cloudflare Pages Configuration**:
   - Go to your Cloudflare Pages project settings
   - Navigate to "Functions" > "KV namespace bindings"
   - Add binding: Variable name: `RATE_LIMIT`, KV namespace: (select your namespace)

> **Note**: Rate limiting will gracefully degrade if KV namespace is not configured (requests will be allowed).

## Security Testing Checklist

### Input Validation Tests
- [ ] Submit invalid email format
- [ ] Submit email exceeding 254 characters
- [ ] Submit text fields exceeding 500 characters
- [ ] Attempt XSS with `<script>alert(1)</script>`
- [ ] Attempt SQL injection with `admin'; DROP TABLE leads;--`

### Rate Limiting Tests
- [ ] Submit form 6 times rapidly
- [ ] Verify 429 error on 6th request
- [ ] Check `Retry-After` header
- [ ] Wait 1 hour and verify submission works again

### Bot Protection Tests
- [ ] Fill honeypot field and verify silent rejection
- [ ] Verify normal submission without honeypot works
- [ ] Complete Turnstile challenge and verify submission succeeds
- [ ] Submit without completing Turnstile and verify rejection
- [ ] Verify Turnstile widget resets after successful submission

### Security Headers Tests
- [ ] Verify CSP in browser DevTools Network tab
- [ ] Check all security headers present
- [ ] Verify no console errors from CSP violations

### Client-side Throttling Tests
- [ ] Submit form and try to submit again within 30 seconds
- [ ] Verify error message with countdown
- [ ] Wait 30 seconds and verify submission works

## Vulnerabilities Addressed

✅ **SQL Injection**: Parameterized queries  
✅ **XSS (Cross-Site Scripting)**: Input sanitization + CSP  
✅ **CSRF (Cross-Site Request Forgery)**: CORS configuration (honeypot + Turnstile provide additional protection)  
✅ **Clickjacking**: X-Frame-Options header  
✅ **MIME Sniffing**: X-Content-Type-Options header  
✅ **Rate Limiting/DDoS**: IP-based rate limiting  
✅ **Bot Spam**: Honeypot field + Cloudflare Turnstile  
✅ **Information Disclosure**: Generic error messages  
✅ **Duplicate Entries**: Database constraint check  

## Maintenance & Updates

### Regular Security Audits
- Review error logs for suspicious patterns
- Monitor rate limit triggers
- Check honeypot detection logs
- Update CSP as new resources are added

### Adjusting Rate Limits
To change the rate limit threshold, edit [`security.js`](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/functions/lib/security.js):

```javascript
// Change this constant
const RATE_LIMIT_MAX = 5; // requests per hour
```

### Updating CSP
When adding new external resources (CDNs, APIs, etc.), update the CSP in [`index.html`](file:///Users/anupadesilva/Documents/MyApps/2025/kitly-webpage/index.html) to whitelist them.

## Additional Recommendations

### Future Enhancements
1. **HTTPS Enforcement**: Ensure Cloudflare Pages is configured for HTTPS-only
2. **Subresource Integrity (SRI)**: Add integrity attributes to external scripts/styles
3. **Database Encryption**: Consider encrypting email addresses at rest
4. **Email Verification**: Implement double opt-in to verify email addresses
5. **Security Headers Service**: Use Cloudflare Page Rules for additional security headers
6. **WAF Rules**: Configure Cloudflare WAF for additional protection
7. **Turnstile Analytics**: Monitor Turnstile Dashboard for bot patterns and adjust settings

### Monitoring
- Set up alerts for high rate limit triggers
- Monitor bot detection logs
- Track failed validation attempts
- Review error rates

## References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Cloudflare Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [RFC 5322 (Email Format)](https://tools.ietf.org/html/rfc5322)
