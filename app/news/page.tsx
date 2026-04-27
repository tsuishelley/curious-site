import { ARTICLES } from '@/lib/articles';
import { fetchArticles } from '@/lib/sanity';
import WritingPageClient from '@/components/WritingPageClient';

export default async function WritingPage() {
  const sanityArticles = await fetchArticles();
  const articles = sanityArticles.length > 0 ? sanityArticles : ARTICLES;
  return <WritingPageClient articles={articles} />;
}
