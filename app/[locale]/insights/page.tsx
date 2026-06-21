import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {INSIGHT_POSTS} from '@/lib/content/insights';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home.insights'});
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function InsightsIndex({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.insights');
  const tn = await getTranslations('nav');

  return (
    <>
      <section className="px-6 pt-32 pb-12 lg:px-12 lg:pt-44 lg:pb-16">
        <div className="mx-auto max-w-[1500px]">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tn('home')}</Link>
            <span>/</span>
            <span className="text-ivory/80">{tn('insights')}</span>
          </nav>
          <div className="mt-6 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
            <h1 className="mt-3 font-display text-6xl leading-[1.0] tracking-[-0.04em] text-ivory lg:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/70">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {INSIGHT_POSTS.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/insights/${post.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-800">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="mt-5">
                    <div className="text-[10px] uppercase tracking-[0.4em] text-gold">
                      {t(`posts.${post.key}.category`)} · {t(`posts.${post.key}.date`)}
                    </div>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-ivory transition group-hover:text-gold">
                      {t(`posts.${post.key}.title`)}
                    </h2>
                    <p className="mt-3 text-sm text-ivory/55">
                      {t(`posts.${post.key}.excerpt`)}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mute">
                      {post.readMinutes} min read
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
