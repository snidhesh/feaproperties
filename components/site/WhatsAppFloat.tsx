import {useLocale} from 'next-intl';

export function WhatsAppFloat() {
  const locale = useLocale();
  const side = locale === 'ar' ? 'left-6' : 'right-6';
  return (
    <a
      href="https://wa.me/971504280362"
      aria-label="WhatsApp"
      className={`fixed bottom-6 ${side} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink-950 shadow-xl shadow-black/40 transition hover:scale-105`}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .066 11.86C.07 5.337 5.396.011 11.92.011a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.416c-.003 6.524-5.327 11.85-11.853 11.85a11.9 11.9 0 0 1-5.696-1.452L.057 24z" />
      </svg>
    </a>
  );
}
