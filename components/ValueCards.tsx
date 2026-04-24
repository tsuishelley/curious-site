'use client';

import { useEffect, useRef, useState } from 'react';

interface ValueCard {
  title: string;
  description: string;
  iconSrc?: string;
}

interface Props {
  cards: ValueCard[];
}

export default function ValueCards({ cards }: Props) {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((_, i) => {
            setTimeout(() => setVisibleIndex(i), i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cards]);

  return (
    <section className="value-props" ref={sectionRef}>
      {cards.map((v, i) => (
        <div
          key={v.title}
          className={`value-card value-card--animate${visibleIndex >= i ? ' value-card--visible' : ''}`}
        >
          {v.iconSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.iconSrc} alt="" className="value-card-icon" />
          )}
          <h3>{v.title}</h3>
          <p>{v.description}</p>
        </div>
      ))}
    </section>
  );
}
