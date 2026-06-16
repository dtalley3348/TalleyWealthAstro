import type { LinkItem } from './site-content';

export type BlogStrategy = {
  primaryIntent: string;
  supportingIntents: string[];
  links: LinkItem[];
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    label: string;
  };
};

export const blogStrategyBySlug: Record<string, BlogStrategy> = {
  'health-insurance-options-before-age-65': {
    primaryIntent: 'Health insurance planning for retirement before Medicare',
    supportingIntents: ['Retiring before 65', 'Healthcare bridge', 'Retirement income planning'],
    links: [
      { title: 'Can I Retire Before 65?', href: '/can-i-retire-before-65-tri-cities-tn', description: 'The broader decision page for the bridge period before Medicare.' },
      { title: 'Retirement Calculator', href: '/calculators', description: 'Start with rough spending, portfolio, withdrawal, and sequence-risk math.' },
      { title: 'Pre-Retirement Planning', href: '/financial-advisor-for-pre-retirees', description: 'Planning for the years when work may become optional.' },
      { title: 'What Is Your Retirement Number?', href: '/resources/blog/whats-your-number-retirement', description: 'Why the retirement number needs taxes, income sources, and lifestyle built in.' },
    ],
    cta: {
      eyebrow: 'Before Medicare',
      title: 'Retiring before 65 starts with the healthcare bridge.',
      body: 'The health insurance choice needs to be coordinated with taxes, portfolio withdrawals, Roth conversions, Social Security timing, and the life you want retirement to support.',
      href: '/can-i-retire-before-65-tri-cities-tn',
      label: 'See the early-retirement guide',
    },
  },
  'should-i-elect-s-corp-status': {
    primaryIntent: 'S-Corp election, owner compensation, and business-owner tax planning',
    supportingIntents: ['Business owner tax planning', 'Reasonable compensation', 'Tennessee S-Corp planning'],
    links: [
      { title: 'S-Corp Planning in the Tri-Cities', href: '/s-corp-planning-tri-cities-tn', description: 'The decision page for owner pay, reasonable compensation, Tennessee tax, and S-Corp fit.' },
      { title: 'S-Corp Tax Savings Visual', href: '/learn/s-corp-tax-savings-explained', description: 'An interactive explainer showing where payroll-tax savings can appear.' },
      { title: 'Business Owner Tax Planning in the Tri-Cities', href: '/business-owner-tax-planning-tri-cities-tn', description: 'How owner tax decisions fit into broader local planning.' },
      { title: 'Business Owner Planning', href: '/services/business-owner-planning', description: 'Planning for the overlap between the business, household, taxes, and cash flow.' },
    ],
    cta: {
      eyebrow: 'S-Corp planning needs context',
      title: 'The election is not the plan. The owner-pay decision is part of the plan.',
      body: 'An Explore Call can help clarify whether there is enough profit, complexity, and tax exposure to justify deeper planning around owner compensation and entity structure.',
      href: '/get-started',
      label: 'Schedule an Explore Call',
    },
  },
  'phantom-checkbox-roth-conversions': {
    primaryIntent: 'Roth conversion strategy inside retirement and tax planning',
    supportingIntents: ['Tax planning', 'Retirement income planning', 'Keystone Method'],
    links: [
      { title: 'Roth Conversions Before Retirement?', href: '/roth-conversions-before-retirement-tri-cities-tn', description: 'The decision guide for timing conversions before or after work income drops.' },
      { title: 'Tax Planning', href: '/services/tax-planning', description: 'How proactive tax planning fits into the broader plan.' },
      { title: 'Retirement Planning', href: '/services/retirement-planning', description: 'How Roth decisions connect to income, RMDs, and Social Security.' },
      { title: 'The Keystone Method', href: '/how-we-work/keystone-method', description: 'The planning process that coordinates tax, investments, retirement, and estate decisions.' },
    ],
    cta: {
      eyebrow: 'Roth conversions belong in a plan',
      title: 'Want to know whether Roth conversions actually fit your situation?',
      body: 'The answer depends on your lifetime tax picture, income timing, retirement date, Medicare thresholds, and withdrawal plan. That is exactly the kind of work Keystone is built to organize.',
      href: '/roth-conversions-before-retirement-tri-cities-tn',
      label: 'See the Roth conversion guide',
    },
  },
  'most-people-cant-name-a-single-tax-strategy': {
    primaryIntent: 'Proactive tax planning for people with meaningful tax bills',
    supportingIntents: ['Tax strategy', 'Business owner planning', 'Johnson City tax planning'],
    links: [
      { title: 'Tax Planning', href: '/services/tax-planning', description: 'Year-round planning before the tax year is already over.' },
      { title: 'Business Owner Planning', href: '/services/business-owner-planning', description: 'Planning when profits, entity decisions, and personal wealth overlap.' },
      { title: 'Financial Advisor for Business Owners', href: '/financial-advisor-for-business-owners', description: 'Advice for owners whose business and personal finances are connected.' },
      { title: 'Financial Advisor in Johnson City, TN', href: '/financial-advisor-johnson-city-tn', description: 'Local planning for Johnson City families and business owners.' },
    ],
    cta: {
      eyebrow: 'Tax strategy should be visible',
      title: 'If you cannot name the strategy, it may be time to build one.',
      body: 'An Explore Call is a simple way to talk through what you are paying, what is driving it, and whether there is enough opportunity to justify deeper planning.',
      href: '/get-started',
      label: 'Schedule an Explore Call',
    },
  },
  'whats-your-number-retirement': {
    primaryIntent: 'Retirement number and retirement readiness planning',
    supportingIntents: ['Retirement planning', 'Pre-retirees', 'Johnson City retirement planning'],
    links: [
      { title: 'Can I Retire Before 65?', href: '/can-i-retire-before-65-tri-cities-tn', description: 'The decision page for health insurance, spending, taxes, Social Security, and the bridge before Medicare.' },
      { title: 'Retirement Planning', href: '/services/retirement-planning', description: 'Turn a retirement number into income, tax, and investment decisions.' },
      { title: 'Financial Advisor for Pre-Retirees', href: '/financial-advisor-for-pre-retirees', description: 'Planning for people within sight of retirement.' },
      { title: 'Retirement Calculator', href: '/calculators', description: 'Run a rough estimate of projected portfolio, income need, and gap.' },
    ],
    cta: {
      eyebrow: 'Retirement guide',
      title: 'Want a clearer way to think about your number?',
      body: 'The retirement guide walks through spending, taxes, timing, risk, and the decisions that shape whether the plan holds up.',
      href: '/guide',
      label: 'Download the free guide',
    },
  },
  'retirement-risk-nobody-talks-about': {
    primaryIntent: 'Sequence risk, inflation risk, and retirement portfolio structure',
    supportingIntents: ['Retirement planning', 'Investment management', 'Pre-retirees'],
    links: [
      { title: 'Can I Retire Before 65?', href: '/can-i-retire-before-65-tri-cities-tn', description: 'Stress-test the bridge period before Medicare begins.' },
      { title: 'Retirement Planning', href: '/services/retirement-planning', description: 'Plan income before withdrawals begin.' },
      { title: 'Investment Management', href: '/services/investment-management', description: 'Build the portfolio around the plan instead of the other way around.' },
      { title: 'Retirement Calculator', href: '/calculators', description: 'Stress-test the number before treating it like the plan.' },
    ],
    cta: {
      eyebrow: 'Risk needs structure',
      title: 'The goal is not less risk. It is the right risk for the plan.',
      body: 'A retirement portfolio should be built around income timing, tax exposure, withdrawal needs, and the risks you can actually control.',
      href: '/services/retirement-planning',
      label: 'Explore retirement planning',
    },
  },
  'what-tax-planning-actually-looks-like': {
    primaryIntent: 'What proactive tax planning means in practice',
    supportingIntents: ['Tax planning', 'Keystone Method', 'Business owners'],
    links: [
      { title: 'Tax Planning', href: '/services/tax-planning', description: 'What year-round planning looks like at Talley Wealth.' },
      { title: 'Tax Membership', href: '/tax-membership', description: 'How Talley Tax organizes preparation and planning across the year.' },
      { title: 'The Keystone Method', href: '/how-we-work/keystone-method', description: 'How tax decisions get coordinated with the rest of the plan.' },
      { title: 'Business Owner Planning', href: '/services/business-owner-planning', description: 'Tax and planning decisions for owners with growing profits.' },
    ],
    cta: {
      eyebrow: 'Tax planning is a process',
      title: 'Want to see how tax planning can run through the year?',
      body: 'Tax Membership is the Talley Tax model for pairing accurate preparation with planning touchpoints before the year is already over.',
      href: '/tax-membership',
      label: 'See the Tax Membership rhythm',
    },
  },
  'what-changes-as-financial-independence-gets-closer': {
    primaryIntent: 'Financial independence transition planning',
    supportingIntents: ['Retirement planning', 'Investment management', 'Tax strategy'],
    links: [
      { title: 'Financial Planning', href: '/services/financial-planning', description: 'Coordinate the decisions that start overlapping as independence gets closer.' },
      { title: 'Retirement Planning', href: '/services/retirement-planning', description: 'Turn financial independence into income and tax decisions.' },
      { title: 'Investment Management', href: '/services/investment-management', description: 'Align the portfolio with the next phase of life.' },
      { title: 'The Keystone Method', href: '/how-we-work/keystone-method', description: 'The planning engagement for connected decisions.' },
    ],
    cta: {
      eyebrow: 'The playbook changes',
      title: 'Close to financial independence? The next decisions deserve more precision.',
      body: 'Keystone is built for the moment when taxes, investments, retirement timing, estate decisions, and family priorities start touching each other.',
      href: '/how-we-work/keystone-method',
      label: 'See the Keystone Method',
    },
  },
  'tax-planning-high-income-w2-earners': {
    primaryIntent: 'Tax planning for high-income W-2 earners',
    supportingIntents: ['High-income professionals', 'Physicians', 'Healthcare professionals'],
    links: [
      { title: 'Tax Planning', href: '/services/tax-planning', description: 'Planning for income, deductions, equity, and retirement contributions.' },
      { title: 'Financial Advisor for Healthcare Professionals', href: '/financial-advisor-for-healthcare-professionals', description: 'Planning for physicians and medical professionals.' },
      { title: 'Financial Advisor for Healthcare Professionals', href: '/financial-advisor-for-healthcare-professionals', description: 'Planning for local healthcare professionals.' },
      { title: 'Financial Planning', href: '/services/financial-planning', description: 'A broader planning process for high-income households.' },
    ],
    cta: {
      eyebrow: 'High income needs coordination',
      title: 'A paycheck can still create planning opportunities.',
      body: 'High-income W-2 earners may have fewer obvious levers than business owners, but compensation, retirement accounts, investments, taxes, and timing still need to work together.',
      href: '/services/tax-planning',
      label: 'Explore tax planning',
    },
  },
};
