/**
 * Long-form community editorial — used at /communities and /communities/[slug].
 *
 * Adapted from BlackOak's neighbourhoods content (Palm Jumeirah, Downtown
 * Dubai, Dubai Marina) and written fresh for the three FEA communities not in
 * that file (Meydan, Emaar South, Dubai Islands). Brand-specific references
 * have been stripped; prose adapted to fit FEA's voice.
 *
 * In Phase 2 this moves behind Sanity. Until then, content lives here so the
 * tile rail, the index page, and detail pages share one source of truth.
 */

export type Attraction = {
  name: string;
  description: string;
};

export type InvestReason = {
  title: string;
  description: string;
};

export type CommunityFact = {
  label: string;
  value: string;
};

export type CommunityDetail = {
  slug: string;
  name: string;
  tagline: string;
  /** Paragraphs separated by `\n\n` */
  description: string;
  /** Local hero (preferred) or external URL */
  heroImage: string;
  facts: CommunityFact[];
  attractions: Attraction[];
  whyInvest: InvestReason[];
  seo: {title: string; description: string};
};

export const COMMUNITY_DETAILS: CommunityDetail[] = [
  {
    slug: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: "The world's most recognisable address.",
    description: `Palm Jumeirah is the largest man-made island on the planet and one of the few residential addresses recognisable from orbit. Shaped like a date palm, the island's trunk, fronds and outer crescent host a deliberately curated mix of beachfront villas, branded residences and tower penthouses — most with direct access to the Arabian Gulf.

The frond villas remain Dubai's classic waterfront product: private gardens, infinity pools and unobstructed sea views. The crescent and trunk host the marquee branded buildings — Atlantis The Royal, One Palm, FIVE Palm Jumeirah, Como Residences — alongside resort-grade amenities and Dubai's most established luxury hospitality scene.

For boutique buyers, the Palm rewards selectivity. Frond positioning, view orientation, building reputation and on-plot privacy all materially affect both lifestyle and resale. We help clients read those signals before they show up in the price.`,
    heroImage: '/communities/palm-jumeirah.png',
    facts: [
      {label: 'Completed', value: '2006'},
      {label: 'Length', value: '~5 km'},
      {label: 'Developer', value: 'Nakheel'},
      {label: 'Property mix', value: 'Villas · Apartments · Penthouses'},
    ],
    attractions: [
      {
        name: 'Atlantis The Royal',
        description:
          "Dubai's most-talked-about resort opening since the original Atlantis — chef-driven dining, a sky-pool deck, and signature suites that have become the new benchmark for the city's luxury hotel scene.",
      },
      {
        name: 'The Pointe',
        description:
          "A waterfront promenade at the tip of the Palm with restaurants and weekend programming overlooking Atlantis and the Crescent fountain show.",
      },
      {
        name: 'Nakheel Mall',
        description:
          "The Palm's anchor retail destination on the trunk — premium brands, dining and a rooftop infinity pool at the top of The View.",
      },
      {
        name: 'Palm West Beach',
        description:
          "A beach club strip along the western shoreline — daybeds, kite-surfing and sunset dining a short walk from most frond villas.",
      },
      {
        name: 'The View at the Palm',
        description:
          "A 52nd-floor observation deck for the only angle that does the island's geometry justice.",
      },
    ],
    whyInvest: [
      {
        title: 'Globally recognisable',
        description:
          'Few residential addresses translate as cleanly to international buyers. The Palm draws sustained demand from every major source market.',
      },
      {
        title: 'Rental yields hold up',
        description:
          'Tourist-driven short-let demand and a deep long-let tenant base keep occupancy strong year-round.',
      },
      {
        title: 'Waterfront premium',
        description:
          'Direct beach access and unobstructed sea views command meaningful premiums over comparable non-waterfront inventory.',
      },
      {
        title: 'A real ladder',
        description:
          'From studios in the trunk towers to ultra-prime branded penthouses on the crescent, the Palm offers entry points at every luxury price band.',
      },
    ],
    seo: {
      title: 'Palm Jumeirah — Iconic Island Living, Dubai',
      description:
        'Boutique advisory on Palm Jumeirah villas, branded residences and penthouses. FEA Properties guides buyers, sellers and investors across the trunk, fronds and crescent.',
    },
  },
  {
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    tagline: 'The centre of now.',
    description: `Downtown Dubai is the city's beating commercial and lifestyle core — anchored by the Burj Khalifa, The Dubai Mall and the choreographed Dubai Fountain. Built by Emaar as a master-planned district from the ground up, it remains the most densely-amenitied square mile in the UAE and one of the most visited destinations on earth.

For residents, the proposition is walkability: dining, retail and culture sit within five minutes of every tower lobby. The Boulevard hosts the long-stay rentals; Burj Vista, Address Sky View and Opera Grand carry the prestige addresses; Burj Khalifa itself remains the only Downtown postcode that's also a global landmark.

Yield economics here are unusual — short-let demand is consistent, long-let tenant quality is high, and the inventory is bounded by the master-plan. Downtown rarely surprises on the downside.`,
    heroImage: '/communities/downtown-dubai.png',
    facts: [
      {label: 'Developer', value: 'Emaar Properties'},
      {label: 'Anchor', value: 'Burj Khalifa (828 m)'},
      {label: 'Boulevard', value: '3.5 km'},
      {label: 'Property mix', value: 'Apartments · Penthouses · Hotel-residences'},
    ],
    attractions: [
      {
        name: 'Burj Khalifa',
        description:
          "The world's tallest building remains the city's defining silhouette — and the centre of every Downtown sightline.",
      },
      {
        name: 'The Dubai Mall',
        description:
          "More retail and dining than most cities — plus an aquarium, ice rink and the indoor entrance to the Burj.",
      },
      {
        name: 'Dubai Fountain',
        description:
          "Nightly choreographed water shows on the lake at the foot of the Burj. The view is part of the rental price.",
      },
      {
        name: 'Dubai Opera',
        description:
          "A 2,000-seat performance hall with a deliberately programmed calendar of opera, ballet and international concerts.",
      },
      {
        name: 'Souk Al Bahar',
        description:
          "A waterfront promenade of restaurants and lounges with the cleanest skyline-facing terraces in the district.",
      },
    ],
    whyInvest: [
      {
        title: 'Central by design',
        description:
          "Walking distance to two metro stations, the Dubai Mall and the city's flagship hotels. Connectivity is structural here, not accidental.",
      },
      {
        title: 'Dual tenant base',
        description:
          'Long-let professionals and short-let visitors both compete for the same inventory — supporting yield through the cycle.',
      },
      {
        title: 'Capital growth track',
        description:
          'Downtown has compounded steadily through every Dubai cycle. The address itself underwrites resale liquidity.',
      },
      {
        title: 'Bounded supply',
        description:
          "The master-plan is largely complete. New stock arrives at a pace that demand absorbs.",
      },
    ],
    seo: {
      title: 'Downtown Dubai — The Centre of Now',
      description:
        'Boutique advisory on Downtown Dubai apartments, penthouses and branded residences across Burj Vista, Opera Grand, Address Sky View and the Boulevard towers.',
    },
  },
  {
    slug: 'dubai-marina',
    name: 'Dubai Marina',
    tagline: 'Waterfront living at full volume.',
    description: `Dubai Marina is the city's longest man-made marina — a 3-kilometre canal lined with the densest concentration of high-rise residential towers in the country. The Marina Walk is one of Dubai's busiest pedestrian promenades; JBR Beach is two minutes on foot; Bluewaters and Ain Dubai sit on the next bridge.

The inventory is layered. The earliest towers — Princess, Marina Crown, Ocean Heights — trade on view and lock-up-and-leave convenience. Mid-vintage stock around Marina Gate and Sparkle Towers is the sweet spot for tenants. Newer branded product (Six Senses, Cavalli) sits at the top of the curve, alongside a steady pipeline of off-plan launches.

Marina prices read transparent — comparables are plentiful, occupancy is high, and tower-to-tower yield differences are well-understood by anyone who lives there.`,
    heroImage: '/communities/dubai-marina.png',
    facts: [
      {label: 'Marina length', value: '3 km'},
      {label: 'Walk length', value: '7 km'},
      {label: 'Transit', value: 'Metro · Tram · Walking distance to JBR'},
      {label: 'Property mix', value: 'Apartments · Penthouses · Branded residences'},
    ],
    attractions: [
      {
        name: 'Marina Walk',
        description:
          "Seven kilometres of waterfront promenade lined with restaurants, cafes and weekend programming. Most towers exit directly onto it.",
      },
      {
        name: 'JBR Beach & The Walk',
        description:
          "Dubai's busiest public beach plus the retail-and-dining strip behind it — five minutes on foot from the south end of the Marina.",
      },
      {
        name: 'Dubai Marina Mall',
        description:
          "A mid-sized mall on the canal with everyday retail, a cinema and direct boardwalk access for residents.",
      },
      {
        name: 'Ain Dubai (Bluewaters)',
        description:
          "The world's largest observation wheel, one bridge away. A useful proxy for sea-view value across the Marina towers.",
      },
      {
        name: 'Pier 7',
        description:
          "A seven-floor dining tower at Marina Walk — each level a different restaurant, all with the canal view.",
      },
    ],
    whyInvest: [
      {
        title: 'Rental yields lead the city',
        description:
          'Marina consistently ranks among the top three Dubai districts for gross rental yield. Tenant demand is structural.',
      },
      {
        title: 'Short-let viability',
        description:
          "Tourist proximity to JBR Beach and Ain Dubai sustains a robust holiday-let market for landlords who choose it.",
      },
      {
        title: 'Transit-served',
        description:
          'Two metro stations and the Tram network make Marina one of the few districts where car ownership is genuinely optional.',
      },
      {
        title: 'Liquid market',
        description:
          'Comparable inventory is plentiful and pricing is transparent. Resale velocity is reliably high.',
      },
    ],
    seo: {
      title: 'Dubai Marina — Waterfront Urban Living',
      description:
        'Boutique advisory on Dubai Marina apartments, penthouses and branded residences. Towers, views and tenant economics explained by FEA Properties.',
    },
  },
  {
    slug: 'meydan',
    name: 'Meydan',
    tagline: 'Where the city slows down.',
    description: `Meydan is the residential answer to a question Dubai has been asking for a decade: how do you get five minutes from Downtown and still hear quiet? The district is anchored by the Meydan Racecourse, surrounded by gated villa enclaves and low-rise apartment communities — Polo Residence, District One, Sobha Hartland, Nad Al Sheba Gardens — that have made it the city's preferred green-belt address for owner-occupiers.

The pace here is deliberately different. Tree-lined streets, walking trails, and a noticeable absence of the towers that define the rest of Sheikh Mohammed Bin Rashid City. District One pushes the upper end with mansion plots fronting the world's largest man-made crystal lagoon; the smaller communities offer the same lifestyle at four-bedroom-villa price points.

For investors, Meydan is an off-plan story as much as a ready-market one. Sobha One, Nad Al Sheba Gardens, Chevalia Estate at Grand Polo Club — the pipeline is unusually deep for a district this central.`,
    heroImage:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1800&q=80',
    facts: [
      {label: 'Anchor', value: 'Meydan Racecourse'},
      {label: 'Developer', value: 'Meydan Group · Sobha · Emaar'},
      {label: 'Distance to Downtown', value: '~10 min by car'},
      {label: 'Property mix', value: 'Villas · Townhouses · Low-rise apartments'},
    ],
    attractions: [
      {
        name: 'Meydan Racecourse',
        description:
          "Home of the Dubai World Cup — the world's richest horse-racing event. The grandstand itself sets the tone for the district's pace.",
      },
      {
        name: 'The Track Meydan Golf',
        description:
          "A floodlit nine-hole course designed for after-work and twilight play — open later than most Dubai courses.",
      },
      {
        name: 'Crystal Lagoon (District One)',
        description:
          "The largest man-made lagoon in the world — a private beach for District One residents and a defining amenity for the neighbourhood.",
      },
      {
        name: 'Meydan One',
        description:
          "A mixed-use destination under development that will add the district's first major retail and entertainment anchor.",
      },
    ],
    whyInvest: [
      {
        title: 'Central but residential',
        description:
          "Ten minutes from Downtown without the density of Downtown. A genuinely rare profile in central Dubai.",
      },
      {
        title: 'Off-plan depth',
        description:
          'Active pipelines from Meydan Group, Sobha, and Emaar mean entry-points at multiple stages of construction and pricing.',
      },
      {
        title: 'Owner-occupier-led',
        description:
          'Communities with strong owner-occupier mix tend to age better — both visually and on resale.',
      },
      {
        title: 'Connectivity',
        description:
          'Direct access to Al Khail Road and Sheikh Mohammed Bin Zayed Road ties the district into the rest of the city without traffic-trapping it.',
      },
    ],
    seo: {
      title: 'Meydan — Quiet residential Dubai, ten minutes from Downtown',
      description:
        'Boutique advisory across Meydan villa communities — District One, Polo Residence, Sobha Hartland, Nad Al Sheba Gardens. FEA Properties.',
    },
  },
  {
    slug: 'emaar-south',
    name: 'Emaar South',
    tagline: 'Townhouse country, near the runways.',
    description: `Emaar South sits on the south-western edge of Dubai, built around an 18-hole championship golf course and a master-plan deliberately optimised for villas and townhouses rather than towers. It is a long district — measured in kilometres, not blocks — designed to feel suburban without losing the connectivity that Dubai residents now expect.

The development thesis is straightforward. Emaar South is positioned directly alongside Al Maktoum International, the airport into which Dubai's long-term passenger volume will migrate as DXB approaches capacity. As that shift accelerates, Emaar South becomes one of the few master-planned residential districts within ten minutes of a major Dubai airport, with prices that still reflect its current rather than future positioning.

For buyers, it's a value district. For investors, it's a wait-it-out district. For families, it's the rare new community where the schools, parks and roads are built before the marketing.`,
    heroImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80',
    facts: [
      {label: 'Developer', value: 'Emaar Properties'},
      {label: 'Anchor', value: '18-hole championship golf course'},
      {label: 'Nearest airport', value: 'Al Maktoum International'},
      {label: 'Property mix', value: 'Villas · Townhouses · Low-rise apartments'},
    ],
    attractions: [
      {
        name: 'Emaar South Golf',
        description:
          "An 18-hole championship course threading through the master-plan, with most villa enclaves backing onto a fairway or green corridor.",
      },
      {
        name: 'Greens Park',
        description:
          "A network of pedestrian parks and cycling paths designed to connect the residential clusters without funnelling residents onto roads.",
      },
      {
        name: 'Expo City Dubai',
        description:
          "The post-Expo legacy district — Dubai's emerging knowledge-and-events campus — is the nearest major urban draw, ten minutes by car.",
      },
      {
        name: 'Al Maktoum International',
        description:
          "Dubai's second airport, currently under major expansion and projected to become the city's primary passenger gateway later this decade.",
      },
    ],
    whyInvest: [
      {
        title: 'Early-cycle pricing',
        description:
          "Inventory is still priced against current conditions rather than the airport-shift thesis. Patient capital is rewarded here.",
      },
      {
        title: 'Family-led demand',
        description:
          "The villa-and-townhouse weighting plays to a tenant pool that grows alongside Dubai's school-age population.",
      },
      {
        title: 'Emaar quality',
        description:
          'Emaar masters are reliably delivered, reliably maintained, and reliably resold. Build quality is rarely the variable.',
      },
      {
        title: 'Airport-led upside',
        description:
          "As Al Maktoum capacity scales, the proximity-to-runway proposition strengthens. Few central districts can claim that.",
      },
    ],
    seo: {
      title: 'Emaar South — Villas & townhouses near Al Maktoum, Dubai',
      description:
        'Boutique advisory on Emaar South villas, townhouses and apartments. Golf-course living minutes from Dubai\'s next major airport.',
    },
  },
  {
    slug: 'dubai-islands',
    name: 'Dubai Islands',
    tagline: 'Five islands, a new shoreline.',
    description: `Dubai Islands is Nakheel's reimagining of the Deira-side shoreline — five connected islands extending the city's coast and adding nineteen kilometres of beach frontage. It is the most significant new waterfront launch in Dubai since Palm Jumeirah, and it is being released in phases that intentionally avoid the speculative density of earlier eras.

The master-plan emphasises beach access, marinas, mangrove walks and a deliberate spread of residential typologies — beachfront villas, mid-rise apartments, branded residences and resort-anchored stock. Bay Grove Residences is the early lead on the apartment side; further villa and townhouse plots are coming through the pipeline now.

For buyers, the proposition is simple: this is the closest you'll get to ground-floor in a major Dubai island launch for the foreseeable future. Pricing reflects early-cycle positioning, and the shoreline is finite by design.`,
    heroImage:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1800&q=80',
    facts: [
      {label: 'Developer', value: 'Nakheel'},
      {label: 'Islands', value: '5 connected islands'},
      {label: 'Beach frontage', value: '~19 km'},
      {label: 'Distance to DXB', value: '~10 min by car'},
    ],
    attractions: [
      {
        name: 'Public beaches',
        description:
          "Nineteen kilometres of new public beach frontage — making Dubai Islands one of the largest open-shore additions to the emirate in a generation.",
      },
      {
        name: 'Mangrove walkways',
        description:
          "Protected coastal walking paths threading the islands' natural mangrove edges. A rare bit of preserved ecology in a development this scale.",
      },
      {
        name: 'Nakheel Marinas',
        description:
          "Two of Nakheel's new marina developments will sit within Dubai Islands, anchoring the waterfront commercial mix.",
      },
      {
        name: 'Proximity to Dubai International',
        description:
          "Ten minutes from DXB Terminal 1 — the closest island residential district to the city's primary airport.",
      },
    ],
    whyInvest: [
      {
        title: 'Early-cycle entry',
        description:
          "Phased releases mean off-plan prices today reflect a master-plan that will not be visible to comparables for several years.",
      },
      {
        title: 'Bounded waterfront supply',
        description:
          "Beachfront inventory is finite by definition. Dubai Islands meaningfully increases supply but stays scarce on a per-metre basis.",
      },
      {
        title: 'Nakheel-developed',
        description:
          'The developer behind Palm Jumeirah and The World — track record on delivery and master-planning is the most relevant comparator.',
      },
      {
        title: 'Connectivity to DXB',
        description:
          "Few new waterfront master-plans sit this close to the primary international airport. Useful for both short-let and corporate-let strategies.",
      },
    ],
    seo: {
      title: 'Dubai Islands — Nakheel\'s new shoreline',
      description:
        'Boutique advisory on Dubai Islands — Bay Grove, off-plan villa launches and apartments across the five-island Nakheel master-plan.',
    },
  },
];

export function findCommunityDetail(slug: string): CommunityDetail | undefined {
  return COMMUNITY_DETAILS.find((c) => c.slug === slug);
}
