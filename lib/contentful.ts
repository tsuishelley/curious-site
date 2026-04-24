import { createClient } from 'contentful';
import type {
  HomePageSkeleton,
  ValuePropositionSkeleton,
  PortfolioCompanySkeleton,
  TestimonialSkeleton,
  NewsArticleSkeleton,
  HomePageFields,
  ValuePropositionFields,
  PortfolioCompanyFields,
  TestimonialFields,
  NewsArticleFields,
} from '@/types/contentful';

const isConfigured =
  !!process.env.CONTENTFUL_SPACE_ID && !!process.env.CONTENTFUL_ACCESS_TOKEN;

const client = isConfigured
  ? createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    })
  : null;

export async function getHomePage(): Promise<HomePageFields | null> {
  if (!client) return null;
  const entries = await client.getEntries<HomePageSkeleton>({ content_type: 'homePage', limit: 1 });
  return entries.items[0]?.fields ?? null;
}

export async function getValuePropositions(): Promise<ValuePropositionFields[]> {
  if (!client) return [];
  const entries = await client.getEntries<ValuePropositionSkeleton>({
    content_type: 'valueProposition',
  });
  return entries.items.map((e) => e.fields).sort((a, b) => a.order - b.order);
}

export async function getPortfolioCompanies(): Promise<PortfolioCompanyFields[]> {
  if (!client) return [];
  const entries = await client.getEntries<PortfolioCompanySkeleton>({
    content_type: 'portfolioCompany',
  });
  return entries.items.map((e) => e.fields).sort((a, b) => a.order - b.order);
}

export async function getTestimonials(): Promise<TestimonialFields[]> {
  if (!client) return [];
  const entries = await client.getEntries<TestimonialSkeleton>({
    content_type: 'testimonial',
  });
  return entries.items.map((e) => e.fields).sort((a, b) => a.order - b.order);
}

export async function getNewsArticles(): Promise<NewsArticleFields[]> {
  if (!client) return [];
  const entries = await client.getEntries<NewsArticleSkeleton>({
    content_type: 'newsArticle',
    limit: 4,
  });
  return entries.items
    .map((e) => e.fields)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}
