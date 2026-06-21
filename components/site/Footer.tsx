import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export function SiteFooter() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 px-6 pb-12 pt-24 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-12 border-b hairline pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block">
              <img src="/logo_basic.png" alt="FEA Properties" className="h-20 w-auto" />
            </Link>
            <p className="mt-6 max-w-md text-ivory/60">{t('tagline')}</p>

            <form className="mt-10 flex max-w-md gap-2 rounded-full border hairline bg-ink-900 p-1.5">
              <input
                type="email"
                placeholder={t('newsletter')}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-ivory placeholder:text-mute focus:outline-none"
              />
              <button
                type="button"
                className="rounded-full bg-gold px-5 py-2 text-xs uppercase tracking-[0.18em] text-ink-950 transition hover:bg-ivory"
              >
                {t('newsletterSubmit')}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4 text-ivory/70">
              <a href="https://instagram.com/" aria-label="Instagram" className="hover:text-gold">
                <SocialSvg path="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 2.76A5.46 5.46 0 1 1 12 17.46 5.46 5.46 0 0 1 12 6.54zm0 1.62a3.84 3.84 0 1 0 0 7.68 3.84 3.84 0 0 0 0-7.68zm5.65-2.99a1.27 1.27 0 1 1-2.54 0 1.27 1.27 0 0 1 2.54 0z" />
              </a>
              <a href="https://linkedin.com/company/feaproperties/" aria-label="LinkedIn" className="hover:text-gold">
                <SocialSvg path="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73a1.74 1.74 0 1 1 0-3.48 1.74 1.74 0 0 1 0 3.48zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77c1.4-2.58 7-2.77 7 2.47V19z" />
              </a>
              <a href="https://facebook.com/Feaprop" aria-label="Facebook" className="hover:text-gold">
                <SocialSvg path="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </a>
              <a href="https://wa.me/971504280362" aria-label="WhatsApp" className="hover:text-gold">
                <SocialSvg path="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .066 11.86C.07 5.337 5.396.011 11.92.011a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.416c-.003 6.524-5.327 11.85-11.853 11.85a11.9 11.9 0 0 1-5.696-1.452L.057 24z" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold">{t('explore')}</div>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li><Link href="/properties" className="hover:text-gold">{tn('properties')}</Link></li>
              <li><Link href="/about" className="hover:text-gold">{tn('about')}</Link></li>
              <li><Link href="/insights" className="hover:text-gold">{tn('insights')}</Link></li>
              <li><Link href="/contact" className="hover:text-gold">{tn('contact')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold">{t('services')}</div>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li><span>Buy</span></li>
              <li><span>Sell</span></li>
              <li><span>Rent</span></li>
              <li><span>Off-Plan</span></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold">{t('visit')}</div>
            <address className="mt-5 not-italic text-sm leading-relaxed text-ivory/70">
              FEA Properties<br />
              3301 Prime Tower<br />
              Marasi Drive, Business Bay<br />
              Dubai, United Arab Emirates<br /><br />
              <a href="tel:+97145469115" className="hover:text-gold">+971 4 546 9115</a><br />
              <a href="tel:+971504280362" className="hover:text-gold">+971 50 428 0362</a><br />
              <a href="mailto:info@feaproperties.ae" className="hover:text-gold">info@feaproperties.ae</a>
            </address>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-mute md:flex-row md:items-center">
          <div>{t('rights', {year})}</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gold">{t('privacy')}</a>
            <a href="#" className="hover:text-gold">{t('terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialSvg({path}: {path: string}) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d={path} />
    </svg>
  );
}
