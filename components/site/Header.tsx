import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MobileMenu} from './MobileMenu';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink-950"
      >
        {tc('skipToContent')}
      </a>

      <header id="site-header" className="fixed inset-x-0 top-0 z-50">
        <div className="scrim-top absolute inset-x-0 -top-2 h-28"></div>
        <nav className="relative mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-12">
          <Link href="/" className="flex items-center">
            <img
              src="/logo_basic.png"
              alt="FEA Properties"
              className="h-14 w-auto"
            />
          </Link>

          <ul className="hidden items-center gap-10 text-xs uppercase tracking-[0.22em] text-ivory/80 lg:flex">
            <li><Link href="/" className="hover:text-gold">{t('home')}</Link></li>
            <li><Link href="/properties" className="hover:text-gold">{t('properties')}</Link></li>
            <li><Link href="/about" className="hover:text-gold">{t('about')}</Link></li>
            <li><Link href="/insights" className="hover:text-gold">{t('insights')}</Link></li>
            <li><Link href="/contact" className="hover:text-gold">{t('contact')}</Link></li>
          </ul>

          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="hidden rounded-full border border-ivory/30 px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold md:block"
            >
              {t('scheduleViewing')}
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </header>

      {/* Scroll listener — toggles .is-scrolled on #site-header. Inline to
          avoid an additional client component on every page. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var h = document.getElementById('site-header');
              if (!h) return;
              var toggle = function () {
                if (window.scrollY > 24) h.classList.add('is-scrolled');
                else h.classList.remove('is-scrolled');
              };
              window.addEventListener('scroll', toggle, { passive: true });
              toggle();
            })();
          `,
        }}
      />
    </>
  );
}
