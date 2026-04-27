import { createClient } from 'next-sanity';
import type { Article } from './articles';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null;

export interface SanityCompany {
  name: string;
  acquisitionDate?: string;
  logo?: { asset?: { url: string } };
  order?: number;
}

export async function fetchArticles(): Promise<Article[]> {
  if (!sanityClient) return [];
  const results = await sanityClient.fetch<
    Array<{
      title: string;
      subtitle?: string;
      slug: { current: string };
      category: string;
      date: string;
      readTime?: string;
      author?: string;
      body?: string;
    }>
  >(`*[_type == "article"] | order(date desc)`);

  return results.map((a) => ({
    title: a.title,
    subtitle: a.subtitle,
    slug: a.slug.current,
    category: a.category,
    date: (() => {
      const [y, m, d] = a.date.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    })(),
    readTime: a.readTime,
    author: a.author,
    body: a.body,
  }));
}

export async function fetchCompanies(): Promise<SanityCompany[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch<SanityCompany[]>(
    `*[_type == "company"] | order(order asc)`
  );
}
