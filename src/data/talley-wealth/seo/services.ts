import { TrendingUp, Clock, BarChart3, Calculator, Briefcase } from 'lucide-react';
import type { ServiceData } from './types';

export const services: Record<string, ServiceData> = {
  'financial-planning': {
    name: 'Financial Planning',
    slug: 'financial-planning',
    shortName: 'Financial Planning',
    icon: TrendingUp,
    description: 'Comprehensive financial planning that coordinates your investments, taxes, retirement, and estate plan into one cohesive strategy.',
    bulletPoints: [
      'Cash flow analysis and budgeting strategy',
      'Net worth tracking and goal setting',
      'Insurance review and risk management',
      'Education planning (529 plans, funding strategies)',
      'Coordinated tax and investment planning',
      'Ongoing plan updates as your life changes',
    ],
    faqs: [
      {
        q: 'What does a comprehensive financial plan include?',
        a: "A comprehensive plan typically covers cash flow, net worth, investments, tax strategy, retirement projections, insurance review, estate planning, and education funding. It's a coordinated strategy — not a collection of separate products.",
      },
      {
        q: 'How is financial planning different from investment management?',
        a: "Investment management focuses on your portfolio. Financial planning is the bigger picture — it includes your investments but also your taxes, insurance, estate plan, retirement timing, and life goals. At Talley Wealth, we do both, and they're fully coordinated.",
      },
      {
        q: 'How often is my financial plan updated?',
        a: "We update your plan at least annually and whenever significant life events occur — a job change, inheritance, new baby, or market shift. Your plan is a living document, not a one-time deliverable.",
      },
      {
        q: 'Do I need a financial plan if I already have a CPA?',
        a: "A CPA typically handles tax preparation and compliance. A financial planner focuses on forward-looking strategy — how to reduce future taxes, optimize investments, and build toward your goals. The two roles complement each other, and at Talley Wealth, David holds both a CFP® and EA credential.",
      },
      {
        q: 'What should I bring to my first meeting?',
        a: "Nothing is required for the initial Explore Call — it's a casual conversation. If we decide to work together, we'll provide a checklist of documents like tax returns, account statements, and insurance policies. We make the process as simple as possible.",
      },
    ],
  },
  'retirement-planning': {
    name: 'Retirement Planning',
    slug: 'retirement-planning',
    shortName: 'Retirement Planning',
    icon: Clock,
    description: 'Retirement planning that gives you clarity on when you can retire, how much you can spend, and how to make your money last.',
    bulletPoints: [
      'Retirement income projections and gap analysis',
      'Social Security timing optimization',
      'Roth conversion strategies to reduce future taxes',
      'Required Minimum Distribution (RMD) planning',
      'Pension analysis and election guidance',
      'Healthcare cost planning before and after Medicare',
    ],
    faqs: [
      {
        q: 'When should I start planning for retirement?',
        a: "The earlier the better, but the decade between 55 and 65 is especially critical. That's when the biggest decisions happen — Social Security timing, Roth conversions, pension elections, and healthcare bridge strategies. If you're within 10 years of retirement, it's time to get serious about a plan.",
      },
      {
        q: 'How do I know if I have enough to retire?',
        a: "We build detailed retirement income projections that model your spending, income sources, taxes, and investment growth over a 30+ year horizon. The goal is to answer the question with data, not guesswork — and to stress-test the plan against different market and inflation scenarios.",
      },
      {
        q: 'What is a Roth conversion, and should I do one?',
        a: "A Roth conversion moves money from a pre-tax account (like a traditional IRA) to a Roth IRA, where it can grow tax-free. You pay taxes on the converted amount now, but future withdrawals are tax-free. Whether it makes sense depends on your current tax bracket, future income projections, and estate planning goals.",
      },
      {
        q: 'When should I take Social Security?',
        a: "You can claim Social Security as early as 62, but your benefit increases roughly 8% per year if you delay up to age 70. The right time depends on your health, other income sources, spousal benefits, and tax situation. We model multiple scenarios to help you find the optimal claiming strategy.",
      },
      {
        q: 'What happens to my healthcare between retirement and Medicare?',
        a: "If you retire before 65, you'll need to bridge the gap between employer coverage and Medicare. Options may include COBRA, marketplace plans, a spouse's employer plan, or health-sharing arrangements. We factor healthcare costs into every retirement plan we build.",
      },
    ],
  },
  'investment-management': {
    name: 'Investment Management',
    slug: 'investment-management',
    shortName: 'Investment Management',
    icon: BarChart3,
    description: 'Investment management built around the financial plan, tax situation, retirement timeline, and real-life tolerance for volatility.',
    bulletPoints: [
      'Portfolio design based on the job each account needs to do',
      'Risk calibration across time horizon and real-life volatility tolerance',
      'Active and passive implementation where each approach fits',
      'Tax-aware asset location, rebalancing, and withdrawal strategy',
      'Employer retirement plan review and coordination',
      'Behavioral coaching through normal market stress',
    ],
    faqs: [
      {
        q: 'Do you manage investment assets?',
        a: 'Yes. Talley Wealth provides investment management as part of a planning-first advisory relationship. The portfolio is coordinated with the financial plan, tax picture, retirement income needs, cash reserves, and the specific job each account is supposed to do.',
      },
      {
        q: 'What investment philosophy does Talley Wealth follow?',
        a: 'Planning decides the job. Tax context affects the tradeoffs. Investment discipline funds the life. We use a disciplined process focused on ownership, diversification, costs, taxes, risk, and the purpose of the money.',
      },
      {
        q: 'Do you use actively managed funds or index funds?',
        a: 'Both can have a place. We tend to prefer simple, low-cost exposure where markets are highly efficient, while being more open to active or specialist managers in areas where selectivity may matter more. The implementation should fit the client, the account type, and the role of the money.',
      },
      {
        q: 'How do you determine my risk tolerance?',
        a: 'We start with two filters: the time horizon for the money and the amount of volatility the client can realistically tolerate. A good portfolio should avoid reckless risk, but it should also avoid unnecessary under-risking when long-term money needs growth.',
      },
      {
        q: 'Can you manage my 401(k) at work?',
        a: "While we can't directly manage employer-sponsored plans, we can review your plan's investment options, recommend an allocation strategy, and coordinate your 401(k) with your other accounts.",
      },
    ],
  },
  'tax-planning': {
    name: 'Tax Planning',
    slug: 'proactive-tax-planning',
    shortName: 'Tax Planning',
    icon: Calculator,
    description: 'Proactive tax planning from a CFP® and Enrolled Agent who coordinates your tax return with your financial plan — so nothing falls through the cracks.',
    bulletPoints: [
      'Multi-year tax projection and bracket management',
      'Roth conversion analysis and execution',
      'Capital gains planning and harvesting',
      'Estimated tax payment optimization',
      'State tax planning (TN/VA cross-border)',
      'Tax return preparation coordinated with your financial plan',
    ],
    faqs: [
      {
        q: "What's the difference between tax preparation and tax planning?",
        a: "Tax preparation is backward-looking — it reports what happened last year. Tax planning is forward-looking — it identifies strategies to reduce your taxes in the current year and beyond. We do both, and they're coordinated with your overall financial plan.",
      },
      {
        q: 'What is an Enrolled Agent?',
        a: "An Enrolled Agent (EA) is a federally licensed tax practitioner authorized by the U.S. Treasury Department to represent taxpayers before the IRS. EAs must pass a comprehensive exam and complete ongoing education. It's the highest credential the IRS awards.",
      },
      {
        q: 'Can you help if I have multi-state income?',
        a: "Yes. We regularly work with clients who have income in both Tennessee and Virginia, or who have rental properties, business interests, or remote work arrangements in other states. Multi-state tax planning is one of our core competencies.",
      },
      {
        q: 'How does tax planning connect to my investments?',
        a: "Every investment decision has tax consequences — from which accounts to contribute to, to when to sell, to how to locate assets across taxable and tax-deferred accounts. By coordinating your tax return and investment strategy, we can identify opportunities that most advisors and most CPAs miss individually.",
      },
    ],
  },
  'entrepreneur-financial-planning': {
    name: 'Entrepreneur & Small Business Financial Planning',
    slug: 'entrepreneur-financial-planning',
    shortName: 'Business Planning',
    icon: Briefcase,
    description: 'Financial planning for business owners who need to coordinate their personal finances with their business strategy — from entity structure to exit planning.',
    bulletPoints: [
      'Business entity structure and tax optimization',
      'Owner compensation and retirement plan design',
      'Business valuation and exit planning',
      'Succession planning for family businesses',
      'Cash flow management between business and personal',
      'Buy-sell agreement coordination',
    ],
    faqs: [
      {
        q: 'Should my business be an LLC, S-Corp, or C-Corp?',
        a: "The right structure depends on your revenue, how you pay yourself, your self-employment tax exposure, and your long-term goals. An S-Corp election, for example, may reduce self-employment taxes for some business owners — but it also adds complexity. We can model the options for your specific situation.",
      },
      {
        q: 'What retirement plan is best for a small business owner?',
        a: "Options include SEP-IRAs, Solo 401(k)s, SIMPLE IRAs, and defined benefit plans. The right choice depends on your income level, number of employees, and how much you want to contribute. A Solo 401(k) or defined benefit plan may allow significantly higher contributions than a SEP-IRA in some cases.",
      },
      {
        q: 'When should I start planning my business exit?',
        a: "Ideally, 3-5 years before you want to exit. That gives you time to increase the business's value, structure the sale or transition tax-efficiently, and build personal wealth outside the business. Starting early could also give you more negotiating leverage and more options.",
      },
      {
        q: 'How do you coordinate with my business CPA?',
        a: "We work alongside your existing CPA and attorney — not in competition with them. We focus on forward-looking financial strategy while your CPA handles compliance and bookkeeping. Many of our business owner clients find that this coordination catches opportunities that fall between the cracks.",
      },
    ],
  },
};

export const serviceList = Object.values(services);
