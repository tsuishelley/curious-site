import { createClient } from '@sanity/client';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: '9d49k71g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skMd8C4BoRAmc2JqtmXKqMlyjBAnnvMJtEUwpXpOkEM59jAlUrjDueHD4QhsUw3qk36fT5bulVEqOZavh',
  useCdn: false,
});

const posts = parse(readFileSync('Curious - Blog Posts - 654155fd6683e2009660d0be.csv', 'utf8'), {
  columns: true, skip_empty_lines: true,
}).filter(p => p.Archived === 'false' && p.Draft === 'false');

const BULK_PUBLISH = 'Thu Jul 03 2025';

function toYMD(str) {
  const d = new Date(str);
  return d.toISOString().split('T')[0];
}

async function run() {
  for (const post of posts) {
    const publishedOn = post['Published On'];
    const createdOn = post['Created On'];
    const id = `webflow-${post.Slug}`;

    // Use createdOn for articles bulk-published on Jul 3 2025 (not their real date)
    const useCreated = publishedOn.startsWith(BULK_PUBLISH);
    const date = toYMD(useCreated ? createdOn : publishedOn);

    await client.patch(id).set({ date }).commit();
    console.log(`${useCreated ? '[fixed]' : '[ok]   '} ${date}  ${post.Name}`);
  }
  console.log('\nDone.');
}

run().catch(console.error);
