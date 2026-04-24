'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  paragraphs: string[];
  className?: string;
}

export default function ScrollRevealText({ paragraphs, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const p = (windowH - rect.top) / (rect.height + windowH * 0.3);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Exclude the first paragraph from the scroll-driven pool — it's always full opacity
  const remainingWords = paragraphs.slice(1).flatMap((p) => p.split(' '));
  const total = remainingWords.length;

  let globalIndex = 0;

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((para, pi) => (
        <p key={pi} className="scroll-reveal-para">
          {para.split(' ').map((word, wi) => {
            if (pi === 0) {
              // First paragraph always full opacity
              return <span key={wi} style={{ opacity: 1 }}>{word}{' '}</span>;
            }
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
