import {setRequestLocale, getTranslations} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/i18n/routing';
import {getFeaturedProperties, getFacets} from '@/lib/crm/service';
import {PropertyCard} from '@/components/site/PropertyCard';

const COMMUNITY_TILES = [
  {name: 'Palm Jumeirah', kicker: 'Iconic', image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=900&q=80'},
  {name: 'Downtown Dubai', kicker: 'Skyline', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80'},
  {name: 'Dubai Marina', kicker: 'Waterfront', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80'},
  {name: 'Meydan', kicker: 'Garden estate', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=80'},
  {name: 'Emaar South', kicker: 'Emerging', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80'},
  {name: 'Dubai Islands', kicker: 'New shores', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80'},
];

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [featured, facets] = await Promise.all([
    getFeaturedProperties(3),
    getFacets(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[760px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
        <div className="scrim absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-6 pb-24 lg:px-12 lg:pb-32">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-10 bg-gold" />
            {t('kicker')}
          </div>
          <h1 className="max-w-5xl font-display text-[clamp(2.6rem,7.5vw,7.5rem)] leading-[0.95] tracking-[-0.04em] text-ivory">
            {t('headlineStart')} <em className="italic text-gold">{t('headlineEm')}</em>.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ivory/80 lg:text-lg">
            {t('subheadline')}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 transition hover:bg-gold"
            >
              {t('ctaBrowse')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-gold hover:text-gold"
            >
              {t('ctaSpeak')}
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE PILLARS */}
      <section className="border-y hairline bg-ink-900">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 divide-y divide-ivory/10 px-6 py-12 md:grid-cols-3 md:divide-y-0 md:divide-x lg:px-12">
          {(['buy', 'sell', 'rent'] as const).map((p) => (
            <div key={p} className="px-2 py-6 md:px-10">
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
                {t(`pillars.${p}Kicker`)}
              </div>
              <h3 className="mt-3 font-display text-3xl leading-tight text-ivory">
                {t(`pillars.${p}Title`)}
              </h3>
              <p className="mt-3 text-sm text-ivory/60">
                {t(`pillars.${p}Body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED — live from CRM */}
      <section className="bg-ink-950 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-end justify-between border-b hairline pb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
                {t('featured.kicker')}
              </div>
              <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory lg:text-6xl">
                {t('featured.title')}
              </h2>
            </div>
            <Link
              href="/properties"
              className="hidden items-center gap-2 text-sm uppercase tracking-[0.2em] text-ivory/70 hover:text-gold md:flex"
            >
              {t('featured.viewAll')} <span>→</span>
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-12 text-center text-ivory/60">
              <p>No active listings to feature.</p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITIES — horizontal rail on mobile, grid on desktop */}
      <section id="communities" className="bg-ink-900 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
              {t('communities.kicker')}
            </div>
            <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory lg:text-6xl">
              {t('communities.title')}
            </h2>
            <p className="mt-5 text-ivory/60">{t('communities.subtitle')}</p>
          </div>

          <div className="scroll-rail mt-14 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {COMMUNITY_TILES.map((c) => {
              const facet = facets.communities.find((f) => f.value === c.name);
              const count = facet?.count ?? 0;
              return (
                <Link
                  key={c.name}
                  href="/properties"
                  className="group relative block aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-sm sm:w-auto sm:shrink"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width:640px) 78vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <div className="text-[10px] uppercase tracking-[0.4em] text-gold">
                      {c.kicker}
                    </div>
                    <div className="mt-2 font-display text-3xl text-ivory">{c.name}</div>
                    <div className="mt-1 text-xs text-ivory/60">
                      {t('communities.activeListings', {count})}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-mute sm:hidden">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
            {t('communities.swipeHint')}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-ink-950 px-6 py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/Feleg-Abenker.jpg"
                alt="Feleg Abenker"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                style={{objectPosition: '50% 15%'}}
              />
            </div>
            <div className="absolute -bottom-6 -end-6 hidden rounded-sm bg-ink-900 px-7 py-5 ring-1 ring-gold/30 lg:block">
              <div className="text-[10px] uppercase tracking-[0.4em] text-gold">Credentials</div>
              <div className="mt-2 flex gap-6 text-sm">
                <div>
                  <div className="text-mute">BRN</div>
                  <div className="text-ivory">42732</div>
                </div>
                <div>
                  <div className="text-mute">ORN</div>
                  <div className="text-ivory">29899</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('founder.kicker')}</div>
            <h2 className="mt-3 font-display text-5xl leading-[1.05] tracking-[-0.04em] text-ivory lg:text-6xl">
              {t('founder.name')}
            </h2>
            <div className="gold-rule mt-8 w-24" />
            <p className="mt-8 text-lg leading-relaxed text-ivory/75">{t('founder.body1')}</p>
            <p className="mt-5 text-ivory/60">{t('founder.body2')}</p>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-y hairline py-8">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('founder.stats.years')}</dt>
                <dd className="mt-2 font-display text-3xl text-ivory">10+</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('founder.stats.communities')}</dt>
                <dd className="mt-2 font-display text-3xl text-ivory">22</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('founder.stats.languages')}</dt>
                <dd className="mt-2 font-display text-3xl text-ivory">3</dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 transition hover:bg-ivory"
              >
                {t('founder.ctaConsult')}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded-full border border-ivory/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-gold hover:text-gold"
              >
                {t('founder.ctaRead')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONCIERGE CTA */}
      <section className="relative overflow-hidden bg-ink-900 px-6 py-24 lg:px-12">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          unoptimized
        />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('concierge.kicker')}</div>
          <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory lg:text-6xl">
            {t('concierge.title')}
          </h2>
          <p className="mt-6 text-ivory/70">{t('concierge.body')}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/971504280362"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 transition hover:bg-ivory"
            >
              {t('concierge.ctaWhatsapp')}
            </a>
            <a
              href="tel:+97145469115"
              className="inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 transition hover:bg-gold"
            >
              {t('concierge.ctaCall')} +971 4 546 9115
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-gold hover:text-gold"
            >
              {t('concierge.ctaMessage')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
