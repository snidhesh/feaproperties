/**
 * BrokerDesk → FEA Properties — normalized CRM types.
 *
 * Promoted from `scripts/types.draft.ts` after Phase 0 probe sign-off.
 * Single source of truth for `Property` and `LeadPayload`. The adapter in
 * `lib/crm/adapter.ts` translates the raw BrokerDesk shape → these types.
 *
 * Source contract: GET https://feaprop.brokerdesk.ae/api/v1/public/listings
 * Auth: x-api-key (raw, no prefix)
 */

import {z} from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// 1) RAW BROKERDESK SHAPE
// ─────────────────────────────────────────────────────────────────────────────

export const BrokerDeskAgentSchema = z.object({
  name: z.string(),
});

export const BrokerDeskListingSchema = z.object({
  id: z.string(),
  reference: z.string(),
  titleEn: z.string(),
  titleAr: z.string().nullable(),
  descriptionEn: z.string(),
  descriptionAr: z.string().nullable(),
  address: z.string(),
  locationCity: z.string(),
  locationCommunity: z.string(),
  locationBuilding: z.string(),
  offering: z.enum(['sale', 'yearly']),
  type: z.string(), // BrokerDesk uses free-text; we normalize in the adapter
  furnishingType: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  area: z.number(),
  parkingSlots: z.number(),
  price: z.number(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()),
  agent: BrokerDeskAgentSchema,
  availableFrom: z.string(),
  developer: z.string().nullable(),
  projectName: z.string().nullable(),
  numberOfFloors: z.number().nullable(),
  plotSize: z.number().nullable(),
});

export const BrokerDeskListResponseSchema = z.object({
  data: z.array(BrokerDeskListingSchema),
});

export type BrokerDeskListing = z.infer<typeof BrokerDeskListingSchema>;
export type BrokerDeskListResponse = z.infer<typeof BrokerDeskListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 2) NORMALIZED INTERNAL TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type LocalizedString = {
  en: string;
  ar?: string;
  /** true when AR is missing and EN is shown as fallback */
  fallback?: boolean;
};

export type PropertyStatus = 'off-plan' | 'ready' | 'rented' | 'sold';
export type PropertyOffering = 'sale' | 'rent-yearly';
export type PropertyCategory =
  | 'apartment'
  | 'villa'
  | 'townhouse'
  | 'hotel-apartment'
  | 'penthouse';
export type FurnishingType = 'furnished' | 'semi-furnished' | 'unfurnished';
export type Locale = 'en' | 'ar';

export type Property = {
  id: string;
  reference: string;
  slug: string;

  title: LocalizedString;
  description: LocalizedString;
  marketingHeadline: string;

  status: PropertyStatus;
  offering: PropertyOffering;
  category: PropertyCategory;
  furnishing: FurnishingType;

  location: {
    city: string;
    community: string;
    building: string;
    latLng?: [number, number];
  };

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parkingSlots: number;

  price: {amount: number; currency: 'AED'};

  amenities: string[];
  media: {
    hero: string;
    gallery: string[];
  };

  agent: {name: string; phone?: string; whatsapp?: string};
  availableFrom: string;
  updatedAt: string;

  developer?: string;
  projectName?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) LEAD PAYLOAD (intake on hold until customer confirms; types ready)
// ─────────────────────────────────────────────────────────────────────────────

export type LeadSource =
  | 'contact-page'
  | 'property-inquiry'
  | 'consultation'
  | 'footer'
  | 'newsletter';

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: LeadSource;
  propertyId?: string;
  propertyReference?: string;
  propertyTitle?: string;
  locale: Locale;
  pageUrl: string;
  utm?: {source?: string; medium?: string; campaign?: string};
  submittedAt: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) FILTERS (used by /properties listing page)
// ─────────────────────────────────────────────────────────────────────────────

export type PropertyFilters = {
  status?: PropertyStatus;
  category?: PropertyCategory;
  community?: string;
  bedsMin?: number;
  priceMin?: number;
  priceMax?: number;
  offering?: PropertyOffering;
};

export type FilterFacets = {
  communities: Array<{value: string; count: number}>;
  categories: Array<{value: PropertyCategory; count: number}>;
  developers: Array<{value: string; count: number}>;
  priceCoverage: number; // 0..1 — fraction of listings with numeric price
  bedsCoverage: number;
  developerCoverage: number;
};
