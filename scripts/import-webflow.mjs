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

// Parse authors CSV
const authorsRaw = parse(readFileSync('Curious - Authors - 6553f75b85c6a17d96bf49ba.csv', 'utf8'), {
  columns: true, skip_empty_lines: true,
});
const authorsBySlug = Object.fromEntries(authorsRaw.map(a => [a.Slug, a.Name]));

// Parse blog posts CSV
const postsRaw = parse(readFileSync('Curious - Blog Posts - 654155fd6683e2009660d0be.csv', 'utf8'), {
  columns: true, skip_empty_lines: true,
});

// Map Webflow category via post name heuristic (no category field in Webflow)
// We'll import as 'Perspectives' by default — can be edited in Studio
function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('acqui') || lower.includes('welcome') || lower.includes('shareholder') || lower.includes('year in review')) return 'Announcements';
  if (lower.includes('update') || lower.includes('roadmap') || lower.includes('q1') || lower.includes('q2') || lower.includes('q3') || lower.includes('q4')) return 'Portfolio Updates';
  return 'Perspectives';
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  if (isNaN(d)) return null;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

async function run() {
  const posts = postsRaw.filter(p => p.Archived === 'false' && p.Draft === 'false');
  console.log(`Importing ${posts.length} published posts...`);

  for (const post of posts) {
    const authorName = authorsBySlug[post.Author] ?? post.Author ?? '';
    const date = parseDate(post['Published On']);
    const category = inferCategory(post.Name);

    await client.createOrReplace({
      _type: 'article',
      _id: `webflow-${post.Slug}`,
      title: post.Name,
      subtitle: post['Post Summary'] ?? '',
      slug: { _type: 'slug', current: post.Slug },
      category,
      date: date ?? '2024-01-01',
      author: authorName,
      body: post['Post Body'] ?? '',
    });
    console.log(`  ✓ [${category}] ${post.Name}`);
  }

  console.log('\nDone!');
}

run().catch(console.error);
