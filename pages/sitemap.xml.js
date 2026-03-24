const SITE_URL = 'https://litepdf.org';

const PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/merge', priority: '0.9', changefreq: 'monthly' },
  { path: '/split', priority: '0.9', changefreq: 'monthly' },
  { path: '/compress', priority: '0.9', changefreq: 'monthly' },
  { path: '/pdf-to-jpg', priority: '0.9', changefreq: 'monthly' },
  { path: '/jpg-to-pdf', priority: '0.9', changefreq: 'monthly' },
  { path: '/rotate', priority: '0.8', changefreq: 'monthly' },
  { path: '/unlock', priority: '0.8', changefreq: 'monthly' },
  { path: '/protect', priority: '0.8', changefreq: 'monthly' },
  { path: '/watermark', priority: '0.8', changefreq: 'monthly' },
  { path: '/page-numbers', priority: '0.8', changefreq: 'monthly' },
  { path: '/word-counter', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.5', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/contact', priority: '0.3', changefreq: 'yearly' },
];

function generateSiteMap() {
  const today = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
).join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function SiteMap() {
  return null;
}
