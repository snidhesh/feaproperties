'use client';

import {useTranslations} from 'next-intl';

export function InquirySidebarForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle: string;
  propertyId: string;
}) {
  const t = useTranslations('detail.sidebar');
  return (
    <form className="rounded-sm border hairline bg-ink-900 p-7" data-property-id={propertyId}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{t('requestDetails')}</div>
      <h3 className="mt-2 font-display text-2xl leading-tight text-ivory">{t('requestTitle')}</h3>
      <p className="mt-2 text-xs text-mute">{t('requestBody')}</p>
      <div className="mt-5 space-y-3">
        <input
          type="text"
          placeholder={t('name')}
          className="w-full rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute focus:border-gold focus:outline-none"
        />
        <input
          type="email"
          placeholder={t('email')}
          className="w-full rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute focus:border-gold focus:outline-none"
        />
        <input
          type="tel"
          placeholder={t('phone')}
          className="w-full rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute focus:border-gold focus:outline-none"
        />
        <textarea
          rows={3}
          placeholder={t('message')}
          className="w-full rounded-sm border hairline bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute focus:border-gold focus:outline-none"
        />
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
      >
        {t('send')}
      </button>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-mute">
        {t('sourceLabel')} · {propertyTitle.slice(0, 40)}
      </p>
    </form>
  );
}
