type JsonLd = Record<string, unknown>;

const siteUrl = 'https://talleywealth.com';
const logoUrl = `${siteUrl}/brands/talley-wealth/logo.webp`;
const davidUrl = `${siteUrl}/about/meet-david-talley`;
const organizationId = `${siteUrl}/#organization`;
const davidId = `${davidUrl}#david-talley`;
const websiteId = `${siteUrl}/#website`;

function titleCase(segment: string) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function buildBreadcrumbSchema(pathname: string): JsonLd | null {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';
  const segments = cleanPath === '/' ? [] : cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        '@type': 'ListItem',
        position: index + 2,
        name: titleCase(segment),
        item: `${siteUrl}${path}`,
      };
    }),
  ];

  return {
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}${cleanPath}#breadcrumb`,
    itemListElement,
  };
}

export function buildTalleyJsonLd({
  pathname,
  canonicalUrl,
  title,
  description,
}: {
  pathname: string;
  canonicalUrl: string;
  title: string;
  description: string;
}): JsonLd[] {
  const breadcrumb = buildBreadcrumbSchema(pathname);

  const graph: JsonLd[] = [
    {
      '@type': ['FinancialService', 'LocalBusiness'],
      '@id': organizationId,
      name: 'Talley Wealth',
      url: siteUrl,
      logo: logoUrl,
      image: logoUrl,
      telephone: '+1-423-617-0160',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '203 Broyles Drive, Suite 301',
        addressLocality: 'Johnson City',
        addressRegion: 'TN',
        postalCode: '37601',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Johnson City', addressRegion: 'TN' },
        { '@type': 'City', name: 'Bristol', addressRegion: 'TN' },
        { '@type': 'City', name: 'Bristol', addressRegion: 'VA' },
        { '@type': 'City', name: 'Kingsport', addressRegion: 'TN' },
        { '@type': 'AdministrativeArea', name: 'Tri-Cities Tennessee' },
      ],
      founder: { '@id': davidId },
      employee: { '@id': davidId },
      knowsAbout: [
        'Financial planning',
        'Retirement planning',
        'Tax planning',
        'Investment management',
        'Roth conversion planning',
        'Business owner financial planning',
      ],
      makesOffer: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Financial Planning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Retirement Planning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Proactive Tax Planning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Investment Management' } },
      ],
    },
    {
      '@type': 'Person',
      '@id': davidId,
      name: 'David Talley',
      url: davidUrl,
      jobTitle: 'Founder and Lead Advisor',
      worksFor: { '@id': organizationId },
      affiliation: { '@id': organizationId },
      knowsAbout: [
        'Certified financial planning',
        'Tax planning',
        'Retirement income planning',
        'Investment management',
        'Estate planning coordination',
      ],
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', name: 'CERTIFIED FINANCIAL PLANNER™ professional' },
        { '@type': 'EducationalOccupationalCredential', name: 'Chartered Financial Consultant®' },
        { '@type': 'EducationalOccupationalCredential', name: 'Enrolled Agent' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: 'Talley Wealth',
      url: siteUrl,
      publisher: { '@id': organizationId },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: logoUrl,
      inLanguage: 'en-US',
      ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
    },
  ];

  if (breadcrumb) graph.push(breadcrumb);
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}


export function buildFAQPageSchema(faqs: Array<{ q: string; a: string }>): JsonLd | null {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function buildBlogPostingSchema({
  title,
  description,
  datePublished,
  image,
  url,
  author = 'David Talley',
}: {
  title: string;
  description: string;
  datePublished: string;
  image: string;
  url: string;
  author?: string;
}): JsonLd {
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    image: absoluteImage,
    mainEntityOfPage: url,
    author: author === 'David Talley' ? { '@id': davidId } : { '@type': 'Person', name: author },
    publisher: { '@id': organizationId },
  };
}
