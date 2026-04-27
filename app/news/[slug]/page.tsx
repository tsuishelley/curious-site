import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/lib/articles';
import { fetchArticles } from '@/lib/sanity';
import ShareButton from '@/components/ShareButton';
import RelatedCardImage from '@/components/RelatedCardImage';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticles() {
  const sanity = await fetchArticles();
  return sanity.length > 0 ? sanity : ARTICLES;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  return { title: article?.title ?? 'Article' };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
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
        {article.subtitle && <p className="post-subtitle">{article.subtitle}</p>}
      </header>

      <div className="post-utility-bar">
        <div className="post-utility-left">
          {article.author && <span className="post-author">By {article.author}</span>}
        </div>
        <ShareButton />
      </div>

      {article.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.heroImage} alt={article.title} className="post-hero-image" />
      ) : (
        <div className="post-hero-image" />
      )}

      <article
        className="post-body"
        dangerouslySetInnerHTML={{ __html: article.body ?? '' }}
      />

      {related.length > 0 && (
        <section className="post-related">
          <div className="post-related-grid">
            {related.map((a) => (
              <Link key={a.slug} href={`/news/${a.slug}`} className="post-related-card">
                <RelatedCardImage heroImage={a.heroImage} title={a.title} />
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
