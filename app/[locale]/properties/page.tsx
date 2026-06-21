import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {filterProperties, getFacets} from '@/lib/crm/service';
import {PropertyCard} from '@/components/site/PropertyCard';
import type {PropertyFilters} from '@/lib/crm/types';

export const revalidate = 600;

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{
    community?: string;
    category?: string;
    status?: string;
    beds?: string;
  }>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('properties');
  const tc = await getTranslations('common');

  const filters: PropertyFilters = {
    community: sp.community,
    category: sp.category as PropertyFilters['category'],
    status: sp.status as PropertyFilters['status'],
    bedsMin: sp.beds ? Number(sp.beds) : undefined,
  };

  const [listings, facets] = await Promise.all([
    filterProperties(filters),
    getFacets(),
  ]);

  return (
    <>
      <section className="px-6 pt-32 pb-12 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tc('previous')}</Link>
            <span>/</span>
            <span className="text-ivory/80">{t('pageTitle')}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
              <h1 className="mt-3 font-display text-6xl leading-none tracking-[-0.04em] text-ivory lg:text-7xl">
                {t('pageTitle')}
              </h1>
              <p className="mt-4 max-w-xl text-ivory/60">
                {t('intro', {count: listings.length})}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[88px] z-40 border-y hairline bg-ink-900/95 backdrop-blur">
        <div className="mx-auto max-w-[1500px] px-6 py-4 lg:px-12">
          <form className="flex flex-wrap items-center gap-3" action={`/${locale}/properties`} method="GET">
            <select
              name="status"
              defaultValue={sp.status ?? ''}
              className="rounded-full border hairline bg-ink-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/80 focus:outline-none"
            >
              <option value="">{t('filters.status')}</option>
              <option value="off-plan">{t('filters.statusOffPlan')}</option>
              <option value="ready">{t('filters.statusReady')}</option>
            </select>

            <select
              name="category"
              defaultValue={sp.category ?? ''}
              className="rounded-full border hairline bg-ink-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/80 focus:outline-none"
            >
              <option value="">{t('filters.category')}</option>
              {facets.categories.map((c) => (
                <option key={c.value} value={c.value} className="capitalize">
                  {c.value.replace('-', ' ')} ({c.count})
                </option>
              ))}
            </select>

            <select
              name="community"
              defaultValue={sp.community ?? ''}
              className="rounded-full border hairline bg-ink-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/80 focus:outline-none"
            >
              <option value="">{t('filters.location')}</option>
              {facets.communities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value} ({c.count})
                </option>
              ))}
            </select>

            {facets.bedsCoverage >= 0.8 && (
              <select
                name="beds"
                defaultValue={sp.beds ?? ''}
                className="rounded-full border hairline bg-ink-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/80 focus:outline-none"
              >
                <option value="">{t('filters.beds')}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            )}

            <button
              type="submit"
              className="rounded-full bg-gold px-5 py-2 text-xs uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
            >
              Apply
            </button>
            <Link
              href="/properties"
              className="text-xs uppercase tracking-[0.2em] text-mute hover:text-gold"
            >
              {t('filters.clearAll')}
            </Link>
          </form>
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          {listings.length === 0 ? (
            <div className="mx-auto max-w-md py-24 text-center">
              <h2 className="font-display text-3xl text-ivory">{t('empty.title')}</h2>
              <p className="mt-4 text-ivory/60">{t('empty.subtitle')}</p>
              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-full bg-gold px-7 py-3 text-xs uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
              >
                {t('empty.cta')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
