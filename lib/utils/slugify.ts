/**
 * Slug helpers — stable, locale-agnostic URLs.
 *
 * Strategy per the approved plan:
 *   `slugify(titleEn) + '-' + last8(id)`
 *
 * The id suffix keeps slugs unique even if FEA renames a listing in BrokerDesk,
 * and lets us recover the listing from the URL without a lookup table.
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function buildSlug(title: string, id: string): string {
  const base = slugify(title);
  const suffix = id.replace(/-/g, '').slice(-8);
  return base ? `${base}-${suffix}` : suffix;
}

export function idFromSlug(slug: string): string | null {
  const match = slug.match(/-([a-z0-9]{8})$/i);
  return match?.[1] ?? null;
}
