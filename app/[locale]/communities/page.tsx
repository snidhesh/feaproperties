import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {FEATURED_COMMUNITIES} from '@/lib/content/communities';
import {getFacets} from '@/lib/crm/service';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'communities'});
  return {
    title: t('pageTitle'),
    description: t('intro'),
  };
}

export default async function CommunitiesIndex({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('communities');
  const tn = await getTranslations('nav');
  const facets = await getFacets();

  const findCount = (name: string) =>
    facets.communities.find((f) => f.value === name)?.count ?? 0;

  return (
    <>
      <section className="px-6 pt-32 pb-12 lg:px-12 lg:pt-44 lg:pb-16">
        <div className="mx-auto max-w-[1500px]">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tn('home')}</Link>
            <span>/</span>
            <span className="text-ivory/80">{tn('communities')}</span>
          </nav>
          <div className="mt-6 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
            <h1 className="mt-3 font-display text-6xl leading-[1.0] tracking-[-0.04em] text-ivory lg:text-7xl">
              {t('pageTitle')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">{t('intro')}</p>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 px-6 pb-24 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COMMUNITIES.map((c) => {
            const count = findCount(c.name);
            return (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized={c.image.startsWith('http')}
                />
                <div className="scrim absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-gold">{c.kicker}</div>
                  <div className="mt-2 font-display text-3xl text-ivory">{c.name}</div>
                  {count > 0 && (
                    <div className="mt-1 text-xs text-ivory/60">
                      {/* Re-uses the home.communities.activeListings translation */}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
