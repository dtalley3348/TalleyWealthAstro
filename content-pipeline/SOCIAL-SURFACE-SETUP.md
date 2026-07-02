# Social Surface Setup

This is the working setup file for expanding the Talley content engine across
Talley Wealth, Talley Tax, Retire With Talley, and David Talley Personal.

Use this file with:

- `content-pipeline/DISTRIBUTION-ARCHITECTURE.md`
- `content-pipeline/PROFILE-ASSET-KITS.md`
- `content-pipeline/social-surface-ledger.csv`
- `content-pipeline/SOCIAL-SURFACE-AUDIT.md`
- `content-pipeline/distribution-properties.json`
- `content-pipeline/distribution-routing.json`
- `content-pipeline/starter-posts/`

## Operating Rule

Destination surfaces first. Metricool second. Content-engine routing third.

Do not code the review app to assume accounts exist until the account/page exists,
has the right profile language, has the right admin/recovery setup, has Smarsh
archiving connected, and can be connected in Metricool.

The app may recommend a property before it is live. It should not schedule to
that property until the ledger shows the relevant surface exists, Smarsh is
connected or intentionally waived, and Metricool is connected.

## Current Properties

### Talley Wealth

Purpose: main advisory/planning brand.

Default link:

`https://talleywealth.com/`

Primary content:

- Retirement decisions.
- Business-owner wealth.
- Keystone / ongoing advisory.
- Investments, tax strategy, estate, cash flow, and planning topics when they
  need to be judged together.

Channels to keep/audit:

- Instagram
- Facebook Page
- LinkedIn company page
- Google Business Profile
- X

### Talley Tax

Purpose: separate tax business.

Default link:

`https://talleytax.com/`

Primary content:

- Tax preparation.
- Year-round tax advisory.
- Business owner tax mechanics.
- Entity/payroll/S corp/reasonable compensation/estimated tax topics.
- Retirement-tax reminders when the tax lens is clear.

Channels to build/connect:

- Instagram: connected to the Talley Tax Facebook Page and connected in
  Metricool on 2026-06-29.
- Google Business Profile: verified in Google Business Profile Manager and
  connected in Metricool on 2026-06-29.
- Facebook Page: created and connected in Metricool.
- LinkedIn company page: created and connected in Metricool.
- X: deferred. Do not create a separate Talley Tax X account for now; keep X
  activity under the existing Talley Wealth X account only.

Boundary:

Talley Tax should not sound like an advisory/investment firm. Keep investment,
financial-planning, Keystone, and advisory relationship language on Talley Wealth.

### Retire With Talley

Purpose: retirement education page/channel from David Talley and Talley Wealth.

Default link:

`https://retirewithtalley.com/`

Near-term redirect:

`https://talleywealth.com/financial-advisor-for-pre-retirees`

Primary content:

- Retirement paycheck planning.
- 401(k) decisions near retirement.
- Retirement timing.
- Investment decisions near retirement.
- Cash reserves and withdrawal order.
- Sequence risk and inflation risk.
- Spouse/family continuity.
- Retirement tax-window topics written for the retirement audience.
- Healthcare and Social Security topics only when they are part of a broader
  retirement decision, not the channel's top-line identity.

Channels to build/connect:

- Instagram: live as `@retirewithtalley`, converted to a Creator professional
  account, linked to the Retire With Talley Facebook Page, and connected in
  Metricool on 2026-06-29. Website link still needs to be added from the
  Instagram mobile app because desktop blocks link editing.
- Facebook Page: created, linked to Instagram, and connected in Metricool.
- LinkedIn Showcase Page: created under Talley Wealth and connected in
  Metricool.
- X: deferred. Do not create a separate Retire With Talley X account for now;
  keep X activity under the existing Talley Wealth X account only.

Do not create:

- Google Business Profile.

Boundary:

Retire With Talley is not a separate advisory firm. Use retirement education
language and subtle "from Talley Wealth" relationship language.

### David Talley Personal

Purpose: David's founder/thinking channel.

Default link:

`https://talleywealth.com/david`

Primary content:

- Founder POV.
- Leadership.
- AI.
- Advisory industry observations.
- Decision-making.
- Planning/tax thoughts that sound more like David than company copy.

Channels to build/connect:

- Personal LinkedIn: connected in Metricool. Preserve existing credibility. Do
  not over-narrow.
- X: deferred. Do not create a separate David Personal X account for now; keep X
  activity under the existing Talley Wealth X account only.

Do not create yet:

- Separate middle-ground David Instagram.
- David Personal Facebook Page.
- David Personal Google Business Profile.

## Setup Sequence

1. Audit what exists.
2. Confirm handles and page URLs.
3. Create missing pages/accounts.
4. Add profile images and banners.
5. Add bios/about/profile copy.
6. Add default links.
7. Add David as owner/admin and Stephenee as backup admin where supported.
8. Enable 2FA/recovery/password-manager storage.
9. David connects each new surface to Smarsh.
10. Create/connect Metricool brands.
11. Load starter posts as drafts only after Smarsh and Metricool are ready.
12. Add property-aware routing to the review app.

## Confirmation Rules

I can prepare copy, files, checklists, and draft setup payloads without further
approval.

Before external side effects, pause for explicit confirmation at the action:

- final page/account creation,
- saving public profile copy,
- uploading/changing public profile images or banners,
- adding admins,
- connecting Metricool accounts,
- posting/scheduling content,
- connecting Smarsh if credentials or account permissions are involved.

