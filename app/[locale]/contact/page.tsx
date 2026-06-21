import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function ContactPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tn = await getTranslations('nav');

  return (
    <>
      <section className="px-6 pt-32 pb-20 lg:px-12 lg:pt-44 lg:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold">{tn('home')}</Link>
            <span>/</span>
            <span className="text-ivory/80">{t('pageTitle')}</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
            <h1 className="mt-4 font-display text-6xl leading-[1.0] tracking-[-0.04em] text-ivory lg:text-8xl">
              {t('headlineStart')} <em className="italic text-gold">{t('headlineEm')}</em>.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/70">{t('intro')}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form className="rounded-sm border hairline bg-ink-900 p-10">
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('form.kicker')}</div>
              <h2 className="mt-2 font-display text-2xl text-ivory">{t('form.title')}</h2>
              <div className="gold-rule mt-6" />

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t('form.firstName')} type="text" />
                <Field label={t('form.lastName')} type="text" />
                <Field label={t('form.email')} type="email" />
                <Field label={t('form.phone')} type="tel" />

                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
                    {t('form.interestLabel')}
                  </span>
                  <select className="rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none">
                    <option>{t('form.interest.buying')}</option>
                    <option>{t('form.interest.selling')}</option>
                    <option>{t('form.interest.renting')}</option>
                    <option>{t('form.interest.offplan')}</option>
                    <option>{t('form.interest.management')}</option>
                    <option>{t('form.interest.general')}</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
                    {t('form.messageLabel')}
                  </span>
                  <textarea
                    rows={5}
                    className="rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>

                <label className="flex items-start gap-3 sm:col-span-2">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border hairline bg-ink-800 accent-[var(--color-gold)]" />
                  <span className="text-xs text-ivory/60">
                    {t('form.consent')}{' '}
                    <a href="#" className="text-gold hover:underline">{t('form.privacyLink')}</a>
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory sm:w-auto"
              >
                {t('form.submit')}
              </button>
              <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-mute">
                {t('form.sourceLabel')}
              </p>
            </form>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-5">
              <div className="rounded-sm border hairline bg-ink-900 p-8">
                <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('channels.kicker')}</div>
                <h3 className="mt-2 font-display text-2xl text-ivory">{t('channels.title')}</h3>
                <ul className="mt-6 space-y-4">
                  <ChannelRow color="green" label={t('channels.whatsapp')} value="+971 50 428 0362" href="https://wa.me/971504280362" />
                  <ChannelRow color="gold" label={t('channels.office')} value="+971 4 546 9115" href="tel:+97145469115" />
                  <ChannelRow color="gold" label={t('channels.email')} value="info@feaproperties.ae" href="mailto:info@feaproperties.ae" />
                </ul>
              </div>

              <div className="rounded-sm border hairline bg-ink-900 p-8">
                <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('visit.kicker')}</div>
                <h3 className="mt-2 font-display text-2xl text-ivory">{t('visit.title')}</h3>
                <address className="mt-4 not-italic text-sm leading-relaxed text-ivory/70">
                  FEA Properties<br />
                  3301 Prime Tower<br />
                  Marasi Drive, Business Bay<br />
                  Dubai, United Arab Emirates<br /><br />
                  {t('visit.hours')}<br />
                  {t('visit.hoursWeekend')}
                </address>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({label, type}: {label: string; type: string}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.3em] text-mute">{label}</span>
      <input
        type={type}
        className="rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </label>
  );
}

function ChannelRow({color, label, value, href}: {color: 'green' | 'gold'; label: string; value: string; href: string}) {
  const bg = color === 'green' ? 'bg-[#25D366]/15 text-[#25D366]' : 'bg-gold/15 text-gold';
  return (
    <li className="flex items-center gap-4">
      <span className={`grid h-11 w-11 place-items-center rounded-full ${bg}`}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-[0.3em] text-mute">{label}</div>
        <a href={href} className="text-ivory hover:text-gold">{value}</a>
      </div>
    </li>
  );
}
