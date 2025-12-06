# Cloudflare Turnstile Setup Guide

## Overview

Cloudflare Turnstile is now integrated into the wishlist form as an additional layer of bot protection. This guide will help you configure it properly.

## Step 1: Get Turnstile Keys

1. **Go to Cloudflare Dashboard**:
   - Navigate to https://dash.cloudflare.com/
   - Select your account
   - Go to **Turnstile** in the left sidebar

2. **Create a New Site**:
   - Click **"Add Site"**
   - Enter your domain or `localhost` for testing
   - Choose widget type: **Managed** (recommended)
   - Click **Create**

3. **Copy Your Keys**:
   - **Site Key** (Public): Used in frontend code
   - **Secret Key** (Private): Used for backend verification

## Step 2: Configure Local Development

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your Site Key** to `.env`:
   ```env
   VITE_TURNSTILE_SITE_KEY=your_site_key_here
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## Step 3: Configure Production (Cloudflare Pages)

### Frontend (Site Key)

The site key is automatically included in the build from `VITE_TURNSTILE_SITE_KEY` environment variable.

1. Go to **Cloudflare Pages** → Your Project → **Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `VITE_TURNSTILE_SITE_KEY`
   - **Value**: Your public site key
   - **Environment**: Production (and Preview if needed)
3. Click **Save**

### Backend (Secret Key)

The secret key is used by the Cloudflare Worker function to verify tokens.

1. Stay in **Environment Variables** section
2. Add variable:
   - **Name**: `TURNSTILE_SECRET_KEY`
   - **Value**: Your secret key
   - **Environment**: Production (and Preview if needed)
3. **Important**: Check **"Encrypt"** to keep it secure
4. Click **Save**

## Step 4: Redeploy

After adding environment variables, trigger a new deployment:

```bash
git add .
git commit -m "Add Turnstile configuration"
git push
```

Or use the Cloudflare Pages dashboard to create a new deployment.

## Testing

### Local Testing

For local development, Turnstile provides a test site key that always passes:

```env
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

This is set as the default fallback in the code, so you can test without a real key.

### Visual Test Modes

Turnstile offers special site keys for testing different scenarios:

- **Always passes**: `1x00000000000000000000AA`
- **Always blocks**: `2x00000000000000000000AB`
- **Forces challenge**: `3x00000000000000000000FF`

### Production Testing

1. Open your deployed site
2. Navigate to the wishlist form
3. You should see the Turnstile widget (checkbox or invisible challenge)
4. Complete the challenge
5. Submit the form
6. Check Cloudflare Dashboard → Turnstile → Analytics for verification stats

## How It Works

### Frontend Flow

1. User fills out the form
2. Turnstile widget loads and presents challenge (if needed)
3. On success, widget returns a token
4. Token is stored in component state
5. On form submit, token is sent to API

### Backend Verification

1. API receives form data + Turnstile token
2. API calls Cloudflare's siteverify endpoint
3. Cloudflare validates the token
4. If valid, API processes the submission
5. If invalid, API returns error

### Security Features

- ✅ **Server-side verification**: Token is verified on backend
- ✅ **Single-use tokens**: Each token can only be used once
- ✅ **Time-limited**: Tokens expire after a short time
- ✅ **IP validation**: Token is tied to user's IP address
- ✅ **Fail-secure**: Rejects requests if verification unavailable

## Widget Configuration

The Turnstile widget is configured in `src/sections/Wishlist.jsx`:

```jsx
<Turnstile
  ref={turnstileRef}
  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
  onSuccess={(token) => setTurnstileToken(token)}
  onError={() => {
    setTurnstileToken('');
    setErrorMessage('Verification failed. Please try again.');
  }}
  onExpire={() => setTurnstileToken('')}
  theme="auto"  // Automatically matches light/dark mode
/>
```

### Available Options

You can customize the widget by changing these props:

- `theme`: `"light"`, `"dark"`, or `"auto"`
- `size`: `"normal"` or `"compact"`
- `appearance`: `"always"`, `"execute"`, or `"interaction-only"`

## Troubleshooting

### Widget Not Showing

**Possible causes:**
1. Missing or invalid site key
2. CSP blocking Turnstile scripts
3. Network firewall blocking Cloudflare

**Solutions:**
1. Check environment variable is set correctly
2. Verify CSP allows `https://challenges.cloudflare.com`
3. Check browser console for errors

### Verification Failing

**Possible causes:**
1. Missing or invalid secret key on backend
2. Token already used or expired
3. IP address mismatch

**Solutions:**
1. Verify `TURNSTILE_SECRET_KEY` is set in Cloudflare Pages
2. Ensure tokens are reset after each submission
3. Check Cloudflare Turnstile logs for error codes

### Common Error Codes

- `missing-input-secret`: Secret key not configured
- `invalid-input-secret`: Secret key is wrong
- `missing-input-response`: No token provided
- `invalid-input-response`: Token is invalid or expired
- `timeout-or-duplicate`: Token already used or expired

## CSP Configuration

The Content Security Policy has been updated to allow Turnstile:

```html
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
  connect-src 'self' https://challenges.cloudflare.com;
  frame-src https://challenges.cloudflare.com;
">
```

## Monitoring

Track Turnstile usage in Cloudflare Dashboard:

1. Go to **Turnstile** in Cloudflare Dashboard
2. Select your site
3. View **Analytics** tab for:
   - Total challenges served
   - Pass/fail rates
   - Challenge types (managed, interactive, etc.)

## Cost

Cloudflare Turnstile is **free for unlimited use**. No cost concerns!

## Additional Resources

- [Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [React Turnstile Library](https://github.com/marsidev/react-turnstile)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)

## Summary

After setup, your wishlist form will have:

1. ✅ Honeypot field (passive bot detection)
2. ✅ Cloudflare Turnstile (active bot verification)
3. ✅ Rate limiting (abuse prevention)
4. ✅ Input validation (data integrity)
5. ✅ Multiple layers of security working together

This creates a robust defense against bot submissions while maintaining a good user experience.
