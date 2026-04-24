'use client';

import { useEffect, useRef, useState } from 'react';
import { usePixelHover } from './PixelHover';

const COLS = 14;
const ROWS = 6;

export default function CTASection() {
  const wrapRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ cols: COLS, rows: ROWS });
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(size.cols, size.rows);
  const total = size.cols * size.rows;

  return (
    <section
      ref={wrapRef}
      className="cta-banner"
      id="contact"
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
      data-red-bg
    >
      {/* Pixel overlay */}
      {hovered && (
        <div
          className="pixel-grid cta-pixel-grid"
          style={{
            gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
            gridTemplateRows: `repeat(${size.rows}, 1fr)`,
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="pixel-cell"
              style={{
                background: '#fff',
                opacity: visibleCells.has(i) ? 0.2 : 0,
                transition: 'opacity 0.12s ease',
              }}
            />
          ))}
        </div>
      )}

      <h2 className="cta-headline italic-serif">Get in touch with our team.</h2>
    </section>
  );
}
