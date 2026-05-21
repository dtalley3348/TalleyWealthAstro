import { Stethoscope, DollarSign, Clock, Briefcase, Factory, HeartPulse, TrendingUp, Shield, Calculator, Users } from 'lucide-react';
import type { PersonaData } from './types';

export const personas: Record<string, PersonaData> = {
  'doctors': {
    name: 'Doctors & Physicians',
    slug: 'doctors',
    label: 'For Physicians',
    heroTitle: 'Financial Planning Built for Doctors',
    heroDescription: "You spent a decade learning medicine. Your financial advisor should spend just as much time understanding your unique situation — from student loans to practice ownership to retirement.",
    problemTitle: 'Why Doctors Need Specialized Planning',
    problemDescription: "Physicians earn well — but they also face financial complexity that most advisors aren't equipped to handle. A late career start, massive student debt, high tax liability, and limited time to manage it all creates a perfect storm.",
    problemDetail: "At Talley Wealth, we work with physicians and healthcare professionals across the Tri-Cities. We understand the rhythms of your career - from residency to attending to potential practice ownership - and we build plans that evolve with you.",
    bulletPoints: [
      'Student loan repayment strategy (PSLF, refinancing, or aggressive payoff)',
      'High W-2 income with limited tax deductions',
      'Choosing between employer plans, backdoor Roth, and deferred comp',
      'Disability & life insurance structured for physician incomes',
      'Practice buy-in or buy-out planning',
      'Burnout-proofing: building freedom into your financial plan',
    ],
    differentiators: [
      {
        icon: DollarSign,
        title: 'Tax + Investment Coordination',
        desc: 'As a CFP® and Enrolled Agent, we coordinate your tax return and investment strategy together — so nothing falls through the cracks.',
      },
      {
        icon: Stethoscope,
        title: 'Career-Stage Planning',
        desc: "Whether you're finishing residency or five years from retirement, your plan should match where you are right now.",
      },
      {
        icon: Clock,
        title: 'Respect for Your Time',
        desc: 'We handle the complexity so you can focus on patients. Clear recommendations, minimal meetings, maximum impact.',
      },
    ],
    ctaTitle: 'Ready to Get Your Finances in Order?',
    ctaDescription: "Schedule a free 15-minute Explore Call. No preparation needed — just an honest conversation about where you are and where you want to be.",
    metaTitle: 'Financial Advisor for Doctors & Physicians | Talley Wealth',
    metaDescription: 'Financial planning built for physicians. Talley Wealth helps doctors in the Tri-Cities navigate student loans, tax planning, practice transitions, and retirement — with a CFP® and Enrolled Agent on your side.',
    faqs: [
      {
        q: 'Should I pursue Public Service Loan Forgiveness (PSLF) or pay off my loans aggressively?',
        a: "It depends on your employer, loan balance, income trajectory, and filing status. If you work for a qualifying nonprofit employer, PSLF could forgive a significant balance after 120 qualifying payments. But if your loans are manageable relative to your income, aggressive payoff might save you more in total interest. We model both scenarios.",
      },
      {
        q: "What is a 'backdoor Roth IRA' and should I use one?",
        a: "A backdoor Roth IRA is a strategy where high-income earners contribute to a traditional IRA and then convert it to a Roth IRA, bypassing the Roth income limits. It's a common tool for physicians, but it requires careful execution to avoid unexpected tax consequences — especially if you have existing traditional IRA balances.",
      },
      {
        q: 'How do I protect my income if I become disabled?',
        a: "Own-occupation disability insurance is critical for physicians. It pays benefits if you can't perform the duties of your specific medical specialty — even if you could work in another field. Group policies from employers often have limitations, so we typically recommend supplementing with an individual policy.",
      },
      {
        q: 'When should a doctor start working with a financial advisor?',
        a: "The earlier the better — ideally during residency or fellowship, when foundational decisions about loans, benefits, and savings habits are being made. But if you're already an attending, it's never too late. The complexity only increases with income, and a good plan can help you catch up quickly.",
      },
      {
        q: 'Can you help with physician contract negotiations?',
        a: "We can review the financial components of a physician contract — compensation structure, benefits, retirement plan contributions, malpractice coverage, and non-compete clauses — to help you understand the full economic value. For legal review, we'd coordinate with a healthcare attorney.",
      },
    ],
    scenario: {
      title: 'A New Attending Physician Balancing Loans, Taxes, and Saving',
      situation: "A 34-year-old physician just completed residency and started as an attending, earning significantly more than during training. They carry substantial student loan debt, are unsure whether to pursue PSLF or refinance, and haven't started saving meaningfully for retirement. Their spouse stays home with two young children.",
      approach: "We might begin by analyzing the PSLF pathway — confirming employer qualification, verifying the repayment plan, and projecting the forgiveness timeline. Simultaneously, we'd optimize their tax withholdings for their new income level, set up retirement contributions to maximize their 403(b) and a backdoor Roth IRA, and put appropriate disability and life insurance in place. The key would be building a system that works automatically so the physician can focus on medicine, not money management.",
    },
  },
  'business-owners': {
    name: 'Business Owners',
    slug: 'business-owners',
    label: 'For Business Owners',
    heroTitle: 'When the business is working, the money decisions get bigger.',
    heroDescription: "Most business owners do not first reach out because they want a generic financial plan. They reach out because the business is working, the tax bill feels out of hand, and they know there has to be a smarter way to make decisions.",
    heroImage: '/brands/talley-wealth/david-whiteboard-strategy.jpg',
    heroImageAlt: 'David Talley explaining financial planning strategy at a whiteboard',
    heroImagePosition: 'center 34%',
    recognitionTitle: 'Success creates a different kind of financial pressure.',
    recognitionIntro: 'Business owners tend to look for solutions, not just problems. This page is for the owner who wants someone at the table who can think across tax, planning, investments, cash flow, and the business itself.',
    recognitionCards: [
      {
        title: 'The tax bill feels wrong',
        body: 'You are making more money, writing bigger checks, and wondering whether other owners with similar income are somehow playing the game better.',
      },
      {
        title: 'You want a strategist, not a one-off task',
        body: 'You may start by looking for tax strategy, but what you really want is a person who notices financial opportunities and threats before they become urgent.',
      },
      {
        title: 'The business and personal sides overlap',
        body: 'Owner pay, retirement plans, cash reserves, entity decisions, estimated taxes, investments, and eventual exit planning all touch each other.',
      },
    ],
    problemTitle: 'Taxes may start the conversation. The real work goes wider.',
    problemDescription: "A business owner may come in asking for tax strategy, an entity review, or a better retirement plan. Those may be exactly the right issues to discuss. But the best work usually happens when those questions are connected to the owner's full financial life.",
    problemDetail: "Talley Wealth helps Tri-Cities business owners build a more coordinated plan around the business and the family. That means tax planning before the year is over, investment decisions that reflect business risk, retirement planning that does not depend entirely on a future sale, and a clear process for decisions that used to live only in the owner's head.",
    bulletPoints: [
      'Proactive tax strategy before the year is already over',
      'Owner compensation strategy, salary, distributions, and estimated taxes',
      'Retirement plan design, including Solo 401(k), SEP IRA, cash balance, and defined benefit options',
      'Entity structure review coordinated with your CPA and attorney',
      'Building personal wealth outside the business',
      'Exit, succession, and buy-sell planning before a transaction forces the issue',
    ],
    differentiators: [
      {
        icon: Briefcase,
        title: 'Business + Personal Integration',
        desc: "The business is not separate from your personal plan. We look at owner income, taxes, investments, retirement, cash flow, risk, and exit planning together.",
      },
      {
        icon: Calculator,
        title: 'Tax Strategy Before Tax Season',
        desc: "Tax planning has to happen while there is still time to act. We look for the legal strategies, timing decisions, and planning levers that fit your actual business.",
      },
      {
        icon: TrendingUp,
        title: 'Someone Who Speaks Entrepreneur',
        desc: "Owners think differently. They move fast, solve problems, and carry risks other people do not always see. The planning has to respect that reality.",
      },
    ],
    ctaTitle: 'Bring the business question. We will look at the whole picture.',
    ctaDescription: "Schedule a 15-minute Explore Call. We will talk about what is happening in the business, what feels unresolved, and whether Keystone is the right way to coordinate the tax and planning work.",
    metaTitle: 'Financial Advisor for Business Owners | Talley Wealth',
    metaDescription: 'Tax strategy and financial planning for business owners in the Tri-Cities. Talley Wealth helps coordinate owner compensation, retirement plan design, entity decisions, exit planning, and personal wealth.',
    faqs: [
      {
        q: 'How do I know if I should switch from an LLC to an S-Corp?',
        a: "An S-Corp election may reduce self-employment taxes if your business generates consistent profits above a reasonable salary. However, it adds payroll complexity and compliance requirements. We model the actual tax savings for your specific revenue and compensation to see if the switch makes sense.",
      },
      {
        q: 'How much should I pay myself as a business owner?',
        a: "The IRS requires S-Corp owners to take a 'reasonable salary' before taking distributions. Too low, and you risk an audit. Too high, and you're paying unnecessary payroll taxes. We help you find the right balance based on your industry, revenue, and role in the business.",
      },
      {
        q: 'What is a buy-sell agreement and do I need one?',
        a: "A buy-sell agreement outlines what happens to your ownership stake if you die, become disabled, or want to leave the business. It protects your family and your business partners. If you have a partner or co-owner, a properly funded buy-sell agreement is essential.",
      },
      {
        q: 'Can I use my business to fund my retirement?',
        a: "Yes — and the right retirement plan can be one of the most powerful tax tools available to business owners. Depending on your situation, a Solo 401(k) or defined benefit plan may allow you to contribute significantly more than a standard IRA, potentially reducing your taxable income substantially.",
      },
      {
        q: 'How do I start planning my business exit?',
        a: "Start by understanding your business's current value, identifying potential buyers (internal or external), and building personal wealth outside the business. We recommend starting 3-5 years before your target exit date so you have time to maximize value and structure the transition tax-efficiently.",
      },
    ],
    scenario: {
      title: 'A profitable owner whose tax bill finally got their attention',
      situation: "A Tri-Cities business owner has moved past survival mode. Revenue and profit are up, employees are on payroll, and the owner is used to writing large checks. But the tax bill now feels out of hand, and they suspect there are strategies other successful owners are using that they have not been shown.",
      approach: "We might start by reviewing the business tax picture, owner compensation, retirement plan options, entity structure, cash flow, estimated taxes, and the personal balance sheet. Then we would identify which moves are actually relevant, coordinate with the CPA or attorney where needed, and build the personal plan around the reality that the business is both an asset and a source of risk.",
    },
  },
  'inherited-wealth': {
    name: 'Inherited Wealth',
    slug: 'inherited-wealth',
    label: 'For Inherited Wealth',
    heroTitle: 'Inherited money can change the picture. The next decisions matter.',
    heroDescription: 'An inheritance can open new possibilities. It can also put tax, investment, estate, and family decisions in front of you before you feel ready for them.',
    heroImage: '/brands/talley-wealth/stephenee-client-conversation.jpg',
    heroImageAlt: 'Talley Wealth team members in conversation at the office',
    heroImagePosition: 'center center',
    recognitionTitle: 'New money can create immediate responsibility.',
    recognitionIntro: 'This page is for someone who has received money, expects to receive money, or has suddenly become the person helping an aging parent make financial decisions.',
    recognitionCards: [
      {
        title: 'You do not want to make a permanent mistake',
        body: 'The accounts, tax forms, investment choices, estate documents, and family questions may all arrive at once. You want to be careful without becoming frozen.',
      },
      {
        title: 'You need a fresh view of what is possible',
        body: 'A meaningful inheritance is not just a bigger account balance. It can change retirement timing, work decisions, giving, housing, family support, and long-term security.',
      },
      {
        title: 'You may be handling this for a parent',
        body: 'Sometimes the real issue is not inherited money yet. It is becoming power of attorney, coordinating accounts, and replacing an old advisory relationship that no longer fits.',
      },
    ],
    problemTitle: 'The portfolio can wait until the plan is clear.',
    problemDescription: "Most people assume the job is to find a good portfolio. That matters, but inherited wealth usually needs a planning sequence first: what has to be done now, what can wait, what is taxable, what belongs in the estate plan, and what this money actually changes.",
    problemDetail: "Talley Wealth helps families slow the decision down enough to make the right first moves. We look at account types, beneficiary rules, inherited IRA timelines, cash needs, tax brackets, estate documents, existing investments, and the life options the inheritance may create.",
    bulletPoints: [
      'Inherited IRA and beneficiary account distribution rules',
      'Tax planning around inherited assets, basis, income, and timing',
      'Investment allocation after a lump sum or account transfer',
      'Estate document review and coordination with an attorney',
      'Planning for retirement, work, housing, giving, or family support after the inheritance',
      'Power of attorney and aging-parent financial coordination',
    ],
    differentiators: [
      {
        icon: Shield,
        title: 'Careful First Moves',
        desc: 'Inherited wealth often comes with emotion and urgency. We separate what must happen now from what should wait until the full picture is clear.',
      },
      {
        icon: Calculator,
        title: 'Tax + Account Sequencing',
        desc: 'Inherited IRAs, taxable accounts, real estate, cash, and insurance proceeds are not treated the same. The tax treatment drives the order of decisions.',
      },
      {
        icon: Users,
        title: 'Family Context',
        desc: 'This work often touches parents, siblings, spouses, adult children, attorneys, and old advisor relationships. The plan has to respect the family reality.',
      },
    ],
    ctaTitle: 'Before you make the next move, get oriented.',
    ctaDescription: 'Schedule a 15-minute Explore Call. We will talk about what changed, what decisions are already in front of you, and whether Keystone is the right way to organize the next steps.',
    metaTitle: 'Financial Advisor for Inherited Wealth | Talley Wealth',
    metaDescription: 'Financial planning for inherited wealth, inherited IRAs, family money, and aging-parent decisions. Talley Wealth helps coordinate tax, investment, estate, and retirement decisions.',
    faqs: [
      {
        q: 'What should I do first after receiving an inheritance?',
        a: 'Start by identifying what type of assets you inherited and which deadlines apply. Cash, taxable accounts, inherited IRAs, real estate, and insurance proceeds all have different tax and planning rules. We usually recommend slowing down major decisions until the full picture is organized.',
      },
      {
        q: 'How are inherited IRAs taxed?',
        a: 'Most non-spouse beneficiaries have to distribute an inherited IRA within a required timeline, and distributions are generally taxable as ordinary income. The best withdrawal pattern depends on your income, tax bracket, age, goals, and the rest of the inherited assets.',
      },
      {
        q: 'Should inherited money be invested right away?',
        a: 'Not always. Some money may need to stay liquid while estate administration, taxes, cash needs, and family decisions are sorted out. Once the planning picture is clear, the investment approach should match the role that money now plays in your life.',
      },
      {
        q: 'Can you help if I am power of attorney for a parent?',
        a: 'Yes. We can help organize accounts, clarify income needs, review the investment structure, coordinate with tax and estate professionals, and make the ongoing decision process more manageable for the family member handling the responsibility.',
      },
    ],
    scenario: {
      title: 'A family inheritance that changed what retirement could look like',
      situation: 'Someone receives a meaningful inheritance after a parent passes away. They already had savings and a retirement goal, but the inheritance makes the old plan feel outdated. They are unsure how to invest it, how the inherited IRA rules work, what to keep in cash, and whether this changes when they can retire.',
      approach: 'We might begin by separating assets by tax treatment and deadline, then model how the inheritance changes retirement timing, income needs, taxes, charitable giving, estate documents, and investment allocation. The goal would be to avoid rushed decisions and turn the new money into a coordinated plan.',
    },
  },
  'executives-equity-comp': {
    name: 'Executives & Equity Comp Professionals',
    slug: 'executives-equity-comp',
    label: 'For Equity Comp',
    heroTitle: 'Equity compensation can make good income feel complicated.',
    heroDescription: 'RSUs, stock options, deferred comp, bonuses, and concentrated company stock can create tax and timing decisions that should not be handled one grant at a time.',
    heroImage: '/brands/talley-wealth/david-stephenee-window.jpg',
    heroImageAlt: 'David Talley and Stephenee Carberry reviewing planning work at the Talley Wealth office',
    heroImagePosition: 'center center',
    recognitionTitle: 'This is not just a diversify-or-hold decision.',
    recognitionIntro: 'This page is for the executive or professional whose compensation has become more complicated than a paycheck and a 401(k).',
    recognitionCards: [
      {
        title: 'Vesting is creating a tax question',
        body: 'RSUs, options, bonuses, or deferred comp are about to hit income, and you want to know what can be planned before the tax bill is already baked in.',
      },
      {
        title: 'Concentration is not a generic decision',
        body: 'You may know people who held company stock and did very well. You may also know concentration can go badly. The right answer needs to be personal, not automatic.',
      },
      {
        title: 'You want planning before asset management',
        body: 'You may not be looking to hand over every account. You want a tax strategist and financial planner who can help decide what should happen first.',
      },
    ],
    problemTitle: 'Equity decisions need context.',
    problemDescription: 'The usual advice is to diversify. Often that is right. Sometimes it is incomplete. A better process looks at grant type, vesting schedule, tax bracket, AMT exposure, cash needs, career risk, company risk, retirement goals, and the rest of the portfolio.',
    problemDetail: 'Talley Wealth helps executives and professionals coordinate equity compensation with the broader plan. That can include tax projections, vesting calendars, sale plans, diversification frameworks, withholding review, charitable strategy, retirement contributions, and investment allocation.',
    bulletPoints: [
      'RSU vesting, withholding, and sale planning',
      'ISO, NSO, and ESPP tax coordination',
      'AMT exposure and exercise timing analysis',
      'Concentrated stock diversification frameworks',
      'Deferred compensation election and distribution planning',
      'Bonus, withholding, estimated tax, and cash-flow coordination',
      'Investment management that reflects career and company-stock risk',
    ],
    differentiators: [
      {
        icon: TrendingUp,
        title: 'Nuance Around Concentration',
        desc: 'We do not pretend every concentrated position has the same answer. We build a decision framework around your risk, upside, taxes, and goals.',
      },
      {
        icon: Calculator,
        title: 'Tax Modeling Before the Event',
        desc: 'The useful planning happens before vesting, exercise, sale, or deferral deadlines. We model the tax effect while there is still time to choose.',
      },
      {
        icon: Briefcase,
        title: 'Planning First',
        desc: 'Keystone gives you a planning engagement before any ongoing investment relationship, so equity decisions are not reduced to a sales conversation.',
      },
    ],
    ctaTitle: 'Make the next vesting date part of a plan.',
    ctaDescription: 'Schedule a 15-minute Explore Call. We will talk through the equity decisions coming up, what feels unresolved, and whether Keystone is the right place to map the choices.',
    metaTitle: 'Financial Advisor for Executives with Equity Compensation | Talley Wealth',
    metaDescription: 'Financial planning for executives and professionals with RSUs, stock options, deferred compensation, bonuses, and concentrated company stock.',
    faqs: [
      {
        q: 'Should I sell RSUs as soon as they vest?',
        a: 'Many people should consider selling at vesting because RSUs are taxed as ordinary income when they vest and holding them afterward is similar to choosing to buy more company stock. But the right answer depends on your company exposure, tax picture, cash needs, and goals.',
      },
      {
        q: 'How do I decide whether to exercise stock options?',
        a: 'The decision depends on option type, strike price, expiration date, current value, AMT exposure, cash required, expected holding period, and how much of your net worth is already tied to the company. We model those trade-offs before action.',
      },
      {
        q: 'Can you help if I only want planning around my equity comp?',
        a: 'Yes. Keystone is a planning engagement first. If ongoing investment management makes sense later, that can be discussed after the planning is real, but the equity comp work does not have to begin as an asset transfer conversation.',
      },
      {
        q: 'What if I believe strongly in my company stock?',
        a: 'That belief matters, but it should be tested against the rest of your financial life. We help define how much concentration is intentional, how much is accidental, and what would need to be true to keep, sell, hedge, or diversify over time.',
      },
    ],
    scenario: {
      title: 'An executive with RSUs vesting and no clear sale plan',
      situation: 'An executive has several RSU vesting dates coming up, a large bonus year, and a growing amount of net worth tied to one company. They are not opposed to diversifying, but they also do not want a generic answer that ignores upside, career trajectory, or taxes.',
      approach: 'We might build a vesting calendar, tax projection, withholding review, and concentration map. Then we would compare sale rules, diversification targets, estimated tax needs, retirement contributions, and reinvestment options so each vesting event fits the larger plan.',
    },
  },
  'eastman-employees': {
    name: 'Kingsport Employer-Benefit Planning',
    slug: 'kingsport-employer-benefits',
    label: 'For Kingsport Professionals',
    heroTitle: 'Employer benefits can be valuable. The choices still need a plan.',
    heroDescription: "For many Kingsport families, a long career at a major local employer can shape retirement timing, taxes, investments, healthcare, and family decisions. The planning should respect that bigger picture.",
    heroImage: '/brands/talley-wealth/cities/kingsport-eastman.jpg',
    heroImageAlt: 'Kingsport, Tennessee',
    heroImagePosition: 'center center',
    employerDisclosure: 'Talley Wealth is an independent firm and is not affiliated with, endorsed by, or sponsored by Eastman Chemical Company or any employer mentioned on this page.',
    recognitionTitle: 'The benefits are only useful if the choices fit your life.',
    recognitionIntro: 'This page is for Kingsport-area employees and retirees who want pension, 401(k), tax, investment, and retirement timing decisions modeled together instead of handled one form at a time.',
    recognitionCards: [
      {
        title: 'Retirement timing is getting real',
        body: 'You may be trying to understand what working another year actually changes, how pension or retirement benefits fit, and whether the plan works outside the paycheck.',
      },
      {
        title: 'The benefit choices feel too important to guess on',
        body: 'Pension elections, 401(k) allocation, deferred comp, stock, healthcare, and tax timing can all affect the same retirement picture.',
      },
      {
        title: 'You want local context, not generic benefits advice',
        body: 'Major employers have shaped Kingsport families for generations. Planning around that kind of career should feel grounded in the way people actually live here.',
      },
    ],
    problemTitle: 'Good benefits still need good coordination.',
    problemDescription: "A strong benefits package can still leave you with hard questions. The issue is usually not whether a benefit is good. It is when to use it, how it affects taxes, how it changes retirement timing, and how it fits with the rest of the plan.",
    problemDetail: "Talley Wealth helps Kingsport and Tri-Cities families coordinate employer benefits with retirement planning, tax strategy, investment management, and estate decisions. If your career involved a major local employer, the benefit package should be treated as part of the broader financial picture, not a separate checklist.",
    bulletPoints: [
      'Retirement timing and employer-benefit coordination',
      'Pension, lump sum, or income-election analysis when available',
      '401(k) allocation, rollover, and withdrawal planning',
      'Deferred compensation and stock-compensation tax planning when applicable',
      'Healthcare, Medicare, and tax-bracket planning around retirement',
      'Investment management that accounts for career, benefit, and company exposure',
    ],
    differentiators: [
      {
        icon: Factory,
        title: 'Kingsport Context',
        desc: "Long careers with major local employers are woven into Kingsport family life. We bring local context to decisions that otherwise get reduced to generic benefit language.",
      },
      {
        icon: Calculator,
        title: 'Tax-Aware Benefit Decisions',
        desc: "Benefit elections can affect taxable income, Medicare brackets, withdrawal order, and retirement timing. We model those choices together.",
      },
      {
        icon: Clock,
        title: 'Retirement Timing',
        desc: "A benefit decision is rarely just a benefit decision. It needs to connect to when you want to stop working and what happens next.",
      },
    ],
    ctaTitle: 'Get clear before the next benefit decision.',
    ctaDescription: "Schedule a 15-minute Explore Call. We will talk about the decision in front of you and whether Keystone is the right way to build the full retirement and benefits picture.",
    metaTitle: 'Financial Planning for Kingsport Employer Benefits | Talley Wealth',
    metaDescription: 'Financial planning for Kingsport professionals and retirees with employer-benefit decisions. Talley Wealth helps coordinate retirement timing, taxes, investments, and benefit choices.',
    faqs: [
      {
        q: 'Can you help me decide when I can retire from a major Kingsport employer?',
        a: "We can help model retirement timing by looking at income sources, employer benefits, investment accounts, taxes, healthcare, Social Security, and the spending you want retirement to support. The goal is not just a date, but understanding what changes if you work longer or retire sooner.",
      },
      {
        q: 'How should I think about a pension or lump-sum decision?',
        a: "The right choice depends on the specific options available, your other income sources, health, spouse or survivor needs, tax picture, investment risk, and desire for flexibility. We compare the decision inside the full retirement plan rather than looking at the election in isolation.",
      },
      {
        q: 'Should I roll over my 401(k) when I retire?',
        a: "Sometimes a rollover makes coordination easier. Sometimes staying in the plan may be reasonable. The decision depends on investment options, fees, withdrawal needs, tax strategy, creditor protection, and how the account fits with the rest of your plan.",
      },
      {
        q: 'How do taxes affect the retirement decision?',
        a: "Taxes can affect when you retire, which accounts you draw from first, whether Roth conversions make sense, how Social Security is taxed, and whether Medicare premium brackets become an issue. Those decisions are best modeled before the year is already over.",
      },
      {
        q: 'Is this only for people right at retirement?',
        a: "No, but the closer retirement gets, the more useful the work usually becomes. Mid-career employees may still benefit when compensation, taxes, stock, deferred compensation, or major family decisions make the planning more complex.",
      },
    ],
    scenario: {
      title: 'A Kingsport family trying to turn benefits into a retirement date',
      situation: "A long-tenured employee at a major Kingsport employer is close enough to retirement that the benefit choices are no longer theoretical. They have a substantial 401(k), possible pension or income-election decisions, healthcare questions, and a spouse who wants to understand what retiring sooner or later would actually change.",
      approach: "We might build a retirement-timing model that compares benefit elections, 401(k) withdrawal order, Social Security timing, healthcare costs, taxes, and investment allocation. Then we would turn those choices into a practical year-by-year plan instead of a stack of disconnected benefit decisions.",
    },
  },
  'pre-retirees': {
    name: 'Pre-Retirees (55-65)',
    slug: 'pre-retirees',
    label: 'For Pre-Retirees',
    heroTitle: 'Retirement planning for the years when it stops being theoretical.',
    heroDescription: "As retirement gets closer, curiosity usually turns into urgency. You want to know when you can stop working, what life will feel like, what your money can support, and which decisions matter more than you realized.",
    heroImage: '/brands/talley-wealth/david-conversation.jpg',
    heroImageAlt: 'David Talley in conversation at the Talley Wealth office',
    heroImagePosition: 'center center',
    recognitionTitle: 'Retirement is close enough that it is becoming the elephant in the room.',
    recognitionIntro: 'This page is for the person who has saved, worked, and done many things right, but now wants a much more complete answer than a simple retirement number.',
    recognitionCards: [
      {
        title: 'You want to know when',
        body: 'Not in a vague way. You want to understand what retiring at 60, 62, 65, or later actually changes, and whether working another year really moves the needle.',
      },
      {
        title: 'You want life after work to feel worth it',
        body: 'Successful people often fear retiring into a lifestyle they do not actually enjoy. Purpose, family, travel, routine, and spending all need to be part of the plan.',
      },
      {
        title: 'You want more than a number',
        body: 'A portfolio value and an income estimate matter, but they do not create real clarity unless the taxes, risks, healthcare, investments, and lifestyle are modeled together.',
      },
    ],
    problemTitle: 'The closer retirement gets, the more the answer depends on the whole picture.',
    problemDescription: "Most people think the main question is, \"How much income can my investments create?\" That answer matters. But by itself, it can be misleading. The better question is how the plan behaves when taxes, market timing, healthcare, Social Security, spending, risk, and life on the other side of work all interact.",
    problemDetail: "Talley Wealth helps Tri-Cities pre-retirees move from a rough retirement guess to a coordinated plan. Sometimes the biggest lever is not working two more years. It may be a tax strategy, withdrawal sequence, investment change, Roth conversion window, or a clearer understanding of what you actually want retirement to fund.",
    bulletPoints: [
      'Retirement income modeling across spending, taxes, healthcare, and inflation',
      'Social Security timing and spousal claiming analysis',
      'Roth conversion planning during the low-tax window',
      'Healthcare bridge strategy from employer coverage to Medicare',
      'Pension election analysis (lump sum vs. annuity)',
      'Withdrawal sequencing and tax bracket management in early retirement',
      'Lifestyle planning around purpose, spending, travel, family, and flexibility',
    ],
    differentiators: [
      {
        icon: Clock,
        title: 'More Than a Retirement Number',
        desc: "We do not stop at a simple income estimate. The work is to understand which choices can move the result and what retirement actually needs to support.",
      },
      {
        icon: Shield,
        title: 'Risk Looked at From More Than One Angle',
        desc: "Moving away from one risk can move you closer to another. We look at market risk, tax risk, healthcare risk, longevity risk, and lifestyle risk together.",
      },
      {
        icon: Calculator,
        title: 'Tax-Smart Transitions',
        desc: "The years around retirement can create tax windows that disappear later. We model Roth conversions, withdrawal order, Social Security timing, and Medicare thresholds together.",
      },
    ],
    ctaTitle: 'Retirement is too important for a rough guess.',
    ctaDescription: "Schedule a 15-minute Explore Call. We will talk about your timeline, what feels unresolved, and whether Keystone is the right way to build the full retirement picture.",
    metaTitle: 'Financial Advisor for Pre-Retirees (55-65) | Talley Wealth',
    metaDescription: 'Pre-retirement planning for ages 55-65 in the Tri-Cities. Talley Wealth helps coordinate retirement income, taxes, Roth conversions, Social Security timing, healthcare, investments, and lifestyle planning.',
    faqs: [
      {
        q: 'How do I know if I can afford to retire?',
        a: "We build a retirement income projection that accounts for your spending needs, all income sources (Social Security, pensions, investment accounts), taxes, healthcare costs, and inflation. The model stress-tests your plan against different market scenarios so you can see — with data — whether your money is likely to last.",
      },
      {
        q: 'Should I take Social Security at 62, 67, or 70?',
        a: "Each year you delay past 62 increases your benefit. But the 'right' age depends on your health, other income sources, spousal benefits, and tax situation. We model multiple claiming scenarios to show the cumulative difference over your projected lifetime.",
      },
      {
        q: 'What is the Roth conversion "window" and why does it matter?',
        a: "The years between retirement and age 72 (when RMDs begin) are often your lowest-income years. Converting traditional IRA money to Roth during this window means paying taxes at a potentially lower rate and enjoying tax-free growth and withdrawals for the rest of your life. This window closes once RMDs and Social Security push your income back up.",
      },
      {
        q: 'What should I do with my 401(k) when I retire?',
        a: "Options typically include leaving it with your employer, rolling it to an IRA, or taking distributions. An IRA rollover often provides more investment options and easier coordination with your tax strategy. We evaluate your specific plan to determine the best approach.",
      },
      {
        q: 'How do I plan for healthcare costs between retirement and Medicare?',
        a: "If you retire before 65, you'll need coverage for the gap. We evaluate options including COBRA, marketplace (ACA) plans, a spouse's employer plan, and healthcare sharing ministries. We also factor in Medicare premiums, Part D costs, and potential IRMAA surcharges once you're on Medicare.",
      },
    ],
    scenario: {
      title: 'A couple close enough to retirement that the question will not go away',
      situation: "A married couple in their late 50s or early 60s has saved well and believes they are probably in decent shape. But retirement is now close enough that the old answer, \"we think we are fine,\" no longer feels satisfying. They want to know what retiring sooner or later actually changes, what lifestyle they can support, and whether they are missing better tax or investment decisions.",
      approach: "We might build a year-by-year retirement model that compares different retirement ages, Social Security timing, spending levels, withdrawal sequences, healthcare costs, tax brackets, and Roth conversion windows. Then we would connect the math to the life side: what they want to do, what it costs, what risks matter most, and which decisions actually change the outcome.",
    },
  },
  'ballad-health': {
    name: 'Healthcare Professionals',
    slug: 'healthcare-professionals',
    label: 'For Healthcare Professionals',
    heroTitle: 'Healthcare careers leave little room for financial loose ends.',
    heroDescription: "Long hours, high income, benefits, student loans, insurance, taxes, and retirement decisions can stack up quickly. The financial side should feel organized, not like one more chart to review.",
    heroImage: '/brands/talley-wealth/david-conversation.jpg',
    heroImageAlt: 'David Talley in conversation at Talley Wealth',
    heroImagePosition: 'center center',
    employerDisclosure: 'Talley Wealth is an independent firm and is not affiliated with, endorsed by, or sponsored by Ballad Health or any healthcare employer mentioned on this page.',
    recognitionTitle: 'You may not need something complicated. You may need someone to make it coherent.',
    recognitionIntro: 'This page is for physicians, advanced practice providers, and healthcare leaders who want the major decisions organized across taxes, benefits, investments, debt, insurance, and time.',
    recognitionCards: [
      {
        title: 'Your income changed faster than your plan',
        body: 'After training, promotion, or a new role, the paycheck may look different before the tax strategy, savings plan, insurance, and investment decisions have caught up.',
      },
      {
        title: 'You have limited time for financial admin',
        body: 'Healthcare work can make ordinary money decisions feel like one more thing on an already full schedule.',
      },
      {
        title: 'Retirement or a career change is starting to matter',
        body: 'Some healthcare professionals want to know when they can slow down, reduce hours, change roles, or retire without guessing.',
      },
    ],
    problemTitle: 'High income does not automatically create clarity.',
    problemDescription: "Healthcare professionals are often capable, busy, and used to handling pressure. That does not mean the financial pieces automatically line up. Taxes, loans, benefits, insurance, investments, and retirement timing still need a coordinated process.",
    problemDetail: "Talley Wealth helps healthcare professionals in the Tri-Cities organize the moving parts into a planning framework. That can include retirement plan decisions, student loan strategy, tax planning, insurance review, investment allocation, and the question of what work should look like over the next decade.",
    bulletPoints: [
      'Student loan and PSLF decision support where relevant',
      'High-income tax planning and withholding review',
      '403(b), 457(b), retirement plan, and benefit coordination',
      'Disability, life insurance, and family-protection review',
      'Investment allocation that reflects career, tax, and time constraints',
      'Planning for reduced hours, role changes, or retirement timing',
    ],
    differentiators: [
      {
        icon: HeartPulse,
        title: 'Built Around Limited Time',
        desc: "The planning process has to respect the reality of healthcare schedules: clear meetings, organized decisions, and less financial clutter.",
      },
      {
        icon: DollarSign,
        title: 'Tax-Aware Planning',
        desc: "High income can create avoidable tax drag if decisions are made separately. We coordinate taxes, benefits, retirement accounts, and investments together.",
      },
      {
        icon: Users,
        title: 'Work + Life Context',
        desc: "Planning should account for the career, but not stop there. Family, time, risk, retirement, and optionality all matter.",
      },
    ],
    ctaTitle: 'Make the financial side easier to understand.',
    ctaDescription: "Schedule a 15-minute Explore Call. We will talk about what feels unresolved and whether Keystone is the right way to organize the financial side.",
    metaTitle: 'Financial Advisor for Healthcare Professionals | Talley Wealth',
    metaDescription: 'Financial planning for healthcare professionals in the Tri-Cities. Talley Wealth helps coordinate taxes, student loans, benefits, insurance, investments, and retirement decisions.',
    faqs: [
      {
        q: 'Can you help with student loan and PSLF questions?',
        a: "Yes. We can help review whether PSLF, refinancing, or a different payoff strategy deserves attention. Eligibility depends on employer status, loan type, repayment plan, income, and filing status, so the analysis needs to be specific.",
      },
      {
        q: 'How should healthcare professionals prioritize retirement accounts?',
        a: "The right order depends on cash flow, tax bracket, employer plans, loan strategy, family needs, and whether other goals need funding first. We coordinate retirement contributions with the rest of the plan instead of treating them as an isolated savings target.",
      },
      {
        q: 'How do I know if my disability insurance is adequate?',
        a: "For many healthcare professionals, income is the engine of the whole plan. We review group coverage, benefit caps, taxability, specialty-specific needs, and whether individual own-occupation coverage should be considered.",
      },
      {
        q: 'Is this only for physicians?',
        a: "No. Physicians may have more obvious income complexity, but nurse practitioners, physician assistants, CRNAs, administrators, and other healthcare leaders can face many of the same planning questions.",
      },
      {
        q: 'Can planning help if I want to slow down later?',
        a: "It can. We can model what reduced hours, a role change, or earlier retirement would do to income, benefits, taxes, savings, and long-term confidence. The goal is to understand the tradeoffs before the decision feels urgent.",
      },
    ],
    scenario: {
      title: 'A healthcare professional wondering whether they can slow down',
      situation: "A healthcare professional is earning well but feels stretched. They want to understand whether reducing hours in a few years would damage the plan, how current benefits and retirement contributions fit, and whether student loans, taxes, insurance, and investments are being handled in the right order.",
      approach: "We might model full-time and reduced-hour scenarios, then coordinate retirement contributions, tax withholding, loan strategy, insurance coverage, investment allocation, and cash flow. The point would be to understand the real tradeoffs before making a career decision under pressure.",
    },
  },
};

export const personaList = Object.values(personas);
