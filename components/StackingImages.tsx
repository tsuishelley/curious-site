'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

interface StackCard {
  src?: string;
  alt?: string;
  bg?: string;
}

interface Props {
  cards: StackCard[];
}

export default function StackingImages({ cards }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → cards.length

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // progress: 0 when container top hits viewport top, cards.length when bottom exits
      const scrolled = -top;
      const total = height - viewH;
      const p = Math.max(0, Math.min(cards.length, (scrolled / total) * cards.length));
      setProgress(p);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [cards.length]);

  return (
    // Outer wrapper provides scroll height: viewH + cards * 600px of travel
    <div
      ref={containerRef}
      className="stack-scroll-outer"
      style={{ height: `calc(100vh + ${cards.length * 600}px)` }}
    >
      {/* Sticky inner pins to viewport */}
      <div className="stack-sticky-inner">
        <div className="stack-deck">
          {cards.map((card, i) => {
            // How far this card has been "passed": 0 = just arrived, 1 = next card fully on top
            const cardProgress = Math.max(0, Math.min(1, progress - i));

            // Card slides up from below when not yet reached
            const arrived = progress >= i;
            const translateY = arrived ? 0 : 100; // % of card height

            // Scale down as subsequent cards pile on top
            const stackDepth = Math.max(0, progress - i - 1); // how many cards are on top
            const scale = Math.max(0.88, 1 - stackDepth * 0.04);

            // Slight upward shift as cards stack (creates the "pushed back" feel)
            const stackTranslateY = -stackDepth * 12;

            return (
              <div
                key={i}
                className="stack-card-wrap"
                style={{
                  zIndex: i + 1,
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: arrived ? 'auto' : 'none',
                }}
              >
                <div
                  className="stack-card"
                  style={{
                    transform: `translateY(${arrived ? stackTranslateY : 80}%) scale(${scale})`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: arrived ? 1 : 0,
                  }}
                >
                  {card.src ? (
                    <Image
                      src={card.src}
                      alt={card.alt ?? ''}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="stack-card-placeholder"
                      style={{ background: card.bg ?? 'rgba(49,43,43,0.06)' }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
