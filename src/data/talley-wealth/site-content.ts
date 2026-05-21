import { blogPosts as migratedBlogPosts } from './blog-posts';

export type LinkItem = {
  title: string;
  href: string;
  description?: string;
};

export type CardItem = {
  title: string;
  body: string;
  href?: string;
};

export type BasicPage = {
  title: string;
  description: string;
  eyebrow?: string;
  heading: string;
  intro: string;
  image?: string;
  cta?: string;
  sections?: CardItem[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  body: string[];
  author?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean | null;
  duration?: string | null;
  videoUrl?: string | null;
};

export type LearnArticle = {
  slug: string;
  category: string;
  title: string;
  description: string;
  body: string[];
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  service: string;
  location?: string;
  audience?: string;
};

export const toolbarLinks: LinkItem[] = [
  { title: 'Blog', href: '/resources/blog' },
  { title: 'Client Portal', href: '/resources/portal' },
  { title: 'Talley Tax', href: 'https://talleytax.com', description: 'external' },
];

export const audiencePages: Record<string, BasicPage> = {
  retirement: {
    title: 'Retirement Planning | Talley Wealth',
    description: 'Retirement planning for people who want tax, investments, and income decisions coordinated before they stop working.',
    eyebrow: 'Who this is for',
    heading: 'Retirement is not one decision. It is a chain of connected decisions.',
    intro: 'We help pre-retirees and retirees coordinate income, taxes, Social Security, investments, and estate decisions so the plan holds together.',
    image: '/brands/talley-wealth/case-studies/retiree.png',
    sections: [
      { title: 'Income timing', body: 'When to draw from which account, and how those moves affect tax brackets and portfolio risk.' },
      { title: 'Tax-aware withdrawals', body: 'Roth conversions, RMDs, charitable giving, and taxable income planned together.' },
      { title: 'Ongoing adjustment', body: 'Retirement plans change as markets, health, family needs, and tax rules change.' },
    ],
  },
  professionals: {
    title: 'Financial Planning for Professionals | Talley Wealth',
    description: 'Financial planning for physicians, executives, and professionals with complex compensation and tax decisions.',
    eyebrow: 'Who this is for',
    heading: 'Your career is producing options. The plan decides what those options become.',
    intro: 'Professionals come to us when compensation, tax, retirement, insurance, and family goals need to be coordinated instead of handled one at a time.',
    image: '/brands/talley-wealth/case-studies/professional.png',
    sections: [
      { title: 'Compensation strategy', body: 'Equity, bonuses, retirement plans, and cash flow mapped against real goals.' },
      { title: 'Tax planning', body: 'Planning before deadlines so tax strategy is not limited to filing season.' },
      { title: 'Decision support', body: 'Clear tradeoffs for large career, family, and wealth-transfer decisions.' },
    ],
  },
  complex: {
    title: 'Complex Financial Planning | Talley Wealth',
    description: 'Coordinated planning for business owners, families, and households with connected financial decisions.',
    eyebrow: 'Who this is for',
    heading: 'The closer you get, the more everything touches everything else.',
    intro: 'Most clients have already done the hard part. They built, earned, saved, and carried responsibility. Now the pieces need to work together.',
    image: '/brands/talley-wealth/hero-team-meeting.jpg',
    sections: [
      { title: 'Business and personal planning', body: 'Owner compensation, retirement, taxes, succession, and liquidity viewed together.' },
      { title: 'Family complexity', body: 'Support for estate, education, gifting, and multigenerational planning conversations.' },
      { title: 'Coordinated execution', body: 'A plan that turns scattered tasks into a sequence of decisions and follow-through.' },
    ],
  },
};

export const aboutPages: Record<string, BasicPage> = {
  purpose: {
    title: 'Purpose | Talley Wealth',
    description: 'Talley Wealth exists to help people make connected financial decisions with more clarity and less drift.',
    eyebrow: 'Our purpose',
    heading: 'Planning should make the next decision clearer.',
    intro: 'We built the firm for people who need more than account management. They need a calm process for tax, investment, retirement, and family decisions.',
    image: '/brands/talley-wealth/david-whiteboard.jpg',
    sections: [
      { title: 'Plan first', body: 'The investment approach follows the financial plan, not the other way around.' },
      { title: 'Coordinate the pieces', body: 'Taxes, risk, estate, cash flow, and investments are reviewed as one system.' },
      { title: 'Keep showing up', body: 'Planning is not a binder. It is a rhythm of decisions, execution, and adjustment.' },
    ],
  },
  'our-commitment': {
    title: 'Our Commitment | Talley Wealth',
    description: 'A fiduciary, transparent, planning-first commitment from Talley Wealth.',
    eyebrow: 'Our commitment',
    heading: 'You should know how advice is given and why it is being recommended.',
    intro: 'Our commitment is straightforward: lead with planning, communicate clearly, and keep the advice tied to the decisions that matter.',
    image: '/brands/talley-wealth/david-stephenee-office.jpg',
    sections: [
      { title: 'Fiduciary advice', body: 'Recommendations are made around your goals, constraints, and tradeoffs.' },
      { title: 'Transparent pricing', body: 'Pricing is published and easy to understand before you become a client.' },
      { title: 'Plain language', body: 'Complex topics are translated into decisions you can actually make.' },
    ],
  },
  independent: {
    title: 'Independent Financial Advisor | Talley Wealth',
    description: 'Why independent, fee-based planning matters for clients with connected decisions.',
    eyebrow: 'Independent firm',
    heading: 'Independent means the work can start with your life, not a product shelf.',
    intro: 'Talley Wealth is a small independent firm in Johnson City, Tennessee, built around planning before product selection.',
    image: '/brands/talley-wealth/david-conversation.jpg',
    sections: [
      { title: 'Open architecture', body: 'The planning process is not limited to one company product lineup.' },
      { title: 'Local accountability', body: 'Clients work with the people doing the planning, not a rotating call center.' },
      { title: 'Tax-aware coordination', body: 'Planning and tax strategy stay connected throughout the year.' },
    ],
  },
  'meet-david-talley': {
    title: 'Meet David Talley | Talley Wealth',
    description: 'Meet David Talley, founder and lead advisor of Talley Wealth in Johnson City, Tennessee.',
    eyebrow: 'Founder and lead advisor',
    heading: 'Meet David Talley',
    intro: 'David Talley started Talley Wealth to do planning a particular way: plan first, run investments to fit the plan, and use tax strategy as a year-round lever.',
    image: '/brands/talley-wealth/david-portrait-full.jpg',
    sections: [
      { title: 'CFP professional', body: 'David brings planning discipline to tax, investment, and retirement decisions.' },
      { title: 'Enrolled Agent', body: 'Tax planning is part of the process, not an afterthought at filing time.' },
      { title: 'Local roots', body: 'The firm serves Johnson City, the Tri-Cities, and families across the region.' },
    ],
  },
};

export const howPages: Record<string, BasicPage> = {
  'what-to-expect': {
    title: 'What to Expect | Talley Wealth',
    description: 'What happens when you start the Talley Wealth planning process.',
    eyebrow: 'The process',
    heading: 'You should know what happens before you start.',
    intro: 'The first steps are designed to make fit clear. We learn what is going on, explain the process, and only move forward when the work makes sense.',
    sections: [
      { title: 'Explore Call', body: 'A short conversation to understand what prompted you to reach out and whether we are a fit.' },
      { title: 'Discovery', body: 'We gather the financial facts, but also the decisions and worries behind them.' },
      { title: 'Keystone work', body: 'The planning work is sequenced so the important decisions actually get made.' },
      { title: 'Ongoing guidance', body: 'Once the structure is in place, we keep the plan current and coordinate implementation.' },
    ],
  },
  'success-stories': {
    title: 'Planning Examples | Talley Wealth',
    description: 'Hypothetical composite examples of coordinated planning decisions.',
    eyebrow: 'Planning examples',
    heading: 'The win is not a prettier report. The win is a better decision.',
    intro: 'These stories are representative planning situations, not guarantees of future results. They show the kind of coordination the process is built for.',
    sections: [
      { title: 'Retiring owner', body: 'Coordinated business sale timing, retirement income, estimated taxes, and reinvestment decisions.' },
      { title: 'Physician household', body: 'Organized debt, retirement contributions, insurance, and tax projections around a fast-moving career.' },
      { title: 'Pre-retiree couple', body: 'Mapped Social Security, Roth conversions, charitable giving, and portfolio income before the first withdrawal.' },
    ],
  },
};

export const blogPosts: BlogPost[] = migratedBlogPosts;

export const learnArticles: LearnArticle[] = [
  {
    category: 'retirement',
    slug: 'social-security-timing',
    title: 'Social Security timing basics',
    description: 'How claiming age fits into the larger retirement income plan.',
    body: [
      'Social Security should be evaluated with income needs, tax brackets, survivor benefits, and portfolio withdrawals.',
      'The right answer is rarely based on age alone. It depends on the household and the rest of the plan.',
    ],
  },
  {
    category: 'tax',
    slug: 'roth-conversion-window',
    title: 'The Roth conversion window',
    description: 'Why the years before RMDs can create planning opportunities.',
    body: [
      'A Roth conversion can make sense when today tax rates are lower than future expected rates.',
      'The decision should be modeled with Medicare premiums, charitable giving, estate goals, and future cash flow.',
    ],
  },
  {
    category: 'investing',
    slug: 'portfolio-job-description',
    title: 'Give your portfolio a job description',
    description: 'A portfolio should be built around the cash flow and risk it needs to support.',
    body: [
      'Investments are easier to evaluate when the plan says what the portfolio is supposed to do.',
      'Risk, liquidity, taxes, and expected withdrawals should shape the investment design.',
    ],
  },
];

export const seoPages: SeoPage[] = [
  ['financial-advisor-johnson-city-tn', 'Financial Advisor in Johnson City, TN', 'Johnson City, Tennessee', 'Financial planning'],
  ['johnson-city-financial-advisor', 'Johnson City Financial Advisor', 'Johnson City, Tennessee', 'Financial planning'],
  ['financial-advisor-kingsport-tn', 'Financial Advisor in Kingsport, TN', 'Kingsport, Tennessee', 'Financial planning'],
  ['financial-advisor-bristol-tn-va', 'Financial Advisor in Bristol, TN/VA', 'Bristol, Tennessee and Virginia', 'Financial planning'],
  ['financial-advisor-abingdon-va', 'Financial Advisor in Abingdon, VA', 'Abingdon, Virginia', 'Financial planning'],
  ['financial-advisor-erwin-tn', 'Financial Advisor in Erwin, TN', 'Erwin, Tennessee', 'Financial planning'],
  ['financial-advisor-greeneville-tn', 'Financial Advisor in Greeneville, TN', 'Greeneville, Tennessee', 'Financial planning'],
  ['financial-advisor-knoxville-tn', 'Financial Advisor in Knoxville, TN', 'Knoxville, Tennessee', 'Financial planning'],
  ['financial-advisor-morristown-tn', 'Financial Advisor in Morristown, TN', 'Morristown, Tennessee', 'Financial planning'],
  ['financial-advisor-sevierville-tn', 'Financial Advisor in Sevierville, TN', 'Sevierville, Tennessee', 'Financial planning'],
  ['financial-advisor-asheville-nc', 'Financial Advisor in Asheville, NC', 'Asheville, North Carolina', 'Financial planning'],
  ['financial-advisor-southwest-virginia', 'Financial Advisor in Southwest Virginia', 'Southwest Virginia', 'Financial planning'],
  ['retirement-planning-kingsport-tn', 'Retirement Planning in Kingsport, TN', 'Kingsport, Tennessee', 'Retirement planning'],
  ['retirement-planning-bristol-tn-va', 'Retirement Planning in Bristol, TN/VA', 'Bristol, Tennessee and Virginia', 'Retirement planning'],
  ['retirement-planning-abingdon-va', 'Retirement Planning in Abingdon, VA', 'Abingdon, Virginia', 'Retirement planning'],
  ['retirement-planning-greeneville-tn', 'Retirement Planning in Greeneville, TN', 'Greeneville, Tennessee', 'Retirement planning'],
  ['retirement-planning-knoxville-tn', 'Retirement Planning in Knoxville, TN', 'Knoxville, Tennessee', 'Retirement planning'],
  ['retirement-planning-asheville-nc', 'Retirement Planning in Asheville, NC', 'Asheville, North Carolina', 'Retirement planning'],
  ['retirement-planning-southwest-virginia', 'Retirement Planning in Southwest Virginia', 'Southwest Virginia', 'Retirement planning'],
  ['proactive-tax-planning-kingsport-tn', 'Proactive Tax Planning in Kingsport, TN', 'Kingsport, Tennessee', 'Proactive tax planning'],
  ['proactive-tax-planning-bristol-tn-va', 'Proactive Tax Planning in Bristol, TN/VA', 'Bristol, Tennessee and Virginia', 'Proactive tax planning'],
  ['proactive-tax-planning-abingdon-va', 'Proactive Tax Planning in Abingdon, VA', 'Abingdon, Virginia', 'Proactive tax planning'],
  ['proactive-tax-planning-knoxville-tn', 'Proactive Tax Planning in Knoxville, TN', 'Knoxville, Tennessee', 'Proactive tax planning'],
  ['proactive-tax-planning-asheville-nc', 'Proactive Tax Planning in Asheville, NC', 'Asheville, North Carolina', 'Proactive tax planning'],
  ['proactive-tax-planning-sevierville-tn', 'Proactive Tax Planning in Sevierville, TN', 'Sevierville, Tennessee', 'Proactive tax planning'],
  ['investment-management-knoxville-tn', 'Investment Management in Knoxville, TN', 'Knoxville, Tennessee', 'Investment management'],
  ['investment-management-asheville-nc', 'Investment Management in Asheville, NC', 'Asheville, North Carolina', 'Investment management'],
  ['entrepreneur-financial-planning-erwin-tn', 'Entrepreneur Financial Planning in Erwin, TN', 'Erwin, Tennessee', 'Business-owner planning'],
  ['entrepreneur-financial-planning-sevierville-tn', 'Entrepreneur Financial Planning in Sevierville, TN', 'Sevierville, Tennessee', 'Business-owner planning'],
  ['entrepreneur-financial-planning-southwest-virginia', 'Entrepreneur Financial Planning in Southwest Virginia', 'Southwest Virginia', 'Business-owner planning'],
  ['financial-advisor-for-business-owners', 'Financial Advisor for Business Owners', undefined, 'Business-owner planning', 'Business owners'],
  ['financial-advisor-for-inherited-wealth', 'Financial Advisor for Inherited Wealth', undefined, 'Financial planning', 'families with inherited wealth'],
  ['financial-advisor-for-executives-equity-comp', 'Financial Advisor for Executives with Equity Compensation', undefined, 'Equity compensation planning', 'executives and professionals with equity compensation'],
  ['financial-advisor-for-pre-retirees', 'Financial Advisor for Pre-Retirees', undefined, 'Retirement planning', 'Pre-retirees'],
  ['financial-advisor-for-healthcare-professionals', 'Financial Advisor for Healthcare Professionals', undefined, 'Financial planning', 'healthcare professionals'],
  ['financial-advisor-for-kingsport-employer-benefits', 'Financial Planning for Kingsport Employer Benefits', undefined, 'Financial planning', 'Kingsport professionals with employer-benefit decisions'],
].map(([slug, heading, location, service, audience]) => ({
  slug: slug as string,
  title: `${heading} | Talley Wealth`,
  description: `${service} from Talley Wealth for ${audience ?? `clients in ${location}`}.`,
  eyebrow: location ? location as string : audience as string,
  heading: heading as string,
  intro: location
    ? `Talley Wealth helps clients in ${location} coordinate planning, tax, investments, and retirement decisions through a clear year-round process.`
    : `Talley Wealth helps ${audience} coordinate the financial decisions that tend to become more connected as life and wealth get more complex.`,
  service: service as string,
  location: location as string | undefined,
  audience: audience as string | undefined,
}));

export const seoPageMap = new Map(seoPages.map((page) => [page.slug, page]));
export const blogPostMap = new Map(blogPosts.map((post) => [post.slug, post]));
export const learnArticleMap = new Map(learnArticles.map((article) => [`${article.category}/${article.slug}`, article]));

export const learnCategories = Array.from(new Set(learnArticles.map((article) => article.category)));

export const requiredTalleyRoutes = [
  '/',
  '/about',
  '/about/independent',
  '/about/meet-david-talley',
  '/about/our-commitment',
  '/about/purpose',
  '/calculator',
  '/calculators',
  '/contact',
  '/explore-call-read',
  '/get-started',
  '/guide',
  '/guide-download',
  '/how-we-work',
  '/how-we-work/keystone-method',
  '/how-we-work/services',
  '/how-we-work/success-stories',
  '/how-we-work/what-to-expect',
  '/learn',
  '/meet-david-talley',
  '/meet-the-team',
  '/pricing',
  '/resources/blog',
  '/resources/portal',
  '/seo-index',
  '/who-we-help',
  '/who-we-serve/complex',
  '/who-we-serve/professionals',
  '/who-we-serve/retirement',
  '/workshop',
  ...seoPages.map((page) => `/${page.slug}`),
];
