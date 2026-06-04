import type { WikiArticle } from './types';

export const wikiArticles: WikiArticle[] = [
  // ============================================
  // RETIREMENT PLANNING (5 articles)
  // ============================================
  {
    slug: 'when-can-i-afford-to-retire',
    category: 'retirement-planning',
    question: 'How do I know when I can actually afford to retire?',
    quickAnswer: 'You can afford to retire when your income sources, investments, taxes, healthcare costs, and spending plan work together with enough margin to survive real life. The number matters, but confidence usually comes from understanding how the income will actually be created, not just hearing that a projection says you are okay.',
    content: `Most people ask this question as if there is one number hiding somewhere. If they can just find it, the anxiety will go away.

I understand why. Retirement is a huge transition. You are taking something that has been predictable for decades, a paycheck, and replacing it with a system you may never have had explained clearly.

The first thing I would want to know is not just how much you have saved. I would want to know what job that money has to do.

## The real question underneath the question

"Can I retire?" usually means:

- Will my income hold up if markets are bad early?
- Am I going to pay more tax than I need to?
- What happens before Medicare?
- When should Social Security start?
- Which account do I spend from first?
- Can I still travel, help family, give, or enjoy the early years?
- What would make the plan fail?

That is why a quick answer rarely changes someone's life. You might feel better for a week, but if you still do not understand how the income works, the worry comes back.

## What I would look at

I would start with spending, but not in a flat, fake way. Retirement spending usually has stages. The first decade is often more active and expensive. The middle years may settle down. Later years can become healthcare-heavy.

Then I would map guaranteed or semi-guaranteed income: Social Security, pensions, rental income, part-time work, or anything else that reduces pressure on the portfolio.

Only after that does the investment portfolio get its job description. The plan should dictate the portfolio, not the other way around. Some dollars need to be stable because they may be spent soon. Other dollars need to grow because retirement may last 25, 30, or 35 years.

## The confidence part

The goal is not for you to become a retirement-income expert. The goal is for you to understand the plan well enough to ask better questions and feel the decisions are being made in the right order.

That kind of confidence is deeper than a green checkmark in software. It comes from seeing the whole picture, understanding the tradeoffs, and knowing someone has thought through what happens if real life does not cooperate.`,
    relatedSlugs: ['what-is-sequence-of-returns-risk', 'when-should-i-claim-social-security', 'how-should-i-invest-in-retirement'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'when-should-i-claim-social-security',
    category: 'retirement-planning',
    question: 'When should I claim Social Security?',
    quickAnswer: 'Social Security should usually be decided as part of the retirement income plan, not as a standalone maximization problem. Health, spouse protection, tax strategy, portfolio withdrawals, and the need for bridge income can all change the right answer.',
    content: `The internet tends to turn Social Security into a math contest. Delay until 70, maximize the monthly benefit, and call it a day.

Sometimes that is exactly right. Sometimes it is not.

The mistake is treating Social Security like it lives by itself. It does not. It interacts with your portfolio, tax brackets, Medicare premiums, spouse protection, and how much income you need in the first few years after work ends.

## What delaying really does

If you delay past full retirement age, your monthly benefit increases. That can be valuable, especially if you are healthy, have longevity in the family, or want to maximize the survivor benefit for a spouse.

But delaying also means something has to fund the gap. If you retire at 64 and wait until 70, those six years of spending usually come from savings, part-time work, a pension, or a spouse's income.

That is not automatically bad. In fact, using portfolio dollars early while delaying Social Security can be a very good strategy. But it needs to be coordinated.

## Where people get tripped up

The "best" Social Security age may change once you look at:

- whether one spouse needs a stronger survivor benefit
- whether drawing from an IRA early creates Roth conversion room
- whether portfolio withdrawals in early retirement are safe
- whether claiming early creates breathing room before Medicare
- whether current health makes a long break-even period unrealistic

This is why I do not like answering the question in isolation. Social Security is not just a benefit. It is one piece of the retirement income system.

## A better way to think about it

The question is not simply, "How do I get the most from Social Security?"

The better question is, "How does Social Security help the whole plan work better?"

Sometimes that means waiting. Sometimes it means claiming earlier. The answer should come from your actual plan, not from a rule of thumb that never met you.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'roth-conversion-should-i', 'medicare-what-i-need-to-know'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'how-much-should-i-have-saved-by-age',
    category: 'retirement-planning',
    question: 'Am I behind for retirement?',
    quickAnswer: 'Maybe, but age-based savings benchmarks are too blunt to answer that well. What matters is the gap between your future spending and your reliable income, how long the money needs to last, what tax buckets you own, and whether your savings rate can still change the outcome.',
    content: `Savings benchmarks are everywhere. One times income by 30. Three times by 40. Six times by 50. They are not useless, but they can create false comfort or unnecessary panic.

I have seen people look behind on a benchmark and still be fine because they have a pension, low spending, or a realistic retirement age. I have also seen people look fine on paper and still have a problem because nearly all the money is pre-tax, the spending assumptions are too low, or the retirement date is too aggressive.

## The better question

Instead of asking whether you match a benchmark, ask what the plan actually needs from your savings.

That means looking at:

- what you expect to spend
- what Social Security or pension income may cover
- how much must come from investments
- whether your accounts are traditional, Roth, or taxable
- how many years the portfolio may need to support you
- how much flexibility you have around work, spending, and timing

That is the real retirement gap. Not the difference between your balance and a national rule of thumb.

## If you are behind

The answer is rarely one magic move. It is usually a combination of smaller decisions made in the right order: save more, work a little longer, reduce debt, adjust the retirement date, change the investment mix, or be more precise with tax strategy.

This is where good planning can be encouraging without being fake. Sometimes the situation is better than you thought. Sometimes it is not. Either way, you want to know early enough that your decisions still matter.

## If you are ahead

Being ahead is not the same as being done. At a certain point, the work changes from accumulation to coordination: taxes, withdrawals, risk, estate planning, giving, and how the money will actually support your life.

The account balance is only one part of the story. The plan is what tells us what that balance means.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'traditional-vs-roth-which-is-better', 'what-is-asset-allocation'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'what-is-sequence-of-returns-risk',
    category: 'retirement-planning',
    question: 'What if the market drops right after I retire?',
    quickAnswer: 'A market decline early in retirement can be more damaging than the same decline later because you may be taking withdrawals while the portfolio is down. The answer is not to avoid all risk. It is to structure the plan so near-term income is protected while long-term money still has enough growth to fight inflation.',
    content: `This is one of the retirement risks people feel instinctively before they know the name for it.

If the market falls while you are still working, it is uncomfortable, but you may still be saving and buying at lower prices. If the market falls right after you retire, and you are also taking money out, the math changes.

You can be forced to sell more shares while prices are down. Those shares are no longer there to participate when the market recovers. That is sequence of returns risk.

## The natural reaction can create a different problem

Once people understand this, the instinct is often to get much more conservative.

That makes emotional sense. But retirement usually lasts long enough that inflation matters too. A portfolio built only to avoid market movement may quietly lose purchasing power for decades.

So the job is not to run from risk. The job is precision.

## What a better structure can look like

A retirement income plan may separate money by time horizon. Dollars needed soon should not be exposed to the same volatility as dollars that may not be touched for 15 or 20 years.

That can mean cash reserves, short-term fixed income, a bucket or silo structure, flexible withdrawal rules, and a portfolio designed around the actual spending plan.

None of that removes uncertainty. It gives the portfolio a job description.

## The question I would ask

If the market dropped 25 percent in your first two years of retirement, what would your plan actually do?

If the answer is "I guess we would hope it comes back," that is not enough. And if the answer is "we moved everything to cash," that may not be enough either.

The better answer is a plan that respects both risks: the loud one, market decline, and the quiet one, inflation.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'how-should-i-invest-in-retirement', 'what-is-asset-allocation'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'fear',
  },
  {
    slug: 'medicare-what-i-need-to-know',
    category: 'retirement-planning',
    question: 'What should I know about Medicare before I retire?',
    quickAnswer: 'Medicare is not just a health insurance decision. The timing can affect penalties, cash flow, retirement dates, Roth conversions, and Medicare premium surcharges. You want the enrollment decision and the tax plan talking to each other before you leave work.',
    content: `Medicare can feel like a separate checklist. Turn 65, pick a plan, move on.

It is more connected than that.

Medicare affects your retirement date, your bridge insurance if you retire before 65, your monthly cash flow, and sometimes your tax strategy because higher income can increase Medicare premiums through IRMAA.

## The basic timing

Most people become eligible at 65. If you are already retired, you usually need to pay close attention to the initial enrollment window. Missing it can create penalties that do not simply go away.

If you are still working and covered by an employer plan, you may be able to delay, but the rules depend on the type and size of the employer plan. This is an area where guessing is a bad idea.

## The planning issues people miss

The biggest misses I see are not usually about the Medicare plan itself. They are about coordination:

- retiring before 65 without a good bridge insurance plan
- doing Roth conversions without watching IRMAA thresholds
- assuming Medicare means healthcare becomes cheap
- forgetting that a spouse may be on a different timeline
- waiting too long to understand Medigap, Medicare Advantage, and prescription coverage

## Why this belongs in the retirement plan

Healthcare is one of the largest expenses in retirement. Medicare helps, but it does not make healthcare free, and the choices are not isolated from the rest of the plan.

If you are within a few years of retirement, Medicare should be part of the same conversation as Social Security, portfolio withdrawals, taxes, and cash reserves. It is all connected whether we plan for it or not.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'when-should-i-claim-social-security', 'roth-conversion-should-i'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },

  // ============================================
  // INVESTMENT BASICS (5 articles)
  // ============================================
  {
    slug: 'what-is-asset-allocation',
    category: 'investment-basics',
    question: 'How should my investments change as my plan changes?',
    quickAnswer: 'Your investments should change when the job of the money changes. The right mix depends on when each dollar may be needed, how much volatility the plan can absorb, and how much volatility you can personally live through without abandoning the strategy.',
    content: `A lot of investment conversations start in the wrong place.

They start with products, funds, performance, or a risk questionnaire. Those things matter, but they are not the starting point. The starting point is the plan.

What does this money need to do? When might you need it? What happens if the market is bad at the wrong time? What happens if you get too conservative and inflation quietly eats the plan alive?

## The two filters

Once we know a dollar is going to be invested, I think about two filters.

The first is time horizon. Money needed in the next couple of years should not be treated like money that may sit untouched for 20 years.

The second is behavioral. How much volatility can you actually endure without making a decision that damages the plan? Some people can watch an account fall and stay calm because they understand the structure. Other people cannot. That is not a moral failure. It is an input.

## Precision matters

The goal is not always less risk. Sometimes people are too aggressive. Sometimes, more often than they realize, they are too conservative for the job their money has to do.

Turning the risk dial up or down a couple of notches can matter enormously over a long retirement. The math compounds whether we pay attention to it or not.

## What this means practically

Your portfolio should not be a pile of investments hoping to become a life. Your life, your spending, your taxes, your legacy goals, and your temperament should tell the portfolio what it is supposed to be.

That is a very different conversation than, "Which fund did best last year?"`,
    relatedSlugs: ['how-should-i-invest-in-retirement', 'what-is-sequence-of-returns-risk', 'what-is-diversification'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'what-is-diversification',
    category: 'investment-basics',
    question: 'Am I actually diversified, or do I just own a lot of things?',
    quickAnswer: 'Owning a lot of accounts or funds is not the same as being diversified. Real diversification means the pieces of your portfolio have different jobs and do not all depend on the same thing going right at the same time.',
    content: `People often think they are diversified because they own a lot of things.

Multiple accounts. Several mutual funds. A few stocks. Maybe an old 401(k), a current 401(k), an IRA, and a brokerage account.

That can still be the same risk wearing different clothes.

## What diversification is trying to solve

The point is not to make the portfolio complicated. The point is to avoid having too much of your future depend on one company, one sector, one tax treatment, one country, one interest-rate environment, or one version of the economy.

That can include diversification across stocks and bonds, growth and value, U.S. and international, large and small companies, and different account types.

## The planning layer

The more important question is whether the diversification matches the plan.

A retiree drawing income needs a different structure than a 35-year-old executive with a high savings rate. A business owner whose net worth is already concentrated in one company may need different portfolio risk than someone whose financial life is mostly retirement accounts.

Diversification is not just an investment theory. It is a way of making sure one bad outcome does not take too much of the plan with it.

## What I would look for

I would want to know whether your accounts are accidentally overlapping, whether old workplace plans are still aligned with your current life, whether your tax buckets are balanced, and whether the portfolio is concentrated in ways you do not realize.

The goal is not to own everything. The goal is to own the right things for the right reasons.`,
    relatedSlugs: ['what-is-asset-allocation', 'index-funds-vs-actively-managed', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-should-i-invest-in-retirement',
    category: 'investment-basics',
    question: 'How should I invest once I am retired?',
    quickAnswer: 'Retirement investing should be built around withdrawals, taxes, and time horizon. Some money needs stability because it may be spent soon. Some money needs growth because retirement may last decades. The structure should make both truths visible.',
    content: `Investing in retirement is different because the portfolio is no longer just growing for someday. It is helping create income now.

That changes the job.

When you are accumulating, volatility is mostly an emotional and behavioral challenge. In retirement, volatility can become a cash-flow problem because you may be selling investments to live.

## The retirement portfolio needs jobs

I like to think in terms of time horizon. Money that may be needed soon should be positioned differently from money that may not be needed for many years.

That does not mean everything becomes conservative. In fact, one of the most common mistakes is becoming so conservative that the portfolio cannot fight inflation over a long retirement.

The balance is the hard part.

## Withdrawals and taxes matter

The investment mix should also coordinate with which accounts you spend from. Taxable accounts, traditional IRAs, Roth accounts, and HSAs all behave differently.

The order of withdrawals can affect tax brackets, Medicare premiums, Roth conversion windows, capital gains, and how much flexibility you have later.

So the question is not only "what should I own?" It is also "where should I own it, and when should I spend it?"

## The goal

A good retirement portfolio should help you avoid panic in bad markets without quietly starving the plan of long-term growth.

That takes more than picking investments. It takes connecting the investments to the income plan, tax plan, and real person who has to live through the next market cycle.`,
    relatedSlugs: ['what-is-sequence-of-returns-risk', 'what-is-asset-allocation', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'how-much-international-stock-should-i-own',
    category: 'investment-basics',
    question: 'Do I really need international investments?',
    quickAnswer: 'International investing is not about chasing whichever market did best recently. It is about avoiding a portfolio that depends entirely on one country continuing to lead forever. The right amount depends on the plan, taxes, account location, and your ability to stick with it through long periods of underperformance.',
    content: `International investing is one of those topics where recent performance tends to dominate the conversation.

If U.S. stocks have done better for a long time, people start asking why they own international at all. That is understandable. It is also exactly how investors end up overconfident in whatever just worked.

## The reason to own it

The reason is diversification. Not because international will always outperform, and not because there is a magic percentage everyone should own.

The reason is that the future is unknown. Different markets lead at different times, currencies move, valuations change, and the U.S. will not necessarily be the best-performing market in every future decade.

## The reason not to overdo it

There is also a behavioral side. If an allocation makes you miserable enough to abandon it after years of underperformance, it was not the right allocation for you.

This is where textbook investing and real-life investing separate a little. The mathematically elegant answer is not always the answer a person can actually live with.

## How I would decide

I would look at the overall plan, account types, tax costs, time horizon, and how much tracking-error discomfort you can handle. Then I would use international exposure deliberately, not as a random leftover in a fund lineup.

The goal is not to win an argument about global market theory. The goal is to build a portfolio that can do its job in more than one version of the future.`,
    relatedSlugs: ['what-is-diversification', 'what-is-asset-allocation', 'index-funds-vs-actively-managed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'index-funds-vs-actively-managed',
    category: 'investment-basics',
    question: 'Should I use index funds or active management?',
    quickAnswer: 'For most public-market exposure, low-cost index funds are very hard to beat after fees and taxes. But the bigger issue is not index versus active. It is whether the investments are low-cost, tax-aware, diversified, and connected to the plan.',
    content: `The index-versus-active debate can get weirdly religious.

My view is simpler. Costs matter. Taxes matter. Diversification matters. Behavior matters. And the investments should serve the plan.

For many clients, that points heavily toward low-cost index or evidence-based funds for broad market exposure. If you can own an entire market cheaply and tax-efficiently, an active manager has to overcome a real headwind before they add value.

## Where active management struggles

Active funds often cost more, trade more, and create more taxable distributions. Even if the manager is talented, the fund has to beat the market by enough to overcome those costs.

Some do for a while. Many do not. And picking the ones that will outperform in advance is much harder than recognizing the ones that did well after the fact.

## Where the real advice lives

The real value is usually not guessing which fund manager wins next. It is building the right allocation, placing assets in the right accounts, managing taxes, rebalancing, coordinating withdrawals, and keeping the client from making damaging decisions when markets get loud.

That is less flashy than fund picking. It is also where a lot of the actual planning value lives.

## My practical answer

Use low-cost, diversified tools unless there is a very good reason not to. Then spend the serious energy on the decisions that are more likely to move your real life: risk level, tax location, withdrawal sequencing, Roth conversion windows, concentration risk, and whether the portfolio actually matches the plan.`,
    relatedSlugs: ['what-is-asset-allocation', 'what-is-diversification', 'tax-loss-harvesting-explained'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'myth-busting',
  },

  // ============================================
  // TAX-SMART STRATEGIES (5 articles)
  // ============================================
  {
    slug: 'roth-conversion-should-i',
    category: 'tax-planning',
    question: 'Should I do a Roth conversion?',
    quickAnswer: 'A Roth conversion makes sense when paying tax now is likely better than paying tax later. The right amount depends on lifetime tax brackets, retirement timing, Social Security, RMDs, Medicare premiums, charitable giving, and cash available to pay the tax.',
    content: `Roth conversions are one of the best examples of why tax planning should not only look at this year.

A conversion intentionally raises your tax bill now. That feels wrong if your only goal is to pay less this April. But if the bigger goal is to lower your cumulative lifetime tax bill, paying more this year can be exactly the right move.

## The wrong question

The wrong question is, "How much can I convert without it hurting?"

That usually leads to timid conversions that feel responsible but leave most of the strategy untouched.

The better question is, "How much should I convert based on the lifetime tax picture?"

That answer is often larger than people expect. Sometimes it is zero. The point is that the number should come from the math, not from emotional comfort.

## What drives the decision

I would look at:

- current and future tax brackets
- expected retirement income
- Social Security timing
- future required minimum distributions
- Medicare IRMAA thresholds
- charitable giving plans
- whether one spouse may eventually file single
- cash available outside the IRA to pay the tax

This is why conversions are not a one-time checkbox. The right amount can change every year.

## When the window is best

For many people, the strongest window is after retirement income drops but before Social Security and RMDs begin. For others, especially people with very large tax-deferred balances, it can make sense even during working years.

The strategy is simple in concept and complicated in execution. That combination is exactly where people tend to make expensive mistakes.`,
    relatedSlugs: ['traditional-vs-roth-which-is-better', 'what-are-required-minimum-distributions', 'medicare-what-i-need-to-know'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'traditional-vs-roth-which-is-better',
    category: 'tax-planning',
    question: 'Should I use traditional or Roth retirement accounts?',
    quickAnswer: 'Traditional versus Roth is really a tax-timing decision. Traditional accounts usually help when your tax rate is higher today than it will be later. Roth accounts help when paying tax today is likely cheaper than paying tax later or when future flexibility is valuable.',
    content: `Traditional versus Roth gets talked about like a preference question. It is really a sequencing question.

Do you want the tax benefit now, or later?

Traditional contributions may lower this year's taxable income. Roth contributions do not, but qualified withdrawals can be tax-free later. The better answer depends on when your tax rate is lower.

## The normal rule

If you are in a high tax bracket today and expect to be in a lower bracket later, traditional contributions can make sense.

If you are in a low bracket today, expect higher income later, or want more tax-free flexibility in retirement, Roth can make sense.

That is the clean textbook version. Real life adds nuance.

## What the textbook misses

Roth money can create flexibility around Medicare premiums, RMDs, surviving-spouse tax brackets, and large one-time expenses in retirement.

Traditional money can create a future tax problem if too much wealth accumulates in pre-tax accounts and there is no plan to distribute or convert it intentionally.

The right mix is often more valuable than an all-or-nothing answer.

## What I would look at

I would want to know your current tax bracket, expected career path, business income, retirement timeline, account balances, state tax situation, and how much future tax flexibility you already have.

The goal is not to pick a team. The goal is to build tax flexibility so you are not trapped later.`,
    relatedSlugs: ['roth-conversion-should-i', 'how-are-investments-taxed', 'what-are-required-minimum-distributions'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'what-are-required-minimum-distributions',
    category: 'tax-planning',
    question: 'Why do required minimum distributions matter before I am old enough to take them?',
    quickAnswer: 'RMDs matter years before they begin because large traditional IRA or 401(k) balances can create forced taxable income later. Waiting until RMD age to plan often means the best tax windows have already closed.',
    content: `Required minimum distributions are easy to ignore until they start.

That is usually too late.

RMDs are the IRS eventually saying, "You deferred taxes long enough. Now money has to come out." If most of your wealth is in traditional retirement accounts, those forced withdrawals can create more taxable income than you expected.

## The problem

RMDs can affect:

- ordinary income taxes
- Medicare premiums
- taxation of Social Security
- charitable giving strategy
- surviving-spouse tax brackets
- how much flexibility you have later in retirement

The issue is not that RMDs are bad. The issue is being surprised by them.

## Why planning early matters

The years between retirement and RMD age can be extremely valuable. Income may be lower. Social Security may not have started. You may have room to do Roth conversions or realize capital gains at better rates.

Once RMDs begin, they fill up the tax return whether you want them to or not.

## What can help

Depending on the situation, the answer may include Roth conversions, qualified charitable distributions, different withdrawal sequencing, delaying or coordinating Social Security, or changing how taxable and retirement accounts are invested.

This is a lifetime tax planning question, not just an age-73 reminder.`,
    relatedSlugs: ['roth-conversion-should-i', 'when-should-i-claim-social-security', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'tax-loss-harvesting-explained',
    category: 'tax-planning',
    question: 'Is tax-loss harvesting actually worth doing?',
    quickAnswer: 'Tax-loss harvesting can be useful, but it is not magic. It matters most when it is coordinated with capital gains, business events, charitable giving, rebalancing, and the broader tax plan.',
    content: `Tax-loss harvesting sounds more sophisticated than it is.

If an investment is down, you may be able to sell it, realize the loss, and use that loss to offset capital gains. If losses exceed gains, a limited amount can offset ordinary income, with the rest carried forward.

That can be useful. But the strategy is often oversold.

## Where it helps

Tax-loss harvesting can help when you have capital gains from selling investments, real estate, a business asset, or concentrated stock.

It can also create room to rebalance a portfolio that has drifted without creating as much tax cost.

## Where people get sloppy

The danger is letting the tax tail wag the investment dog. A loss is not valuable simply because it exists. It should be harvested only if the replacement investment keeps the portfolio aligned and avoids wash-sale problems.

You do not want to save a little tax and accidentally change the risk of the portfolio in a way that hurts the plan.

## The planning version

The better version is coordinated. If a business owner is selling an asset, an executive has concentrated stock, or a retiree is managing gains while doing Roth conversions, harvesting losses can be one piece of a larger tax strategy.

By itself, it is a tactic. Connected to the plan, it can be useful.`,
    relatedSlugs: ['how-are-investments-taxed', 'index-funds-vs-actively-managed', 'roth-conversion-should-i'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-are-investments-taxed',
    category: 'tax-planning',
    question: 'Why does it matter where I hold different investments?',
    quickAnswer: 'Different accounts tax income, gains, and withdrawals differently. Asset location means placing investments where their tax behavior fits best, so the portfolio and tax plan work together instead of accidentally fighting each other.',
    content: `Two people can own the same investments and have very different after-tax outcomes because the investments live in different accounts.

That is asset location.

It is not about what you own. It is about where you own it.

## The basic idea

Traditional IRAs and 401(k)s generally turn withdrawals into ordinary income. Roth accounts can create tax-free qualified withdrawals. Taxable brokerage accounts may receive capital gains treatment, qualified dividends, and a step-up in basis at death.

Those differences matter.

## Examples

Highly tax-inefficient investments may belong in tax-deferred or tax-free accounts. Broad stock index funds may work well in taxable accounts because they can be relatively tax-efficient. Bonds, REITs, and active funds may need more thought.

But this is not just a tax-efficiency chart. The withdrawal plan matters too.

If all the right assets are in the wrong buckets, retirement income can become harder to manage.

## Why coordination matters

Asset location touches investment management, retirement income, estate planning, charitable giving, and tax planning.

That is why "go ask your CPA" is not enough by itself, and neither is an investment allocation that ignores the tax return. The pieces have to talk to each other.`,
    relatedSlugs: ['traditional-vs-roth-which-is-better', 'what-is-asset-allocation', 'tax-loss-harvesting-explained'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },

  // ============================================
  // ESTATE & LEGACY (3 articles)
  // ============================================
  {
    slug: 'what-estate-documents-do-i-need',
    category: 'estate-planning',
    question: 'What estate planning documents should I have in place?',
    quickAnswer: 'Most adults need a will, durable financial power of attorney, healthcare power of attorney, and advance directive. But documents are only the beginning. Beneficiaries, titling, taxes, liquidity, and family dynamics have to be coordinated too.',
    content: `Estate planning often gets reduced to documents. Do I have a will? Do I need a trust? Who is my power of attorney?

Those are important questions, but they are not the whole plan.

At a basic level, most adults should have a will, durable financial power of attorney, healthcare power of attorney, and an advance directive or living will. Depending on the family, asset level, and state, a revocable trust may also make sense.

## The document problem

Documents can be legally valid and still not do what the family expects.

That happens when beneficiary designations are outdated, accounts are titled incorrectly, the trust was never funded, life insurance does not match the liquidity need, or no one has thought through how retirement accounts will be taxed when inherited.

The attorney may have done the legal work correctly. The plan can still be uncoordinated.

## What I would check

I would want to know:

- who is named on retirement accounts and life insurance
- whether account titling matches the estate plan
- whether heirs can handle money outright
- whether taxes change the intended outcome
- whether there is enough liquidity
- whether the right people know where documents are

## The point

Estate planning is not only about who gets what. It is about making a hard season less chaotic for the people you love.

The documents matter. The coordination around the documents matters just as much.`,
    relatedSlugs: ['do-i-need-a-trust', 'how-to-leave-money-to-children', 'received-an-inheritance-what-now'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'do-i-need-a-trust',
    category: 'estate-planning',
    question: 'Do I need a trust, or is a will enough?',
    quickAnswer: 'A trust may help with privacy, probate avoidance, incapacity planning, real estate in multiple states, blended-family issues, or controlling how heirs receive money. But a trust is a tool, not the goal. The goal is making the estate plan actually work.',
    content: `Trusts get talked about like they are either only for rich people or something everyone needs.

Neither is quite right.

A trust is a tool. The question is what problem you are trying to solve.

## When a trust may make sense

A revocable living trust can help if you want to avoid probate, keep family details private, manage property in more than one state, plan for incapacity, or control how money is distributed to children or other heirs.

It can also be useful in blended families or situations where an outright inheritance would create problems.

## When a will may be enough

If the estate is simple, beneficiary designations are clean, assets are titled properly, and probate is not a major concern, a will and the right powers of attorney may do the job.

The key phrase there is "if everything is clean." That is where assumptions can get expensive.

## The part people miss

Creating a trust is not the finish line. The trust has to be funded. Beneficiary designations and account titles have to be reviewed. The investment, tax, and liquidity pieces still need to fit.

I have seen people pay for good estate documents and still leave the family with a mess because no one connected the documents to the financial life.

## Better question

Do not start with, "Do I need a trust?"

Start with, "What do I want to happen if I become incapacitated or die, and what would keep that from happening cleanly?"

Then decide whether a trust solves a real problem.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'how-to-leave-money-to-children', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-to-leave-money-to-children',
    category: 'estate-planning',
    question: 'What is the best way to leave money to my children?',
    quickAnswer: 'The best way depends on the children, the assets, the tax picture, and what you are trying to accomplish. Outright inheritance may be fine for mature adult children, but trusts, Roth conversions, beneficiary planning, and charitable strategies can materially change the outcome.',
    content: `Leaving money to children sounds simple until you sit with the details.

Which children? At what ages? In what form? With what tax cost? Are there spouses, creditors, addiction concerns, special needs, business interests, or family land involved?

This is where personal finance stops being pure math.

## The first question

The first question is not, "What is the most tax-efficient way to leave money?"

The first question is, "What would be helpful and wise for this family?"

For some adult children, outright inheritance is perfectly fine. For others, structure is kindness. A trust can distribute money over time, protect against bad decisions, or preserve assets for a particular purpose.

## The tax piece

The type of asset matters. A taxable brokerage account may receive a step-up in basis. A traditional IRA inherited by adult children may have to be emptied within 10 years, which can create a large tax bill. Roth accounts can be extremely valuable to heirs.

That means Roth conversions during your lifetime may be partly an estate-planning strategy, not just a retirement tax strategy.

## The human piece

Parents sometimes want fairness, but fairness is not always equal percentages. One child may be involved in a family business. Another may have special needs. Another may be financially secure already.

The right plan should be technically sound and emotionally aware.

## The point

You are not just transferring dollars. You are transferring responsibility, opportunity, and sometimes complexity. The plan should respect all three.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'do-i-need-a-trust', 'roth-conversion-should-i'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'strategy',
  },

  // ============================================
  // LIFE TRANSITIONS (4 articles)
  // ============================================
  {
    slug: 'received-an-inheritance-what-now',
    category: 'life-transitions',
    question: 'I inherited money. What should I do first?',
    quickAnswer: 'Slow down first. Before investing, spending, gifting, or paying off debt, understand what you inherited, how it is taxed, what decisions are actually urgent, and how the money fits into your life. The first job is to avoid turning a gift into a rushed decision.',
    content: `An inheritance can be both a blessing and a strange kind of pressure.

People often feel like they should do something right away. Invest it. Pay something off. Help family. Buy something meaningful. Make the gift count.

Most of the time, the best first move is to slow down.

## What to do first

Park cash somewhere safe while you understand the facts. Then sort out what you inherited:

- cash
- taxable investments
- retirement accounts
- real estate
- business interests
- life insurance
- trust assets

Each one has different tax rules, timelines, and planning implications.

## What not to rush

Do not rush into a new investment strategy before you know what the money is for. Do not make large gifts under emotional pressure. Do not assume inherited retirement accounts work like your own retirement account.

And do not feel embarrassed if you do not know how all of this works. Most people do not. Inherited wealth often arrives at the exact moment when people are least emotionally ready to make technical decisions.

## The better question

The right question is, "What does this money make possible, and what responsibility came with it?"

Maybe it accelerates retirement. Maybe it pays off debt. Maybe it funds education, giving, or a house. Maybe it should simply become part of a long-term plan.

The answer should be deliberate, not reactive.`,
    relatedSlugs: ['how-to-leave-money-to-children', 'how-are-investments-taxed', 'what-estate-documents-do-i-need'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'financial-planning-during-divorce',
    category: 'life-transitions',
    question: 'What financial decisions matter most during divorce?',
    quickAnswer: 'Divorce decisions should be evaluated after taxes, cash flow, retirement impact, insurance, and estate planning are considered. Two assets with the same dollar value on paper can be very different once taxes, liquidity, and future income are included.',
    content: `Divorce is one of the clearest examples of why the spreadsheet value is not always the real value.

A house, a taxable account, a Roth IRA, and a traditional 401(k) may all show dollar amounts. Those dollars do not behave the same way.

Some are liquid. Some are not. Some are taxable later. Some may create maintenance costs. Some may look fair today and create a problem five years from now.

## What matters most

You want to understand:

- after-tax value of assets
- retirement account division and QDRO rules
- whether the house is affordable on one income
- health insurance
- life insurance needs
- beneficiary designations
- estate documents
- cash flow after the settlement

This is a time when technically equal is not always actually equal.

## The emotional reality

It is completely normal for money decisions to feel heavier during divorce. People are tired, hurt, scared, or just trying to get through the next thing.

That is exactly why clear planning matters. You do not want permanent financial decisions made only from exhaustion.

## The goal

The goal is not to win every dollar on paper. The goal is to leave the process with a financial life that works, with fewer surprises, and with a clear plan for rebuilding.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'when-can-i-afford-to-retire', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'planning-for-career-change',
    category: 'life-transitions',
    question: 'How should I prepare financially before a career change?',
    quickAnswer: 'A career change should be planned around cash runway, health insurance, taxes, retirement savings, equity or deferred compensation, and the risk that income may not transition cleanly. The more uncertainty you are taking on, the more structure you need before the leap.',
    content: `A career change can be a good decision and still be financially sloppy if the planning is thin.

The big issue is not only whether the new opportunity is exciting. It is whether your financial life can absorb the transition.

## What I would want in place

Before a major change, I would look at:

- cash reserves
- health insurance options
- unused benefits
- unvested stock or deferred compensation
- retirement account options
- tax withholding or estimated payments
- debt payments
- whether the income gap changes longer-term goals

If you are moving into self-employment, the tax planning becomes even more important. Quarterly estimates, retirement plan choices, business deductions, and cash-flow discipline all matter quickly.

## The planning question

The question is not, "Can I survive the next few months?"

The better question is, "What has to be true for this move to be wise even if the transition takes longer than expected?"

That is a different standard. It forces you to build margin before you need it.

## Why this matters

Good opportunities can be damaged by poor timing. If the financial pressure becomes too high too quickly, you may be forced into decisions you would not have made with a little more runway.

Planning does not remove risk. It keeps the risk from being accidental.`,
    relatedSlugs: ['traditional-vs-roth-which-is-better', 'how-much-should-i-have-saved-by-age', 'what-is-asset-allocation'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'caring-for-aging-parents-financially',
    category: 'life-transitions',
    question: 'How do I help aging parents without wrecking my own plan?',
    quickAnswer: 'Start by understanding your parents\' documents, income, insurance, care wishes, and long-term care risk. Then decide what help is sustainable. Caring for parents is deeply personal, but your own retirement security still has to be protected.',
    content: `Helping aging parents is one of those topics where the financial and emotional sides are impossible to separate.

You may be dealing with love, guilt, family roles, medical decisions, old habits, and real money all at the same time.

That is a lot to carry.

## Start before the crisis

If possible, understand:

- where important documents are
- who has power of attorney
- what income they receive
- what insurance they have
- whether they have long-term care coverage
- what they want if they need help at home or in a facility
- who their attorney, CPA, and advisor are

These conversations are easier before something happens.

## The boundary problem

Adult children often start helping one bill at a time. Then one bill becomes many. Then career decisions, housing, and retirement savings get affected.

That does not mean you should not help. It means you need to know what kind of help is sustainable.

You cannot build a plan around unlimited sacrifice and call it planning.

## The coordination piece

Long-term care, Medicaid rules, estate documents, home equity, taxes, family agreements, and your own retirement plan all interact. This is exactly the kind of situation where a single isolated answer is rarely enough.

The goal is to care well without letting the entire family financial picture become reactive.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'medicare-what-i-need-to-know', 'when-can-i-afford-to-retire'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },

  // ============================================
  // WORKING WITH AN ADVISOR (3 articles)
  // ============================================
  {
    slug: 'what-is-a-fiduciary',
    category: 'working-with-advisor',
    question: 'What does it actually mean for an advisor to be a fiduciary?',
    quickAnswer: 'A fiduciary has to put your interests first, disclose conflicts, and give advice in your best interest. That matters, but it is only the floor. You still need to know whether the advisor has the judgment, process, and scope to coordinate the decisions you actually need help with.',
    content: `Being a fiduciary matters. I would not minimize it.

But I also would not stop there.

A fiduciary obligation is a standard of care. It helps answer whether the advisor is supposed to act in your best interest. It does not automatically tell you whether the advice is deep enough, coordinated enough, or right for your situation.

## What to ask

You can ask:

- Are you a fiduciary at all times?
- Will you put that in writing?
- How are you compensated?
- Do you receive commissions or referral fees?
- What conflicts should I know about?

Those are fair questions.

## The next layer

After that, ask what the advisor actually does.

Do they coordinate tax planning, investment management, retirement income, estate planning, insurance, and implementation? Or do they mostly manage investments and call the rest financial planning?

There is a big difference between a portfolio relationship and a planning relationship.

## The point

Fiduciary is important. It is not the whole story.

You want someone legally obligated to put your interests first and capable of seeing the whole picture clearly enough to lead the work.`,
    relatedSlugs: ['how-do-financial-advisors-get-paid', 'what-to-expect-first-meeting', 'how-are-investments-taxed'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-do-financial-advisors-get-paid',
    category: 'working-with-advisor',
    question: 'How do financial advisors get paid, and why should I care?',
    quickAnswer: 'Advisor compensation matters because it shapes incentives. Fees, commissions, AUM, flat fees, and hybrids can all create different conflicts. The point is not that one model makes someone automatically good or bad, but you should understand exactly what you pay and what advice is included.',
    content: `How an advisor gets paid is not a side detail. It tells you something about incentives.

Some advisors charge a percentage of assets. Some charge flat fees. Some charge hourly. Some receive commissions from products. Some use a mix.

The problem is not that every compensation model except one is evil. That is too simplistic. The problem is when the client does not understand what they are paying, what conflicts exist, and what work is actually included.

## What to clarify

Ask:

- What do I pay directly?
- Do you receive commissions?
- Are there product expenses in addition to your fee?
- What services are included?
- Do you coordinate tax planning or only investment management?
- Is implementation included, or only recommendations?

The all-in cost matters. So does the all-in value.

## Fee and fit

A higher fee can be perfectly reasonable if the planning complexity justifies it and the work is actually being done. A low fee can be expensive if important decisions are missed.

That is especially true when taxes, retirement income, estate planning, business ownership, equity compensation, or inherited wealth are involved.

## The question behind the fee

Do not only ask, "Is this expensive?"

Ask, "Is my situation complex enough that I need this level of advice, and is the advisor actually doing the work the fee implies?"

That is a much better filter.`,
    relatedSlugs: ['what-is-a-fiduciary', 'what-to-expect-first-meeting', 'roth-conversion-should-i'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'what-to-expect-first-meeting',
    category: 'working-with-advisor',
    question: 'What should I expect in a first conversation with a financial advisor?',
    quickAnswer: 'A first conversation should help both sides understand whether there is a real fit. You should be able to share what prompted you to reach out, what feels unclear, and what you hope to improve without being pressured into a product or a premature decision.',
    content: `The first conversation should not feel like a sales ambush.

It should feel like a thoughtful sorting conversation. What prompted you to reach out? What is going on? What have you already tried? Where does it feel like the pieces are not working together?

That does not mean the advisor should avoid talking about fit. Fit matters.

## What the advisor should be listening for

A good advisor should be trying to understand whether your situation matches the kind of work they actually do.

For Talley Wealth, that usually means some combination of retirement decisions, tax strategy, investment management, business ownership, estate coordination, inherited wealth, or a financial life that has become too complex to keep carrying alone.

If someone only needs a quick one-off answer, or the complexity does not justify the fee, it may not be the right fit. That is not a rejection. It is honesty.

## What you should be looking for

You should feel like the advisor is listening carefully and asking better questions than you expected.

You should understand how they are paid, what process comes next, what kind of clients they serve best, and whether they can actually own implementation or only point out ideas.

## The right tone

A first call can be warm and still be discerning. You do not need to have everything perfectly organized. But you should leave with a clearer sense of whether the relationship deserves a deeper look.

That is the point of the first conversation.`,
    relatedSlugs: ['what-is-a-fiduciary', 'how-do-financial-advisors-get-paid', 'when-can-i-afford-to-retire'],
    lastUpdated: '2026-06-02',
    author: 'David Talley',
    type: 'practical',
  },
];

export function getArticleBySlug(slug: string): WikiArticle | undefined {
  return wikiArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): WikiArticle[] {
  return wikiArticles.filter(article => article.category === categorySlug);
}

export function getRelatedArticles(article: WikiArticle): WikiArticle[] {
  if (!article.relatedSlugs) return [];
  return article.relatedSlugs
    .map(slug => getArticleBySlug(slug))
    .filter((a): a is WikiArticle => a !== undefined);
}

export function searchArticles(query: string): WikiArticle[] {
  const lowercaseQuery = query.toLowerCase();
  return wikiArticles.filter(article =>
    article.question.toLowerCase().includes(lowercaseQuery) ||
    article.quickAnswer.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
}
