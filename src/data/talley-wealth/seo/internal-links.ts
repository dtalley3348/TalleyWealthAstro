/**
 * Keyword-to-SEO-page mapping for internal linking from wiki/blog content.
 * Each keyword maps to an array of relevant SEO pages with labels and paths.
 */

export interface InternalLink {
  label: string;
  path: string;
}

const linkMap: Record<string, InternalLink[]> = {
  retirement: [
    { label: 'Retirement Planning', path: '/services/retirement-planning' },
    { label: 'Financial Advisor for Pre-Retirees', path: '/financial-advisor-for-pre-retirees' },
  ],
  tax: [
    { label: 'Tax Planning', path: '/services/tax-planning' },
    { label: 'Financial Advisor in Johnson City, TN', path: '/financial-advisor-johnson-city-tn' },
  ],
  business: [
    { label: 'Financial Advisor for Business Owners', path: '/financial-advisor-for-business-owners' },
    { label: 'Business Owner Planning', path: '/services/business-owner-planning' },
  ],
  investment: [
    { label: 'Investment Management', path: '/services/investment-management' },
    { label: 'Financial Advisor in Kingsport, TN', path: '/financial-advisor-kingsport-tn' },
  ],
  eastman: [
    { label: 'Financial Advisor in Kingsport, TN', path: '/financial-advisor-kingsport-tn' },
    { label: 'Kingsport Employer-Benefit Planning', path: '/financial-advisor-for-kingsport-employer-benefits' },
  ],
  estate: [
    { label: 'Financial Planning', path: '/services/financial-planning' },
    { label: 'Financial Advisor for Pre-Retirees', path: '/financial-advisor-for-pre-retirees' },
  ],
  doctor: [
    { label: 'Financial Advisor for Healthcare Professionals', path: '/financial-advisor-for-healthcare-professionals' },
    { label: 'Financial Advisor in Johnson City, TN', path: '/financial-advisor-johnson-city-tn' },
  ],
  healthcare: [
    { label: 'Financial Advisor for Healthcare Professionals', path: '/financial-advisor-for-healthcare-professionals' },
    { label: 'Financial Advisor in Johnson City, TN', path: '/financial-advisor-johnson-city-tn' },
  ],
  irs: [
    { label: 'Financial Advisor in Johnson City, TN', path: '/financial-advisor-johnson-city-tn' },
    { label: 'Tax Planning', path: '/services/tax-planning' },
  ],
};

/**
 * Given an array of keywords (from article categories, tags, or content),
 * returns up to `max` unique, relevant SEO page links.
 */
export function getInternalLinks(keywords: string[], max = 3): InternalLink[] {
  const seen = new Set<string>();
  const results: InternalLink[] = [];

  for (const keyword of keywords) {
    const key = keyword.toLowerCase();
    for (const [mapKey, links] of Object.entries(linkMap)) {
      if (key.includes(mapKey)) {
        for (const link of links) {
          if (!seen.has(link.path) && results.length < max) {
            seen.add(link.path);
            results.push(link);
          }
        }
      }
    }
  }

  // If no matches found, return general links
  if (results.length === 0) {
    return [
      { label: 'Financial Advisor in Johnson City, TN', path: '/financial-advisor-johnson-city-tn' },
      { label: 'How We Work', path: '/how-we-work/what-to-expect' },
    ].slice(0, max);
  }

  return results;
}
