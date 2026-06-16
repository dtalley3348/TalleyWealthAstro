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

export interface LocalPageCard {
  title: string;
  body: string;
}

export interface LocalPageStrategyBrief {
  localTruth: string;
  whoThisIsReallyFor: string;
  whatTheyAreProbablyFeeling: string;
  whatNotToOverdo: string;
  voiceNotes: string;
}

export interface LocalAudienceStrategyBrief {
  identity: string;
  businessStage?: string;
  taxPressure?: string;
  cashFlowReality?: string;
  familyLayer?: string;
  controlTension?: string;
  retirementOrExitLayer?: string;
  voiceNotes: string;
}

export interface AnswerSummary {
  title: string;
  body: string;
  fitItems: string[];
  localContext: string;
  betterFit?: string;
}

export interface DecisionDepth {
  eyebrow: string;
  title: string;
  intro: string;
  items: LocalPageCard[];
}

export interface LocalProofBlock {
  title: string;
  body: string;
  items: string[];
}

export interface LocalPageQualityGate {
  approvedForIndex: boolean;
  score: number;
  uniqueLocalDecision: string;
  specificFit: string;
  specificNonFit: string;
  proofStandard: string;
  reviewNotes: string[];
}

export interface DecisionClusterStrategyBrief {
  decisionQuestion: string;
  sourceMethod: 'ramble-first' | 'existing-material-synthesis' | 'expert-draft';
  whoThisIsFor: string;
  surfaceQuestion: string;
  realQuestion: string;
  commonMisunderstanding: string;
  talleyPointOfView: string;
  badFitBoundary: string;
  davidPhrases: string[];
  whatToAvoid: string[];
  localRelevanceRule: string;
  voiceNotes: string;
}

export interface CityLocalPage {
  heading?: string;
  intro: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionBody: string[];
  proofTitle: string;
  proofBody: string;
  cards: LocalPageCard[];
  answerSummary?: AnswerSummary;
  localProof?: LocalProofBlock;
  decisionDepth?: DecisionDepth;
}

export interface LocalAudiencePage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  intro: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionBody: string[];
  proofTitle: string;
  proofBody: string;
  bulletPoints: string[];
  cards: LocalPageCard[];
  faqs: FAQ[];
  scenario: Scenario;
  ctaTitle: string;
  ctaDescription: string;
  strategyBrief?: LocalAudienceStrategyBrief;
  answerSummary?: AnswerSummary;
  localProof?: LocalProofBlock;
  decisionDepth?: DecisionDepth;
  qualityGate?: LocalPageQualityGate;
}

export interface DecisionClusterPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionBody: string[];
  proofTitle: string;
  proofBody: string;
  bulletPoints: string[];
  cards: LocalPageCard[];
  faqs: FAQ[];
  scenario: Scenario;
  ctaTitle: string;
  ctaDescription: string;
  strategyBrief: DecisionClusterStrategyBrief;
  answerSummary: AnswerSummary;
  localProof: LocalProofBlock;
  decisionDepth: DecisionDepth;
  relatedLinks: Array<LocalPageCard & { href: string }>;
  qualityGate: LocalPageQualityGate;
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
  localThesis?: string;
  bestFitAudience?: string;
  livedLocalProof?: string;
  strategyBrief?: LocalPageStrategyBrief;
  qualityGate?: LocalPageQualityGate;
  cityPage?: CityLocalPage;
  localAudiencePages?: {
    preRetirees?: LocalAudiencePage;
    businessOwners?: LocalAudiencePage;
  };
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
    qualityGate?: LocalPageQualityGate;
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
  decisionQuestions?: {
    eyebrow: string;
    title: string;
    intro: string;
    questions: Array<{
      q: string;
      a: string;
    }>;
  };
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
