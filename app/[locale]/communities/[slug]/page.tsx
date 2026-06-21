import {notFound} from 'next/navigation';
import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {COMMUNITY_DETAILS, findCommunityDetail} from '@/lib/content/community-details';
import {findCommunityBySlug} from '@/lib/content/communities';

export const revalidate = 600;

export async function generateStaticParams() {
  return COMMUNITY_DETAILS.map((c) => ({slug: c.slug}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {slug} = await params;
  const detail = findCommunityDetail(slug);
  if (!detail) return {};
  return {
    title: detail.seo.title,
    description: detail.seo.description,
  };
}

export default async function CommunityDetail({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const detail = findCommunityDetail(slug);
  if (!detail) notFound();

  const t = await getTranslations('communities.detail');
  const tn = await getTranslations('nav');

  const tile = findCommunityBySlug(slug);
  const paragraphs = detail.description.split(/\n{2,}/);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src={detail.heroImage}
          alt={detail.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={detail.heroImage.startsWith('http')}
        />
        <div className="scrim absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-6 pb-20 lg:px-12 lg:pb-28">
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tn('home')}</Link>
            <span>/</span>
            <Link href="/communities" className="hover:text-gold">{tn('communities')}</Link>
          </nav>
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
            {tile?.kicker ?? 'Community'}
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[1.0] tracking-[-0.04em] text-ivory lg:text-8xl">
            {detail.name}
          </h1>
          <p className="mt-6 max-w-2xl font-display text-2xl italic text-ivory/85">
            {detail.tagline}
          </p>
        </div>
      </section>

      {/* QUICK FACTS STRIP */}
      <section className="border-y hairline bg-ink-900 px-6 py-10 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-8 sm:grid-cols-4">
          {detail.facts.map((f) => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{f.label}</div>
              <div className="mt-2 font-display text-xl text-ivory">{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OVERVIEW + ATTRACTIONS */}
      <section className="bg-ink-950 px-6 py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('overview')}</div>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-ivory">
              {detail.tagline}
            </h2>
            <div className="gold-rule mt-6 w-24" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ivory/80">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-sm border hairline bg-ink-900 p-8">
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
                {t('attractions')}
              </div>
              <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ivory">
                What's around
              </h3>
              <ul className="mt-7 divide-y divide-ivory/10">
                {detail.attractions.map((a) => (
                  <li key={a.name} className="py-5">
                    <div className="font-display text-xl text-ivory">{a.name}</div>
                    <p className="mt-2 text-sm text-ivory/65 leading-relaxed">{a.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* WHY INVEST */}
      <section className="bg-ink-900 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('whyInvest')}</div>
            <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory">
              The investment case
            </h2>
            <div className="gold-rule mt-6 w-24" />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border hairline bg-ivory/10 md:grid-cols-2 lg:grid-cols-4">
            {detail.whyInvest.map((reason, i) => (
              <div key={reason.title} className="bg-ink-950 p-8">
                <div className="font-display text-5xl text-gold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-5 font-display text-2xl leading-tight text-ivory">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm text-ivory/65 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-900 px-6 py-24 lg:px-12">
        <Image
          src={detail.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          unoptimized={detail.heroImage.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 to-ink-900" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl leading-tight tracking-[-0.04em] text-ivory lg:text-6xl">
            {t('ctaTitle', {community: detail.name})}
          </h2>
          <p className="mt-6 text-ivory/70">{t('ctaBody')}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
            >
              {t('ctaButton')}
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/30 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory hover:border-gold hover:text-gold"
            >
              ← {t('back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
