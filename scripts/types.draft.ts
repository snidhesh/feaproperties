/**
 * Phase 0.4 — Normalized types drafted from the BrokerDesk probe.
 *
 * THIS IS A DRAFT. It is promoted to `lib/crm/types.ts` in Phase 1.4 once the
 * Next.js scaffold exists. Until then, keep all CRM-shape decisions documented
 * here so the adapter has a single source of truth.
 *
 * Source data: probe-output/properties.raw.json (4 active listings, single
 * tenant feaprop.brokerdesk.ae, sampled 2026-06-21).
 */

import {z} from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// 1) RAW BROKERDESK SHAPE
// Mirrors exactly what `/api/v1/public/listings` returns — no normalization.
// Used by the adapter as its input contract.
// ─────────────────────────────────────────────────────────────────────────────

export const BrokerDeskAgentSchema = z.object({
  name: z.string(),
});

export const BrokerDeskListingSchema = z.object({
  id: z.string(),
  reference: z.string(),

  // Title / description — both locales structurally present.
  // Empirically: titleEn 100%, titleAr & descriptionAr 0% populated.
  titleEn: z.string(),
  titleAr: z.string().nullable(),
  descriptionEn: z.string(),
  descriptionAr: z.string().nullable(),

  // Address line FEA writes free-form ("Exclusive | Community View | Vacant").
  // Not a real street address; treat as a marketing strapline.
  address: z.string(),

  // Granular location. No lat/lng anywhere in the payload.
  locationCity: z.string(),
  locationCommunity: z.string(),
  locationBuilding: z.string(),

  // BrokerDesk uses `offering` for transaction type, NOT readiness.
  //   sale    → for sale (covers off-plan AND ready; the API doesn't distinguish)
  //   yearly  → annual rental
  // No `status` field exists; off-plan vs ready must be inferred (see notes).
  offering: z.enum(['sale', 'yearly']),

  type: z.enum(['apartment', 'villa', 'townhouse', 'hotel-apartment', 'penthouse']),
  furnishingType: z.enum(['furnished', 'semi-furnished', 'unfurnished']),

  bedrooms: z.number(),
  bathrooms: z.number(),
  area: z.number(),                       // sqft
  parkingSlots: z.number(),
  price: z.number(),                      // raw AED, e.g. 2_580_000

  amenities: z.array(z.string()),         // kebab-case tags
  images: z.array(z.string().url()),
  agent: BrokerDeskAgentSchema,
  availableFrom: z.string(),              // ISO date

  // Empirically 0% populated, but accept any shape:
  developer: z.string().nullable(),
  projectName: z.string().nullable(),
  numberOfFloors: z.number().nullable(),
  plotSize: z.number().nullable(),
});

export const BrokerDeskListResponseSchema = z.object({
  data: z.array(BrokerDeskListingSchema),
});

export type BrokerDeskListing = z.infer<typeof BrokerDeskListingSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 2) NORMALIZED INTERNAL TYPES
// The shape the UI imports. The adapter does CRM-shape → this.
// ─────────────────────────────────────────────────────────────────────────────

export type LocalizedString = {en: string; ar?: string};

export type PropertyStatus =
  | 'off-plan' // inferred when availableFrom is in the future OR projectName is set
  | 'ready'    // default for sale listings
  | 'rented'   // can't currently infer; reserved
  | 'sold';    // can't currently infer; reserved

export type PropertyOffering = 'sale' | 'rent-yearly';

export type Property = {
  id: string;
  reference: string;
  slug: string; // slugify(titleEn) + '-' + last8(id)

  title: LocalizedString;
  description: LocalizedString;
  marketingHeadline: string; // CRM `address` field — boutique strapline

  status: PropertyStatus;
  offering: PropertyOffering;
  category: 'apartment' | 'villa' | 'townhouse' | 'hotel-apartment' | 'penthouse';
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';

  location: {
    city: string;
    community: string;
    building: string;
    // BrokerDesk does NOT return lat/lng. We resolve coordinates via
    // lib/geo/communities.ts at render time. Map detail card falls back to
    // community-level pin when precise coords are absent.
    latLng?: [number, number];
  };

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parkingSlots: number;

  // Currency hard-coded — BrokerDesk only quotes AED.
  price: {amount: number; currency: 'AED'};

  amenities: string[];
  media: {
    hero: string;        // images[0]
    gallery: string[];   // images[1..]
    // video / virtualTour / floorPlans: not currently exposed; Phase 2.
  };

  agent: {name: string; phone?: string; whatsapp?: string};
  availableFrom: string;
  updatedAt: string; // synthetic — set to probe time until BrokerDesk exposes it

  // Empirically null in current inventory — keep optional so the listings UI
  // can show the field when FEA backfills it.
  developer?: string;
  projectName?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) LEAD PAYLOAD (Phase 1.10 will POST these to /api/v1/public/intake/leads)
// Final field names depend on BrokerDesk's intake schema — confirmed once the
// lead-intake API key is supplied and we get a successful POST.
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
  // Property context (only on property-inquiry source)
  propertyId?: string;
  propertyReference?: string;
  propertyTitle?: string;
  // Routing context
  locale: 'en' | 'ar';
  pageUrl: string;
  utm?: {source?: string; medium?: string; campaign?: string};
  submittedAt: string; // ISO
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) DERIVED FACTS (for the adapter)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BrokerDesk does not expose a status field. Heuristic:
 *  - projectName present       → 'off-plan'
 *  - availableFrom > today + 90 days → 'off-plan'
 *  - otherwise                 → 'ready'
 * FEA should review this rule once the broader inventory lands. Misclassifying
 * a ready unit as off-plan is louder than the reverse, so the threshold leans
 * conservative.
 */
export function inferStatus(listing: BrokerDeskListing): PropertyStatus {
  if (listing.projectName) return 'off-plan';
  const available = new Date(listing.availableFrom);
  const ninetyDaysFromNow = new Date(Date.now() + 90 * 86_400_000);
  if (available > ninetyDaysFromNow) return 'off-plan';
  return 'ready';
}

export function normalizeOffering(offering: 'sale' | 'yearly'): PropertyOffering {
  return offering === 'sale' ? 'sale' : 'rent-yearly';
}

/**
 * Locale fallback per the plan:
 *  - If AR field is null/empty AND EN exists, return EN with a flag the UI uses
 *    to render the `(English)` indicator + lang="en" attribute.
 */
export function localized(en: string, ar: string | null | undefined): LocalizedString {
  if (ar && ar.trim().length > 0) return {en, ar};
  return {en};
}
