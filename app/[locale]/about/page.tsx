import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('home');

  return (
    <>
      <section className="relative grid min-h-[80vh] grid-cols-1 pt-24 lg:grid-cols-12 lg:pt-32">
        <div className="relative min-h-[60vh] lg:col-span-7 lg:min-h-0">
          <Image
            src="/Feleg-Abenker.jpg"
            alt="Feleg Abenker"
            fill
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover object-top"
            priority
          />
          <div className="scrim absolute inset-0" />
        </div>
        <div className="flex flex-col justify-end bg-ink-900 px-6 py-16 lg:col-span-5 lg:px-14 lg:py-24">
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
          <h1 className="mt-3 font-display text-6xl leading-[1.0] tracking-[-0.04em] text-ivory lg:text-7xl">
            Feleg <span className="italic">Abenker</span>.
          </h1>
          <div className="gold-rule mt-6 w-24" />
          <p className="mt-7 max-w-md text-lg leading-relaxed text-ivory/80">
            {tc('founder.body1')}
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 border-t hairline pt-8 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('credentials.brn')}</dt>
              <dd className="mt-1 font-display text-2xl text-ivory">42732</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('credentials.orn')}</dt>
              <dd className="mt-1 font-display text-2xl text-ivory">29899</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('credentials.direct')}</dt>
              <dd className="mt-1 text-ivory">+971 50 428 0362</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-mute">{t('credentials.languages')}</dt>
              <dd className="mt-1 text-ivory">{t('credentials.languagesValue')}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-ink-950 px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('story.kicker')}</div>
          <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory">
            {t('story.title')}
          </h2>
          <div className="gold-rule mt-6 w-24" />
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-ivory/80">
            <p>{t('story.body1')}</p>
            <p>{t('story.body2')}</p>
            <p>{t('story.body3')}</p>
            <p className="text-ivory">{t('story.signature')}</p>
          </div>
        </div>
      </section>

      <section className="border-y hairline bg-ink-900 px-6 py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-12 lg:grid-cols-4">
          <Stat label={t('stats.founded')} value="2016" />
          <Stat label={t('stats.years')} value="10+" />
          <Stat label={t('stats.communities')} value="22" />
          <Stat label={t('stats.transactions')} value="340+" />
        </div>
      </section>

      <section className="bg-ink-900 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-gold">Trusted by · partnered with</div>
          <h2 className="mt-3 font-display text-5xl leading-tight tracking-[-0.04em] text-ivory">
            Where you'll also see us.
          </h2>
          <div className="gold-rule mt-6 w-24" />
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border hairline bg-ivory/10 md:grid-cols-3 lg:grid-cols-4">
            {['PropertyFinder', 'Bayut', 'Dubizzle', 'Emaar', 'Meraas', 'Nakheel', 'Damac', 'Sobha'].map((p) => (
              <div key={p} className="bg-ink-950 px-8 py-12 text-center">
                <div className="font-display text-2xl text-ivory">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-950 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl leading-tight tracking-[-0.04em] text-ivory">
            A short conversation, on your terms.
          </h2>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{label}</div>
      <div className="mt-3 font-display text-5xl text-ivory">{value}</div>
    </div>
  );
}
