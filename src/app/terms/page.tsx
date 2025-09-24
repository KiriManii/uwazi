export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1>Terms of Service</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Uwazi, you accept and agree to be bound by these Terms of
        Service. If you do not agree to these terms, please do not use our platform.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Uwazi provides an online polling platform that allows users to create, share, and
        analyze polls focused on African governance and public opinion.
      </p>

      <h2>3. User Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate information when creating polls</li>
        <li>Not create polls with offensive, illegal, or misleading content</li>
        <li>Not attempt to manipulate poll results through automated voting or fraud</li>
        <li>Not use the platform for spam or malicious purposes</li>
        <li>Respect the privacy and intellectual property of others</li>
      </ul>

      <h2>4. Free Tier Limitations</h2>
      <p>
        Free accounts are limited to 2 polls per week with a maximum of 25 responses per
        poll. We reserve the right to enforce these limits and remove accounts that violate
        them.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        You retain ownership of the polls you create. By using Uwazi, you grant us a
        license to display and process your poll data to provide our services.
      </p>

      <h2>6. Data and Privacy</h2>
      <p>
        Your use of Uwazi is also governed by our{' '}
        <a href="/privacy">Privacy Policy</a>. We collect and use data as described in that
        policy.
      </p>

      <h2>7. Prohibited Content</h2>
      <p>Polls containing the following are strictly prohibited:</p>
      <ul>
        <li>Hate speech or discrimination</li>
        <li>Illegal activities or content</li>
        <li>Harassment or threats</li>
        <li>Misleading or fraudulent information</li>
        <li>Spam or commercial solicitation</li>
      </ul>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms or
        engage in harmful behavior.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        Uwazi is provided "as is" without warranties of any kind. We do not guarantee
        uninterrupted service or error-free operation.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        Uwazi shall not be liable for any indirect, incidental, or consequential damages
        arising from your use of the platform.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of Uwazi after changes
        constitutes acceptance of the new terms.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        For questions about these terms, please visit our{' '}
        <a href="/contact">contact page</a>.
      </p>
    </div>
  );
}
