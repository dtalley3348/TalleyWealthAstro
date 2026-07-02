// metricool-dry-run.mjs
// Converts schedule.json into Metricool-shaped local payloads. Does not post.
// Metricool requires X-Mc-Auth plus userId and blogId (brand ID).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv(path.join(ROOT, ".env"));

const schedulePath = path.join(ROOT, "schedule.json");
if (!fs.existsSync(schedulePath)) {
  console.error("[metricool] schedule.json missing. Run node scripts/schedule.mjs first.");
  process.exit(1);
}

const userId = process.env.METRICOOL_USER_ID || "";
const blogId = process.env.METRICOOL_BRAND_ID_TALLEY_WEALTH || process.env.METRICOOL_BRAND_ID || "";
const apiKeyPresent = !!process.env.METRICOOL_API_KEY;
const timezone = process.env.METRICOOL_TIMEZONE || "America/New_York";

const rows = JSON.parse(fs.readFileSync(schedulePath, "utf8"));
const payloads = rows.filter((row) => row.date !== "OVERFLOW").map((row) => toPayload(row));

fs.writeFileSync(path.join(ROOT, "metricool-dry-run.json"), JSON.stringify({
  readyForApiWrite: apiKeyPresent && !!userId && payloads.every((payload) => !!payload.metricoolBrandId),
  missing: [
    !apiKeyPresent && "METRICOOL_API_KEY",
    !userId && "METRICOOL_USER_ID",
    !blogId && "METRICOOL_BRAND_ID",
  ].filter(Boolean),
  generatedAt: new Date().toISOString(),
  payloads,
}, null, 2));

console.log(`[metricool] dry run wrote ${payloads.length} payloads -> metricool-dry-run.json`);
if (!apiKeyPresent || !userId || !blogId) console.log("[metricool] missing:", [!apiKeyPresent && "METRICOOL_API_KEY", !userId && "METRICOOL_USER_ID", !blogId && "METRICOOL_BRAND_ID"].filter(Boolean).join(", "));

function providerFor(platform) {
  return {
    linkedin: "linkedin",
    instagram: "instagram",
    facebook: "facebook",
    x: "twitter",
    gbp: "gmb",
  }[platform] || platform.toLowerCase();
}
function toPayload(row) {
  const provider = providerFor(row.platform);
  const body = {
    publicationDate: { dateTime: `${row.date}T${row.time}:00`, timezone },
    text: Array.isArray(row.thread) ? row.thread[0] : row.text,
    providers: [{ network: provider, status: "PENDING" }],
    autoPublish: false,
    draft: true,
    saveExternalMediaFiles: true,
    media: [],
    pipeline: {
      sourceVideo: row.video,
      asset: row.asset,
      localMediaNote: mediaNote(row),
    },
  };
  if (Array.isArray(row.thread) && row.thread.length > 1) {
    body.descendants = row.thread.slice(1).map((text) => ({
      text,
      providers: [{ network: provider, status: "PENDING" }],
      autoPublish: false,
      draft: true,
      media: [],
    }));
  }
  if (provider === "twitter") body.twitterData = { tags: [] };
  if (provider === "linkedin") body.linkedinData = { type: "post", previewIncluded: true, publishImagesAsPDF: false };
  if (provider === "facebook") body.facebookData = { type: "POST", title: "" };
  if (provider === "instagram") body.instagramData = { type: row.asset === "video" ? "REEL" : "POST", showReelOnFeed: true, collaborators: [] };
  const rowBlogId = brandIdFor(row);
  return {
    method: "POST",
    url: `https://app.metricool.com/api/v2/scheduler/posts?userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(rowBlogId)}`,
    headers: { "X-Mc-Auth": apiKeyPresent ? "[set in .env]" : "[missing]" },
    metricoolBrand: row.metricoolBrand || row.property || "Talley Wealth",
    metricoolBrandId: rowBlogId,
    body,
  };
}
function brandIdFor(row) {
  const brand = String(row.metricoolBrand || row.property || "Talley Wealth");
  const key = brand.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const value = process.env[`METRICOOL_BRAND_ID_${key}`];
  if (value) return value;
  return brand === "Talley Wealth" ? blogId : "";
}
function mediaNote(row) {
  if (row.asset === "x_thread") return "Text-only X thread; no media upload required.";
  if (/^x_extra_/.test(row.asset)) return "Text-only X extra; no media upload required.";
  if (row.asset === "gbp") return "Text-only Google Business Profile post; no media upload required.";
  if (row.asset === "video") return "Uses output/<video>/scheduled/captioned_with_cover_9x16.mp4 when present, otherwise the captioned/clean vertical video.";
  return "Real scheduling needs hosted/uploaded media URLs before video/carousel posts are sent.";
}
function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}
