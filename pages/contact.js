import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout title="Contact" description="Get in touch with the LitePDF team.">
      <div className="tool-page" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1>Contact Us</h1>
        <p>Have questions, feedback, or suggestions? We would love to hear from you.</p>

        <div style={{ background: '#f8f9fb', borderRadius: 12, padding: 32, marginTop: 32, textAlign: 'left' }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Email</h3>
            <p style={{ color: '#6b7280', fontSize: 15 }}>
              <a href="mailto:hello@litepdf.org" style={{ color: '#2563eb' }}>hello@litepdf.org</a>
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Response Time</h3>
            <p style={{ color: '#6b7280', fontSize: 15 }}>
              We typically respond within 24–48 hours.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Bug Reports</h3>
            <p style={{ color: '#6b7280', fontSize: 15 }}>
              Found a bug or something not working right? Please include the tool name, your browser, and a description of the issue. Screenshots help a lot!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