## Metricool Brand Names

Use exactly:

- `Talley Wealth` (`3305339`)
- `Talley Tax` (`6466164`)
- `Retire With Talley` (`6466168`)
- `David Talley Personal` (`6466174`)

Current Metricool connection state as of 2026-06-29:

- Talley Wealth: Facebook, Instagram, LinkedIn, Google Business Profile, X.
- Talley Tax: Facebook, Instagram, LinkedIn, Google Business Profile.
- Retire With Talley: Facebook, Instagram professional account, and LinkedIn
  Showcase Page.
- David Talley Personal: personal LinkedIn.
- Extra X accounts are intentionally deferred. The only active X surface is the
  existing Talley Wealth X account.

Metricool X note: Metricool's own help says X/Twitter requires a premium-plan
add-on at $5/month per connected X account. Do not add paid X connections for
Talley Tax, Retire With Talley, or David Personal unless the strategy changes.

## Smarsh / Compliance Notes

- Social content does not need Cambridge pre-approval before posting.
- New social surfaces should be connected to Smarsh before starter posts begin.
- Smarsh connection is David's manual/account-level step. Codex should prepare the
  destination surfaces and Metricool setup, then leave a clear Smarsh handoff
  marker instead of treating Smarsh as a Codex-owned task.
- No TikTok.
- No YouTube Shorts.
- Keep YouTube out of automated posting.
- Website-bound/blog/long-form assets still need the PDF/compliance review path.

## First Build Checklist

- [x] Audit live handles and URLs.
- [x] Create/update `social-surface-ledger.csv` from the audit.
- [x] Add property-level distribution config.
- [x] Add distribution routing builder.
- [x] Add Distribution Setup view to the review app.
- [x] Confirm Talley Tax Google Business Profile admin access.
- [x] Create and connect Talley Tax Facebook Page.
- [x] Create and connect Retire With Talley Facebook Page.
- [x] Create and connect Talley Tax LinkedIn company page.
- [x] Create and connect Retire With Talley LinkedIn Showcase Page.
- [x] Create Metricool Brands for Talley Tax, Retire With Talley, and David
  Talley Personal.
- [x] Connect David Talley Personal Metricool Brand to personal LinkedIn.
- [x] Link Talley Tax Instagram to the Talley Tax Facebook Page and connect it in
  Metricool.
- [x] Link Retire With Talley Instagram to the Retire With Talley Facebook Page
  and connect it in Metricool.
- [ ] Add `https://retirewithtalley.com/` to the Retire With Talley Instagram
  profile link from the mobile app.
- [x] Defer extra X account creation; keep X under Talley Wealth only.
- [x] Confirm Metricool supports separate Brands and the Facebook / LinkedIn /
  Showcase / personal LinkedIn mix.
- [x] Confirm X account add-on cost/limit in Metricool.
- [ ] David connects each new surface in Smarsh after the surface exists.
- [ ] Set `retirewithtalley.com` to redirect or replace its placeholder page.
- [x] Deploy latest Talley Wealth site so `/david` is live.
- [ ] Only then turn on multi-property scheduling.

## Asset Map

Talley Wealth:

- Profile identity: keep current unless audit shows bad crop/outdated asset.
- Headshot for David page and David Personal:
  `public/brands/talley-wealth/david-talley.webp`
- Square David social crop:
  `content-pipeline/brand-assets/david-talley/david-talley-profile-square.jpg`

Talley Tax:

- Local setup assets:
  - `content-pipeline/brand-assets/talley-tax/talley-tax-primary-dark-trans.png`
  - `content-pipeline/brand-assets/talley-tax/talley-tax-primary-dark-trans.svg`
  - `content-pipeline/brand-assets/talley-tax/talley-tax-stacked-dark-trans.png`
  - `content-pipeline/brand-assets/talley-tax/talley-tax-stacked-dark-trans.svg`
- Banner:
  `content-pipeline/brand-assets/talley-tax/talley-tax-banner.png`

Retire With Talley:

- Profile/icon:
  - Facebook and Instagram headshot:
  `content-pipeline/brand-assets/retire-with-talley/retire-with-talley-david-profile.jpg`
  - LinkedIn Showcase mark:
  `content-pipeline/brand-assets/retire-with-talley/retire-with-talley-profile.svg.png`
  `content-pipeline/brand-assets/retire-with-talley/retire-with-talley-profile-icon.svg.png`
- Banner:
  `content-pipeline/brand-assets/retire-with-talley/retire-with-talley-mountain-banner-wide.png`

## Local Draft Copy Sources

Exact profile copy:

`content-pipeline/PROFILE-ASSET-KITS.md`

Launch/action packet:

`content-pipeline/SOCIAL-SURFACE-ACTION-PACKET.md`

Per-surface setup packets:

`content-pipeline/social-setup-payloads/`

Starter posts:

- `content-pipeline/starter-posts/talley-tax-starter-posts.md`
- `content-pipeline/starter-posts/retire-with-talley-starter-posts.md`
- `content-pipeline/starter-posts/david-talley-personal-starter-posts.md`

## Next App Work After Setup

The review app already shows property-aware routing recommendations. After the
surfaces are live, Smarsh is connected, and Metricool Brands are verified, the
next app pass should add:

- route approval/edit controls,
- property-specific rewrite generation,
- compliance flags by property,
- Metricool Brand ID verification by destination,
- scheduling to approved `primary_only` and `recommended_secondary` routes.

Do not auto-schedule optional secondary routes by default.
