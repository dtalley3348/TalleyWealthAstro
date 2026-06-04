import type { WikiCategory } from './types';

export const wikiCategories: WikiCategory[] = [
  {
    slug: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Questions about retirement timing, income, Social Security, Medicare, and building confidence before work becomes optional.',
    icon: 'TrendingUp',
    articleCount: 5,
  },
  {
    slug: 'investment-basics',
    title: 'Investment Decisions',
    description: 'How your portfolio should change when the job of the money changes, especially around retirement and taxes.',
    icon: 'LineChart',
    articleCount: 5,
  },
  {
    slug: 'tax-planning',
    title: 'Tax-Smart Strategies',
    description: 'Roth conversions, retirement tax windows, account location, and decisions that can lower lifetime tax, not just this year\'s bill.',
    icon: 'Calculator',
    articleCount: 5,
  },
  {
    slug: 'estate-planning',
    title: 'Estate & Legacy',
    description: 'Documents, beneficiaries, trusts, inherited accounts, and the coordination that helps an estate plan actually work.',
    icon: 'Shield',
    articleCount: 3,
  },
  {
    slug: 'life-transitions',
    title: 'Life Transitions',
    description: 'Inherited money, divorce, career changes, and family care decisions where the next move deserves more than a quick answer.',
    icon: 'RefreshCw',
    articleCount: 4,
  },
  {
    slug: 'working-with-advisor',
    title: 'Working With an Advisor',
    description: 'How to evaluate fit, fees, fiduciary duty, planning depth, and whether someone is actually coordinating the work.',
    icon: 'Users',
    articleCount: 3,
  },
];

export function getCategoryBySlug(slug: string): WikiCategory | undefined {
  return wikiCategories.find(cat => cat.slug === slug);
}
