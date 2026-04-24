'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const PIXEL_SIZE = 80;
const ROWS = 2;
const FILL_RATIO = 0.70;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [cols, setCols] = useState(0);
  const [visibleCells, setVisibleCells] = useState<Set<number>>(new Set());
  const pixelRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animatedRef = useRef(false);
  const pathname = usePathname();

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const runAnimation = useCallback((numCols: number) => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    clearTimers();

    const total = numCols * ROWS;
    const count = Math.floor(total * FILL_RATIO);
    const chosen = shuffle(Array.from({ length: total }, (_, i) => i)).slice(0, count);
    const newSet = new Set<number>();

    timersRef.current = chosen.map((cellIdx, i) =>
      setTimeout(() => {
        newSet.add(cellIdx);
        setVisibleCells(new Set(newSet));
      }, i * 22)
    );
  }, []);

  // Reset on page navigation
  useEffect(() => {
    animatedRef.current = false;
    clearTimers();
    setVisibleCells(new Set());
  }, [pathname]);

  // Measure viewport width → cols
  useEffect(() => {
    const update = () => setCols(Math.floor(window.innerWidth / PIXEL_SIZE));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Trigger animation when scrolled into view
  useEffect(() => {
    const el = pixelRef.current;
    if (!el || cols === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) runAnimation(cols); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cols, runAnimation]);

  useEffect(() => () => clearTimers(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <footer className="footer">
      <div
        ref={pixelRef}
        className="footer-pixels"
        style={{
          display: 'grid',
          gridTemplateColumns: cols > 0 ? `repeat(${cols}, 1fr)` : 'none',
          gridTemplateRows: `repeat(${ROWS}, ${PIXEL_SIZE}px)`,
        }}
      >
        {cols > 0 && Array.from({ length: cols * ROWS }, (_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--red)',
              opacity: visibleCells.has(i) ? 1 : 0,
              transition: 'opacity 0.15s ease',
            }}
          />
        ))}
      </div>

      <div className="footer-inner">
        <div className="footer-col footer-col--nav">
          <a href="/about">About</a>
          <a href="https://careers.curious.vc/" target="_blank" rel="noopener noreferrer">Careers</a>
          <a href="/companies">Companies</a>
          <a href="/approach">Approach</a>
          <a href="/news">News</a>
        </div>
        <div className="footer-col footer-col--social">
          <a href="#">Linkedin</a>
          <a href="#">Twitter</a>
          <a href="#">Medium</a>
          <a href="#">Email</a>
        </div>
        <div className="footer-col footer-col--newsletter">
          <p>
            Curious is a long-term holding company that buys and grows software companies with
            empathy.
          </p>
          <p>
            Join the Curious Dispatch to receive our latest thinking, news, and opportunities
            within our portfolio.
          </p>
          {submitted ? (
            <p className="newsletter-success">Thanks — you&apos;re on the list.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                className="newsletter-input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark btn-sm">Get in Touch</button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p>©️ Curious Holdings 2026</p>
      </div>
    </footer>
  );
}
