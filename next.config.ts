import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const config: NextConfig = {
  images: {
    remotePatterns: [
      // BrokerDesk serves listing images from PropertyFinder's shared CDN
      {protocol: 'https', hostname: 'static.shared.propertyfinder.ae'},
      // Mapbox static-image API (Phase 1 detail-map fallback)
      {protocol: 'https', hostname: 'api.mapbox.com'},
    ],
  },
  redirects: async () => [
    // Legacy SEO migrations (root → /en + /blog → /insights)
    {source: '/blog', destination: '/en/insights', permanent: true},
    {source: '/blog/:slug', destination: '/en/insights/:slug', permanent: true},
    {source: '/properties', destination: '/en/properties', permanent: true},
    {source: '/properties/:slug', destination: '/en/properties/:slug', permanent: true},
    {source: '/about', destination: '/en/about', permanent: true},
    {source: '/contact', destination: '/en/contact', permanent: true},
    {source: '/privacy-policy', destination: '/en/privacy', permanent: true},
  ],
  experimental: {
    optimizePackageImports: ['zod'],
  },
};

export default withNextIntl(config);
