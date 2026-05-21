import type { WikiCategory } from './types';

export const wikiCategories: WikiCategory[] = [
  {
    slug: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Strategic planning for the transition to and through retirement, including income and Social Security optimization',
    icon: 'TrendingUp',
    articleCount: 5,
  },
  {
    slug: 'investment-basics',
    title: 'Investment Basics',
    description: 'Understanding portfolio management, asset allocation, and building long-term wealth',
    icon: 'LineChart',
    articleCount: 5,
  },
  {
    slug: 'tax-planning',
    title: 'Tax-Smart Strategies',
    description: 'Tax-efficient investing, Roth conversions, and coordinating taxes with your financial plan',
    icon: 'Calculator',
    articleCount: 5,
  },
  {
    slug: 'estate-planning',
    title: 'Estate & Legacy',
    description: 'Protecting your wealth and ensuring it transfers according to your wishes',
    icon: 'Shield',
    articleCount: 3,
  },
  {
    slug: 'life-transitions',
    title: 'Life Transitions',
    description: 'Financial guidance for major life changes including inheritance, divorce, and career shifts',
    icon: 'RefreshCw',
    articleCount: 4,
  },
  {
    slug: 'working-with-advisor',
    title: 'Working With an Advisor',
    description: 'Understanding fiduciary standards, fee structures, and what to expect from a financial advisor',
    icon: 'Users',
    articleCount: 3,
  },
];

export function getCategoryBySlug(slug: string): WikiCategory | undefined {
  return wikiCategories.find(cat => cat.slug === slug);
}
