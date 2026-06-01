# Analytics And Clarity Setup

Last updated: June 1, 2026

## Purpose

Use analytics to understand whether the website is doing its job as a trust and search foundation. Google Analytics 4 is the scoreboard. Microsoft Clarity is the behavior review layer.

## Current Implementation

The site supports both tools through environment variables:

- `PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4 measurement ID, such as `G-XXXXXXXXXX`.
- `PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity project ID.

The current default IDs are:

- GA4: `G-PMB7EVR4G6`
- Microsoft Clarity: `x0aqtyazy9`

These IDs are public by design because they are embedded in browser-side tracking scripts. Render environment variables can override the defaults if the IDs change later.

## Events

When GA4 is enabled, the site tracks standard page views through the Google tag and these click events:

- `explore_call_click`: links to `/get-started` and the Calendly Explore Call URL.
- `phone_click`: `tel:` links.
- `email_click`: `mailto:` links.
- `lead_form_submit`: successful public contact/lead form submissions.

## Privacy Notes

Microsoft Clarity should be configured with conservative masking for a financial services website. Keep form fields and any potentially sensitive user-entered content masked. Do not add Clarity to client portals, tax portals, payment pages, or other private experiences.

The public privacy policy includes a plain-English analytics notice.

## Verification After Deploy

After Savannah deploys:

1. Confirm the environment variables are present in Render.
2. Open the live site in an incognito or clean browser session.
3. Use Google Tag Assistant or GA4 Realtime to confirm GA4 fires.
4. Use Microsoft Clarity setup verification to confirm Clarity receives data.
5. Click an Explore Call link, phone link, and email link, then confirm GA4 receives the click events.
