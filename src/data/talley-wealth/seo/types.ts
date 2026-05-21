import type { LucideIcon } from 'lucide-react';

export interface FAQ {
  q: string;
  a: string;
}

export interface Scenario {
  title: string;
  situation: string;
  approach: string;
  disclosure?: string;
}

export interface CityData {
  name: string;
  state: 'TN' | 'VA' | 'NC';
  slug: string;
  angle: string;
  employers: string[];
  landmarks: string[];
  population?: string;
  county: string;
  whyLocal: string;
  bulletPoints: string[];
  metaTitle: string;
  metaDescription: string;
  nearbyCities?: string[];
  customPath?: string;
  citySuffix?: string;
  faqs?: FAQ[];
  scenario?: Scenario;
  heroImage?: string;
  heroImageAlt?: string;
  enabledServices?: string[];
  serviceOverrides?: Record<string, {
    faqs?: FAQ[];
    scenario?: Scenario;
    bulletPoints?: string[];
    description?: string;
  }>;
  personalStory?: {
    title: string;
    content: string;
  };
}

export interface ServiceData {
  name: string;
  slug: string;
  shortName: string;
  icon: LucideIcon;
  description: string;
  bulletPoints: string[];
  faqs?: FAQ[];
}

export interface PersonaData {
  name: string;
  slug: string;
  label: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  employerDisclosure?: string;
  recognitionTitle?: string;
  recognitionIntro?: string;
  recognitionCards?: Array<{
    title: string;
    body: string;
  }>;
  problemTitle: string;
  problemDescription: string;
  problemDetail: string;
  bulletPoints: string[];
  differentiators: Array<{
    icon: LucideIcon;
    title: string;
    desc: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
  metaTitle: string;
  metaDescription: string;
  faqs?: FAQ[];
  scenario?: Scenario;
}

export interface CityServicePageData {
  city: CityData;
  service: ServiceData;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  whySection: string;
  bulletPoints: string[];
}
