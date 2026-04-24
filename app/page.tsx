import Link from 'next/link';
import PortfolioSection from '@/components/PortfolioSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import HeroHeadline from '@/components/HeroHeadline';
import AcquisitionSection from '@/components/AcquisitionSection';
import SlideUpText from '@/components/SlideUpText';
import ValueCards from '@/components/ValueCards';
import NewsSection from '@/components/NewsSection';
import { getValuePropositions, getNewsArticles } from '@/lib/contentful';

/* ── Fallback data (used when Contentful is not configured) ── */

const FALLBACK_VALUES = [
  {
    title: 'Permanent Capital',
    description:
      "Each acquisition we make is in the frame of decades to build companies that can evolve alongside transformational shifts. We're focused on legacy, resilience, and continuous reinvention, not raising additional funds or future exits.",
    iconSrc: '/images/icon-barchart.svg',
  },
  {
    title: 'Operational Chops',
    description:
      'We combine deep software experience with a bias toward emerging technology. We move quickly to adopt, master, and operationalize new tools to improve efficiency, decision-making, and performance.',
    iconSrc: '/images/icon-network.svg',
  },
  {
    title: 'Certainty of Close',
    description:
      'Our process is built on efficiency and certainty. We close within 60 days and pay cash. Founders decide whether to stay with the business or hand it off. No golden handcuffs.',
    iconSrc: '/images/icon-handshake.svg',
  },
];


export default async function HomePage() {
  const [values, news] = await Promise.all([
    getValuePropositions(),
    getNewsArticles(),
  ]);

  const valueCards = values.length ? values : FALLBACK_VALUES;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <HeroHeadline />
        </div>
        <div className="hero-right">
          <p className="hero-description">
            Curious is a long-term holding company that buys and grows software companies with empathy. We're operate as builders first, buyers second.
          </p>
          <div className="hero-ctas">
            <Link href="/#contact" className="btn btn-dark btn-sm">Get in Touch</Link>
            <Link href="/news" className="btn btn-outline-dark btn-sm">See What&apos;s New</Link>
          </div>
        </div>
      </section>

      {/* HERO IMAGE BAND */}
      <Link href="/approach" className="hero-image-band">
        <video
          className="hero-band-img"
          src="/videos/leaves-rustling.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-band-overlay" />
        <div className="hero-band-content">
          <div className="hero-band-text">
            <p>Things are changing in the industry.</p>
            <p className="italic-serif">We&apos;re ready to adapt.</p>
          </div>
          <span className="btn btn-outline-white btn-sm hero-band-cta">
            Learn more about our approach
          </span>
        </div>
      </Link>

      {/* VALUE PROPS */}
      <ValueCards cards={valueCards} />

      {/* PORTFOLIO */}
      <PortfolioSection />

      {/* TESTIMONIALS */}
      <TestimonialsCarousel />

      {/* ACQUISITION CRITERIA */}
      <section className="acquisition">
        <span className="pill pill-red">Revenue of companies we look to buy</span>
        <SlideUpText text="$1M – $5M" className="acquisition-range" />
        <AcquisitionSection />
      </section>

      {/* NEWS */}
      <NewsSection />

    </>
  );
}
