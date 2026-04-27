'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePixelHover } from '@/components/PixelHover';
import type { Article } from '@/lib/articles';

const FILTERS = ['All', 'Announcements', 'Perspectives', 'Portfolio Updates'];
const COLS = 10;
const ROWS = 10;

function WritingCardImage() {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(COLS, ROWS);
  const total = COLS * ROWS;
  return (
    <div
      className="writing-card-image"
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

export default function WritingPageClient({ articles }: { articles: Article[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  const PAGE_SIZE = 15;
  const filtered = (activeFilter === 'All'
    ? articles
    : articles.filter((a) => a.category === activeFilter)
  ).slice(0, PAGE_SIZE);

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
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="writing-grid">
        {filtered.map((article, i) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className={`writing-card writing-card--anim${mounted ? ' writing-card--visible' : ''}`}
            style={{ animationDelay: mounted ? `${0.2 + i * 0.07}s` : '0s' }}
          >
            <WritingCardImage />
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

      <div className="writing-pagination">
        <a href="#">← Previous</a>
        <a href="#">Next →</a>
      </div>
    </section>
  );
}
