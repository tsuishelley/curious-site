'use client';

import { usePixelHover } from '@/components/PixelHover';

const COLS = 10;
const ROWS = 10;

export default function RelatedCardImage({ heroImage, title }: { heroImage?: string; title: string }) {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(COLS, ROWS);
  const total = COLS * ROWS;
  return (
    <div
      className="post-related-image"
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImage} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {hovered && (
        <div
          className="pixel-grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="pixel-cell"
              style={{
                background: 'var(--red)',
                opacity: visibleCells.has(i) ? 1 : 0,
                transition: 'opacity 0.12s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
