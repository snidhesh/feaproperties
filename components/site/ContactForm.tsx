'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {ContactFormSchema, type ContactFormValues} from '@/lib/validation/lead';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const te = useTranslations('contact.form.errors');
  const ts = useTranslations('contact.form.success');
  const ti = useTranslations('contact.form.interest');
  const locale = useLocale();

  const [state, setState] = useState<SubmitState>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      interest: 'buying',
      message: '',
      consent: false,
      website: '',
    },
    mode: 'onBlur',
  });

  // Translate a Zod error message-key into the localized string.
  const errText = (key?: string) => (key ? te(key as never) : '');

  const onSubmit = async (values: ContactFormValues) => {
    setState('submitting');
    setServerError(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...values,
          source: 'contact-page',
          locale,
          pageUrl:
            typeof window !== 'undefined' ? window.location.href : '',
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'generic');
      }
      setState('success');
    } catch (err) {
      setServerError(te('generic'));
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="rounded-sm border hairline bg-ink-900 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-3xl leading-tight tracking-[-0.04em] text-ivory">
          {ts('title')}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ivory/70">{ts('body')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://wa.me/971504280362"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-950 hover:bg-ivory"
          >
            {ts('ctaWhatsapp')}
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full border border-ivory/30 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ivory hover:border-gold hover:text-gold"
          >
            {ts('ctaBack')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      // Password managers (1Password / LastPass / Bitwarden) inject attributes
      // into <form> and <input> after SSR, which trips React's hydration warning
      // for what is actually a benign DOM mutation.
      suppressHydrationWarning
      className="rounded-sm border hairline bg-ink-900 p-10"
    >
      <div className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('kicker')}</div>
      <h2 className="mt-2 font-display text-2xl text-ivory">{t('title')}</h2>
      <div className="gold-rule mt-6" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label={t('firstName')}
          error={errText(errors.firstName?.message)}
          {...register('firstName')}
        />
        <Field
          label={t('lastName')}
          error={errText(errors.lastName?.message)}
          {...register('lastName')}
        />
        <Field
          label={t('email')}
          type="email"
          error={errText(errors.email?.message)}
          autoComplete="email"
          {...register('email')}
        />
        <Field
          label={t('phoneOptional')}
          type="tel"
          autoComplete="tel"
          error={errText(errors.phone?.message)}
          {...register('phone')}
        />

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
            {t('interestLabel')}
          </span>
          <select
            {...register('interest')}
            className={`rounded-sm border bg-ink-800 px-4 py-3 text-sm text-ivory focus:outline-none ${
              errors.interest ? 'border-red-400/60 focus:border-red-400' : 'border-ivory/15 focus:border-gold'
            }`}
          >
            <option value="buying">{ti('buying')}</option>
            <option value="selling">{ti('selling')}</option>
            <option value="renting">{ti('renting')}</option>
            <option value="offplan">{ti('offplan')}</option>
            <option value="management">{ti('management')}</option>
            <option value="general">{ti('general')}</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-mute">
            {t('messageLabel')}
          </span>
          <textarea
            rows={5}
            {...register('message')}
            className={`rounded-sm border bg-ink-800 px-4 py-3 text-sm text-ivory focus:outline-none ${
              errors.message ? 'border-red-400/60 focus:border-red-400' : 'border-ivory/15 focus:border-gold'
            }`}
          />
          {errors.message?.message && (
            <span className="text-xs text-red-300/90">{errText(errors.message.message)}</span>
          )}
        </label>

        {/* Honeypot — hidden from humans, bots fill it and we reject server-side */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register('website')}
        />

        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 h-4 w-4 rounded border hairline bg-ink-800 accent-[var(--color-gold)]"
          />
          <span className="text-xs text-ivory/60">
            {t('consent')}{' '}
            <a href="#" className="text-gold hover:underline">
              {t('privacyLink')}
            </a>
            {errors.consent?.message && (
              <span className="ms-2 text-red-300/90">{errText(errors.consent.message)}</span>
            )}
          </span>
        </label>
      </div>

      {serverError && (
        <div className="mt-6 rounded-sm border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink-950 transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state === 'submitting' ? t('submitting') : t('submit')}
      </button>
      <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-mute">
        {t('sourceLabel')}
      </p>
    </form>
  );
}

const Field = (() => {
  type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  };
  return function Field({label, error, ...props}: FieldProps) {
    return (
      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-mute">{label}</span>
        <input
          {...props}
          className={`rounded-sm border bg-ink-800 px-4 py-3 text-sm text-ivory focus:outline-none ${
            error ? 'border-red-400/60 focus:border-red-400' : 'border-ivory/15 focus:border-gold'
          }`}
        />
        {error && <span className="text-xs text-red-300/90">{error}</span>}
      </label>
    );
  };
})();
