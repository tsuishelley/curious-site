'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/basePath';

const SEARCH_DATA = {
  companies: ['Buildfire', 'Convox', 'Uservoice', 'Polymer', 'Avenue'],
  articles: [
    'Shaping Insight: Uservoice Brand Evolution',
    'The Free Trial Trap: Why More Product Exposure Isn\'t Always Better',
  ],
};

function getResults(q: string) {
  if (!q.trim()) return null;
  const lower = q.toLowerCase();
  return {
    companies: SEARCH_DATA.companies.filter((c) => c.toLowerCase().includes(lower)),
    articles: SEARCH_DATA.articles.filter((a) => a.toLowerCase().includes(lower)),
  };
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/news?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/images/logo-curious.svg')} alt="Curious Holdings" className="nav-logo-img" />
        </Link>
        <div className="nav-links">
          <Link href="/companies">Companies</Link>
          <Link href="/approach">Approach</Link>
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          <button
            className="nav-search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11.7" y1="11.7" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <Link href="/#contact" className="btn btn-dark btn-sm nav-cta">
          Get in Touch
        </Link>
        <button
          className="nav-hamburger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* SEARCH OVERLAY */}
      {searchOpen && (() => {
        const results = getResults(query);
        const totalCount = results ? results.companies.length + results.articles.length : 0;
        return (
          <div className="search-overlay search-overlay--open">
            {/* Close */}
            <button className="search-close-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Input */}
            <div className="search-body">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  ref={inputRef}
                  className="search-input"
                  type="text"
                  placeholder="Search Curious..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
                <svg className="search-form-icon" width="22" height="22" viewBox="0 0 18 18" fill="none">
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="11.7" y1="11.7" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </form>

              {/* Results */}
              {results && (
                <div className="search-results">
                  {results.companies.length > 0 && (
                    <div className="search-results-group">
                      <p className="search-results-heading">COMPANIES</p>
                      {results.companies.map((name) => (
                        <Link
                          key={name}
                          href="/companies"
                          className="search-result-item"
                          onClick={() => setSearchOpen(false)}
                        >
                          <span className="search-result-name">{name}</span>
                          <hr className="search-result-divider" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.articles.length > 0 && (
                    <div className="search-results-group">
                      <p className="search-results-heading">WRITING</p>
                      {results.articles.map((title) => (
                        <Link
                          key={title}
                          href="/news"
                          className="search-result-item"
                          onClick={() => setSearchOpen(false)}
                        >
                          <span className="search-result-name">{title}</span>
                          <hr className="search-result-divider" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {totalCount === 0 && (
                    <p className="search-no-results">No results found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <Link href="/companies" onClick={() => setMenuOpen(false)}>Companies</Link>
        <Link href="/approach" onClick={() => setMenuOpen(false)}>Approach</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/news" onClick={() => setMenuOpen(false)}>News</Link>
        <Link href="/#contact" className="btn btn-outline-dark" onClick={() => setMenuOpen(false)}>
          Get in Touch
        </Link>
      </div>
    </>
  );
}
