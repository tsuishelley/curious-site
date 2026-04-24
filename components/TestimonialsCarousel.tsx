'use client';

import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from '@/lib/useFadeIn';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote: [
      "When we started exploring options for how Polymer could continue to grow, Andrew and his team quickly became the clear answer. The Curious team brings a rare combination of empathy, decisiveness, and builder's intuition. They immediately understood the balance we worked so hard to strike, simplicity on the surface with powerful functionality underneath, and they also saw what Polymer could become.",
      "Polymer is in good hands with Curious, and we are excited to see it continue to grow into the best option for companies to find and hire the right people.",
    ],
    authorName: 'Andrew Gertig',
    authorRole: 'Co-Founder of',
    authorCompany: 'Polymer',
    avatarSrc: '/images/avatar-andrew.png',
  },
  {
    quote: [
      "Through the process of finding a new home for Avenue we spoke to tens of potential partners. From our very first meeting, Andrew and Curious stood out for their empathy for our story, curiosity (unsurprisingly!) and a builder's mindset that focused on potential and possibility.",
      "More simply: they just got it. It was refreshing to start from a place of understanding and respect, rather than feeling like every aspect of the company's history and operations was under a microscope.",
    ],
    authorName: 'Steven Mulcahy',
    authorRole: 'Former CEO of',
    authorCompany: 'Avenue',
    avatarSrc: '/images/avatar-steven.png',
  },
  {
    quote: [
      "Working with Curious was an incredibly smooth and straightforward process.",
      "From the beginning, they demonstrated quick decision making and a level of transparency that made the entire experience seamless. Unlike many firms that acquire businesses to run out cash, Curious is passionate about the brands they take on. Their dedication to the business was clear, and I'm confident it's in great hands. I couldn't recommend them more highly.",
    ],
    authorName: 'Ian Blair',
    authorRole: 'Founder of',
    authorCompany: 'Buildfire',
    avatarSrc: '/images/avatar-andrew.png',
  },
  {
    quote: [
      "Watching what Curious has built has been validating in a lot of ways. Uservoice was 17 years of my life, and knowing it landed with someone who sees the long-term value in \"overlooked\" companies rather than just asset-stripping or quick flips means a lot.",
      "The decades-long orientation is exactly right. The best software companies aren't always the ones chasing hypergrowth - they're the ones that solve real problems for real customers and build sustainable businesses around that. You're proving that model works at scale.",
    ],
    authorName: 'Marcus Nelson',
    authorRole: 'Co-Founder of',
    authorCompany: 'Uservoice',
    avatarSrc: '/images/avatar-steven.png',
  },
  {
    quote: [
      "We were specifically looking for a team with the operating experience to take the business to the next level. This is where the \"Builders, not bankers\" mantra of Curious was a perfect fit.",
      "Not only did we find the right home for the Convox team, but we also knew that the business would continue to thrive and our customers would be in the experienced hands of operators who would invest in and improve the business and its products.",
    ],
    authorName: 'Steve McKay',
    authorRole: 'Former Chairman of',
    authorCompany: 'Convox',
    avatarSrc: '/images/avatar-andrew.png',
  },
  {
    quote: [
      "The first thing we noticed about Andrew and the Curious team was their approach to business, one that feels more human and less transactional.",
      "Right from our first conversation, they led with clarity and a deep commitment to transparency—values that we instantly aligned with. From the start, I could tell they weren't just checking boxes, they genuinely wanted to understand our journey and were focused on getting a positive outcome for everyone.",
    ],
    authorName: 'Gaurabh Mathure',
    authorRole: 'Co-Founder of',
    authorCompany: 'Phenom',
    avatarSrc: '/images/avatar-steven.png',
  },
];

const PER_PAGE = 2;
const PAGES = Math.ceil(TESTIMONIALS.length / PER_PAGE);

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quotes">
        {t.quote.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <div>
        <hr className="testimonial-divider" />
        <div className="testimonial-author">
          <Image
            src={t.avatarSrc}
            alt={t.authorName}
            width={58}
            height={58}
            className="testimonial-avatar"
          />
          <div>
            <p className="testimonial-name">{t.authorName}</p>
            <p className="testimonial-role">
              {t.authorRole} <span className="accent">{t.authorCompany}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const [page, setPage] = useState(0);
  const [slideHeight, setSlideHeight] = useState<number | undefined>(undefined);
  const firstSlideRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useFadeIn();

  // Measure the first slide after mount and on resize
  useEffect(() => {
    const measure = () => {
      if (firstSlideRef.current) {
        setSlideHeight(firstSlideRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section className="testimonials" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`fade-content${visible ? ' fade-content--visible' : ''}`}>
      <h2 className="section-title">Testimonials</h2>

      <div className="testimonial-overflow">
        <div
          className="testimonial-track"
          style={{
            width: `${PAGES * 100}%`,
            transform: `translateX(-${(page / PAGES) * 100}%)`,
          }}
        >
          {Array.from({ length: PAGES }).map((_, pi) => (
            <div
              key={pi}
              ref={pi === 0 ? firstSlideRef : undefined}
              className="testimonial-slide"
              style={{
                width: `${100 / PAGES}%`,
                ...(pi > 0 && slideHeight ? { height: slideHeight } : {}),
              }}
            >
              <div className="testimonial-grid">
                {TESTIMONIALS.slice(pi * PER_PAGE, pi * PER_PAGE + PER_PAGE).map((t) => (
                  <TestimonialCard key={t.authorName} t={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonial-dots">
        {Array.from({ length: PAGES }).map((_, i) => (
          <button
            key={i}
            className={`dot${i === page ? ' dot--active' : ''}`}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
