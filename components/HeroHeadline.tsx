'use client';

import { useEffect, useState } from 'react';

const LINES = [
  { text: 'We create exceptional exits', italic: false },
  { text: "for founders, evolving what", italic: false },
  { text: "they've built to stay ahead of", italic: false },
  { text: "what's next.", italic: true },
];

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789$#@&=+~%!?*^<>';
const SCRAMBLE_TARGET = "what's next.";
const SCRAMBLE_DURATION = 900; // ms for full resolution
const SCRAMBLE_START_DELAY = 860; // ms after mount (as the line slides in)

function useScramble(target: string, startDelay: number) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;

    const outerTimer = setTimeout(() => {
      const SWAP_INTERVAL = 80; // ms between character swaps
      let lastSwap: number | null = null;

      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);

        // Only re-randomise characters every SWAP_INTERVAL ms
        if (lastSwap === null || now - lastSwap >= SWAP_INTERVAL) {
          lastSwap = now;

          const result = target
            .split('')
            .map((char, i) => {
              if (char === ' ' || char === "'" || char === '.') return char;
              const resolveAt = (i / target.replace(/[' .]/g, '').length) * 0.85;
              if (progress >= resolveAt + 0.15) return char;
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join('');

          setDisplay(result);
        }

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
        }
      };

      rafId = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(outerTimer);
      cancelAnimationFrame(rafId);
    };
  }, [target, startDelay]);

  return display;
}

export default function HeroHeadline() {
  const [visible, setVisible] = useState(false);
  const scrambled = useScramble(SCRAMBLE_TARGET, SCRAMBLE_START_DELAY);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <h1 className="hero-headline">
      {LINES.map((line, i) => (
        <span key={i} className="hero-line-wrap">
          <span
            className={`hero-line${visible ? ' hero-line--visible' : ''}${line.italic ? ' italic-serif' : ''}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {line.italic ? scrambled : line.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
