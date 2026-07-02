# Pipeline Media Hosting

The pipeline needs a public file URL before Metricool can schedule video or carousel media.
Metricool can pull this:

`https://some-public-host/IMG_4500/captioned_vertical_9x16.mp4`

Metricool cannot pull this:

`/Users/davidtalley/Code/.../captioned_vertical_9x16.mp4`

## Recommended Setup

Use a separate Cloudflare R2 bucket. This does not require moving `talleywealth.com`, changing the website, or moving DNS.

The easiest first version can use Cloudflare's public R2 bucket URL. A custom subdomain like `media.talleywealth.com` can be added later only if desired.

## Current Setup

Cloudflare R2 is configured for the pipeline:

- Bucket: `talley-pipeline-media`
- Public URL: `https://pub-39b74d81e39345909e29e5a82f0cac1d.r2.dev`
- Prefix: `talley-pipeline`

The R2 credentials live only in `content-pipeline/.env`:

```bash
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=talley-pipeline-media
R2_PUBLIC_BASE_URL=
R2_KEY_PREFIX=talley-pipeline
```

Note: a narrow bucket-scoped `Object Read & Write` token returned `403 AccessDenied` on upload even though Cloudflare's UI labels it as write-capable. The working credential is an R2 `Admin Read & Write` token. Keep it private and rotate it in Cloudflare if it is ever exposed.

## What Codex Handles

Codex can run:

```bash
node scripts/upload-metricool-media-r2.mjs
```

That script reads `schedule.json`, uploads scheduled video/carousel files to R2, and writes:

`work/metricool-media-manifest.json`

Then the guarded Metricool live writer can use those public URLs:

```bash
METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --from-schedule --include-media --confirm-live --max=1
```

By default this creates Metricool drafts unless `--publishable` is explicitly added.

## Verification

Verified June 23, 2026:

- R2 upload script uploaded a disposable PNG to the public R2 bucket.
- The public URL returned `HTTP/1.1 200 OK`.
- Metricool created a draft-only media item from that R2 URL with `draft: true`, `autoPublish: false`, and one retained media item.
- The Metricool draft was deleted afterward.
- The disposable R2 smoke object was deleted afterward.

## Safety Notes

- The R2 upload script does not post anything.
- The Metricool live writer requires `METRICOOL_LIVE_WRITE=true` and `--confirm-live`.
- If Metricool creates a draft but drops the media, the writer deletes that draft and errors.
- Keep the bucket separate from the website repo so the site deploy does not become a video warehouse.
