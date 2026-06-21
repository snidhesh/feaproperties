/**
 * Featured communities on the homepage rail.
 *
 * Imagery: currently stock photography from Unsplash, visually verified to
 * match the location vibe (aerial of Palm Jumeirah, Burj Khalifa for
 * Downtown, marina at twilight for Dubai Marina, etc.). When FEA's own
 * library is ready, swap each `image` field for the hosted URL — the rest
 * of the structure stays the same. The `kicker` translation key resolves
 * via `messages/{en,ar}.json` under `home.communities.<kickerKey>`.
 */

export type FeaturedCommunity = {
  /** URL slug — used at /communities/[slug] */
  slug: string;
  /** Display name — should match `Property.location.community` in CRM */
  name: string;
  /** Short kicker overlaid above the name (e.g. "Iconic", "Waterfront") */
  kicker: string;
  /** Hero image URL */
  image: string;
};

export const FEATURED_COMMUNITIES: FeaturedCommunity[] = [
  {
    slug: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    kicker: 'Iconic',
    image:
      'https://images.unsplash.com/photo-1732645023408-6e99df42f09e?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    kicker: 'Skyline',
    image:
      'https://images.unsplash.com/photo-1582120031356-35f21bf61055?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'dubai-marina',
    name: 'Dubai Marina',
    kicker: 'Waterfront',
    image:
      'https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'meydan',
    name: 'Meydan',
    kicker: 'Garden estate',
    image:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'emaar-south',
    name: 'Emaar South',
    kicker: 'Emerging',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'dubai-islands',
    name: 'Dubai Islands',
    kicker: 'New shores',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
  },
];

export function findCommunityBySlug(slug: string): FeaturedCommunity | undefined {
  return FEATURED_COMMUNITIES.find((c) => c.slug === slug);
}
