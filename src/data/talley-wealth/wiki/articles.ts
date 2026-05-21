import type { WikiArticle } from './types';

export const wikiArticles: WikiArticle[] = [
  // ============================================
  // RETIREMENT PLANNING (5 articles)
  // ============================================
  {
    slug: 'when-can-i-afford-to-retire',
    category: 'retirement-planning',
    question: 'How do I know when I can afford to retire?',
    quickAnswer: 'You can typically retire when your savings, Social Security, and other income sources can sustain your desired lifestyle for 30+ years. A common rule of thumb is the 4% rule—if 4% of your portfolio plus other income covers your expenses, you may be ready. However, retirement readiness depends on your specific expenses, healthcare needs, and goals.',
    content: `This is the question that keeps most pre-retirees up at night. Let me break down how we actually think about it.

**The basic math:**
Add up your expected annual expenses in retirement. Include everything—housing, healthcare, travel, hobbies, helping family. Then compare that to your income sources:
- Social Security (estimate at ssa.gov)
- Pension income (if any)
- Rental income or other passive sources
- Sustainable withdrawals from your portfolio

**The 4% rule:**
A commonly cited guideline suggests you can withdraw 4% of your portfolio in year one, then adjust for inflation each year. So $1 million = roughly $40,000/year. This isn't perfect, but it's a starting point.

**What the 4% rule misses:**
- It assumes a 30-year retirement. If you retire at 55, you might need 40 years.
- It doesn't account for sequence of returns risk—bad markets early in retirement hurt more.
- Healthcare costs before Medicare can be significant.
- Your spending won't be constant—most people spend more early in retirement, less later, then more again for healthcare.

**The real answer:**
Retirement readiness isn't just about hitting a number. It's about:
- Having a clear picture of your expenses
- Understanding your income sources
- Building in buffers for healthcare and emergencies
- Testing your assumptions with realistic projections

This is exactly the kind of clarity we help clients build. The goal isn't just to retire—it's to retire confidently.`,
    relatedSlugs: ['how-much-should-i-have-saved-by-age', 'when-should-i-claim-social-security'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'when-should-i-claim-social-security',
    category: 'retirement-planning',
    question: 'When should I claim Social Security benefits?',
    quickAnswer: 'For most people, delaying Social Security until age 70 provides the highest lifetime benefit—your benefit grows roughly 8% per year from full retirement age to 70. However, claiming earlier makes sense if you have health concerns, need the income, or have a lower-earning spouse who can claim spousal benefits while you delay.',
    content: `Social Security timing is one of the highest-stakes decisions in retirement planning. Let me help you think through it.

**The basics:**
- Earliest claim: Age 62 (reduced benefit—about 30% less than full retirement age)
- Full Retirement Age: 66-67 depending on birth year
- Maximum benefit: Age 70 (increased about 8% per year from FRA)

**The math:**
If your full retirement benefit is $2,500/month:
- At 62: ~$1,750/month
- At 67: $2,500/month  
- At 70: ~$3,100/month

**When delaying makes sense:**
- You're in good health and expect to live into your 80s or beyond
- You can afford to wait (other savings, spouse still working)
- You want to maximize survivor benefits for your spouse
- You're still working and would face the earnings test

**When claiming early makes sense:**
- Health concerns that may limit lifespan
- You need the income and don't have other sources
- You're the lower-earning spouse in a strategic claiming plan
- You've been laid off and need bridge income

**The spousal strategy:**
For married couples, coordination matters. Sometimes one spouse claims early while the other delays to maximize survivor benefits. This requires careful planning based on both benefit amounts and ages.

**The bottom line:**
There's no universally right answer. The best strategy depends on your health, other income sources, and marital situation. This is one area where getting it right matters—the difference between optimal and suboptimal claiming can be $100,000+ over a lifetime.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'how-much-should-i-have-saved-by-age'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'how-much-should-i-have-saved-by-age',
    category: 'retirement-planning',
    question: 'How much should I have saved for retirement by my age?',
    quickAnswer: 'Common benchmarks suggest having 1x your salary saved by 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67. These are rough guidelines—your actual target depends on your desired retirement lifestyle, expected Social Security, pension income, and when you plan to retire.',
    content: `These "age-based" savings benchmarks are everywhere. Let me tell you what they actually mean—and what they miss.

**The common benchmarks (based on salary):**
- Age 30: 1x annual salary
- Age 40: 3x annual salary
- Age 50: 6x annual salary
- Age 60: 8x annual salary
- Age 67: 10-12x annual salary

**Why these are useful:**
They give you a rough checkpoint. If you're 50 with twice your salary saved, you know you need to accelerate savings. If you're ahead of schedule, you can breathe a bit.

**Why these can be misleading:**
- They assume you'll spend 70-80% of your pre-retirement income. Maybe you'll spend less. Maybe more.
- They don't account for Social Security differences
- They ignore pensions (increasingly rare, but if you have one, it changes everything)
- They assume "average" returns. Your actual experience will vary.

**A better way to think about it:**
Instead of salary multiples, think about what you'll actually spend. If you need $60,000/year in retirement and expect $25,000 from Social Security, you need to cover a $35,000 gap from savings. Using the 4% rule, that's roughly $875,000 in savings.

**The catch-up conversation:**
If you're behind these benchmarks, don't panic—but do act. Consider:
- Maxing out retirement contributions (including catch-up contributions after 50)
- Working a few years longer
- Adjusting retirement expectations
- Paying off debt to reduce retirement expenses

**My take:**
These benchmarks are better than no benchmarks, but they're not a plan. A real plan accounts for your specific situation—your income, spending, Social Security estimate, and goals.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'what-is-sequence-of-returns-risk'],
    lastUpdated: '2025-12-10',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'what-is-sequence-of-returns-risk',
    category: 'retirement-planning',
    question: 'What is sequence of returns risk and why does it matter?',
    quickAnswer: 'Sequence of returns risk is the danger that market downturns early in retirement can permanently damage your portfolio, even if long-term returns are average. When you\'re withdrawing money, a down market forces you to sell more shares to meet expenses—those shares aren\'t there to recover when markets rebound.',
    content: `This is one of the most underappreciated risks in retirement planning. Let me explain why it matters so much.

**The concept:**
During your working years, a bad market early on barely matters—you have decades to recover. In retirement, the opposite is true. Early losses combined with withdrawals can devastate a portfolio.

**An example:**
Two retirees both average 7% returns over 30 years:
- Retiree A: Gets the bad years early, good years later
- Retiree B: Gets good years early, bad years later

Even with identical average returns, Retiree A runs out of money while Retiree B ends up wealthy. The order of returns matters enormously when you're withdrawing.

**Why it matters:**
- The first 5-10 years of retirement are critical
- A bear market right as you retire can force you to sell low and never recover
- This is why the 4% rule isn't guaranteed—it assumes average sequence of returns

**What you can do about it:**
1. **Build a cash buffer**: 1-2 years of expenses in cash so you don't have to sell stocks in a downturn
2. **Adjust spending**: Be flexible—reduce withdrawals in bad years if possible
3. **Consider a bond tent**: Higher bond allocation early in retirement, gradually shifting to stocks
4. **Delay Social Security**: Use portfolio early, then switch to Social Security for a more stable income base
5. **Part-time work**: Even modest income in early retirement reduces the pressure on your portfolio

**The planning implication:**
This is why retirement planning isn't just about "having enough"—it's about structuring your withdrawals to be resilient. A good plan accounts for bad sequences, not just average outcomes.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'how-should-i-invest-in-retirement'],
    lastUpdated: '2025-12-12',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'medicare-what-i-need-to-know',
    category: 'retirement-planning',
    question: 'What do I need to know about Medicare before retiring?',
    quickAnswer: 'Medicare eligibility begins at 65, regardless of retirement age. You should enroll during your Initial Enrollment Period (3 months before to 3 months after turning 65) to avoid late penalties. Original Medicare (Parts A & B) covers hospital and medical services; Part D covers prescriptions. Many people add Medigap or Medicare Advantage for additional coverage.',
    content: `Medicare is complicated, but the core decisions are manageable. Here's what matters.

**The timeline:**
- Age 65: You're eligible (regardless of when you retire)
- Initial Enrollment Period: 7 months centered on your 65th birthday
- If you're still working with employer coverage, you may delay—but there are rules

**The parts of Medicare:**
- **Part A (Hospital)**: Usually premium-free if you paid payroll taxes for 10+ years
- **Part B (Medical)**: Monthly premium (~$175/month in 2024), covers doctor visits, outpatient care
- **Part D (Prescriptions)**: Separate plans with varying premiums and coverage
- **Medigap (Supplement)**: Fills gaps in Original Medicare, sold by private insurers
- **Medicare Advantage (Part C)**: Alternative to Original Medicare, often includes drug coverage

**The decision tree:**
1. Original Medicare + Medigap + Part D = Most flexibility, any doctor who accepts Medicare, predictable costs
2. Medicare Advantage = Often lower premiums, but network restrictions, variable out-of-pocket

**The penalties:**
If you don't enroll on time and don't have qualifying employer coverage:
- Part B: 10% penalty for each 12-month period you delayed (forever)
- Part D: 1% penalty per month you delayed (forever)

**What people miss:**
- IRMAA: High earners pay more for Parts B and D (based on tax returns from 2 years prior)
- Medigap timing: Best rates are during open enrollment at 65—if you wait, you may face medical underwriting
- Retiring before 65: You'll need bridge coverage (COBRA, marketplace, spouse's plan)

**The bottom line:**
Healthcare costs are one of the biggest retirement expenses. Understanding Medicare isn't optional—it's essential to retiring confidently.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'when-should-i-claim-social-security'],
    lastUpdated: '2025-12-20',
    author: 'David Talley',
    type: 'practical',
  },

  // ============================================
  // INVESTMENT BASICS (5 articles)
  // ============================================
  {
    slug: 'what-is-asset-allocation',
    category: 'investment-basics',
    question: 'What is asset allocation and why does it matter?',
    quickAnswer: 'Asset allocation is how you divide your investments among different asset classes—typically stocks, bonds, and cash. Research shows asset allocation drives the majority of your long-term returns, more than individual stock picks. The right allocation depends on your time horizon, risk tolerance, and goals.',
    content: `Asset allocation is arguably the most important investment decision you'll make. Here's why.

**What it means:**
Asset allocation is the mix of investments in your portfolio:
- Stocks (equities): Higher growth potential, higher volatility
- Bonds (fixed income): Lower returns, more stability
- Cash: Safe but barely keeps up with inflation
- Other: Real estate, commodities, alternatives

**Why it matters:**
Studies consistently show that asset allocation explains 90%+ of the variation in portfolio returns over time. In other words, the mix matters far more than picking individual stocks.

**How to think about it:**
- **Stocks**: The engine of long-term growth. Historically ~10% annual returns, but with significant year-to-year swings.
- **Bonds**: The stabilizer. Lower returns (~4-5%), but cushion during stock downturns.
- **The mix**: More stocks = more growth potential + more volatility. More bonds = more stability + lower expected returns.

**Common allocation frameworks:**
- Age in bonds (60 years old = 60% bonds): Simple but often too conservative
- Risk-based: Match allocation to your actual ability to handle volatility
- Goals-based: Different allocations for different goals with different timelines

**What I tell clients:**
The "right" allocation is one you can stick with. A 90% stock portfolio that you panic-sell in a downturn is worse than an 60/40 portfolio you hold through thick and thin.

**The rebalancing piece:**
Over time, winning investments become a larger share of your portfolio. Rebalancing—selling winners and buying laggards—keeps your allocation on track and forces "buy low, sell high."`,
    relatedSlugs: ['how-should-i-invest-in-retirement', 'what-is-diversification'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'what-is-diversification',
    category: 'investment-basics',
    question: 'What does diversification actually mean for my portfolio?',
    quickAnswer: 'Diversification means spreading investments across different assets so poor performance in one area doesn\'t devastate your entire portfolio. True diversification includes different asset classes (stocks, bonds), geographic regions (US, international), sectors, and investment styles (growth, value). The goal is reducing risk without sacrificing expected return.',
    content: `"Don't put all your eggs in one basket" is investing advice as old as investing itself. But what does real diversification look like?

**What diversification IS:**
Owning investments that don't all move together. When one zigs, another zags. The goal is smoothing your overall ride.

**What diversification is NOT:**
- Owning 20 different tech stocks (they all move together)
- Having accounts at multiple brokerages with similar investments
- Buying different mutual funds that own the same underlying stocks

**Dimensions of diversification:**
1. **Asset class**: Stocks, bonds, real estate, cash
2. **Geography**: US, developed international, emerging markets
3. **Company size**: Large-cap, mid-cap, small-cap
4. **Style**: Growth vs. value
5. **Sector**: Technology, healthcare, financials, etc.

**The practical reality:**
A simple, diversified portfolio might look like:
- US total stock market index (60%)
- International stock index (20%)
- US bond index (20%)

That's three funds covering thousands of individual securities across multiple dimensions.

**Common diversification mistakes:**
- Over-concentration in employer stock (Enron employees learned this the hard way)
- Home country bias (Americans often underweight international)
- Confusing number of holdings with diversification

**The trade-off:**
Diversification means you'll never be 100% in the best-performing investment. That's the point. You also won't be 100% in the worst. The goal is a return you can live with, with risk you can tolerate.`,
    relatedSlugs: ['what-is-asset-allocation', 'how-much-international-stock-should-i-own'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-should-i-invest-in-retirement',
    category: 'investment-basics',
    question: 'How should my investment strategy change in retirement?',
    quickAnswer: 'In retirement, your portfolio shifts from accumulation to distribution. This typically means a more conservative allocation, but not too conservative—you still need growth to outpace inflation over a 30-year retirement. Focus on sustainable withdrawal rates, income generation, and managing sequence of returns risk.',
    content: `The shift from saving to spending requires a different investment mindset. Here's what changes.

**The fundamental shift:**
- Working years: You're adding money. Volatility is opportunity.
- Retirement: You're withdrawing money. Volatility can be dangerous.

**What stays the same:**
- You still need growth (inflation will double prices over 25 years)
- Diversification still matters
- Costs still matter

**What changes:**
- Sequence of returns risk becomes real (bad early returns hurt more)
- Income generation becomes more important
- Liquidity needs increase (you need access to cash)

**A common approach:**
The "bucket strategy" divides your portfolio:
- Bucket 1 (1-2 years): Cash for near-term spending
- Bucket 2 (3-10 years): Bonds for medium-term stability  
- Bucket 3 (10+ years): Stocks for long-term growth

This structure lets you weather downturns without selling stocks at lows.

**Allocation in retirement:**
The old "age in bonds" rule is too simplistic. A healthy 65-year-old might live 30+ more years—that's a long time to be too conservative. Many retirees maintain 40-60% in stocks, adjusting based on other income sources (Social Security, pension) and risk tolerance.

**What to avoid:**
- Going too conservative too early
- Chasing yield in risky investments
- Ignoring inflation's long-term impact
- Over-concentrating in "safe" dividend stocks

**The planning piece:**
Retirement investing isn't just about returns—it's about creating reliable income while preserving capital. That requires coordination between your investments and your withdrawal strategy.`,
    relatedSlugs: ['what-is-sequence-of-returns-risk', 'what-is-asset-allocation'],
    lastUpdated: '2025-12-10',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'how-much-international-stock-should-i-own',
    category: 'investment-basics',
    question: 'How much international stock should I own?',
    quickAnswer: 'Most financial experts suggest 20-40% of your stock allocation in international equities. International stocks provide diversification benefits—different economies perform well at different times. While US stocks have outperformed recently, international diversification protects against extended periods of US underperformance.',
    content: `This is a question that divides even professional investors. Let me give you both the data and the practical considerations.

**The case for international:**
- About 40% of global stock market value is outside the US
- US and international stocks don't move in lockstep—diversification benefit
- The US won't always be the best-performing market
- Emerging markets offer higher growth potential (with higher risk)

**The case for US-heavy:**
- US companies are global (Apple sells everywhere)
- US markets are more efficient and transparent
- Currency risk adds complexity
- US has outperformed international for 15+ years

**What the research says:**
Historical data shows the "winner" rotates. US stocks dominated 2010-2024, but international led 2000-2009. Owning both smooths returns over full market cycles.

**Common allocations:**
- Conservative: 10-20% international
- Moderate: 20-30% international
- Aggressive/Global: 30-40% international

**My take:**
20-30% international is a reasonable middle ground for most investors. You get diversification benefits without being overly exposed to currency risk and less-familiar markets.

**Implementation:**
- Developed international (Europe, Japan, Australia): More stable, lower expected return
- Emerging markets (China, India, Brazil): Higher growth potential, more volatile
- A typical split: 15-20% developed, 5-10% emerging

**What matters most:**
Pick an allocation you can stick with. If international stocks underperform for years, will you abandon ship? If so, consider a smaller allocation you can hold through the rough patches.`,
    relatedSlugs: ['what-is-diversification', 'what-is-asset-allocation'],
    lastUpdated: '2025-12-12',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'index-funds-vs-actively-managed',
    category: 'investment-basics',
    question: 'Should I use index funds or actively managed funds?',
    quickAnswer: 'Index funds typically outperform actively managed funds over time, primarily because of lower costs. While some active managers beat their benchmarks, most don\'t, and it\'s nearly impossible to identify winners in advance. For most investors, low-cost index funds provide better long-term results with less complexity.',
    content: `This debate has been running for decades, but the data is increasingly clear. Let me break it down.

**Index funds:**
- Track a market index (S&P 500, Total Stock Market, etc.)
- Very low costs (0.03-0.20% expense ratios)
- No attempt to "beat the market"—you get market returns, minus small fees
- Broadly diversified, transparent

**Active management:**
- Fund managers try to beat the market through research and trading
- Higher costs (0.50-1.50% expense ratios)
- Sometimes outperform, often underperform
- Can adjust to market conditions (theoretically)

**What the research shows:**
Over 15-year periods, 85-90% of actively managed funds underperform their benchmark index. The primary reason? Fees. If you pay 1% more in fees, you need to outperform by 1% just to break even.

**Why active management is hard:**
- Markets are efficient—public information is already in prices
- Trading costs eat into returns
- Good managers attract assets, making it harder to maintain performance
- Even skilled managers have bad stretches

**When active might make sense:**
- Some asset classes (municipal bonds, emerging markets) may benefit from active management
- Tax-loss harvesting opportunities
- Specific mandates (ESG, sector focus)

**The practical advice:**
For core portfolio holdings—US stocks, international stocks, US bonds—low-cost index funds are hard to beat. Save your complexity (and costs) for areas where it might actually add value.

**What we do:**
Our investment approach relies heavily on low-cost, diversified index funds. We'd rather focus our energy on financial planning, tax optimization, and behavioral coaching than trying to pick winning funds.`,
    relatedSlugs: ['what-is-asset-allocation', 'what-is-diversification'],
    lastUpdated: '2025-12-20',
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
    quickAnswer: 'A Roth conversion makes sense when you expect your future tax rate to be higher than your current rate, or when you have a window of lower income (early retirement, gap year). You pay taxes now but get tax-free growth and withdrawals later. The sweet spot is often the years between retirement and age 72 when RMDs begin.',
    content: `Roth conversions are one of the most powerful tax planning tools available—but they're not right for everyone.

**How it works:**
Move money from a traditional IRA/401(k) to a Roth IRA. You pay income tax on the conversion now, but the money grows tax-free and withdrawals in retirement are tax-free.

**When conversions make sense:**
1. You're in a lower tax bracket now than you expect in retirement
2. You're between retirement and RMDs (the "golden window")
3. You have cash outside the IRA to pay the taxes
4. You want to leave tax-free money to heirs
5. You're concerned about future tax rate increases

**When to be cautious:**
1. You'll need to use IRA money to pay the taxes (undermines the benefit)
2. You're already in a high bracket
3. You plan to be in a lower bracket in retirement
4. You need access to the funds within 5 years (5-year rule applies)

**The "golden window" strategy:**
Many people have a 5-10 year window between retiring (income drops) and age 72 (RMDs begin and push income back up). This window is ideal for strategic Roth conversions—filling up lower tax brackets each year.

**Example:**
Married couple retires at 62 with no income. They can convert ~$94,000 annually and stay in the 12% bracket. Over 10 years, they convert $940,000 to tax-free status while paying historically low rates.

**The analysis:**
This isn't a one-time decision—it's multi-year tax planning. We model scenarios to find the optimal conversion strategy for each client's situation.`,
    relatedSlugs: ['traditional-vs-roth-which-is-better', 'what-are-required-minimum-distributions'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'traditional-vs-roth-which-is-better',
    category: 'tax-planning',
    question: 'Traditional vs. Roth retirement accounts: Which is better?',
    quickAnswer: 'Traditional accounts give you a tax deduction now but taxable withdrawals later. Roth accounts offer no deduction now but tax-free withdrawals later. The "better" choice depends on whether you\'re in a higher tax bracket now or expect to be in retirement. For most people, having both types provides tax flexibility.',
    content: `This is one of the most common retirement questions, and the answer is: it depends. Let me give you a framework.

**Traditional 401(k)/IRA:**
- Contributions reduce taxable income now
- Investments grow tax-deferred
- Withdrawals taxed as ordinary income
- Required Minimum Distributions at 73

**Roth 401(k)/IRA:**
- Contributions made after-tax (no deduction)
- Investments grow tax-free
- Qualified withdrawals are tax-free
- No RMDs for Roth IRAs (Roth 401k RMDs eliminated in 2024)

**When traditional often wins:**
- You're in a high tax bracket now
- You expect to be in a lower bracket in retirement
- You need the tax deduction to maximize contributions

**When Roth often wins:**
- You're in a lower tax bracket now
- You expect higher rates in retirement
- You want tax-free income to manage retirement taxes
- You want to leave tax-free money to heirs

**The real answer: Both.**
Tax diversification is powerful. Having both traditional and Roth money gives you flexibility:
- Pull from traditional to "fill up" low tax brackets
- Use Roth for additional needs without increasing taxable income
- Manage IRMAA (Medicare premium surcharges)
- Control capital gains rates by managing AGI

**What we recommend:**
If you can only choose one, follow the tax bracket guidance above. If you have flexibility, build both buckets. Future tax rates are uncertain—diversification hedges against that uncertainty.`,
    relatedSlugs: ['roth-conversion-should-i', 'what-are-required-minimum-distributions'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'what-are-required-minimum-distributions',
    category: 'tax-planning',
    question: 'What are Required Minimum Distributions and how do they affect me?',
    quickAnswer: 'RMDs are mandatory annual withdrawals from traditional retirement accounts starting at age 73. The amount is calculated by dividing your account balance by an IRS life expectancy factor. RMDs can push you into higher tax brackets and affect Medicare premiums. Strategic planning before RMDs begin can reduce their lifetime tax impact.',
    content: `RMDs are one of those things that surprise people—you've deferred taxes for decades, and now the IRS wants its share.

**The basics:**
- Required Minimum Distributions start at age 73 (moving to 75 in 2033)
- Apply to traditional IRAs, 401(k)s, 403(b)s, and most employer plans
- Do NOT apply to Roth IRAs (huge advantage)
- Penalty for missing RMDs: 25% of the amount not withdrawn

**How they're calculated:**
Divide your December 31 account balance by an IRS life expectancy factor. At 73, that factor is about 26.5, meaning you withdraw roughly 3.8%. The percentage increases each year as your life expectancy shrinks.

**Why RMDs matter:**
If you've been a good saver, RMDs can be substantial. Someone with $2 million in traditional accounts might face an $80,000+ RMD—on top of Social Security and any other income. That can:
- Push you into higher tax brackets
- Increase Medicare premiums (IRMAA)
- Make more Social Security taxable
- Reduce tax-efficient investment positioning

**The planning opportunity:**
The years between retirement and RMDs are golden. Consider:
- Roth conversions to reduce future traditional balances
- Strategic withdrawals to "smooth" income over time
- Charitable giving from IRAs (Qualified Charitable Distributions)

**QCDs—the secret weapon:**
After age 70½, you can donate up to $105,000/year directly from your IRA to charity. It satisfies your RMD but isn't included in taxable income. If you're charitably inclined, this is powerful.

**Bottom line:**
RMD planning isn't something to think about at 72. The best strategies start years earlier.`,
    relatedSlugs: ['roth-conversion-should-i', 'traditional-vs-roth-which-is-better'],
    lastUpdated: '2025-12-10',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'tax-loss-harvesting-explained',
    category: 'tax-planning',
    question: 'What is tax-loss harvesting and should I do it?',
    quickAnswer: 'Tax-loss harvesting means selling investments at a loss to offset capital gains or income. You can deduct up to $3,000 in net losses against ordinary income each year, with excess losses carrying forward. The key is replacing the sold investment with something similar (but not "substantially identical") to maintain market exposure.',
    content: `Tax-loss harvesting is one of the few free lunches in investing. Let me explain how it works.

**The concept:**
When investments decline in value, you have an "unrealized" loss. Selling crystallizes that loss, which can offset:
1. Capital gains from other investments
2. Up to $3,000 of ordinary income per year
3. Future gains (losses carry forward indefinitely)

**The process:**
1. Identify investments trading below your purchase price
2. Sell to realize the loss
3. Immediately buy a similar (but not identical) investment
4. Maintain your desired market exposure while banking the tax benefit

**The "wash sale" rule:**
You can't buy a "substantially identical" investment within 30 days before or after the sale. If you do, the loss is disallowed.

What's substantially identical?
- Same stock: Yes (can't sell Apple and buy Apple within 30 days)
- Same index fund from different providers: Probably yes
- Different index tracking similar markets: Probably no (S&P 500 vs. Total Stock Market is usually fine)

**When to harvest:**
- Market downturns (more opportunities)
- Year-end planning (match gains with losses)
- Throughout the year (don't wait for December)

**What to watch:**
- Transaction costs
- Bid-ask spreads
- Wash sale violations
- Long-term vs. short-term status

**Is it worth it?**
For larger portfolios, yes. A $10,000 harvested loss at a 32% marginal rate saves $3,200 in taxes. Over time, these savings compound. The key is maintaining discipline and not letting tax considerations override good investment decisions.`,
    relatedSlugs: ['how-are-investments-taxed', 'index-funds-vs-actively-managed'],
    lastUpdated: '2025-12-12',
    author: 'David Talley',
    type: 'strategy',
  },
  {
    slug: 'how-are-investments-taxed',
    category: 'tax-planning',
    question: 'How are different types of investment income taxed?',
    quickAnswer: 'Investment taxation depends on the type of income: Qualified dividends and long-term capital gains are taxed at preferential rates (0%, 15%, or 20%). Short-term gains and ordinary dividends are taxed as ordinary income. Interest income is generally taxed as ordinary income (except municipal bond interest, which is often tax-free).',
    content: `Understanding investment taxation helps you keep more of what you earn. Let me break down the categories.

**Long-term capital gains (assets held 1+ year):**
- 0% for income up to ~$44,000 (single) / ~$89,000 (married)
- 15% for income up to ~$492,000 (single) / ~$553,000 (married)
- 20% for income above those thresholds
- Plus 3.8% Net Investment Income Tax for high earners

**Short-term capital gains (assets held less than 1 year):**
- Taxed as ordinary income (up to 37%)
- This is why we generally prefer holding investments long-term

**Qualified dividends:**
- Same preferential rates as long-term capital gains
- Must meet holding period requirements
- Most US stock dividends qualify

**Ordinary dividends:**
- Taxed as ordinary income
- REITs, some foreign stocks, money market funds

**Interest income:**
- Taxed as ordinary income
- Bank interest, corporate bonds, Treasury bonds (federal, not state)
- Municipal bonds are generally tax-free (federal and often state)

**Tax-efficient location:**
Different accounts have different tax treatment:
- Taxable accounts: Best for buy-and-hold investments with qualified dividends
- Traditional IRA/401(k): Good for bonds (converts to ordinary income anyway)
- Roth IRA: Best for highest-growth investments (tax-free growth)

**The planning opportunity:**
Asset location—holding the right investments in the right accounts—can add 0.25-0.50% to after-tax returns annually. That adds up over decades.

This is why comprehensive planning matters. It's not just what you own, but where you own it.`,
    relatedSlugs: ['tax-loss-harvesting-explained', 'traditional-vs-roth-which-is-better'],
    lastUpdated: '2025-12-20',
    author: 'David Talley',
    type: 'educational',
  },

  // ============================================
  // ESTATE & LEGACY (3 articles)
  // ============================================
  {
    slug: 'what-estate-documents-do-i-need',
    category: 'estate-planning',
    question: 'What estate planning documents do I need?',
    quickAnswer: 'Everyone should have four essential documents: a will (directs asset distribution), durable power of attorney (handles financial decisions if you\'re incapacitated), healthcare power of attorney (makes medical decisions), and living will/advance directive (outlines end-of-life wishes). For larger estates, trusts may provide additional benefits.',
    content: `Estate planning isn't just for the wealthy. Everyone needs basic documents to protect themselves and their families.

**The essential four:**

**1. Last Will and Testament**
- Names who gets your assets
- Names guardian for minor children
- Appoints an executor to handle your estate
- Only controls assets in your name alone (not beneficiary-designated or jointly owned)

**2. Durable Power of Attorney**
- Authorizes someone to handle financial matters if you can't
- "Durable" means it continues if you become incapacitated
- Without one, your family may need court intervention

**3. Healthcare Power of Attorney**
- Authorizes someone to make medical decisions if you can't
- Choose someone who knows your wishes and can advocate for you
- Different from a living will

**4. Living Will / Advance Directive**
- States your wishes for end-of-life care
- Addresses life support, feeding tubes, etc.
- Reduces burden on family during difficult decisions

**Beyond the basics:**

**Revocable Living Trust**
- Avoids probate
- Provides privacy (wills are public)
- Allows for incapacity planning
- Generally useful for larger or more complex estates

**Beneficiary designations:**
These override your will for retirement accounts, life insurance, etc. Keep them updated—I've seen more estate planning failures from outdated beneficiaries than from anything else.

**When to review:**
- After major life events (marriage, divorce, children, death)
- Every 3-5 years regardless
- When laws change significantly

**The bottom line:**
Having no documents means the state decides who gets your assets and who makes decisions for you. Take control by having these in place.`,
    relatedSlugs: ['do-i-need-a-trust', 'how-to-leave-money-to-children'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'do-i-need-a-trust',
    category: 'estate-planning',
    question: 'Do I need a trust?',
    quickAnswer: 'A revocable living trust is beneficial if you want to avoid probate, maintain privacy, own real estate in multiple states, or need flexibility for complex family situations. Trusts aren\'t just for the wealthy—the benefits often justify the cost for middle-class families. However, simpler estates may only need a will with proper beneficiary designations.',
    content: `"Do I need a trust?" is one of the most common estate planning questions. The answer depends on your situation.

**What a revocable living trust does:**
- Avoids probate (the court process of validating a will)
- Keeps your estate private (wills become public record)
- Provides incapacity planning
- Allows for flexible distribution (staggered inheritances, etc.)
- Covers real estate in multiple states seamlessly

**When a trust makes sense:**
- You own property in multiple states (avoids probate in each state)
- You want privacy about your assets and beneficiaries
- You want to control how assets are distributed over time
- You have minor children or beneficiaries who shouldn't receive lump sums
- You have a blended family with complex dynamics
- Your state has slow or expensive probate

**When a trust might not be necessary:**
- Your estate is simple (all to spouse, then equally to kids)
- Most assets have beneficiary designations (retirement accounts, life insurance)
- You own property only in one state with simple probate
- Your estate is small and cost is a concern

**The cost consideration:**
A basic revocable trust typically costs $1,500-3,500 from an estate planning attorney. Compare this to:
- Probate costs (typically 3-7% of estate value in some states)
- Time delay (6 months to 2 years)
- Loss of privacy

**Common misconceptions:**
- "Trusts are only for rich people": Not true. Many middle-class families benefit.
- "A trust avoids estate taxes": Revocable trusts don't—irrevocable trusts might.
- "Once I have a trust, I'm done": You must fund the trust (retitle assets) for it to work.

**The planning piece:**
Trusts are a tool, not a goal. The question is what you're trying to accomplish—then we determine if a trust helps achieve that.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'how-to-leave-money-to-children'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-to-leave-money-to-children',
    category: 'estate-planning',
    question: 'What\'s the best way to leave money to my children?',
    quickAnswer: 'Consider age-appropriate distributions rather than lump sums—many parents use trusts to distribute assets in stages (25%, 35%, 45%, or over time). Life insurance can provide immediate tax-free funds. For retirement accounts, understand the 10-year distribution rule for inherited IRAs. Roth accounts are particularly valuable to leave to heirs.',
    content: `Leaving money to the next generation involves more than just naming beneficiaries. Let me walk through the considerations.

**The fundamental question:**
Should your children receive everything immediately, or would structured access be better? Most financial planners recommend against lump-sum inheritances to young adults.

**Structured distribution options:**

**Age-based stages:**
- 1/3 at 25, 1/3 at 30, 1/3 at 35
- Full access at 40 (or whatever age makes sense)
- Requires a trust to implement

**Purpose-based access:**
- Education expenses: Available immediately
- Home purchase: Available with trustee approval
- Living expenses: Discretionary distributions
- Remainder at specified age

**Outright distribution:**
- Simple, no ongoing trust administration
- Appropriate for mature adult children
- Risk: Creditors, divorce, poor decisions

**The inherited IRA problem (SECURE Act):**
Non-spouse beneficiaries must now empty inherited IRAs within 10 years. For large IRAs inherited by high-earning children, this can trigger significant taxes. Roth conversions during your lifetime can help—your children inherit tax-free.

**Life insurance considerations:**
- Provides immediate liquidity
- Proceeds are income-tax-free
- Can equalize inheritance if one child gets the business
- Consider an ILIT for estate-tax-free proceeds

**What we see go wrong:**
1. Outdated beneficiaries (ex-spouses, deceased relatives)
2. Lump sums to unprepared heirs
3. No plan for minor children (court may appoint a guardian for their money)
4. Forgetting about digital assets

**The conversation:**
This is an area where family dynamics matter as much as tax efficiency. We help clients think through not just the "what" but the "how" and "when."`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'do-i-need-a-trust'],
    lastUpdated: '2025-12-10',
    author: 'David Talley',
    type: 'strategy',
  },

  // ============================================
  // LIFE TRANSITIONS (4 articles)
  // ============================================
  {
    slug: 'received-an-inheritance-what-now',
    category: 'life-transitions',
    question: 'I received an inheritance. What should I do?',
    quickAnswer: 'First, take time—there\'s no rush to make major decisions. Park the money somewhere safe (savings account, money market) while you process both emotionally and logistically. Understand the tax implications, then develop a plan that honors both the gift and your long-term goals. Avoid lifestyle inflation and impulsive decisions.',
    content: `Receiving an inheritance is both a blessing and a responsibility. Here's how to approach it thoughtfully.

**The most important advice:**
Slow down. There's no decision that needs to be made this week. Most financial mistakes after an inheritance come from acting too quickly.

**Immediate steps:**

**1. Park the money safely**
Put it in a savings account or money market. You'll earn modest interest while you plan. Don't invest or make major purchases yet.

**2. Understand the tax situation**
- Cash inheritance: Generally not taxable to you
- Inherited IRA: Special distribution rules apply (usually 10-year rule)
- Inherited property: You get a "stepped-up" basis (reset to value at death)
- Estate taxes: Only applies to very large estates ($13.6M+)

**3. Assemble your team**
- Financial advisor (for the plan)
- CPA (for tax implications)
- Estate attorney (if there's complexity or ongoing trust involvement)

**What NOT to do:**
- Don't quit your job
- Don't buy a new house or car immediately
- Don't loan or give money to family under pressure
- Don't invest in anything you don't understand

**Building a plan:**

**Consider your existing goals:**
- Does this accelerate retirement?
- Does it pay off debt?
- Does it fund children's education?
- Does it provide a cushion for emergencies?

**Honor the gift:**
Many people find meaning in using inheritance for things the deceased would have valued—education, family experiences, charitable giving.

**The emotional side:**
Inheritance often comes with complicated feelings—grief, guilt, responsibility. These are real. Take time to process before making financial decisions.

**Our role:**
We help clients navigate inheritance with both technical expertise and emotional awareness. The goal is making choices you'll be proud of years later.`,
    relatedSlugs: ['how-to-leave-money-to-children', 'what-estate-documents-do-i-need'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'financial-planning-during-divorce',
    category: 'life-transitions',
    question: 'What financial planning should I do during a divorce?',
    quickAnswer: 'Divorce requires separating joint finances, understanding asset division implications (especially for retirement accounts and real estate), and rebuilding your individual financial plan. Get your own financial advisor, understand the tax consequences of different settlement options, and update all estate documents and beneficiary designations.',
    content: `Divorce is one of the most financially complex life events. Here's what to prioritize.

**Immediate steps:**

**1. Assemble your team**
- Divorce attorney
- Financial advisor (your own, not a joint one)
- CPA familiar with divorce taxation

**2. Gather documentation**
- All account statements (bank, investment, retirement)
- Tax returns (3-5 years)
- Property records, mortgage statements
- Insurance policies
- Business valuations if applicable

**3. Establish individual credit**
- Open accounts in your name alone
- Start building credit history

**Asset division considerations:**

**Retirement accounts:**
Not all dollars are equal. $100,000 in a taxable account is worth more than $100,000 in a 401(k)—you'll owe taxes on the 401(k) when you withdraw. A QDRO (Qualified Domestic Relations Order) is needed to divide retirement accounts tax-free.

**The house:**
Keeping the house is often emotionally appealing but financially problematic. Can you afford the mortgage, taxes, insurance, and maintenance on one income? Selling and splitting proceeds is often cleaner.

**Social Security:**
If married 10+ years, you may be entitled to benefits based on your ex-spouse's record. This doesn't reduce their benefit.

**Tax implications:**
- Alimony (divorces before 2019): Deductible to payer, taxable to recipient
- Child support: Not deductible or taxable
- Filing status: Determined by status on December 31

**Rebuilding:**

**Update everything:**
- Will, trust, powers of attorney
- Beneficiary designations (retirement accounts, life insurance)
- Account ownership and titles

**Create your new plan:**
- Revised budget on single income
- Retirement projections
- Emergency fund (especially important now)
- Insurance review

**The emotional component:**
Financial decisions during divorce are often clouded by emotions. That's human. Having an objective advisor helps ensure you don't make choices you'll regret.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'what-estate-documents-do-i-need'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'planning-for-career-change',
    category: 'life-transitions',
    question: 'How should I financially prepare for a major career change?',
    quickAnswer: 'Before a career change, build 6-12 months of expenses in savings, understand your health insurance options, and review how the income change affects your long-term plan. Consider the impact on retirement savings, especially if moving to self-employment. Don\'t forget about unvested stock, unused benefits, and 401(k) rollover options.',
    content: `Career changes—whether voluntary or not—require financial preparation. Here's how to approach it.

**Before you leave:**

**1. Build your runway**
6-12 months of expenses in cash. More if your new income is uncertain or you're starting a business. This isn't negotiable.

**2. Maximize current benefits**
- Vest remaining stock options if possible
- Use FSA funds (they don't roll over)
- Get medical/dental work done
- Understand COBRA costs

**3. Know your 401(k) options**
- Leave it (if balance > $7,000)
- Roll to new employer's 401(k)
- Roll to IRA (most flexibility)
- Don't cash out (taxes + 10% penalty if under 59½)

**Health insurance:**
This is often the biggest concern. Options include:
- COBRA (expensive but continues current coverage)
- Spouse's employer plan
- ACA marketplace (subsidies depend on income)
- New employer's plan (waiting periods may apply)

**If moving to self-employment:**

**Retirement accounts:**
- SEP-IRA: Simple, up to 25% of net self-employment income
- Solo 401(k): Higher contribution limits, more complexity
- Don't neglect retirement savings just because it's not automatic

**Taxes:**
- Quarterly estimated payments required
- Self-employment tax (15.3%) on top of income tax
- Deductions available (home office, health insurance, equipment)

**Income planning:**
Variable income requires different budgeting. Plan based on minimum expected income, treat excess as bonus.

**The planning exercise:**
Model scenarios:
- What if the new role pays less? Can you adjust spending?
- What if it takes 6 months to find the right opportunity?
- What if you start a business and it takes 2 years to be profitable?

**Our approach:**
Career transitions are exciting but financially risky. We help clients stress-test their plans and make transitions from a position of strength, not desperation.`,
    relatedSlugs: ['when-can-i-afford-to-retire', 'received-an-inheritance-what-now'],
    lastUpdated: '2025-12-12',
    author: 'David Talley',
    type: 'practical',
  },
  {
    slug: 'caring-for-aging-parents-financially',
    category: 'life-transitions',
    question: 'How do I plan for caring for aging parents?',
    quickAnswer: 'Start conversations early about their finances, insurance, and wishes. Understand their income sources, healthcare coverage, and estate documents. Plan for potential long-term care needs—the average cost is $5,000-10,000/month. Consider how caregiving might affect your own career and retirement timeline.',
    content: `The sandwich generation—caring for both children and parents—faces unique financial challenges. Here's how to prepare.

**Have the conversation (before it's urgent):**
Topics to discuss with parents:
- Where are financial documents kept?
- Who are their advisors (attorney, CPA, financial advisor)?
- What are their income sources and expenses?
- What insurance do they have (health, long-term care, life)?
- What are their wishes for care and end-of-life decisions?
- Are estate documents current?

**Understand their situation:**

**Income sources:**
- Social Security
- Pensions
- Retirement accounts
- Savings and investments

**Healthcare coverage:**
- Medicare Parts A, B, D
- Medigap or Medicare Advantage
- Long-term care insurance (if any)

**Long-term care planning:**

**The reality:**
70% of people over 65 will need long-term care. Average nursing home cost: $8,000-10,000/month. Home care: $4,000-6,000/month for significant needs.

**How it's paid:**
- Private pay (savings)
- Long-term care insurance (if they have it)
- Medicaid (after assets are depleted)
- Medicare does NOT cover long-term care (only short-term rehabilitation)

**Protecting their assets:**
If Medicaid may be needed, planning should start 5+ years before. Assets transferred within 5 years of applying face "look-back" penalties.

**Impact on YOUR finances:**

**Career impact:**
Caregiving often means reduced hours, career pauses, or early retirement. The average caregiver loses $300,000+ in lifetime earnings and retirement savings.

**Direct costs:**
Subsidizing housing, medical bills, or care costs can add up quickly. Set boundaries and have honest conversations about what's sustainable.

**Your own plan:**
Don't sacrifice your retirement security. You can't help anyone if you become a financial burden yourself.

**Legal preparation:**
Ensure they have:
- Durable power of attorney
- Healthcare power of attorney
- Living will
- Updated beneficiary designations

These allow you to help when they can't help themselves.`,
    relatedSlugs: ['what-estate-documents-do-i-need', 'medicare-what-i-need-to-know'],
    lastUpdated: '2025-12-20',
    author: 'David Talley',
    type: 'practical',
  },

  // ============================================
  // WORKING WITH AN ADVISOR (3 articles)
  // ============================================
  {
    slug: 'what-is-a-fiduciary',
    category: 'working-with-advisor',
    question: 'What is a fiduciary financial advisor?',
    quickAnswer: 'A fiduciary is legally required to act in your best interest, not just recommend "suitable" products. This is the highest standard of care in financial services. Registered Investment Advisers (RIAs) are held to this standard. Always ask: "Are you a fiduciary? Will you put that in writing?"',
    content: `The word "fiduciary" gets thrown around a lot. Let me explain what it actually means—and why it matters.

**The fiduciary standard:**
A fiduciary must:
1. Act in the client's best interest
2. Disclose all conflicts of interest
3. Put client interests ahead of their own
4. Provide transparent advice about fees and compensation

**The "suitability" standard (lower):**
Many brokers and insurance agents operate under a suitability standard. They must recommend products that are "suitable" for you—but not necessarily the BEST option. A higher-cost product that pays them more commission can still be "suitable."

**Why this matters:**
Under suitability: An advisor can recommend a mutual fund with a 5% sales load and 1.5% annual fees when a nearly identical no-load fund with 0.03% fees exists—as long as the expensive fund is "suitable."

Under fiduciary: The advisor must recommend the better option for you, not the one that pays them more.

**Who is (and isn't) a fiduciary:**

**Usually fiduciary:**
- Registered Investment Advisers (RIAs)
- Fee-only financial planners
- CFP® professionals (when providing financial planning)

**Usually NOT fiduciary (or only sometimes):**
- Stockbrokers
- Insurance agents
- Bank "financial advisors"
- Advisors at large wirehouses (depends on the account type)

**The test:**
Ask directly: "Are you a fiduciary? Will you act as a fiduciary for all of our interactions? Will you put that in writing?"

If they hedge, deflect, or say "it depends"—that tells you something.

**At Talley Wealth:**
We are fiduciaries, always. It's not just a legal requirement for us—it's the only way we believe advice should be given. Most of our clients pay a clear, flat fee, and we always provide full transparency about compensation.`,
    relatedSlugs: ['how-do-financial-advisors-get-paid', 'what-to-expect-first-meeting'],
    lastUpdated: '2025-12-15',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'how-do-financial-advisors-get-paid',
    category: 'working-with-advisor',
    question: 'How do financial advisors get paid?',
    quickAnswer: 'Financial advisors are paid through fees (percentage of assets, flat fees, or hourly rates), commissions (from selling products), or a combination. Fee-only advisors have fewer conflicts of interest. Always ask about total costs—including fund expense ratios—not just the advisor\'s fee.',
    content: `How an advisor gets paid affects the advice they give. Understanding compensation models helps you evaluate potential conflicts.

**Fee-only:**
The advisor is paid directly by you, period. No commissions from products.

**Common structures:**
- **Assets Under Management (AUM)**: Typically 0.5-1.5% of your portfolio annually
- **Flat fee**: Annual retainer ($3,000-15,000+ depending on complexity)
- **Hourly**: $200-500/hour for specific projects
- **Subscription**: Monthly fee for ongoing planning

**Pros:** Aligned interests, transparent, minimal conflicts
**Cons:** Can be expensive for large portfolios; some minimums apply

**Commission-based:**
The advisor earns commissions from products they sell (mutual funds, insurance, annuities).

**Pros:** May appear "free" to you
**Cons:** Strong incentive to recommend commission-paying products; potential conflicts

**Fee-based (hybrid):**
Some fee for planning/management PLUS commissions on certain products (like insurance).

**Note:** This model can create conflicts if commissions aren't disclosed. The key is transparency — you should always know how your advisor is compensated on every recommendation.

**Questions to ask:**
1. "How are you compensated?"
2. "Do you receive any commissions or referral fees?"
3. "Are you a fiduciary?"
4. "What is my total all-in cost, including fund expenses?"

**Total cost matters:**
An advisor charging 1% who uses funds with 0.50% expense ratios costs you 1.5% annually. An advisor charging 1% who uses funds with 0.05% expense ratios costs you 1.05%. Over 30 years, that 0.45% difference is enormous.

**Our approach:**
Most of our clients pay a clear, flat fee. You know exactly what you're paying and why. When other arrangements make sense for your situation, we disclose them fully. We use low-cost investments because that's what's best for you.`,
    relatedSlugs: ['what-is-a-fiduciary', 'what-to-expect-first-meeting'],
    lastUpdated: '2025-12-18',
    author: 'David Talley',
    type: 'educational',
  },
  {
    slug: 'what-to-expect-first-meeting',
    category: 'working-with-advisor',
    question: 'What should I expect in my first meeting with a financial advisor?',
    quickAnswer: 'The first meeting is typically a get-to-know-you conversation. Come ready to discuss your goals, concerns, and current financial situation (at whatever level you\'re comfortable). The advisor should explain their process, fees, and how they can help. This is a two-way evaluation—you\'re interviewing them as much as they\'re learning about you.',
    content: `The first meeting with a financial advisor should feel like a conversation, not a sales pitch. Here's what to expect.

**What the advisor should do:**
1. Ask about your goals and concerns
2. Listen more than they talk
3. Explain their process clearly
4. Be transparent about fees and how they work
5. Not pressure you into any decisions
6. Answer your questions directly

**What you should bring:**
- A general sense of your financial picture (you don't need detailed statements)
- A list of questions
- An open mind

**What you DON'T need:**
- To share account numbers or sensitive details in the first meeting
- To make any decisions that day
- To know exactly what you want

**Questions to ask the advisor:**
1. "Are you a fiduciary?"
2. "How are you compensated?"
3. "What types of clients do you typically work with?"
4. "What services are included?"
5. "How often will we meet?"
6. "Who will I work with day-to-day?"
7. "What's your investment philosophy?"

**Red flags:**
- Pressure to make quick decisions
- Reluctance to discuss fees
- Vague answers about fiduciary status
- Pushing specific products in the first meeting
- Making big promises or guarantees
- Not asking about your situation before proposing solutions

**What makes a good fit:**
- You feel heard and understood
- Explanations make sense (no jargon)
- The advisor asks good questions
- Fees and process are clear
- You can see yourself working with this person long-term

**Our first meeting:**
We call it an "Explore Call." We're trying to understand your situation and determine if we can help. You're trying to determine if we're the right fit. There's no obligation, no pressure—just an honest conversation about whether working together makes sense.`,
    relatedSlugs: ['what-is-a-fiduciary', 'how-do-financial-advisors-get-paid'],
    lastUpdated: '2025-12-10',
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
