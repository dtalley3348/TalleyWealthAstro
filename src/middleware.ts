import { defineMiddleware } from 'astro:middleware';
import { talleySite } from './site';

const TENANT_PREFIX = '/brands/talley-wealth';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.site = talleySite;

  const { pathname } = context.url;

  const redirects: Record<string, string> = {
    '/locations/johnson-city': '/financial-advisor-johnson-city-tn',
    '/locations/kingsport': '/financial-advisor-kingsport-tn',
    '/locations/erwin': '/financial-advisor-erwin-tn',
    '/meet-david-talley': '/about/meet-david-talley',
  };

  const redirectTarget = redirects[pathname.replace(/\/$/, '') || '/'];
  if (redirectTarget) {
    return context.redirect(redirectTarget, 301);
  }
  if (
    pathname.startsWith(TENANT_PREFIX) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/brands/') ||
    pathname.includes('.')
  ) {
    return next();
  }

  const target = pathname === '/' ? TENANT_PREFIX : `${TENANT_PREFIX}${pathname}`;
  return context.rewrite(target + context.url.search);
});
