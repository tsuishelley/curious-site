import type { Metadata } from 'next';
import PortfolioSection from '@/components/PortfolioSection';
import AcquisitionSection from '@/components/AcquisitionSection';
import SlideUpText from '@/components/SlideUpText';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = { title: 'Companies' };

const MINORITY_COUNT = 15;

export default function CompaniesPage() {
  return (
    <>
      {/* Header */}
      <PageHero
        lines={[
          { text: 'Software companies' },
          { text: 'built to last.', italic: true },
        ]}
        description="Curious acquires early-stage software firms generating $1M–$5M in revenue, operating as a controlling or long-term holding company with a specialization in technology and B2B products."
        primaryCta={{ label: 'Get in Touch', href: '/#contact' }}
        secondaryCta={{ label: 'Our Approach', href: '/approach' }}
      />

      {/* Portfolio */}
      <PortfolioSection />

      {/* Minority Investments */}
      <section className="minority-section">
        <h2 className="minority-title">Minority Investments</h2>
        <div className="minority-grid">
          {Array.from({ length: MINORITY_COUNT }).map((_, i) => (
            <div key={i} className="minority-box" />
          ))}
        </div>
      </section>

      {/* Acquisition Criteria */}
      <section className="acquisition">
        <span className="pill pill-red">Revenue of companies we look to buy</span>
        <SlideUpText text="$1M – $5M" className="acquisition-range" />
        <AcquisitionSection />
      </section>

    </>
  );
}
