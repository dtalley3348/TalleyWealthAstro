import { defineMiddleware } from 'astro:middleware';
import { talleySite } from './site';
import { allSEORoutes } from './data/talley-wealth/seo/routes';

const TENANT_PREFIX = '/brands/talley-wealth';
const CANONICAL_ORIGIN = 'https://talleywealth.com';
const canonicalSeoPaths = new Set(allSEORoutes.map((route) => `/${route.slug}`));

const oldServiceLocationRedirects: { pattern: RegExp; target: string }[] = [
  { pattern: /^\/financial-planning-[a-z0-9-]+$/, target: '/services/financial-planning' },
  { pattern: /^\/investment-management-[a-z0-9-]+$/, target: '/services/investment-management' },
  { pattern: /^\/retirement-planning-[a-z0-9-]+$/, target: '/services/retirement-planning' },
  { pattern: /^\/proactive-tax-planning-[a-z0-9-]+$/, target: '/services/tax-planning' },
  { pattern: /^\/entrepreneur-financial-planning-[a-z0-9-]+$/, target: '/services/business-owner-planning' },
  { pattern: /^\/business-financial-planning-[a-z0-9-]+$/, target: '/financial-advisor-for-business-owners' },
  { pattern: /^\/financial-advisor-(?!for-)[a-z0-9-]+$/, target: '/financial-advisor-tri-cities-tn' },
];

const oldDomainRedirects: Record<string, string> = {
  '/': '/',
  '/home': '/',
  '/about': '/about',
  '/contact': '/contact',
  '/who-we-are': '/about',
  '/our-purpose': '/about',
  '/meet-david-talley': '/about/meet-david-talley',
  '/financial-planning': '/services/financial-planning',
  '/retirement-planning': '/services/retirement-planning',
  '/investment-management': '/services/investment-management',
  '/tax-planning': '/services/tax-planning',
  '/proactive-tax-planning': '/services/tax-planning',
  '/business-owner-financial-planning': '/financial-advisor-for-business-owners',
  '/johnson-city-entrepreneur-financial-planning': '/financial-advisor-for-business-owners',
  '/financial-advisor-johnson-city-tn': '/financial-advisor-johnson-city-tn',
  '/johnson-city-financial-advisor': '/financial-advisor-johnson-city-tn',
  '/financial-advisor-kingsport-tn': '/financial-advisor-kingsport-tn',
  '/financial-advisor-bristol-tn-va': '/financial-advisor-bristol-tn-va',
  '/financial-advisor-tri-cities-tn': '/financial-advisor-tri-cities-tn',
  '/retirement-planning-johnson-city-tn': '/financial-advisor-johnson-city-tn',
  '/retirement-planning-kingsport-tn': '/retirement-planning-kingsport-tn',
  '/retirement-planning-bristol-tn-va': '/retirement-planning-bristol-tn-va',
  '/financial-advisor-for-pre-retirees': '/financial-advisor-for-pre-retirees',
  '/financial-advisor-for-business-owners': '/financial-advisor-for-business-owners',
  '/financial-advisor-for-inherited-wealth': '/financial-advisor-for-inherited-wealth',
  '/financial-advisor-for-executives-equity-comp': '/financial-advisor-for-executives-equity-comp',
  '/learning-center': '/resources/learning-center',
  '/learning-center/1': '/resources/learning-center',
  '/resources': '/resources',
  '/resources/blog': '/resources/blog',
  '/guide': '/guide',
  '/6-tax-tips-for-retirees-free-guide': '/guide',
  '/what-is-fiduciary-duty-a-guide-to-protecting-your-financial-future': '/resources/learning-center',
  '/7-year-end-tax-strategies-every-entrepreneur-should-know': '/resources/blog/what-tax-planning-actually-looks-like',
  '/4-steps-to-complete-estate-plan-free-checklist': '/resources/learning-center',
  '/your-practice-s-next-chapter-a-complete-guide-to-ownership-transitions-ebook': '/financial-advisor-for-business-owners',
};

export const onRequest = defineMiddleware((context, next) => {
  context.locals.site = talleySite;

  const { pathname } = context.url;
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  if (context.url.hostname === 'mytalleyfinancial.com' || context.url.hostname === 'www.mytalleyfinancial.com') {
    const exactTarget = oldDomainRedirects[normalizedPath];
    const patternTarget = oldServiceLocationRedirects.find(({ pattern }) => pattern.test(normalizedPath))?.target;
    const samePathTarget = canonicalSeoPaths.has(normalizedPath) ? normalizedPath : undefined;
    const target = exactTarget ?? patternTarget ?? samePathTarget ?? '/';
    return context.redirect(`${CANONICAL_ORIGIN}${target}${context.url.search}`, 301);
  }

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
    '/retirement': '/services/retirement-planning',
    '/planning': '/services/financial-planning',
    '/who-we-serve': '/who-we-help',
    '/business-owner-financial-planning': '/financial-advisor-for-business-owners',
    '/retirement-planning-elizabethton': '/services/retirement-planning',
    '/taxgameplan/retirement': '/workshop',
    '/investing': '/services/investment-management',
    '/areas-we-serve': '/financial-advisor-tri-cities-tn',
    '/frequently-asked-questions': '/resources/learning-center',
    '/success-stories': '/how-we-work/success-stories',
    '/calculator': '/calculators',
    '/services/keystone-plan': '/how-we-work/keystone-method',
    '/financial-planning': '/services/financial-planning',
    '/retirement-planning': '/services/retirement-planning',
    '/investment-management': '/services/investment-management',
    '/tax-planning': '/services/tax-planning',
    '/proactive-tax-planning': '/services/tax-planning',
    '/learning-center': '/resources/learning-center',
    '/learning-center/1': '/resources/learning-center',
    '/estate': '/resources/learning-center',
    '/johnson-city-entrepreneur-financial-planning': '/financial-advisor-for-business-owners',
    '/what-is-fiduciary-duty-a-guide-to-protecting-your-financial-future': '/resources/learning-center',
    '/7-year-end-tax-strategies-every-entrepreneur-should-know': '/resources/blog/what-tax-planning-actually-looks-like',
    '/4-steps-to-complete-estate-plan-free-checklist': '/resources/learning-center',
    '/your-practice-s-next-chapter-a-complete-guide-to-ownership-transitions-ebook': '/financial-advisor-for-business-owners',
    '/6-tax-tips-for-retirees-free-guide': '/guide',
  };

  if (pathname.startsWith(TENANT_PREFIX) && !pathname.includes('.') && !context.url.searchParams.has('__tenant')) {
    const publicPath = pathname.slice(TENANT_PREFIX.length) || '/';
    return context.redirect(publicPath + context.url.search, 301);
  }

  const redirectTarget = redirects[normalizedPath];
  if (redirectTarget) {
    return context.redirect(redirectTarget, 301);
  }

  if (!canonicalSeoPaths.has(normalizedPath)) {
    const oldServiceLocationRedirect = oldServiceLocationRedirects.find(({ pattern }) => pattern.test(normalizedPath));
    if (oldServiceLocationRedirect) {
      return context.redirect(oldServiceLocationRedirect.target, 301);
    }
  }

  if (normalizedPath === '/404') {
    return next();
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
