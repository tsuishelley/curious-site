import type { Metadata } from 'next';
import AcquisitionSection from '@/components/AcquisitionSection';
import SlideUpText from '@/components/SlideUpText';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = { title: 'Companies' };

const MAJORITY_COUNT = 5;
const MINORITY_COUNT = 15;

export default function CompaniesPage() {
  return (
    <>
      <PageHero
        lines={[
          { text: 'Since 2017, we\'ve been' },
          { text: 'building and investing in' },
          { text: 'software companies.' },
        ]}
        description="We're building the acquisition partner we always wished existed: one that's long-term, operationally deep, and AI-native by design, helping companies evolve with the future rather than get left behind by it."
        primaryCta={{ label: 'Get in Touch', href: '/#contact' }}
        secondaryCta={{ label: 'Our Approach', href: '/approach' }}
      />

      <section className="companies-dark-section">
        <div className="companies-dark-list">
          <div className="companies-dark-row">
            <h2 className="companies-dark-heading">Majority Owned Companies</h2>
            <div className="majority-grid">
              {Array.from({ length: MAJORITY_COUNT }).map((_, i) => (
                <div key={i} className="majority-box" />
              ))}
            </div>
          </div>

          <div className="companies-dark-row">
            <h2 className="companies-dark-heading">Minority Investments</h2>
            <div className="minority-grid">
              {Array.from({ length: MINORITY_COUNT }).map((_, i) => (
                <div key={i} className="minority-box" />
              ))}
            </div>
          </div>
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
