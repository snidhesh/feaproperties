import {notFound} from 'next/navigation';
import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {INSIGHT_POSTS, findPostBySlug} from '@/lib/content/insights';

export async function generateStaticParams() {
  return INSIGHT_POSTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const post = findPostBySlug(slug);
  if (!post) return {};
  const t = await getTranslations({locale, namespace: 'home.insights.posts'});
  return {
    title: t(`${post.key}.title`),
    description: t(`${post.key}.excerpt`),
  };
}

export default async function InsightDetail({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const post = findPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations(`home.insights.posts.${post.key}`);
  const tn = await getTranslations('nav');
  const ti = await getTranslations('home.insights');

  const otherPosts = INSIGHT_POSTS.filter((p) => p.slug !== post.slug);

  // Pre-resolve translations for related-posts cards (can't await inside .map JSX)
  const relatedWithLabels = await Promise.all(
    otherPosts.map(async (p) => {
      const tp = await getTranslations(`home.insights.posts.${p.key}`);
      return {post: p, category: tp('category'), title: tp('title')};
    }),
  );

  return (
    <>
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
        <div className="scrim absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1100px] flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-24">
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tn('home')}</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-gold">{tn('insights')}</Link>
          </nav>
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
            {t('category')} · {t('date')} · {post.readMinutes} min read
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-[-0.04em] text-ivory lg:text-7xl">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* LEDE + SECTIONS */}
      <article className="bg-ink-950 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[760px]">
          <p className="font-display text-2xl leading-snug text-ivory lg:text-3xl">
            {t('lede')}
          </p>
          <div className="gold-rule mt-10" />

          {(['section1', 'section2', 'section3', 'section4'] as const).map((s) => (
            <section key={s} className="mt-12">
              <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-ivory">
                {t(`${s}Title`)}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ivory/80">
                {t(`${s}Body`)}
              </p>
            </section>
          ))}

          <div className="gold-rule mt-16" />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ivory/70 hover:text-gold"
            >
              <span aria-hidden>←</span> {ti('viewAll')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
            >
              Speak with Feleg
            </Link>
          </div>
        </div>
      </article>

      {/* RELATED POSTS */}
      <section className="border-t hairline bg-ink-900 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">
            More insights
          </div>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-ivory">
            Keep reading
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {relatedWithLabels.map(({post: p, category, title}) => (
              <Link
                key={p.slug}
                href={`/insights/${p.slug}`}
                className="group grid grid-cols-3 gap-5 rounded-sm border hairline bg-ink-950 p-4 transition hover:border-gold/40"
              >
                <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width:768px) 33vw, 200px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-gold">
                    {category}
                  </div>
                  <h3 className="mt-2 font-display text-xl leading-snug text-ivory transition group-hover:text-gold">
                    {title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
