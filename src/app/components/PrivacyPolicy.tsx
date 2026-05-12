interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: 'var(--color-bg-deep)', color: 'var(--color-text)' }}>
      <div className="sticky top-0 flex items-center gap-3 p-4 border-b" style={{ background: 'var(--color-bg-deep)', borderColor: 'var(--vr-border)' }}>
        <button onClick={onBack} className="text-sm" style={{ color: 'var(--color-cyan)' }} aria-label="Go back">← Back</button>
        <h1 className="text-lg font-bold">Privacy Policy</h1>
      </div>

      <div className="p-6 space-y-6 max-w-prose mx-auto text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, complete lessons, or contact us for support. This includes your email address, learning progress, and preferences.</p>
          <p className="mt-2">We collect camera and microphone data <strong>only during active AR practice sessions</strong> and solely for sign language recognition. This data is processed on-device and is not stored or transmitted to our servers.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide, maintain, and improve the Sign Learn AR service</li>
            <li>To track your learning progress and personalize your experience</li>
            <li>To send you important notifications about your account</li>
            <li>To communicate with you about updates and new features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>3. Camera &amp; Microphone Permissions</h2>
          <p>Sign Learn AR requires camera access to enable augmented reality features and hand-tracking for sign recognition. Microphone access is required for voice-to-sign translation features. You can revoke these permissions at any time in your device settings; this will disable the relevant features.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>4. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. You may delete your account and all associated data at any time from Settings → Account → Delete Account.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>5. Children's Privacy</h2>
          <p>Sign Learn AR is not directed to children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:privacy@signlearnar.com" style={{ color: 'var(--color-cyan)' }}>privacy@signlearnar.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
