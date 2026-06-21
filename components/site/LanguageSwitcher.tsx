'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';
import type {Locale} from '@/i18n/routing';
import {useTransition} from 'react';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  };

  return (
    <div
      className="hidden items-center gap-1 text-xs font-medium tracking-widest md:flex"
      aria-disabled={isPending}
    >
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`px-2 py-1 ${locale === 'en' ? 'text-ivory' : 'text-mute hover:text-ivory'}`}
      >
        EN
      </button>
      <span className="text-mute">/</span>
      <button
        type="button"
        onClick={() => switchTo('ar')}
        className={`px-2 py-1 ${locale === 'ar' ? 'text-ivory' : 'text-mute hover:text-ivory'}`}
      >
        عربي
      </button>
    </div>
  );
}
