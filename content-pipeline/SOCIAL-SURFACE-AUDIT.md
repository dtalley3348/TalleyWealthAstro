# Social Surface Audit

Last checked: 2026-06-29.

This is a lightweight public/current-state audit for the expanded distribution
architecture. It is not a substitute for logged-in admin verification.

## Confirmed Locally / Publicly

- Re-checked on 2026-06-29: `https://retirewithtalley.com/` still returns a
  GoDaddy Website Builder page with the placeholder phrase "Solutions for a
  Smarter Future."
- Re-checked on 2026-06-29: `https://talleywealth.com/david` returns 200, and
  `https://talleywealth.com/david-talley` redirects to `/david`.
- Re-checked on 2026-06-29: `https://talleywealth.com/financial-advisor-for-pre-retirees`
  returns 200 and remains the correct near-term redirect target for
  `retirewithtalley.com`.
- Talley Tax website resolves at `https://www.talleytax.com/` with canonical
  `https://www.talleytax.com/`.
- Talley Wealth LinkedIn public page exists at
  `https://www.linkedin.com/company/talleywealth`.
- Talley Wealth Metricool Brand is connected locally through the existing
  credentials. Current read-only status reported:
  - Brand label: `Talley Wealth`
  - Brand ID: `3305339`
  - Facebook: connected
  - Instagram: connected
  - LinkedIn company: connected
  - Google Business Profile: connected
  - X: connected as `talleywealth`
- Talley Tax Metricool Brand was re-checked on 2026-06-29:
  - Brand ID: `6466164`
  - Facebook: connected
  - Instagram: connected as `talleytax`
  - LinkedIn company: connected
  - Google Business Profile: connected
  - X: not connected
- `https://www.instagram.com/talleytax/` returns public HTTP 200.
- `https://www.instagram.com/retirewithtalley/` returns public HTTP 200, but the
  current logged-in Instagram session cannot edit it and the visible public
  profile is bare.
- `https://x.com/talleytax` returns HTTP 404 publicly.
- `https://x.com/retirewithtalley` returns HTTP 404 publicly.
- `https://x.com/davidtalleynotes` returns HTTP 404 publicly.
- Talley Tax logo assets were found in Drive and copied into:
  `content-pipeline/brand-assets/talley-tax/`
- A square David profile crop was created at:
  `content-pipeline/brand-assets/david-talley/david-talley-profile-square.jpg`
- Per-surface setup packets were added under:
  `content-pipeline/social-setup-payloads/`

## Important Caveats

- X public 404 means the public profile was not found during the unauthenticated
  check. It is a good availability signal, but final handle availability must be
  verified inside X during account creation.
- Facebook direct URLs returned HTTP 200 for both `talleytax` and
  `retirewithtalley`, but Facebook often returns 200 for login/search/ambiguous
  states. Verify inside a logged-in browser before creating duplicate pages.
- LinkedIn unauthenticated checks can return anti-scrape responses, so public
  HTTP status is not sufficient to verify Company Page or Showcase Page state.
  Use a logged-in LinkedIn admin session for those checks.
- `retirewithtalley.com` is currently a GoDaddy Website Builder placeholder, not
  a redirect to the Talley Wealth pre-retiree page.
- `https://talleywealth.com/david` is no longer a deployment blocker as of
  2026-06-29.

## Metricool Architecture Evidence

Metricool's help docs confirm the architecture this repo now uses:

- One Metricool Brand can hold one profile per platform.
- Multiple accounts for the same platform require separate Metricool Brands.
- X requires a paid add-on per connected X account.

That means the target Brand map remains:

- `Talley Wealth`
- `Talley Tax`
- `Retire With Talley`
- `David Talley Personal`

The review app should recommend routing across all four, but only schedule to a
property after the surface exists, Smarsh archiving is connected or intentionally
waived, and the Metricool Brand/platform is connected.
