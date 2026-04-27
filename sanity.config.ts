import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { article } from './sanity/schemas/article';
import { company } from './sanity/schemas/company';

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '9d49k71g',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  schema: {
    types: [article, company],
  },
  plugins: [
    structureTool(),
    visionTool(),
  ],
});
