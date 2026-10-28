import type { Metadata, Viewport } from 'next';
import '@fontsource/anton/latin-400.css';
import './globals.css';

const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: 'DevPulse — Live GitHub activity widget for your portfolio', template: '%s · DevPulse' },
  description:
    'Embed your real-time GitHub activity, streaks and top repositories on any portfolio or Notion page with a single snippet.',
  openGraph: {
    title: 'DevPulse — Live GitHub activity widget',
    description: 'One snippet. Live streaks, contribution graph and top repos on your portfolio.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#07090d' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
