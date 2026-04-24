'use client';

import Link from 'next/link';
import { useFadeIn } from '@/lib/useFadeIn';
import { ARTICLES } from '@/lib/articles';
import { usePixelHover } from '@/components/PixelHover';

const COLS = 10;
const ROWS = 8;

function NewsCardImage() {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(COLS, ROWS);
  const total = COLS * ROWS;
  return (
    <div
      className="news-card-image"
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
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

export default function NewsSection() {
  const { ref, visible } = useFadeIn();
  const featured = ARTICLES.slice(0, 2);

  return (
    <section className="news" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`fade-content${visible ? ' fade-content--visible' : ''}`}>
        <h2 className="section-title news-section-title">Always learning, always Curious.</h2>
        <div className="news-grid">
          {featured.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="news-card">
              <NewsCardImage />
              <div className="news-card-body">
                <p className="news-card-title">{article.title}</p>
                <p className="news-card-meta">
                  <span className="news-card-category">{article.category}</span>
                  <span className="news-card-dot" />
                  <span className="news-card-date">{article.date}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="writing-pagination" style={{ justifyContent: 'flex-end' }}>
          <a href="/news">See all →</a>
        </div>
      </div>
    </section>
  );
}
