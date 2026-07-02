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

export function buildSEOLandingPageSchema({
  slug,
  title,
  description,
  pageType,
  city,
  serviceName,
  audienceName,
  relatedLinks = [],
}: {
  slug: string;
  title: string;
  description: string;
  pageType: 'city' | 'service-city' | 'local-audience' | 'persona' | 'decision-cluster';
  city?: { name: string; state: string; county?: string } | null;
  serviceName?: string | null;
  audienceName?: string | null;
  relatedLinks?: Array<{ title: string; href: string }>;
}): JsonLd {
  const url = `${siteUrl}/${slug}`;
  const areaServed = city
    ? {
        '@type': 'City',
        name: city.name,
        addressRegion: city.state,
        ...(city.county ? { containedInPlace: { '@type': 'AdministrativeArea', name: city.county } } : {}),
      }
    : undefined;

  const serviceType = serviceName
    ?? (pageType === 'local-audience' && audienceName
      ? `${audienceName} financial planning`
      : pageType === 'decision-cluster'
        ? 'Decision-specific financial planning'
        : 'Financial planning');

  const graph: JsonLd[] = [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: serviceType,
      description,
      provider: { '@id': organizationId },
      mainEntityOfPage: `${url}#webpage`,
      ...(areaServed ? { areaServed } : {}),
      ...(audienceName ? { audience: { '@type': 'Audience', audienceType: audienceName } } : {}),
      serviceType,
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#seo-page`,
      url,
      name: title,
      description,
      isPartOf: { '@id': websiteId },
      about: { '@id': `${url}#service` },
      provider: { '@id': organizationId },
      inLanguage: 'en-US',
      ...(areaServed ? { contentLocation: areaServed } : {}),
    },
  ];

  if (relatedLinks.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#related-next-steps`,
      name: 'Related next steps',
      itemListElement: relatedLinks.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.title,
        url: `${siteUrl}${link.href}`,
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildBlogPostingSchema({
  title,
  description,
  datePublished,
  image,
  url,
  author = 'David Talley',
  videoUrl,
  sourceMoments = [],
}: {
  title: string;
  description: string;
  datePublished: string;
  image: string;
  url: string;
  author?: string;
  videoUrl?: string | null;
  sourceMoments?: {
    timestamp: string;
    seconds: number;
    label: string;
    question?: string;
    answer?: string;
    transcriptExcerpt?: string;
  }[];
}): JsonLd {
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const absoluteVideoUrl = videoUrl
    ? videoUrl.startsWith('http') ? videoUrl : `${siteUrl}${videoUrl}`
    : null;
  const blogPosting: JsonLd = {
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
  const graph: JsonLd[] = [blogPosting];
  if (absoluteVideoUrl) {
    const clips = sourceMoments.slice(0, 3).map((moment) => ({
      '@type': 'Clip',
      name: moment.label,
      startOffset: Math.max(0, Math.round(Number(moment.seconds) || 0)),
      url: `${url}#source-moment-${Math.max(0, Math.round(Number(moment.seconds) || 0))}`,
    }));
    graph.push({
      '@type': 'VideoObject',
      name: title,
      description,
      thumbnailUrl: [absoluteImage],
      uploadDate: datePublished,
      contentUrl: absoluteVideoUrl,
      ...(clips.length ? { hasPart: clips } : {}),
    });
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
