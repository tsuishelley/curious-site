import type { EntrySkeletonType } from 'contentful';

export interface HomePageSkeleton extends EntrySkeletonType {
  contentTypeId: 'homePage';
  fields: {
    heroHeadline: string;
    heroBandTagline: string;
  };
}

export interface ValuePropositionSkeleton extends EntrySkeletonType {
  contentTypeId: 'valueProposition';
  fields: {
    title: string;
    description: string;
    order: number;
  };
}

export interface PortfolioCompanySkeleton extends EntrySkeletonType {
  contentTypeId: 'portfolioCompany';
  fields: {
    name: string;
    acquisitionDate: string;
    featured: boolean;
    order: number;
  };
}

export interface TestimonialSkeleton extends EntrySkeletonType {
  contentTypeId: 'testimonial';
  fields: {
    quote: string;
    authorName: string;
    authorRole: string;
    authorCompany: string;
    order: number;
  };
}

export interface NewsArticleSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsArticle';
  fields: {
    title: string;
    excerpt: string;
    publishedDate: string;
    slug: string;
  };
}

export type HomePageFields = HomePageSkeleton['fields'];
export type ValuePropositionFields = ValuePropositionSkeleton['fields'];
export type PortfolioCompanyFields = PortfolioCompanySkeleton['fields'];
export type TestimonialFields = TestimonialSkeleton['fields'];
export type NewsArticleFields = NewsArticleSkeleton['fields'];
