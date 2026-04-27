import type { Metadata } from 'next';
import { Libre_Franklin } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { ARTICLES } from '@/lib/articles';
import { fetchArticles, fetchCompanies } from '@/lib/sanity';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [sanityArticles, sanityCompanies] = await Promise.all([fetchArticles(), fetchCompanies()]);
  const articles = sanityArticles.length > 0 ? sanityArticles : ARTICLES;
  const companyNames = sanityCompanies.length > 0
    ? sanityCompanies.map((c) => c.name)
    : ['Avenue', 'Buildfire', 'Convox', 'Polymer', 'Uservoice'];

  return (
    <html lang="en" className={libreFranklin.variable}>
      <body>
        <Nav articles={articles} companyNames={companyNames} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
