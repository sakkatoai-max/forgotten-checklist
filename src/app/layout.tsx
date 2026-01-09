import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '忘れ物チェック',
  description: '毎日の持ち物チェックアプリ',
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
        <main>{children}</main>
        <nav>
          <Link href="/">チェック</Link>
          <Link href="/edit">へんしゅう</Link>
          <Link href="/settings">せってい</Link>
        </nav>
      </body>
    </html>
  );
}
