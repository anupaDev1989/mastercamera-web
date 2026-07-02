import React from 'react';

const TermsOfUse = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Master Camera Terms of Use</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: 18 June 2026</p>

        <div className="space-y-8 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement</h2>
            <p className="text-muted-foreground">These Terms of Use ("Terms") govern your use of the Master Camera app ("the App"). By downloading, installing, or using the App, you agree to these Terms. If you do not agree, do not use the App.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. The app</h2>
            <p className="text-muted-foreground">Master Camera is a camera and media-organizer for field work. It captures photos, videos, document scans, and voice notes, and lets you organize them with projects, tags, notes, locations, and other metadata. The App runs entirely on your device: it requires no account and has no backend service. Your content is stored only on your device, as described in our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. License</h2>
            <p className="text-muted-foreground">Subject to these Terms, we grant you a personal, non-exclusive, non-transferable, revocable license to use the App on Apple devices that you own or control, as permitted by the Apple Media Services Terms and Conditions and the standard Apple Licensed Application End User License Agreement (EULA). You may not copy, modify, reverse-engineer, sell, sublicense, or distribute the App except as allowed by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your content and responsibilities</h2>
            <p className="text-muted-foreground">You own the photos, videos, recordings, notes, and other content you create with the App. We claim no rights over it.</p>
            <p className="text-muted-foreground mt-4">You are responsible for your content and for how you use the App, including obtaining any consent required to photograph or record people, property, or locations, and complying with all laws and any site, employer, or client rules that apply to you.</p>
            <p className="text-muted-foreground mt-4">You are responsible for backing up your content. Because the App stores data only on your device, uninstalling the App, losing the device, or a device fault may permanently delete your content.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Acceptable use</h2>
            <p className="text-muted-foreground">You agree not to use the App for any unlawful purpose, to infringe anyone's rights, or in any way that violates these Terms or applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Privacy</h2>
            <p className="text-muted-foreground">Your use of the App is also governed by our Privacy Policy, which explains what the App stores on your device and the permissions it requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimers</h2>
            <p className="text-muted-foreground">The App is provided "as is" and "as available," without warranties of any kind, whether express or implied, including any implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the App will be uninterrupted, error-free, or that it will meet your requirements, and we are not responsible for any loss of data stored on your device.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of liability</h2>
            <p className="text-muted-foreground">To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, profits, or business, arising out of or related to your use of (or inability to use) the App. Nothing in these Terms limits liability that cannot be limited under applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes</h2>
            <p className="text-muted-foreground">We may update the App and these Terms from time to time. When we do, we will revise the "Last updated" date above and post the updated Terms. Your continued use of the App after changes take effect means you accept the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
            <p className="text-muted-foreground">These Terms apply for as long as you use the App. You may end them at any time by deleting the App. We may suspend or end the license if you breach these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact</h2>
            <p className="text-muted-foreground">Questions about these Terms? Email <a href="mailto:support@mastercamera.app" className="text-primary hover:underline">support@mastercamera.app</a>.</p>
          </section>

          <footer className="border-t border-border pt-8 mt-12 text-sm text-muted-foreground">
            <p>© 2026 Master Camera. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
