import { cities } from './cities';
import { services } from './services';
import { personas } from './personas';

export interface SEORoute {
  slug: string;
  type: 'city' | 'service-city' | 'persona';
  cityKey?: string;
  serviceKey?: string;
  personaKey?: string;
}

export const seoRedirects: Record<string, string> = {
  'retirement-planning-johnson-city-tn': '/financial-advisor-johnson-city-tn',
  'tax-planning-johnson-city-tn': '/services/tax-planning',
  'business-financial-planning-johnson-city-tn': '/financial-advisor-for-business-owners',
  'investment-management-johnson-city-tn': '/financial-advisor-johnson-city-tn',
  'estate-planning-johnson-city-tn': '/financial-advisor-for-pre-retirees',
  'financial-advisor-for-ballad-health-professionals': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-ballad-health': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-doctors': '/financial-advisor-for-healthcare-professionals',
  'financial-advisor-for-eastman-employees': '/financial-advisor-for-kingsport-employer-benefits',
};

// Generate all city hub routes
function getCityRoutes(): SEORoute[] {
  return Object.keys(cities).map(key => {
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
      // Skip if city doesn't have this service enabled
      if (!city.enabledServices?.includes(serviceKey)) continue;
      const stateSlug = city.state.toLowerCase();
      const suffix = city.citySuffix ?? `${city.slug}-${stateSlug}`;
      routes.push({
        slug: `${service.slug}-${suffix}`,
        type: 'service-city' as const,
        cityKey,
        serviceKey,
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

export const cityRoutes = getCityRoutes();
export const serviceCityRoutes = getServiceCityRoutes();
export const personaRoutes = getPersonaRoutes();
export const allSEORoutes = [...cityRoutes, ...serviceCityRoutes, ...personaRoutes];
