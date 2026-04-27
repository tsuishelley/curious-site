import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9d49k71g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skMd8C4BoRAmc2JqtmXKqMlyjBAnnvMJtEUwpXpOkEM59jAlUrjDueHD4QhsUw3qk36fT5bulVEqOZavh',
  useCdn: false,
});

const patches = [
  // Company acquisition / funding announcements
  { slug: 'welcoming-avenue-to-curious-expanding-into-real-estate-technology', category: 'Announcements' },
  { slug: 'introducing-polymer-the-leading-applicant-tracking-system-for-small-businesses', category: 'Announcements' },
  { slug: 'announcing-16m-in-permanent-capital', category: 'Announcements' },
  { slug: 'welcoming-buildfire', category: 'Announcements' },
  { slug: 'welcoming-convox-to-the-curious-family', category: 'Announcements' },
  { slug: 'announcing-our-acquisition-of-uservoice', category: 'Announcements' },
  // Portfolio company updates
  { slug: 'shaping-insight-uservoice-brand-evolution', category: 'Portfolio Updates' },
  { slug: 'a-peek-into-what-curious-companies-are-building', category: 'Portfolio Updates' },
];

async function run() {
  for (const { slug, category } of patches) {
    const id = `webflow-${slug}`;
    const doc = await client.fetch('*[_id == $id][0]{ _id, title, category }', { id });
    if (!doc) {
      console.log(`  ✗ not found: ${id}`);
      continue;
    }
    await client.patch(id).set({ category }).commit();
    console.log(`  ✓ [${doc.category} → ${category}] ${doc.title}`);
  }
  console.log('\nDone.');
}

run().catch(console.error);
