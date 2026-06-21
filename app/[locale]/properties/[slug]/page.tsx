import {notFound} from 'next/navigation';
import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getProperty, getAllProperties} from '@/lib/crm/service';
import {LangFallbackTag} from '@/components/site/LangFallbackTag';
import {InquirySidebarForm} from '@/components/site/InquirySidebarForm';
import {DhSymbol} from '@/components/site/DhSymbol';

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const all = await getAllProperties();
    return all.map((p) => ({slug: p.slug}));
  } catch {
    // If CRM is unreachable at build time, fall back to on-demand rendering.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const p = await getProperty(slug);
  if (!p) return {};
  const title = locale === 'ar' && p.title.ar ? p.title.ar : p.title.en;
  return {
    title: `${title} · ${p.location.community}`,
    description: (p.description.en ?? '').slice(0, 160),
  };
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const p = await getProperty(slug);
  if (!p) notFound();

  const t = await getTranslations('detail');
  const title = locale === 'ar' && p.title.ar ? p.title.ar : p.title.en;
  const description =
    locale === 'ar' && p.description.ar ? p.description.ar : p.description.en;
  const titleFallback = locale === 'ar' && !!p.title.fallback;
  const descriptionFallback = locale === 'ar' && !!p.description.fallback;
  const priceLabel = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    maximumFractionDigits: 0,
  }).format(p.price.amount);

  return (
    <>
      {/* BREADCRUMB + TITLE */}
      <section className="border-b hairline px-6 pt-32 pb-10 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{t('breadcrumb.home')}</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-gold">{t('breadcrumb.properties')}</Link>
            <span>/</span>
            <span className="text-ivory/80 truncate max-w-xs">{p.title.en}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold ring-1 ring-gold/30">
                {p.status === 'off-plan' ? 'Off-Plan' : 'Ready'}
              </span>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-[-0.04em] text-ivory lg:text-7xl">
                {title}
                {titleFallback && <LangFallbackTag />}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-ivory/60">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {p.location.building} · {p.location.community}, {p.location.city}
                {p.developer && <span> · by {p.developer}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-b hairline px-6 py-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-4 gap-3">
          {p.media.hero && (
            <div className="relative col-span-4 row-span-2 aspect-[16/10] overflow-hidden rounded-sm md:col-span-2">
              <Image src={p.media.hero} alt={title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          )}
          {p.media.gallery.slice(0, 4).map((url, i) => (
            <div
              key={url}
              className={`relative hidden aspect-[16/10] overflow-hidden rounded-sm md:block ${
                i === 0 ? 'col-span-2' : 'col-span-1'
              }`}
            >
              <Image src={url} alt="" fill sizes="25vw" className="object-cover" />
              {i === 3 && p.media.gallery.length > 4 && (
                <div className="absolute inset-0 grid place-items-center bg-ink-950/60 text-sm uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
                  +{p.media.gallery.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TWO COLUMN */}
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border hairline bg-ivory/10 md:grid-cols-4">
              <SpecCell label={t('specs.bedrooms')} value={p.bedrooms} />
              <SpecCell label={t('specs.bathrooms')} value={p.bathrooms} />
              <SpecCell
                label={t('specs.area')}
                value={p.areaSqft.toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE')}
              />
              <SpecCell label={t('specs.parking')} value={p.parkingSlots} />
            </div>

            <div className="mt-14">
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('overview')}</div>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-ivory">
                {p.marketingHeadline || title}
              </h2>
              <div className="gold-rule mt-6 w-24" />
              <div className="mt-8 space-y-5 whitespace-pre-wrap text-lg leading-relaxed text-ivory/75">
                {description}
                {descriptionFallback && <LangFallbackTag />}
              </div>
            </div>

            {p.amenities.length > 0 && (
              <div className="mt-16">
                <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('amenities')}</div>
                <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-ivory">
                  Inside the walls.
                </h2>
                <div className="gold-rule mt-6 w-24" />
                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {p.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 rounded-sm border hairline bg-ink-900 p-4">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 text-[10px] text-gold">✓</span>
                      <span className="text-sm capitalize">{a.replace(/-/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16">
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('location')}</div>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-ivory">
                {p.location.community} · {p.location.city}
              </h2>
              <div className="gold-rule mt-6 w-24" />
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-sm border hairline bg-ink-900">
                <div className="absolute inset-0 grid place-items-center text-mute">
                  <div className="text-center">
                    <svg className="mx-auto h-10 w-10 text-gold" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                    </svg>
                    <p className="mt-3 text-xs uppercase tracking-[0.3em]">{p.location.community}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-mute">
                      {t('staticMapCaption')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — sticky sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-sm border hairline bg-ink-900 p-7">
                <div className="text-[10px] uppercase tracking-[0.3em] text-mute">
                  {t('sidebar.startingFrom')}
                </div>
                <div className="mt-1 flex items-baseline gap-2 font-display text-4xl text-ivory">
                  <DhSymbol className="text-gold" />
                  <span>{priceLabel}</span>
                </div>
                <div className="mt-1 text-xs text-mute">
                  Ref: {p.reference}
                </div>

                <div className="gold-rule my-6" />

                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/30 text-xl text-ivory">
                    {p.agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-ivory">{p.agent.name}</div>
                    <div className="text-xs text-mute">{t('sidebar.agentRole')}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gold">
                      {t('sidebar.credentials')}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/971504280362?text=${encodeURIComponent(
                      `Hi Feleg, I'm interested in ${p.title.en} (${p.reference}).`,
                    )}`}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
                  >
                    {t('sidebar.whatsapp')}
                  </a>
                  <a
                    href="tel:+971504280362"
                    className="flex items-center justify-center gap-2 rounded-full border border-ivory/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-ivory hover:border-gold hover:text-gold"
                  >
                    {t('sidebar.call')}
                  </a>
                </div>
              </div>

              <InquirySidebarForm propertyTitle={p.title.en} propertyId={p.id} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function SpecCell({label, value}: {label: string; value: string | number}) {
  return (
    <div className="bg-ink-950 p-6">
      <div className="text-[10px] uppercase tracking-[0.3em] text-mute">{label}</div>
      <div className="mt-2 font-display text-3xl text-ivory">{value}</div>
    </div>
  );
}

