import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

/**
 * VELORA root layout.
 *
 * Fonts:
 *   - Bricolage Grotesque (display) — loaded via Google Fonts link tag
 *     because next/font/google doesn't support variable-width axis yet
 *   - Instrument Sans (body) — loaded via Google Fonts link tag
 *   - JetBrains Mono (code) — loaded via next/font
 */
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono-loaded',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VELORA — Application Operating System',
    template: '%s | VELORA',
  },
  description:
    'Intent to production in one platform. Database, auth, storage, realtime, queues, workflows, AI — one dashboard for everything.',
  metadataBase: new URL('https://velora.dev'),
  openGraph: {
    type: 'website',
    siteName: 'VELORA',
    title: 'VELORA — Application Operating System',
    description:
      'Intent to production in one platform. Database, auth, storage, realtime, queues, workflows, AI.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Bricolage Grotesque — display font with width/weight axes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-basalt text-salt">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
