'use client';

import Link from 'next/link';
import { useFadeIn } from '@/lib/useFadeIn';
import { usePixelHover } from '@/components/PixelHover';
import type { Article } from '@/lib/articles';

const COLS = 10;
const ROWS = 8;

function NewsCardImage({ heroImage, title }: { heroImage?: string; title: string }) {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(COLS, ROWS);
  const total = COLS * ROWS;
  return (
    <div
      className="news-card-image"
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

export default function NewsSection({ articles }: { articles: Article[] }) {
  const { ref, visible } = useFadeIn();
  const featured = articles.slice(0, 3);

  return (
    <section className="news" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`fade-content${visible ? ' fade-content--visible' : ''}`}>
        <h2 className="section-title news-section-title">Always learning, always Curious.</h2>
        <div className="news-grid">
          {featured.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="news-card">
              <NewsCardImage heroImage={article.heroImage} title={article.title} />
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
