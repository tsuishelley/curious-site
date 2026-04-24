import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/lib/articles';
import ShareButton from '@/components/ShareButton';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  return { title: article?.title ?? 'Article' };
}

export default function ArticlePage({ params }: Props) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      {/* ── Article Header ── */}
      <header className="post-header">
        <div className="post-meta-row">
          <span className="post-date">{article.date}</span>
          <span className="post-meta-dot" />
          <span className="post-category">{article.category}</span>
          {article.readTime && (
            <>
              <span className="post-meta-dot" />
              <span className="post-read-time">{article.readTime}</span>
            </>
          )}
        </div>

        <h1 className="post-title">{article.title}</h1>

        {article.subtitle && (
          <p className="post-subtitle">{article.subtitle}</p>
        )}
      </header>

      {/* ── Utility Bar ── */}
      <div className="post-utility-bar">
        <div className="post-utility-left">
          {article.author && (
            <span className="post-author">By {article.author}</span>
          )}
        </div>
        <ShareButton />
      </div>

      {/* ── Hero Image ── */}
      <div className="post-hero-image" />

      {/* ── Article Body ── */}
      <article className="post-body">
        {article.body ? (
          article.body.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))
        ) : (
          <>
            <p>
              We started by talking to customers. Not about design — about what they trusted.
              What they feared losing. The answers were consistent: reliability, transparency,
              and a sense that the software had been built by people who understood the problem
              at a deep level.
            </p>
            <p>
              That gave us our brief. The new identity needed to feel considered without feeling
              cold. Modern without feeling like a rebrand for its own sake. We landed on a system
              built around clarity — clean type, generous whitespace, and a palette anchored in
              warmth.
            </p>
            <p>
              The result is a product that looks like it belongs in 2026, while feeling like it
              was built by the same team customers have trusted since the beginning. That
              continuity matters more than most people realize.
            </p>
          </>
        )}
      </article>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <section className="post-related">
          <div className="post-related-grid">
            {related.map((a) => (
              <Link key={a.slug} href={`/news/${a.slug}`} className="post-related-card">
                <div className="post-related-image" />
                <div className="post-related-body">
                  <p className="post-related-card-title">{a.title}</p>
                  <p className="post-related-card-meta">
                    <span>{a.category}</span>
                    <span className="post-meta-dot" />
                    <span>{a.date}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="post-related-back">
            <Link href="/news">← All articles</Link>
          </div>
        </section>
      )}
    </>
  );
}
