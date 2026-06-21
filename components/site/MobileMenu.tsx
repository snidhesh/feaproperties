'use client';

import {useState, useEffect, useCallback} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname, useRouter} from '@/i18n/routing';
import type {Locale} from '@/i18n/routing';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, {locale: next});
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full text-ivory hover:text-gold lg:hidden"
        aria-label={tc('openMenu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] lg:hidden ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" onClick={close} />
        <aside
          className={`drawer absolute inset-y-0 flex h-full w-[90%] max-w-sm flex-col bg-ink-900 px-7 py-7 shadow-2xl ${
            locale === 'ar' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <img src="/logo_basic.png" alt="FEA Properties" className="h-10 w-auto" />
            <button
              type="button"
              onClick={close}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory hover:text-gold"
              aria-label={tc('closeMenu')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <nav className="mt-10 flex flex-col">
            {([
              {href: '/', label: t('home')},
              {href: '/properties', label: t('properties')},
              {href: '/about', label: t('about')},
              {href: '/insights', label: t('insights')},
              {href: '/contact', label: t('contact')},
            ] as const).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="border-b hairline py-4 font-display text-2xl text-ivory hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex items-center gap-1 text-xs font-medium tracking-widest">
            <button
              type="button"
              onClick={() => switchTo('en')}
              className={`px-3 py-1 ${locale === 'en' ? 'text-ivory' : 'text-mute hover:text-ivory'}`}
            >
              EN
            </button>
            <span className="text-mute">/</span>
            <button
              type="button"
              onClick={() => switchTo('ar')}
              className={`px-3 py-1 ${locale === 'ar' ? 'text-ivory' : 'text-mute hover:text-ivory'}`}
            >
              عربي
            </button>
          </div>

          <div className="mt-auto space-y-3 border-t hairline pt-6 text-sm text-ivory/70">
            <a href="tel:+97145469115" className="block hover:text-gold">+971 4 546 9115</a>
            <a href="https://wa.me/971504280362" className="block hover:text-gold">WhatsApp Feleg · +971 50 428 0362</a>
            <a href="mailto:info@feaproperties.ae" className="block hover:text-gold">info@feaproperties.ae</a>
          </div>
        </aside>
      </div>
    </>
  );
}
