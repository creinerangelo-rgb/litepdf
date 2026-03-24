import Link from 'next/link';
import Layout from '../components/Layout';

const TOOLS = [
  { name: 'Merge PDF', description: 'Combine multiple PDFs into one file', icon: '📎', color: '#eff6ff', href: '/merge' },
  { name: 'Split PDF', description: 'Extract pages from a PDF document', icon: '✂️', color: '#fef3c7', href: '/split' },
  { name: 'Compress PDF', description: 'Reduce PDF file size instantly', icon: '📦', color: '#ecfdf5', href: '/compress' },
  { name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', icon: '🖼️', color: '#fce7f3', href: '/pdf-to-jpg' },
  { name: 'JPG to PDF', description: 'Convert images to a PDF document', icon: '📄', color: '#f0fdf4', href: '/jpg-to-pdf' },
  { name: 'Rotate PDF', description: 'Rotate PDF pages in any direction', icon: '🔄', color: '#eef2ff', href: '/rotate' },
  { name: 'Unlock PDF', description: 'Remove password from a protected PDF', icon: '🔓', color: '#fefce8', href: '/unlock' },
  { name: 'Password Protect PDF', description: 'Encrypt your PDF with a password', icon: '🔒', color: '#fef2f2', href: '/protect' },
  { name: 'Watermark PDF', description: 'Add a text watermark to your PDF', icon: '💧', color: '#f0f9ff', href: '/watermark' },
  { name: 'Add Page Numbers', description: 'Number every page of your PDF', icon: '🔢', color: '#faf5ff', href: '/page-numbers' },
  { name: 'Word Counter', description: 'Count words, characters, and sentences', icon: '🔤', color: '#fffbeb', href: '/word-counter' },
];

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <h1>Every PDF tool you need,<br /><em>totally free</em></h1>
        <p>Fast, private, and works right in your browser. No uploads to servers. No signups. No nonsense.</p>
      </section>

      <section className="tools-section">
        <h2>All Tools</h2>
        <div className="tools-grid">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="tool-card">
                <div className="tool-icon" style={{ background: tool.color }}>{tool.icon}</div>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="ad-slot">Advertisement — Google AdSense will appear here</div>

      <section style={{ padding: '40px 0 64px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.5px' }}>Why LitePDF?</h2>
        <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 32 }}>Built for speed and privacy.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, textAlign: 'left' }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'All processing happens locally in your browser. No waiting for server uploads.' },
            { icon: '🔒', title: '100% Private', desc: 'Your files never leave your device. Nothing is uploaded or stored anywhere.' },
            { icon: '🆓', title: 'Completely Free', desc: 'No hidden fees, no file limits, no forced signups. Every tool is free, forever.' },
          ].map((f, i) => (
            <div key={i} style={{ padding: 24, background: '#f8f9fb', borderRadius: 12 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
