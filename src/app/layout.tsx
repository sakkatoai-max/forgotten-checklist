import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '忘れ物チェック',
  description: '毎日の持ち物チェックアプリ',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#4a90e2',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main className="appMain">{children}</main>

        <nav className="bottomNav" aria-label="メインメニュー">
          <Link className="bottomNavLink" href="/">チェック</Link>
          <Link className="bottomNavLink" href="/edit">へんしゅう</Link>
          <Link className="bottomNavLink" href="/settings">せってい</Link>
        </nav>
      </body>
    </html>
  );
}
