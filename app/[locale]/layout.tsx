import type {Metadata} from 'next';
import {Arsenal, Roboto_Flex, El_Messiri, IBM_Plex_Sans_Arabic} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

function isValidLocale(value: string): value is (typeof routing.locales)[number] {
  return (routing.locales as readonly string[]).includes(value);
}
import {SiteHeader} from '@/components/site/Header';
import {SiteFooter} from '@/components/site/Footer';
import {WhatsAppFloat} from '@/components/site/WhatsAppFloat';
import '../globals.css';

const arsenal = Arsenal({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-arsenal',
  display: 'swap',
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

const elMessiri = El_Messiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-el-messiri',
  display: 'swap',
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://feaproperties.ae'),
  title: {
    default: 'FEA Properties — Boutique Real Estate, Dubai',
    template: '%s · FEA Properties',
  },
  description:
    'Boutique Dubai real estate. Off-plan investments, ready homes, and trusted advisory from FEA Properties.',
  alternates: {
    languages: {
      en: '/en',
      ar: '/ar',
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${arsenal.variable} ${robotoFlex.variable} ${elMessiri.variable} ${plexArabic.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-ink-950 text-ivory">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
