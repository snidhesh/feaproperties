/**
 * Service layer over the CRM client + adapter.
 * UI imports from here; never touches `client.ts` or `adapter.ts` directly.
 */

import 'server-only';
import {fetchAllListings} from './client';
import {adaptListings, adaptListing} from './adapter';
import {idFromSlug} from '../utils/slugify';
import type {
  Property,
  PropertyFilters,
  FilterFacets,
  PropertyCategory,
} from './types';

let memo: Promise<Property[]> | null = null;

function getMemoizedListings(): Promise<Property[]> {
  if (!memo) {
    memo = fetchAllListings()
      .then(adaptListings)
      .catch((err) => {
        memo = null; // allow retry on error
        throw err;
      });
  }
  return memo;
}

// Reset memoization between revalidations — server-rendered pages with ISR
// share this module load; re-fetch happens via the underlying fetch cache.
export function resetListingsMemo() {
  memo = null;
}

export async function getAllProperties(): Promise<Property[]> {
  return getMemoizedListings();
}

export async function getProperty(slug: string): Promise<Property | null> {
  const all = await getAllProperties();
  // Slug suffix is the last 8 chars of the id (de-hyphenated). Match against
  // each candidate's slug for exact equality first, then fall back to id suffix
  // so renamed listings still resolve.
  const exact = all.find((p) => p.slug === slug);
  if (exact) return exact;

  const suffix = idFromSlug(slug);
  if (!suffix) return null;
  return (
    all.find((p) => p.id.replace(/-/g, '').endsWith(suffix.toLowerCase())) ??
    null
  );
}

export async function getFeaturedProperties(
  max: number = 3,
): Promise<Property[]> {
  const all = await getAllProperties();
  // Until a Sanity-driven featured override exists, surface the highest-value
  // sale listings first. Falls back to anything if no sale listings present.
  const sorted = [...all].sort((a, b) => {
    if (a.offering !== b.offering) return a.offering === 'sale' ? -1 : 1;
    return b.price.amount - a.price.amount;
  });
  return sorted.slice(0, max);
}

export async function filterProperties(
  filters: PropertyFilters,
): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter((p) => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.offering && p.offering !== filters.offering) return false;
    if (filters.community && p.location.community !== filters.community)
      return false;
    if (filters.bedsMin != null && p.bedrooms < filters.bedsMin) return false;
    if (filters.priceMin != null && p.price.amount < filters.priceMin)
      return false;
    if (filters.priceMax != null && p.price.amount > filters.priceMax)
      return false;
    return true;
  });
}

export async function getFacets(): Promise<FilterFacets> {
  const all = await getAllProperties();
  const total = all.length || 1;

  const tally = <T extends string>(values: T[]) => {
    const map = new Map<T, number>();
    for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
    return [...map.entries()]
      .map(([value, count]) => ({value, count}))
      .sort((a, b) => b.count - a.count);
  };

  return {
    communities: tally(all.map((p) => p.location.community)),
    categories: tally(all.map((p) => p.category)) as Array<{
      value: PropertyCategory;
      count: number;
    }>,
    developers: tally(
      all.map((p) => p.developer).filter((d): d is string => !!d),
    ),
    priceCoverage: all.filter((p) => p.price.amount > 0).length / total,
    bedsCoverage: all.filter((p) => p.bedrooms > 0).length / total,
    developerCoverage: all.filter((p) => !!p.developer).length / total,
  };
}

export {adaptListing};
