import React from 'react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Master Camera Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: 28 June 2026</p>

        <div className="space-y-8 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Summary</h2>
            <p>Master Camera is designed to keep your work private. Everything you capture stays on your device. We do not require an account, and we never collect, sell, or share your personal data. The one time information leaves your device automatically is if you choose to send us feedback — described in "Feedback you send us" below. Otherwise, your content only leaves the device when you share or export it yourself.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">What the app stores on your device</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Photos, videos, document scans, and voice notes you capture.</li>
              <li>The information you attach to them — projects, folders, tags, notes, custom fields, and the GPS location and device orientation recorded at capture.</li>
              <li>Your in-app preferences (such as appearance and gallery settings).</li>
            </ul>
            <p className="text-muted-foreground mt-4">All of this is saved only in the app's private storage on your device (and in a shared container used by the Master Camera share extension and Camera Control widget). It is never uploaded by the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Device permissions we ask for</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Camera</strong> — to take the photos and videos you capture.</li>
              <li><strong>Microphone</strong> — to record audio with your videos and to capture voice notes.</li>
              <li><strong>Location (While Using the App)</strong> — to tag captures with the GPS coordinates of the job site so you can map and search by location. Location is read only while you are capturing and is stored in your media's metadata on your device.</li>
              <li><strong>Motion</strong> — to power the on-screen level and compass guides and to record device orientation in photo metadata.</li>
              <li><strong>Speech Recognition</strong> — to transcribe your spoken voice notes into text. This runs on-device; your audio is not sent to a server.</li>
            </ul>
            <p className="text-muted-foreground mt-4">You can review or change any of these in the Settings app at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">How your data leaves the device</h2>
            <p className="text-muted-foreground">Your captured content only leaves your device when you choose to share or export it — for example using the share sheet to send a photo, or exporting a zip of media. At that point the content is handled by the app or service you send it to, under that service's own privacy terms. Master Camera does not transmit your photos, videos, notes, or location anywhere on its own. The single exception is the optional feedback you send us, covered next.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Feedback you send us</h2>
            <p className="text-muted-foreground">Master Camera includes an optional "Feedback &amp; Feature Request" feature (Settings → Help). It is the only part of the app that sends information to us, and only when you fill it in and tap Send.</p>
            <p className="text-muted-foreground mt-4">When you do, we receive:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
              <li>The message you write and the category you pick (bug, feature request, or general).</li>
              <li>Your email address — only if you choose to enter one so we can reply. You can leave it blank and send anonymously.</li>
              <li>Basic technical details to help us investigate: the app version, your iOS version, and your device model (for example "iPhone 16 Pro Max"). No photos, location, or other content from your library is included.</li>
            </ul>
            <p className="text-muted-foreground mt-4">This is sent securely to our own server and stored only so we can read your feedback, reply if you asked us to, and improve the app. We do not sell or share it, and we do not use it for advertising or tracking. If you never open this feature, nothing is sent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Analytics and tracking</h2>
            <p className="text-muted-foreground">Master Camera contains no analytics, advertising, or tracking technologies, and no third-party SDKs that collect data. We do not track you across apps or websites.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Children's privacy</h2>
            <p className="text-muted-foreground">Master Camera is a tool for field work and is not directed at children. Because we do not collect any personal data, we do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Deleting your data</h2>
            <p className="text-muted-foreground">You can delete individual items, projects, or media within the app at any time. Deleting the app from your device removes all of its stored content.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to this policy</h2>
            <p className="text-muted-foreground">If this policy changes, we will update the text here and the "Last updated" date above, and post the revised version with the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
            <p className="text-muted-foreground">Questions about privacy? Email <a href="mailto:support@mastercamera.app" className="text-primary hover:underline">support@mastercamera.app</a>.</p>
          </section>

          <footer className="border-t border-border pt-8 mt-12 text-sm text-muted-foreground">
            <p>© 2026 Master Camera. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
