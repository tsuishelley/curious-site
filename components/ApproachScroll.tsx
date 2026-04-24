'use client';

import { useRef, useEffect, useState } from 'react';

const CHAPTERS = [
  'Somewhere along the way, software companies became obsessed with growth at all costs. The most efficient businesses turned into cash incinerators, all in the name of growth.',
  'At Curious, we believe in offering an antidote to the startup rat race. The growth at all costs mindset has put countless companies out of business, with their product shuttered and teams furloughed.',
  'Curious is a long-term home for industry leading software businesses.',
  'We build the kind of operational foundation that compounds over time. With AI embedded in how we work, it compounds faster.',
  'We exist to help founders transition their company from unsustainable to sustainable, to change the culture from urgent to calm.',
  'As a team of operators, we evaluate a business on what it can become and help it get there.',
  'We work to fulfill the vision of the founders and operate businesses long-term.',
  'We still think in decades.\nWe just move faster inside them.',
];

// Non-linear image thresholds — spaced out early, accelerating toward end
const IMAGES: { threshold: number; bg: string }[] = [
  { threshold: 0.04, bg: 'rgba(49,43,43,0.05)' },
  { threshold: 0.14, bg: 'rgba(49,43,43,0.08)' },
  { threshold: 0.24, bg: 'rgba(49,43,43,0.11)' },
  { threshold: 0.34, bg: 'rgba(49,43,43,0.14)' },
  { threshold: 0.44, bg: 'rgba(232,82,55,0.10)' },
  { threshold: 0.52, bg: 'rgba(49,43,43,0.17)' },
  { threshold: 0.59, bg: 'rgba(49,43,43,0.20)' },
  { threshold: 0.65, bg: 'rgba(232,82,55,0.16)' },
  { threshold: 0.70, bg: 'rgba(49,43,43,0.23)' },
  { threshold: 0.75, bg: 'rgba(49,43,43,0.26)' },
  { threshold: 0.79, bg: 'rgba(232,82,55,0.22)' },
  { threshold: 0.83, bg: 'rgba(49,43,43,0.29)' },
  { threshold: 0.86, bg: 'rgba(49,43,43,0.32)' },
  { threshold: 0.89, bg: 'rgba(232,82,55,0.28)' },
  { threshold: 0.92, bg: 'rgba(49,43,43,0.35)' },
];

const FADE_OUT_DURATION = 400; // ms to stay invisible between chapters
const SCROLL_HEIGHT = '520vh';

export default function ApproachScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Separate "target" from "displayed" index to allow gap between fade-out and fade-in
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrolled = -top;
      const total = height - viewH;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Derive target chapter from scroll progress
  const targetIndex = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length));

  useEffect(() => {
    if (targetIndex === lastIndexRef.current) return;
    lastIndexRef.current = targetIndex;

    // Clear any pending transition
    if (pendingRef.current) clearTimeout(pendingRef.current);

    // Step 1: fade out
    setVisible(false);

    // Step 2: after gap, swap text and fade back in
    pendingRef.current = setTimeout(() => {
      setDisplayedIndex(targetIndex);
      setVisible(true);
    }, FADE_OUT_DURATION);

    return () => {
      if (pendingRef.current) clearTimeout(pendingRef.current);
    };
  }, [targetIndex]);

  // Images visible so far
  const visibleCount = IMAGES.filter((img) => img.threshold <= progress).length;

  return (
    <div ref={containerRef} style={{ height: SCROLL_HEIGHT }} className="approach-scroll-outer">
      <div className="approach-scroll-sticky">
        <div className="approach-scroll-grid">

          {/* ── Left: fading text ── */}
          <div className="approach-scroll-left">
            <p
              className="approach-chapter-body"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: visible
                  ? 'opacity 0.9s ease, transform 0.9s ease'
                  : 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              {CHAPTERS[displayedIndex].split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          </div>

          {/* ── Right: stacking images ── */}
          <div className="approach-scroll-right">
            <div className="approach-stack-deck">
              {IMAGES.slice(0, visibleCount).map((img, i) => {
                const depth = visibleCount - 1 - i;
                const scale = Math.max(0.82, 1 - depth * 0.03);
                const translateY = -depth * 10;
                return (
                  <div
                    key={i}
                    className="approach-stack-card"
                    style={{
                      zIndex: i + 1,
                      background: img.bg,
                      transform: `scale(${scale}) translateY(${translateY}px)`,
                      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                );
              })}
              {visibleCount === 0 && (
                <div className="approach-stack-card" style={{ background: 'rgba(49,43,43,0.05)', zIndex: 1 }} />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
