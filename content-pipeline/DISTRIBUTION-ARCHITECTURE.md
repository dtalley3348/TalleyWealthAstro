# Distribution Architecture

This is the working map for expanding the content engine from one Talley Wealth
distribution channel into several clear properties without turning the system into
a copy-paste machine.

## Current Decision

Build the destination surfaces first, connect them in Metricool second, then add
multi-property routing to the review app.

The app should eventually drive most of the decision for David. It should not ask
him to choose from scratch every time. The routing recommendation should be visible,
opinionated, and editable.

## Recommendation Levels

Every processed video should get one primary recommendation and one of these
secondary states:

- `primary_only`: post only to the best property.
- `recommended_secondary`: post to the primary property and a second property,
  rewritten for that property because the idea genuinely belongs in both places.
- `optional_secondary`: show a secondary option, but leave it unchecked unless
  David or the reviewer wants more reach.
- `manual_review`: do not schedule automatically until David/Codex reviews the
  fit.
- `exclude`: do not post to that property, with a short reason.

Default behavior: the scheduler should use `primary_only` and
`recommended_secondary`. It should not schedule `optional_secondary` unless it is
explicitly selected in the review app.

## Properties

### Talley Wealth

Job: the main advisory/planning brand.

Primary content:

- Retirement planning that points toward an advice relationship.
- Business owner planning when the point is turning business profit into personal
  wealth.
- Investment, estate, tax, retirement income, charitable, and planning topics
  when they need to be coordinated.
- Keystone, ongoing advisory, pricing, and client-fit content.

Channels:

- Instagram
- Facebook
- LinkedIn company page
- Google Business Profile
- X

Disabled:

- TikTok
- YouTube Shorts
- YouTube automated posting

Default destination: `https://talleywealth.com/`

### Talley Tax

Job: the tax business and tax-specific education surface.

Primary content:

- Tax preparation and year-round tax advisory.
- Business entity tax, S corp compensation, estimates, tax deadlines, IRS
  resolution, payroll/entity confusion, tax season reminders.
- Owner-pay topics when the center of gravity is tax mechanics.

Secondary content:

- Business-owner wealth topics only when the tax lens is clear.
- Retirement-tax topics only when the tax planning angle is clear and the post
  does not imply Talley Tax is delivering investment/advisory services.

Channels to build/connect:

- Instagram: owned by David.
- Facebook Page: create.
- Google Business Profile: exists per David, verify/admin.
- LinkedIn company page: create.
- X: reserve and likely post lightly.

Default destination: `https://talleytax.com/`

Boundary language:

Talley Tax is a separate tax business. Keep investment/advisory positioning on
Talley Wealth. Use separate-business and non-affiliation language when needed.

### Retire With Talley

Job: a retirement education page/channel, not a separate advisory firm.

Primary content:

- Retirement paycheck planning.
- Social Security, Medicare, 401(k) near retirement, retirement timing, cash
  reserves, sequence risk, inflation risk, withdrawal order, spouse/family
  continuity.
- Simple retirement decision frameworks that should feel approachable and
  shareable.

Secondary content:

- Tax-window retirement topics when written for the retirement audience.
- Estate/continuity topics when the retirement-stage context is clear.

Channels to build/connect:

- Instagram: owned by David.
- Facebook Page: create.
- LinkedIn Showcase Page: likely create if the page can sit under Talley Wealth
  cleanly.
- X: reserve and likely post lightly.

Do not use:

- Google Business Profile.
- Fake-firm language.
- TikTok.
- YouTube Shorts.

Default destination for now:

`retirewithtalley.com` should redirect to
`https://talleywealth.com/financial-advisor-for-pre-retirees`.

Subtle relationship language:

- Display name: `Retire With Talley`
- Bio line: `Retirement questions before and after work stops. From David Talley and Talley Wealth.`
- Longer disclosure when needed: `Retire With Talley is a retirement education page from David Talley and Talley Wealth.`

Identity direction:

Do not pay for a new logo yet. Do not use a fully AI-generated logo as the core
mark. Create a simple controlled wordmark from the existing Talley visual system:

- Text mark: `Retire With Talley`
- Small line: `From Talley Wealth`
- Use the Talley Wealth needle mark as the visual bridge.
- Use Talley navy, gold, and the existing serif/sans typography style.
- Use AI only for optional banner/background concepts, not for the core logo.

Useful existing Drive assets:

- Drive folder: `Logo Files 2`
- Talley Wealth needle SVG/PNG variants exist.
- Talley Wealth primary and stacked SVG/PNG variants exist.
- Talley Tax primary and stacked SVG/PNG variants exist.

