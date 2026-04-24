import type { Metadata } from 'next';
import { Libre_Franklin } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
variable: '--font-libre',
});

export const metadata: Metadata = {
  title: { default: 'Curious Holdings', template: '%s | Curious Holdings' },
  description:
    'A long-term holding company that buys and grows software companies with empathy.',
  openGraph: {
    siteName: 'Curious Holdings',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={libreFranklin.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
