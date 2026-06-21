import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api, /trpc (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /studio (Sanity, Phase 2)
  // - static files (anything with a dot)
  matcher: ['/((?!api|trpc|_next|_vercel|studio|.*\\..*).*)'],
};
