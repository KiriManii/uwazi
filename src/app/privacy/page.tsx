export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1>Privacy Policy</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Introduction</h2>
      <p>
        Uwazi ("we", "our", or "us") is committed to protecting your privacy. This Privacy
        Policy explains how we collect, use, and safeguard your information when you use our
        polling platform.
      </p>

      <h2>Information We Collect</h2>
      <h3>Information You Provide</h3>
      <ul>
        <li>Email address (when creating polls or subscribing to updates)</li>
        <li>Poll data (titles, descriptions, options you create)</li>
        <li>Contact information (name, organization) when requesting premium plans</li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <ul>
        <li>IP address (used to prevent duplicate voting)</li>
        <li>Browser type and device information</li>
        <li>Usage data and analytics</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our polling service</li>
        <li>To prevent duplicate voting and fraud</li>
        <li>To send you poll results and updates (with your consent)</li>
        <li>To improve our platform and user experience</li>
        <li>To respond to your inquiries and support requests</li>
      </ul>

      <h2>Data Storage and Security</h2>
      <p>
        Your data is stored securely using Supabase, a trusted cloud database provider. We
        implement industry-standard security measures to protect your information.
      </p>

      <h2>Your Rights</h2>
      <ul>
        <li>Access your data</li>
        <li>Request data deletion</li>
        <li>Opt-out of marketing communications</li>
        <li>Update your information</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use local storage to track which polls you've voted on to prevent duplicate
        voting. No third-party tracking cookies are used.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at{' '}
        <a href="/contact">our contact page</a>.
      </p>
    </div>
  );
}
