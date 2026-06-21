/**
 * Hard-coded insights content for MVP.
 *
 * Replaced by Sanity-driven content in Phase 2 (see plan). Until then we keep
 * the source of truth here so both the homepage section, the /insights index,
 * and the /insights/[slug] detail pages stay in sync. Each post's localized
 * copy (title, excerpt, body paragraphs) lives under `home.insights.posts.<key>`
 * in messages/{en,ar}.json — fetched at render time via next-intl.
 */

export type InsightPostKey = 'goldenVisa' | 'buyerGuide' | 'corporateTax';

export type InsightPost = {
  slug: string;
  key: InsightPostKey;
  image: string;
  publishedAt: string; // ISO date
  readMinutes: number;
};

export const INSIGHT_POSTS: InsightPost[] = [
  {
    slug: 'golden-visa-2026',
    key: 'goldenVisa',
    image:
      'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-06-12',
    readMinutes: 5,
  },
  {
    slug: 'buyers-guide-dubai',
    key: 'buyerGuide',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-04-08',
    readMinutes: 7,
  },
  {
    slug: 'uae-corporate-tax',
    key: 'corporateTax',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-02-03',
    readMinutes: 6,
  },
];

export function findPostBySlug(slug: string): InsightPost | undefined {
  return INSIGHT_POSTS.find((p) => p.slug === slug);
}

export function findPostByKey(key: InsightPostKey): InsightPost {
  const post = INSIGHT_POSTS.find((p) => p.key === key);
  if (!post) throw new Error(`Missing insight post for key: ${key}`);
  return post;
}
