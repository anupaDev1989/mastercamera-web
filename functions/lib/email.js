/**
 * Sends a waitlist confirmation email via the Resend HTTP API.
 * Returns { success: true } or { success: false, error: string }.
 *
 * Requires env.RESEND_API_KEY (Cloudflare secret).
 * Set env.RESEND_FROM_EMAIL to customise the sender (defaults to onboarding@resend.dev).
 * Set env.SITE_URL to customise the base URL for assets (defaults to https://mastercamera.app).
 */
export async function sendWaitlistConfirmation(email, env) {
    if (!env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured — skipping confirmation email');
        return { success: false, error: 'RESEND_API_KEY not set' };
    }

    const from = env.RESEND_FROM_EMAIL || 'Master Camera <onboarding@resend.dev>';
    const siteUrl = (env.SITE_URL || 'https://mastercamera.app').replace(/\/$/, '');
    const logoUrl = `${siteUrl}/logo.png`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#111;border-radius:16px;border:1px solid #222;overflow:hidden;">

          <!-- Header with logo -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1f1f1f;">
              <img src="${logoUrl}" alt="Master Camera" width="72" height="72"
                style="display:block;margin:0 auto 20px;border-radius:16px;width:72px;height:72px;object-fit:contain;" />
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#fff;letter-spacing:-0.5px;">You're on the waitlist!</h1>
              <p style="margin:0;font-size:15px;color:#666;">We'll be in touch soon.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#aaa;">
                Thanks for signing up — you're in. We'll email you the moment Master Camera hits the App Store.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#aaa;">
                As an early-access member you'll get:
              </p>

              <!-- Perks list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="padding:14px 18px;background:#1a1a1a;border-radius:10px;">
                    <p style="margin:0;font-size:14px;color:#fff;">🚀&nbsp; <strong>First access</strong> — before the public launch</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:14px 18px;background:#1a1a1a;border-radius:10px;">
                    <p style="margin:0;font-size:14px;color:#fff;">💸&nbsp; <strong>Launch discount</strong> — exclusive to waitlist members</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:14px 18px;background:#1a1a1a;border-radius:10px;">
                    <p style="margin:0;font-size:14px;color:#fff;">🎙️&nbsp; <strong>Direct input</strong> — shape the features we ship next</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">
                We'll only reach out when there's something worth sharing. No spam, ever.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1f1f1f;text-align:center;">
              <p style="margin:0;font-size:12px;color:#444;">
                You received this because you signed up at <a href="${siteUrl}" style="color:#555;text-decoration:none;">mastercamera.app</a><br>
                <a href="mailto:hello@mastercamera.app" style="color:#555;text-decoration:none;">Contact us</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [email],
                subject: "You're on the Master Camera waitlist 🎉",
                html,
            }),
        });

        if (!res.ok) {
            const body = await res.text();
            console.error('Resend API error:', res.status, body);
            return { success: false, error: `Resend ${res.status}: ${body}` };
        }

        const data = await res.json();
        return { success: true, id: data.id };
    } catch (err) {
        console.error('Resend fetch error:', err);
        return { success: false, error: err.message };
    }
}
