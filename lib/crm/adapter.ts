/**
 * BrokerDesk → normalized `Property` adapter.
 *
 * Keeps all CRM-shape quirks isolated here so the rest of the app imports a
 * stable `Property` type from `lib/crm/types`. If BrokerDesk changes their
 * shape, only this file moves.
 */

import {
  type BrokerDeskListing,
  type Property,
  type PropertyStatus,
  type PropertyOffering,
  type PropertyCategory,
  type FurnishingType,
  type LocalizedString,
} from './types';
import {buildSlug} from '../utils/slugify';

// ─────────────────────────────────────────────────────────────────────────────
// Field normalizers
// ─────────────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES: readonly PropertyCategory[] = [
  'apartment',
  'villa',
  'townhouse',
  'hotel-apartment',
  'penthouse',
];

const VALID_FURNISHING: readonly FurnishingType[] = [
  'furnished',
  'semi-furnished',
  'unfurnished',
];

function toCategory(raw: string): PropertyCategory {
  const normalized = raw.toLowerCase().replace(/[_\s]+/g, '-');
  if ((VALID_CATEGORIES as readonly string[]).includes(normalized)) {
    return normalized as PropertyCategory;
  }
  // Unknown category → fall back to apartment (most common in current data)
  console.warn(`[adapter] unknown category "${raw}"; defaulting to apartment`);
  return 'apartment';
}

function toFurnishing(raw: string): FurnishingType {
  const normalized = raw.toLowerCase().replace(/[_\s]+/g, '-');
  if ((VALID_FURNISHING as readonly string[]).includes(normalized)) {
    return normalized as FurnishingType;
  }
  return 'unfurnished';
}

function toOffering(raw: 'sale' | 'yearly'): PropertyOffering {
  return raw === 'sale' ? 'sale' : 'rent-yearly';
}

/**
 * Infer status — BrokerDesk doesn't expose a status field.
 * - projectName set                   → off-plan
 * - availableFrom > today + 90 days   → off-plan
 * - otherwise                         → ready
 */
function inferStatus(listing: BrokerDeskListing): PropertyStatus {
  if (listing.projectName) return 'off-plan';
  const available = new Date(listing.availableFrom);
  if (Number.isNaN(available.getTime())) return 'ready';
  const ninetyDaysFromNow = new Date(Date.now() + 90 * 86_400_000);
  if (available > ninetyDaysFromNow) return 'off-plan';
  return 'ready';
}

function localized(en: string, ar: string | null | undefined): LocalizedString {
  const arTrimmed = ar?.trim();
  if (arTrimmed && arTrimmed.length > 0) {
    return {en, ar: arTrimmed};
  }
  return {en, fallback: true};
}

// ─────────────────────────────────────────────────────────────────────────────
// Adapter
// ─────────────────────────────────────────────────────────────────────────────

export function adaptListing(listing: BrokerDeskListing): Property {
  const heroImage = listing.images[0];
  if (!heroImage) {
    console.warn(`[adapter] listing ${listing.id} has no images`);
  }
  return {
    id: listing.id,
    reference: listing.reference,
    slug: buildSlug(listing.titleEn, listing.id),

    title: localized(listing.titleEn, listing.titleAr),
    description: localized(listing.descriptionEn, listing.descriptionAr),
    marketingHeadline: listing.address,

    status: inferStatus(listing),
    offering: toOffering(listing.offering),
    category: toCategory(listing.type),
    furnishing: toFurnishing(listing.furnishingType),

    location: {
      city: listing.locationCity,
      community: listing.locationCommunity,
      building: listing.locationBuilding,
      // No lat/lng in CRM — lib/geo/communities.ts (Phase 2) provides centroid
    },

    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    areaSqft: listing.area,
    parkingSlots: listing.parkingSlots,

    price: {amount: listing.price, currency: 'AED'},

    amenities: listing.amenities,
    media: {
      hero: heroImage ?? '',
      gallery: listing.images.slice(1),
    },

    agent: {
      name: listing.agent.name.trim(),
      // BrokerDesk public API exposes only name. We default the contact
      // channels to Feleg's published numbers in the UI layer.
    },
    availableFrom: listing.availableFrom,
    updatedAt: new Date().toISOString(),

    developer: listing.developer ?? undefined,
    projectName: listing.projectName ?? undefined,
  };
}

export function adaptListings(listings: BrokerDeskListing[]): Property[] {
  return listings.map(adaptListing);
}
