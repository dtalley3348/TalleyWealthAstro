import type { APIRoute } from 'astro';
import { blogPosts } from '../data/talley-wealth/site-content';

const site = 'https://talleywealth.com';

const canonicalPaths = [
  '/',
  '/get-started',
  '/contact',
  '/who-we-help',
  '/how-we-work/keystone-method',
  '/how-we-work/what-to-expect',
  '/how-we-work/success-stories',
  '/about',
  '/meet-the-team',
  '/about/meet-david-talley',
  '/about/our-commitment',
  '/pricing',
  '/services',
  '/resources',
  '/resources/blog',
  '/resources/learning-center',
  '/resources/tools',
  '/resources/key-dates',
  '/guide',
  '/calculators',
  '/services/individual-tax',
  '/services/business-services',
  '/services/keystone-plan',
  '/services/financial-planning',
  '/services/retirement-planning',
  '/services/investment-management',
  '/services/tax-planning',
  '/services/business-owner-planning',
  '/financial-advisor-johnson-city-tn',
  '/financial-advisor-tri-cities-tn',
  '/financial-advisor-kingsport-tn',
  '/financial-advisor-bristol-tn-va',
  '/retirement-planning-kingsport-tn',
  '/proactive-tax-planning-kingsport-tn',
  '/proactive-tax-planning-bristol-tn-va',
  '/retirement-planning-bristol-tn-va',
  '/financial-advisor-for-business-owners',
  '/financial-advisor-for-inherited-wealth',
  '/financial-advisor-for-executives-equity-comp',
  '/financial-advisor-for-kingsport-employer-benefits',
  '/financial-advisor-for-pre-retirees',
  '/financial-advisor-for-healthcare-professionals',
  ...blogPosts.map((post) => `/resources/blog/${post.slug}`),
];

export const GET: APIRoute = () => {
  const urls = canonicalPaths.map((path) => `  <url><loc>${site}${path}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