### David Talley Personal

Job: David's founder/thinking channel.

Primary content:

- Founder POV.
- AI, content, building the firm, advisory industry observations.
- Human planning philosophy that sounds more like David than the company voice.
- Business-owner and retirement content when it is more personal judgment than
  brand/service copy.

Channels to build/connect:

- Personal LinkedIn.
- X: reserve and likely post lightly.

Default destination:

Use the temporary David hub:

`https://talleywealth.com/david`

Local route:

`src/pages/brands/talley-wealth/david.astro`

## X Strategy

If compliant and the handles are available, reserve X handles for:

- Talley Tax
- Retire With Talley
- David Talley personal

Posting on those accounts is reasonable from the start, but keep the first phase
text-native and low-risk.

Starting cadence:

- Talley Wealth X: keep current cadence.
- Talley Tax X: 3 to 5 text posts per week.
- Retire With Talley X: 3 to 5 text posts per week.
- David Personal X: 3 to 7 text posts per week.

X is not mainly a video reposting surface here. It should get crisp beliefs,
misconception corrections, short frameworks, quote-style David lines, and small
threads when the idea needs sequence.

Metricool constraint:

Metricool uses Brands as containers. Each Brand can hold one profile per platform.
X may require one paid add-on per connected X account/brand. Confirm plan limits
and add-on cost before assuming all X accounts can be live in Metricool.

## Metricool Brand Map

Create or use these Metricool Brands:

- `Talley Wealth`
  - Instagram
  - Facebook
  - LinkedIn company
  - Google Business Profile
  - X

- `Talley Tax`
  - Instagram
  - Facebook Page
  - LinkedIn company
  - Google Business Profile
  - X

- `Retire With Talley`
  - Instagram
  - Facebook Page
  - LinkedIn Showcase Page if supported cleanly
  - X

- `David Talley Personal`
  - Personal LinkedIn
  - X

Do not attempt to cram David's personal LinkedIn into the Talley Wealth brand.

## Routing Examples

Owner-pay S corp tax mechanics:

- Primary: Talley Tax
- Recommended secondary: David Personal when the post contains a strong founder
  observation.
- Optional secondary: Talley Wealth only if rewritten around profit-to-wealth.

Turning business profit into personal wealth:

- Primary: Talley Wealth
- Recommended secondary: David Personal.
- Optional secondary: Talley Tax if the tax mechanics are central.

Retirement paycheck / Social Security / Medicare / 401(k):

- Primary: Retire With Talley.
- Recommended secondary: Talley Wealth when the post points toward advisory
  planning.
- No Talley Tax unless the tax angle is central.

Retirement tax window:

- Primary: Talley Wealth or Retire With Talley depending the transcript's center
  of gravity.
- Recommended secondary: the other retirement-facing property if the idea is
  strong and can be rewritten.
- Optional secondary: Talley Tax only when tax mechanics are the center.

AI / building the firm / advisory industry observations:

- Primary: David Personal.
- Optional secondary: Talley Wealth only if it reinforces how clients experience
  the advisory process.
- Exclude: Talley Tax and Retire With Talley unless unusually relevant.

Inheritance / guilt / family money:

- Primary: Talley Wealth.
- Optional secondary: David Personal if the post is more reflective or personal.
- Exclude: Talley Tax unless there is a tax-specific angle.

## App Behavior Later

Once the accounts exist and Metricool is connected, the review app should show a
compact `Distribution Fit` block for each video:

- Best home
- Recommended secondary, if any
- Optional secondary, if any
- Excluded properties with short reasons
- Destination link
- Compliance/disclosure note

Approval controls should be property-aware:

- `Approve Talley Tax / X`
- `Approve Talley Tax / GBP`
- `Approve Retire With Talley / Instagram`
- `Approve David Personal / LinkedIn`

The app should preselect primary and recommended secondary items. Optional
secondary items should be visible but unchecked by default.

## Setup Sequence

1. Finalize profile asset kits.
2. Verify/create handles and pages.
3. Set up profile images, banners, bios, links, and pinned posts.
4. Add each real property as a Metricool Brand.
5. Connect accounts and verify which connection types are actually supported.
6. Run a dry schedule for a few approved items.
7. Add distribution-property routing into the app.
8. Run the first small live batch.

## Open Decisions

- David personal destination: newsletter, David page, or temporary link hub.
- Whether Retire With Talley gets a LinkedIn Showcase Page immediately or waits.
- Whether all new X accounts get Metricool add-ons immediately or are reserved
  first and connected as volume proves useful.
- Final Retire With Talley wordmark layout.
