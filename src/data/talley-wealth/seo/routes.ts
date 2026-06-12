import { cities } from './cities';
import { services } from './services';
import { personas } from './personas';
import { decisionClusters } from './decision-clusters';

export interface SEORoute {
  slug: string;
  type: 'city' | 'service-city' | 'local-audience' | 'persona' | 'decision-cluster';
  cityKey?: string;
  serviceKey?: string;
  audienceKey?: 'preRetirees' | 'businessOwners';
  personaKey?: string;
  decisionClusterKey?: string;
}

export const seoRedirects: Record<string, string> = {
  'tax-planning-johnson-city-tn': '/services/tax-planning',
  'business-financial-planning-johnson-city-tn': '/financial-advisor-for-business-owners',
  'investment-management-johnson-city-tn': '/financial-advisor-johnson-city-tn',
  'estate-planning-johnson-city-tn': '/financial-advisor-for-pre-retirees',
  'retirement-planning-tri-cities-tn': '/financial-advisor-tri-cities-tn',
  'financial-planning-for-tri-cities-business-owners': '/financial-advisor-tri-cities-tn',
  'financial-advisor-for-ballad-health-professionals': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-ballad-health': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-doctors': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-eastman-employees': '/financial-advisor-for-kingsport-employer-benefits',
};

// Generate all city hub routes
function getCityRoutes(): SEORoute[] {
  return Object.keys(cities).filter(key => cities[key].qualityGate?.approvedForIndex).map(key => {
    const city = cities[key];
    const stateSlug = city.state.toLowerCase();
    return {
      slug: city.customPath ?? `financial-advisor-${city.slug}-${stateSlug}`,
      type: 'city' as const,
      cityKey: key,
    };
  });
}

// Generate service × city routes — only for cities with enabledServices
function getServiceCityRoutes(): SEORoute[] {
  const routes: SEORoute[] = [];
  for (const serviceKey of Object.keys(services)) {
    const service = services[serviceKey];
    for (const cityKey of Object.keys(cities)) {
      const city = cities[cityKey];
      // Skip if city doesn't have this service enabled or the exact page has not passed the local quality gate.
      if (!city.enabledServices?.includes(serviceKey)) continue;
      const serviceOverride = city.serviceOverrides?.[serviceKey] ?? city.serviceOverrides?.[service.slug];
      if (!serviceOverride?.qualityGate?.approvedForIndex) continue;
      const stateSlug = city.state.toLowerCase();
      const suffix = city.citySuffix ?? `${city.slug}-${stateSlug}`;
      const slug = `${service.slug}-${suffix}`;
      const approvedLocalPageUsesSlug = Object.values(city.localAudiencePages ?? {}).some((page) => page?.slug === slug);
      if (approvedLocalPageUsesSlug) continue;
      routes.push({
        slug,
        type: 'service-city' as const,
        cityKey,
        serviceKey,
      });
    }
  }
  return routes;
}

// Generate local audience routes — only for cities with approved page briefs
function getLocalAudienceRoutes(): SEORoute[] {
  const routes: SEORoute[] = [];
  for (const cityKey of Object.keys(cities)) {
    const city = cities[cityKey];
    for (const audienceKey of ['preRetirees', 'businessOwners'] as const) {
      const page = city.localAudiencePages?.[audienceKey];
      if (!page) continue;
      if (!page.qualityGate?.approvedForIndex) continue;
      routes.push({
        slug: page.slug,
        type: 'local-audience' as const,
        cityKey,
        audienceKey,
      });
    }
  }
  return routes;
}

// Generate persona routes
function getPersonaRoutes(): SEORoute[] {
  return Object.keys(personas).map(key => ({
    slug: `financial-advisor-for-${personas[key].slug}`,
    type: 'persona' as const,
    personaKey: key,
  }));
}

// Generate decision-cluster routes only after the decision brief passes the quality gate.
function getDecisionClusterRoutes(): SEORoute[] {
  return Object.keys(decisionClusters)
    .filter(key => decisionClusters[key].qualityGate?.approvedForIndex)
    .map(key => ({
      slug: decisionClusters[key].slug,
      type: 'decision-cluster' as const,
      decisionClusterKey: key,
    }));
}

export const cityRoutes = getCityRoutes();
export const serviceCityRoutes = getServiceCityRoutes();
export const localAudienceRoutes = getLocalAudienceRoutes();
export const personaRoutes = getPersonaRoutes();
export const decisionClusterRoutes = getDecisionClusterRoutes();
export const allSEORoutes = [...cityRoutes, ...serviceCityRoutes, ...localAudienceRoutes, ...personaRoutes, ...decisionClusterRoutes];
