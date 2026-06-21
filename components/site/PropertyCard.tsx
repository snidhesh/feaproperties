import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import type {Property} from '@/lib/crm/types';
import {LangFallbackTag} from './LangFallbackTag';
import {DhSymbol} from './DhSymbol';

export function PropertyCard({property}: {property: Property}) {
  const locale = useLocale();
  const t = useTranslations('properties.card');

  const title =
    locale === 'ar' && property.title.ar ? property.title.ar : property.title.en;
  const showFallbackTag = locale === 'ar' && !!property.title.fallback;
  const priceLabel = formatAmount(property.price.amount, locale);

  return (
    <article className="group">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-800">
          {property.media.hero ? (
            <Image
              src={property.media.hero}
              alt={title}
              fill
              sizes="(max-width:640px) 78vw, (max-width:1024px) 45vw, 30vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-mute">
              <span className="text-xs uppercase tracking-[0.3em]">No image</span>
            </div>
          )}
          <div className="scrim absolute inset-0" />
          <span className="absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur">
            {property.status === 'off-plan' ? 'Off-Plan' : 'Ready'}
          </span>
          <div className="absolute inset-x-4 bottom-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
              {property.location.community}
            </div>
            <h3 className="mt-1 font-display text-2xl leading-tight tracking-[-0.04em] text-ivory">
              {title}
              {showFallbackTag && <LangFallbackTag />}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="text-xs text-ivory/55">
            <div className="capitalize">{property.category.replace('-', ' ')}</div>
            <div className="mt-1">
              {property.bedrooms} Bed · {property.bathrooms} Bath ·{' '}
              {property.areaSqft.toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE')} sqft
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mute">
              {property.offering === 'rent-yearly' ? '/ year' : t('from')}
            </div>
            <div className="flex items-baseline justify-end gap-1.5 font-display text-xl text-gold">
              <DhSymbol className="text-gold" />
              <span>{priceLabel}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatAmount(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    maximumFractionDigits: 0,
  }).format(amount);
}
