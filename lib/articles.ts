export interface Article {
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  slug: string;
  readTime?: string;
  author?: string;
  body?: string;
}

export const ARTICLES: Article[] = [];
