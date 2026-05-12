interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ background: 'var(--color-bg-deep)', color: 'var(--color-text)' }}>
      <div className="sticky top-0 flex items-center gap-3 p-4 border-b" style={{ background: 'var(--color-bg-deep)', borderColor: 'var(--vr-border)' }}>
        <button onClick={onBack} className="text-sm" style={{ color: 'var(--color-cyan)' }} aria-label="Go back">← Back</button>
        <h1 className="text-lg font-bold">Terms of Service</h1>
      </div>

      <div className="p-6 space-y-6 max-w-prose mx-auto text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using Sign Learn AR, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>2. Use of the Service</h2>
          <p>Sign Learn AR is provided for personal, non-commercial educational use. You may not:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Reverse engineer, decompile, or disassemble any part of the app</li>
            <li>Use the service to train competing machine learning models</li>
            <li>Share your account credentials with others</li>
            <li>Use the service in any way that violates applicable laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>3. Subscriptions &amp; Payments</h2>
          <p>Premium features require a paid subscription. Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date. You can manage or cancel your subscription in your account settings.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>4. Educational Content</h2>
          <p>Sign Learn AR provides sign language educational content for learning purposes. While we strive for accuracy, we make no warranty that the content is error-free. Sign language varies by region, and our content reflects general usage patterns.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>5. Limitation of Liability</h2>
          <p>Sign Learn AR is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>6. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>7. Contact</h2>
          <p>For legal inquiries contact <a href="mailto:legal@signlearnar.com" style={{ color: 'var(--color-cyan)' }}>legal@signlearnar.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
