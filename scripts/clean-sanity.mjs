import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9d49k71g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skMd8C4BoRAmc2JqtmXKqMlyjBAnnvMJtEUwpXpOkEM59jAlUrjDueHD4QhsUw3qk36fT5bulVEqOZavh',
  useCdn: false,
});

async function run() {
  // Delete all manually-seeded placeholder articles (article-* prefix)
  const placeholders = await client.fetch('*[_type == "article" && _id match "article-*"]._id');
  console.log(`Deleting ${placeholders.length} placeholder articles...`);
  for (const id of placeholders) {
    await client.delete(id);
    console.log(`  ✓ deleted ${id}`);
  }
  console.log('\nDone. Remaining articles:');
  const remaining = await client.fetch('*[_type == "article"] | order(date desc) { _id, title, date }');
  remaining.forEach(a => console.log(`  ${a.date}  ${a.title}`));
}

run().catch(console.error);
