import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ title, description, children }) {
  const fullTitle = title ? `${title} — LitePDF` : 'LitePDF — Free Online PDF Tools';
  const desc = description || 'Free, fast, and private PDF tools. Merge, split, compress, and convert PDFs instantly in your browser.';

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
      </Head>

      <header className="header">
        <div className="container header-inner">
          <Link href="/">
            <span className="logo">Lite<span>PDF</span></span>
          </Link>
          <nav>
            <ul className="nav-links">
              <li><Link href="/">Tools</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} LitePDF — All processing happens in your browser. Your files never leave your device.</p>
        </div>
      </footer>
    </>
  );
}
