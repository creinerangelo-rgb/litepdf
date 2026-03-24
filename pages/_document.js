import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6036294141830905"
          crossOrigin="anonymous"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DPKG8H8KZ9"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                'analytics_storage': 'granted'
              });
              gtag('config', 'G-DPKG8H8KZ9');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
