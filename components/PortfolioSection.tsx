'use client';

import { useState } from 'react';
import { useFadeIn } from '@/lib/useFadeIn';
import { asset } from '@/lib/basePath';

interface Company {
  name: string;
  logoSrc?: string;
  acquisitionDate?: string;
}

const COMPANIES: Company[] = [
  { name: 'Avenue', acquisitionDate: 'July 2025', logoSrc: asset('/images/avenue-logo.svg') },
  { name: 'Buildfire', acquisitionDate: 'October 2024', logoSrc: asset('/images/buildfire-logo.svg') },
  { name: 'Convox', acquisitionDate: 'April 2024', logoSrc: asset('/images/convox-logo.svg') },
  { name: 'Polymer', acquisitionDate: 'July 2025', logoSrc: asset('/images/polymer-logo.svg') },
  { name: 'Uservoice', acquisitionDate: 'November 2025', logoSrc: asset('/images/uservoice-logo.svg') },
];

export default function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = COMPANIES[activeIndex];
  const { ref, visible } = useFadeIn();

  const fadeClass = `fade-content${visible ? ' fade-content--visible' : ''}`;

  return (
    <section className="portfolio" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`portfolio-names ${fadeClass}`}>
        {COMPANIES.map((c, i) => (
          <button
            key={c.name}
            className={`portfolio-name${i === activeIndex ? ' portfolio-name--active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className={`portfolio-featured ${fadeClass}`} style={{ transitionDelay: '0.1s' }}>
        {active.acquisitionDate && (
          <span className="pill pill-outline-cream portfolio-chip">
            Acquired {active.acquisitionDate}
          </span>
        )}
        <div key={activeIndex} className="portfolio-featured-inner portfolio-featured-inner--animated">
          {active.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.logoSrc} alt={active.name} className="portfolio-logo" />
          ) : (
            <span className="portfolio-logo-name">{active.name}</span>
          )}
        </div>
      </div>
    </section>
  );
}
