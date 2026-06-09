export type RhythmSeason = {
  label: string;
  timing: string;
  meeting?: string;
  body: string;
  work: string[];
};

export type WatchItem = {
  title: string;
  body: string;
};

export type RhythmQuestion = {
  q: string;
  a: string;
};

export type OngoingRhythm = {
  slug: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  shortTitle: string;
  description: string;
  clientProblem: string;
  questionHeading: string;
  questionBody: string;
  primaryWork: string[];
  watchIntro: string;
  watchItems: WatchItem[];
  seasons: RhythmSeason[];
  proofPoints: string[];
  faqs: RhythmQuestion[];
};

const sharedSeasonLabels = {
  tax: 'Tax Season Review',
  priorities: 'Planning Priorities',
  implementation: 'Implementation & Alignment',
  yearEnd: 'Year-End Strategy',
};

export const ongoingRhythms: OngoingRhythm[] = [
  {
    slug: 'retirement',
    eyebrow: 'Retirement / Retirees',
    metaTitle: 'Ongoing Advisory for Retirement | Talley Wealth',
    metaDescription:
      'See how Talley Wealth keeps retirement income, taxes, investments, Medicare, Roth conversions, RMDs, and estate details coordinated year after year.',
    title: 'Ongoing advisory for retirement and already-retired households',
    shortTitle: 'Retirement / Retirees',
    description:
      'For households turning savings into income, with taxes, Medicare, investments, estate details, and surviving-spouse readiness kept in the same plan.',
    clientProblem:
      'Retirement is not one decision. It is a set of income, tax, healthcare, portfolio, and estate decisions that keep interacting after the retirement date has passed.',
    questionHeading: 'The questions we keep coming back to',
    questionBody:
      'Can the plan support the life you want, where should income come from this year, and are we making tax decisions while there is still time to choose?',
    primaryWork: [
      'Retirement income and withdrawal order',
      'Roth conversion, RMD, QCD, withholding, Medicare, and IRMAA planning',
      'Portfolio alignment for income needs and downside tolerance',
      'Estate organization, beneficiaries, key contacts, and surviving-spouse readiness',
    ],
    watchIntro:
      'The valuable work is often in the timing. A withdrawal, Roth conversion, charitable gift, or Medicare-income decision can look fine by itself and still create problems somewhere else.',
    watchItems: [
      {
        title: 'Income order',
        body: 'Which accounts should provide income, which should keep growing, and how the answer changes as tax years, markets, and cash needs change.',
      },
      {
        title: 'Tax windows',
        body: 'Roth conversions, capital gains, QCDs, RMDs, and withholding decisions that are easier to plan before the calendar closes.',
      },
      {
        title: 'Medicare and IRMAA',
        body: 'How income decisions can affect Medicare premiums, especially in years with Roth conversions, asset sales, or unusually high taxable income.',
      },
      {
        title: 'Continuity',
        body: 'Beneficiaries, estate documents, account organization, and the practical question of whether the plan still works if one spouse has to carry it alone.',
      },
    ],
    seasons: [
      {
        label: sharedSeasonLabels.tax,
        timing: 'February-April',
        body: 'Tax returns and prior-year income decisions show what needs attention before the next retirement-income year gets too far along.',
        work: [
          'Review tax return patterns, withholding, and taxable income sources',
          'Identify Roth conversion, capital gain, QCD, RMD, or Medicare-bracket issues',
          'Confirm cash needs and near-term withdrawal expectations',
        ],
      },
      {
        label: sharedSeasonLabels.priorities,
        timing: 'Spring / early summer',
        meeting: 'Annual Planning Meeting',
        body: 'The core annual meeting reconnects the numbers to the life they are meant to support and sets the planning priorities for the year.',
        work: [
          'Update income, spending, cash reserve, and withdrawal assumptions',
          'Review Social Security, pension, Medicare, RMD, and estate-document touchpoints',
          'Decide which actions should happen this year and which should wait',
        ],
      },
      {
        label: sharedSeasonLabels.implementation,
        timing: 'Summer-fall',
        body: 'Most of the useful work happens between meetings: paperwork, follow-up, analysis, coordination, and keeping decisions moving.',
        work: [
          'Implement portfolio, withdrawal, beneficiary, and account-organization changes',
          'Coordinate with tax, legal, insurance, or family contacts where needed',
          'Monitor cash flow, tax estimates, and life changes that affect the plan',
        ],
      },
      {
        label: sharedSeasonLabels.yearEnd,
        timing: 'October-December',
        meeting: 'Strategy Session',
        body: 'Year-end is where retirement planning often becomes tax planning. The goal is to act while there is still time.',
        work: [
          'Finalize Roth conversion, QCD, RMD, gain/loss, and withholding decisions',
          'Review Medicare/IRMAA exposure and next-year income expectations',
          'Confirm the action list before the calendar closes',
        ],
      },
    ],
    proofPoints: [
      'Income decisions do not get separated from tax decisions.',
      'Portfolio risk is reviewed in light of actual withdrawal needs.',
      'Estate and surviving-spouse readiness stay visible instead of becoming a one-time document review.',
    ],
    faqs: [
      {
        q: 'Do we really need to revisit the plan every year once we retire?',
        a: 'Usually, yes. Retirement is not one decision. Taxes, withdrawals, Social Security, Medicare, portfolio income, and estate details keep interacting, and small changes can matter more once you are living from the plan.',
      },
      {
        q: 'What if we are already retired?',
        a: 'That still fits. The work usually shifts from "Can we retire?" to "Are we taking income in the right order, managing taxes well, and keeping the plan organized if one spouse has to carry it alone?"',
      },
      {
        q: 'Do you look at Roth conversions every year?',
        a: 'We look at them when they may matter. Some years the answer is yes. Some years the tax cost is not worth it. The point is to decide before year-end, not after the opportunity is gone.',
      },
      {
        q: 'Is this mostly investment management?',
        a: 'No. Investments matter, but the bigger question is whether the portfolio, withdrawal plan, tax picture, cash needs, and estate details are working together.',
      },
      {
        q: 'What makes retirement planning different from normal investment advice?',
        a: 'Once paychecks stop, every withdrawal has a job. The question is not just what the portfolio earned. It is what needs to come out, where it should come from, what tax year it lands in, and how it affects the rest of the plan.',
      },
      {
        q: 'Do you help with Medicare and IRMAA planning?',
        a: 'Yes, where it connects to income planning. Medicare premiums can be affected by taxable income, so Roth conversions, capital gains, IRA withdrawals, and other decisions should not be made in isolation.',
      },
    ],
  },
  {
    slug: 'business-owners',
    eyebrow: 'Business Owners',
    metaTitle: 'Ongoing Advisory for Business Owners | Talley Wealth',
    metaDescription:
      'See how Talley Wealth helps business owners keep owner pay, taxes, retirement plans, cash flow, risk, and exit decisions connected year-round.',
    title: 'Ongoing advisory for business owners',
    shortTitle: 'Business Owners',
    description:
      'For owners whose business, tax return, household cash flow, retirement plan, and future exit decisions need to be handled together.',
    clientProblem:
      'The business is usually both the engine and the risk. Ongoing advisory is how the tax, cash-flow, retirement, investment, and exit decisions stop living in separate rooms.',
    questionHeading: 'The questions we keep coming back to',
    questionBody:
      'Is the business helping build personal wealth, are tax decisions being made early enough, and are we reducing dependence on the business over time?',
    primaryWork: [
      'Business and household cash-flow integration',
      'Owner compensation, entity, retirement plan, estimated tax, and deduction planning',
      'Risk, continuity, key-person, estate, and buy-sell coordination',
      'Succession, sale, exit, and personal wealth independence planning',
    ],
    watchIntro:
      'For owners, small decisions rarely stay small. Owner pay can affect retirement plan contributions. A strong profit year can create a tax problem. A future sale can shape what should be built years before a buyer appears.',
    watchItems: [
      {
        title: 'Owner pay and taxes',
        body: 'Compensation, distributions, estimated taxes, withholding, and entity-related decisions that should be reviewed before the year is already over.',
      },
      {
        title: 'Retirement plan design',
        body: 'Whether the company plan is supporting owner goals, employee needs, cash flow, tax planning, and the amount of complexity it creates.',
      },
      {
        title: 'Personal wealth outside the business',
        body: 'How much of the family plan depends on the business and what should be built outside it for flexibility, retirement, and resilience.',
      },
      {
        title: 'Continuity and exit',
        body: 'Succession, insurance, buy-sell, estate, key-person, and sale-readiness issues that are easier to improve before they become urgent.',
      },
    ],
    seasons: [
      {
        label: sharedSeasonLabels.tax,
        timing: 'February-April',
        body: 'Tax season shows whether owner pay, estimated taxes, deductions, retirement contributions, and entity decisions are working together.',
        work: [
          'Review business and personal tax patterns from the prior year',
          'Identify owner compensation, estimated tax, and retirement-plan issues',
          'Flag entity, deduction, QBI, or CPA coordination items while the year is still young',
        ],
      },
      {
        label: sharedSeasonLabels.priorities,
        timing: 'Spring / early summer',
        meeting: 'Annual Planning Meeting',
        body: 'The core annual meeting connects business performance to the household plan and decides which owner decisions deserve attention this year.',
        work: [
          'Review business cash flow, household cash flow, owner pay, and reserves',
          'Update personal wealth, investment, retirement, insurance, and estate priorities',
          'Decide whether exit, succession, continuity, or risk planning needs to move forward',
        ],
      },
      {
        label: sharedSeasonLabels.implementation,
        timing: 'Summer-fall',
        body: 'This is where planning turns into action without requiring everything to become a meeting.',
        work: [
          'Coordinate retirement plan, tax projection, insurance, estate, or entity follow-up',
          'Implement portfolio and cash-flow decisions that reflect business risk',
          'Track open items with CPA, attorney, payroll, benefits, or insurance professionals',
        ],
      },
      {
        label: sharedSeasonLabels.yearEnd,
        timing: 'October-December',
        meeting: 'Strategy Session',
        body: 'The Strategy Session keeps tax and business decisions connected before the calendar closes.',
        work: [
          'Finalize estimated tax, withholding, retirement-plan, and deduction decisions',
          'Review year-end profit, owner pay, cash reserves, and next-year expectations',
          'Identify any time-sensitive business or personal planning actions',
        ],
      },
    ],
    proofPoints: [
      'The business is treated as both an asset and a source of risk.',
      'Tax planning happens before the year is over.',
      'Personal wealth does not depend entirely on a future sale.',
    ],
    faqs: [
      {
        q: 'How is this different for business owners?',
        a: 'The business is usually both the engine and the risk. We look at owner pay, taxes, retirement plans, cash reserves, household goals, insurance, and eventual exit planning together instead of treating the business and personal plan separately.',
      },
      {
        q: 'Do you coordinate with my CPA?',
        a: 'If you have an outside CPA, yes, when it helps. If Talley is also handling the tax work, that coordination is built into the relationship instead of being a separate handoff.',
      },
      {
        q: 'What if I am not planning to sell my business soon?',
        a: 'That is fine. Exit planning is not only about selling. It is also about reducing dependence on the business, building personal wealth outside it, and making sure the business could handle disruption.',
      },
      {
        q: 'Why is year-end such a big deal?',
        a: 'Because a lot of owner decisions have deadlines. Compensation, retirement plan funding, deductions, estimated taxes, and entity-related decisions are much easier to plan before the year closes.',
      },
      {
        q: 'Can you help me figure out how much to pay myself?',
        a: 'Yes, as part of the broader picture. Owner pay affects taxes, retirement plan contributions, cash flow, and sometimes lending or benefit decisions. It should not be decided only by whatever cash happens to be available.',
      },
      {
        q: 'What makes this different from just having a CPA?',
        a: 'A good CPA is important. The difference is that ongoing advisory should connect the tax return to the household plan, investments, risk, retirement, estate issues, and business decisions that need to happen before the return is filed.',
      },
    ],
  },
  {
    slug: 'high-earners',
    eyebrow: 'High Earners / Accumulators',
    metaTitle: 'Ongoing Advisory for High Earners | Talley Wealth',
    metaDescription:
      'See how Talley Wealth helps high earners coordinate tax planning, benefits, equity compensation, HSA and 529 decisions, insurance, cash flow, and investments.',
    title: 'Ongoing advisory for high earners and accumulators',
    shortTitle: 'High Earners / Accumulators',
    description:
      'For households with strong income and enough moving parts that taxes, benefits, equity compensation, savings, insurance, and family goals need one system.',
    clientProblem:
      'High income helps, but it does not automatically become wealth. The planning work is making sure taxes, spending, benefits, equity, insurance, and family priorities are not quietly pulling in different directions.',
    questionHeading: 'The questions we keep coming back to',
    questionBody:
      'Is your income actually building wealth, are the benefits and tax moves being used well, and are the big family decisions getting a place in the plan?',
    primaryWork: [
      'Savings rate, cash flow, liquidity, debt, and what to do with extra cash',
      'Tax planning around income, withholding, backdoor Roth, charitable giving, and equity compensation',
      'Benefits, open enrollment, HSA/FSA, insurance, and family protection',
      'College, estate basics, investment allocation, and major life-goal funding',
    ],
    watchIntro:
      'The issue is rarely one account. It is the number of decisions competing for attention: bonuses, RSUs, benefits, college, insurance, tax withholding, cash reserves, and what to do with money after the obvious bills are paid.',
    watchItems: [
      {
        title: 'Tax-efficient saving',
        body: 'Pre-tax, Roth, backdoor Roth, taxable investing, HSA, 529, charitable, and cash-reserve choices reviewed as one funding order.',
      },
      {
        title: 'Equity and bonus income',
        body: 'RSUs, options, ESPP, bonuses, withholding, concentration risk, and cash-flow decisions that should not be handled one grant at a time.',
      },
      {
        title: 'Benefits and insurance',
        body: 'Open enrollment, HSA/FSA choices, disability coverage, life insurance, umbrella coverage, and other benefits that can have real planning impact.',
      },
      {
        title: 'Family priorities',
        body: 'College, estate basics, major purchases, career changes, and the tradeoffs that come with building wealth while life is still very full.',
      },
    ],
    seasons: [
      {
        label: sharedSeasonLabels.tax,
        timing: 'February-April',
        body: 'Tax season highlights whether strong income is being organized well or leaking through avoidable tax drag and scattered decisions.',
        work: [
          'Review withholding, estimated taxes, bonuses, equity income, and deduction patterns',
          'Identify savings, backdoor Roth, charitable, HSA/FSA, or tax-bracket planning items',
          'Update cash-flow assumptions after the prior year is clear',
        ],
      },
      {
        label: sharedSeasonLabels.priorities,
        timing: 'Spring / early summer',
        meeting: 'Annual Planning Meeting',
        body: 'The core annual meeting turns strong income into a prioritized plan instead of a list of disconnected accounts and benefits.',
        work: [
          'Set the savings, investment, cash-reserve, debt, and major-goal priorities',
          'Review benefits, insurance, college, estate basics, and career changes',
          'Decide which tax and investment moves should happen this year',
        ],
      },
      {
        label: sharedSeasonLabels.implementation,
        timing: 'Summer-fall',
        body: 'The middle of the year is where the team keeps the plan moving while clients stay focused on work and family.',
        work: [
          'Implement investment, savings, account, insurance, and benefit decisions',
          'Coordinate equity, bonus, deferred-compensation, or extra-cash analysis',
          'Track open planning items without turning every item into a separate meeting',
        ],
      },
      {
        label: sharedSeasonLabels.yearEnd,
        timing: 'October-December',
        meeting: 'Strategy Session',
        body: 'Year-end keeps high-income decisions from becoming April surprises.',
        work: [
          'Finalize withholding, estimated tax, equity, charitable, and retirement-plan decisions',
          'Review open enrollment, benefits, HSA/FSA, insurance, and next-year cash flow',
          'Confirm remaining deadlines and next-year priorities',
        ],
      },
    ],
    proofPoints: [
      'High income gets translated into a plan, not just a larger account balance.',
      'Benefits, tax, investment, and cash decisions are reviewed together.',
      'The work is structured to reduce financial admin, not add to it.',
    ],
    faqs: [
      {
        q: 'If we have a strong income, why do we need this much planning?',
        a: 'High income helps, but it does not automatically become wealth. Taxes, spending, benefits, equity compensation, college, insurance, and cash decisions can quietly pull in different directions.',
      },
      {
        q: 'Do you help with benefits and open enrollment?',
        a: 'Yes, when it matters. Health plans, HSAs, disability coverage, life insurance, deferred comp, and other benefits can have real planning impact, especially for high-income households.',
      },
      {
        q: 'What if most of our complexity is stock compensation?',
        a: 'Then the planning needs to account for concentration risk, taxes, timing, cash flow, and how much of your future is already tied to your employer. The answer is rarely just "sell" or "hold."',
      },
      {
        q: 'Is this just for executives?',
        a: 'No. Executives are one example. The broader fit is households with strong income and enough moving parts that tax, savings, benefits, investments, and family priorities need to be coordinated.',
      },
      {
        q: 'What does tax planning look like for high earners?',
        a: 'It usually starts with making sure the obvious pieces are not being missed: withholding, retirement contributions, Roth or backdoor Roth options, HSA/FSA choices, charitable giving, equity comp, and the timing of income or deductions where there is flexibility.',
      },
      {
        q: 'How often should we revisit the plan?',
        a: 'At least annually, and usually again before year-end if there are tax, benefit, equity, or cash-flow decisions with deadlines. The goal is not more meetings. The goal is fewer things drifting until they become urgent.',
      },
    ],
  },
];

export const ongoingRhythmPaths = ongoingRhythms.map((rhythm) => `/how-we-work/ongoing-advisory/${rhythm.slug}`);

export const seasonOrder = [
  sharedSeasonLabels.tax,
  sharedSeasonLabels.priorities,
  sharedSeasonLabels.implementation,
  sharedSeasonLabels.yearEnd,
];

export function getOngoingRhythm(slug: string) {
  return ongoingRhythms.find((rhythm) => rhythm.slug === slug);
}
