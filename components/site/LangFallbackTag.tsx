import {useTranslations} from 'next-intl';

/**
 * Renders a small "(English)" indicator with lang="en" for content that
 * falls back to English because the Arabic translation is missing.
 * Used wherever a LocalizedString.fallback === true on AR pages.
 */
export function LangFallbackTag() {
  const t = useTranslations('fallback');
  return (
    <span lang="en" className="ms-2 align-middle text-[9px] uppercase tracking-[0.25em] text-mute">
      {t('englishTag')}
    </span>
  );
}
