'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePixelHover } from '@/components/PixelHover';
import type { Article } from '@/lib/articles';

const FILTERS = ['All', 'Announcements', 'Perspectives', 'Portfolio Updates'];
const COLS = 10;
const ROWS = 10;
const PAGE_SIZE = 15;

function WritingCardImage({ heroImage, title }: { heroImage?: string; title: string }) {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(COLS, ROWS);
  const total = COLS * ROWS;
  return (
    <div
      className="writing-card-image"
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

export default function WritingPageClient({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  const filtered = activeFilter === 'All'
    ? articles
    : articles.filter((a) => a.category === activeFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(f: string) {
    setActiveFilter(f);
    setPage(1);
  }

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="writing-section">
      <div className="writing-title-wrap">
        <h1 className={`writing-title writing-title--anim${mounted ? ' writing-title--visible' : ''}`}>
          {activeFilter}
        </h1>
      </div>

      <div className={`writing-filters writing-filters--anim${mounted ? ' writing-filters--visible' : ''}`}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`writing-filter${activeFilter === f ? ' writing-filter--active' : ''}`}
            onClick={() => handleFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="writing-grid">
        {paginated.map((article, i) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className={`writing-card writing-card--anim${mounted ? ' writing-card--visible' : ''}`}
            style={{ animationDelay: mounted ? `${0.3 + i * 0.12}s` : '0s' }}
          >
            <WritingCardImage heroImage={article.heroImage} title={article.title} />
            <div className="writing-card-body">
              <p className="writing-card-title">{article.title}</p>
              <p className="writing-card-meta">
                <span className="writing-card-category">{article.category}</span>
                <span className="writing-card-dot" />
                <span className="writing-card-date">{article.date}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="writing-pagination">
          {page > 1 && (
            <button onClick={handlePrev}>← Previous</button>
          )}
          {page < totalPages && (
            <button onClick={handleNext} style={{ marginLeft: 'auto' }}>Next →</button>
          )}
        </div>
      )}
    </section>
  );
}
