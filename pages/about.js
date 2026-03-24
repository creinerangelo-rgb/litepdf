import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About" description="Learn about LitePDF — free, fast, and private PDF tools.">
      <div className="tool-page" style={{ textAlign: 'left', maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>About LitePDF</h1>
        <p style={{ textAlign: 'center' }}>Fast, free, and private PDF tools for everyone</p>

        <div style={{ lineHeight: 1.8, fontSize: 16, color: '#374151', marginTop: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Our Mission</h2>
          <p style={{ marginBottom: 16 }}>
            LitePDF was built with one goal: make PDF tools that are genuinely free, fast, and respect your privacy. No accounts, no file uploads to servers, no hidden limits.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>How It Works</h2>
          <p style={{ marginBottom: 16 }}>
            Every tool on LitePDF runs entirely in your web browser. When you upload a file, it stays on your device — it is never sent to any server. All processing happens locally using modern browser technologies. This means your documents remain 100% private.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Why Free?</h2>
          <p style={{ marginBottom: 16 }}>
            LitePDF is supported by advertising. This allows us to keep every tool completely free with no usage limits. We believe essential document tools should be accessible to everyone.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 32, color: '#1a1a2e' }}>Contact</h2>
          <p>
            Have feedback, suggestions, or questions? We would love to hear from you. Reach out at <strong>hello@litepdf.org</strong>
          </p>
        </div>
      </div>
    </Layout>
  );
}
