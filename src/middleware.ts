import { defineMiddleware } from 'astro:middleware';
import { talleySite } from './site';

const TENANT_PREFIX = '/brands/talley-wealth';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.site = talleySite;

  const { pathname } = context.url;
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  const redirects: Record<string, string> = {
    '/locations/johnson-city': '/financial-advisor-johnson-city-tn',
    '/locations/kingsport': '/financial-advisor-kingsport-tn',
    '/locations/bristol': '/financial-advisor-bristol-tn-va',
    '/locations/erwin': '/financial-advisor-erwin-tn',
    '/locations/greeneville': '/financial-advisor-greeneville-tn',
    '/locations/abingdon': '/financial-advisor-abingdon-va',
    '/meet-david-talley': '/about/meet-david-talley',
    '/who-we-are': '/about',
    '/our-purpose': '/about',
    '/planning': '/services/financial-planning',
    '/investing': '/services/investment-management',
    '/areas-we-serve': '/financial-advisor-tri-cities-tn',
    '/frequently-asked-questions': '/resources/learning-center',
    '/success-stories': '/how-we-work/success-stories',
    '/calculator': '/calculators',
    '/services/keystone-plan': '/how-we-work/keystone-method',
  };

  if (pathname.startsWith(TENANT_PREFIX) && !pathname.includes('.') && !context.url.searchParams.has('__tenant')) {
    const publicPath = pathname.slice(TENANT_PREFIX.length) || '/';
    return context.redirect(publicPath + context.url.search, 301);
  }

  const redirectTarget = redirects[normalizedPath];
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
  const searchParams = new URLSearchParams(context.url.search);
  searchParams.set('__tenant', '1');
  const search = searchParams.toString();
  return context.rewrite(search ? `${target}?${search}` : target);
});
