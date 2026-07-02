# Metricool Brand Setup

Metricool's structure maps cleanly to the expanded system: one Brand per business
or identity, with the matching social accounts connected inside that Brand.

## Brands To Use

- `Talley Wealth`
- `Talley Tax`
- `Retire With Talley`
- `David Talley Personal`

## Current Local State

As of 2026-06-29:

- `Talley Wealth` (`3305339`): Facebook, Instagram, LinkedIn, Google Business
  Profile, X.
- `Talley Tax` (`6466164`): Facebook, Instagram, LinkedIn, Google Business
  Profile.
- `Retire With Talley` (`6466168`): Facebook, Instagram professional account,
  and LinkedIn Showcase Page.
- `David Talley Personal` (`6466174`): personal LinkedIn.

Still missing from Metricool:

- Nothing required for the current no-new-X setup.

Intentionally deferred:

- Talley Tax X.
- Retire With Talley X.
- David Talley Personal X.

## Environment Variables

Use:

```text
METRICOOL_BRAND_ID_TALLEY_WEALTH=
METRICOOL_BRAND_ID_TALLEY_TAX=
METRICOOL_BRAND_ID_RETIRE_WITH_TALLEY=
METRICOOL_BRAND_ID_DAVID_TALLEY_PERSONAL=
```

Use the verified Brand IDs from `SOCIAL-SURFACE-SETUP.md` and
`social-surface-ledger.csv`. Do not enable scheduling to a platform until that
specific platform is connected for the matching Brand.

## X Note

Metricool treats X as a paid add-on. Keep X connected only under the existing
Talley Wealth brand for now. Do not assume Talley Tax, Retire With Talley, or
David Talley Personal can be scheduled to X unless those accounts are created,
archived, and intentionally connected later.

## LinkedIn Note

Metricool's current LinkedIn guidance says a Brand can connect a personal
profile or a Company/Showcase Page, but not both at the same time in the same
Brand. That is why David's personal LinkedIn belongs in `David Talley Personal`,
while Talley Wealth, Talley Tax, and Retire With Talley should use their own
Company or Showcase surfaces.

## Safe Scheduling Rule

The app can recommend a property before setup is complete. It should not schedule
to that property until:

- the surface exists,
- David has connected Smarsh or marked archive as not applicable,
- the Metricool Brand/platform is connected,
- the Brand ID is in `.env`,
- a dry run shows `metricoolBrandId` populated.
