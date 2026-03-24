import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy" description="LitePDF privacy policy. Your files never leave your device.">
      <div className="tool-page" style={{ textAlign: 'left', maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>Privacy Policy</h1>
        <p style={{ textAlign: 'center' }}>Last updated: March 2026</p>

        <div style={{ lineHeight: 1.8, fontSize: 16, color: '#374151', marginTop: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Your Files Are Private</h2>
          <p style={{ marginBottom: 16 }}>
            LitePDF processes all files directly in your web browser. Your documents are never uploaded to our servers. We do not store, read, or have access to any files you use with our tools.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Information We Collect</h2>
          <p style={{ marginBottom: 16 }}>
            We do not collect any personal information. We do not require accounts, logins, or email addresses. We use Google Analytics to understand how visitors use our site (page views, general location, device type). This data is anonymized and cannot identify you personally.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Advertising</h2>
          <p style={{ marginBottom: 16 }}>
            LitePDF uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google Ad Settings.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Cookies</h2>
          <p style={{ marginBottom: 16 }}>
            LitePDF itself does not use cookies. However, our advertising partners (Google AdSense) and analytics tools (Google Analytics) may place cookies on your device. You can control cookie settings through your browser preferences.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Third-Party Links</h2>
          <p style={{ marginBottom: 16 }}>
            Our site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Changes to This Policy</h2>
          <p style={{ marginBottom: 16 }}>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at <strong>hello@litepdf.org</strong>
          </p>
        </div>
      </div>
    </Layout>
  );
}
