'use client';

import { useEffect, useRef, useState } from 'react';

const PARAGRAPHS = [
  "We're vertical agnostic and welcome all situations, even messy ones. We look to acquire software companies, both venture backed or bootstrapped.",
  "We value simple businesses that we can understand and improve on with a focus towards legacy preservation.",
];

const ALL_WORDS = PARAGRAPHS.flatMap((p) => p.split(' '));

export default function AcquisitionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // 0 when section top hits viewport bottom, 1 when section bottom hits viewport center
      const p = (windowH - rect.top) / (rect.height + windowH * 0.5);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  let globalIndex = 0;
  const total = ALL_WORDS.length;

  return (
    <div ref={ref} className="acquisition-body">
      {PARAGRAPHS.map((para, pi) => (
        <p key={pi}>
          {para.split(' ').map((word, wi) => {
            const idx = globalIndex++;
            const threshold = idx / total;
            const wordProgress = (progress - threshold) / (1 / total);
            const opacity = Math.min(1, Math.max(0.25, wordProgress));
            const blur = Math.max(0, (1 - opacity) * 10);
            return (
              <span key={wi} style={{ opacity, filter: `blur(${blur.toFixed(1)}px)` }}>{word}{' '}</span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
