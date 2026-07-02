#!/usr/bin/env node
// schedule-resource-youtube.mjs <reuse-id> [--publishable]
// Schedules the resource-approved source video to YouTube through Metricool.
// This is intentionally tied to Resource Publishing packages, not normal
// short-form approval, because these videos are entering the compliance path.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKLOG = path.join(ROOT, "reuse-backlog.json");
const id = process.argv[2] || "";
const publishable = process.argv.includes("--publishable");

loadDotenv(path.join(ROOT, ".env"));

if (!id) fail("usage: node scripts/schedule-resource-youtube.mjs <reuse-id> [--publishable]");

const backlog = readJson(BACKLOG, []);
const item = (Array.isArray(backlog) ? backlog : []).find((entry) => entry?.id === id);
if (!item) fail(`reuse item not found: ${id}`);
if (!item.slug || !item.localPath) fail(`resource preview is not staged yet: ${id}`);

const liveEnabled = String(process.env.METRICOOL_LIVE_WRITE || "").toLowerCase() === "true";
if (publishable && !liveEnabled) fail("METRICOOL_LIVE_WRITE must be true to schedule publishable YouTube posts");

const required = ["METRICOOL_API_KEY", "METRICOOL_USER_ID", "METRICOOL_BRAND_ID_TALLEY_WEALTH", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_BASE_URL"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) fail(`missing ${missing.join(", ")} in content-pipeline/.env`);

const outDir = item.type === "blog" ? path.join(ROOT, "output", item.sourceVideo) : path.join(ROOT, "reuse-output", item.id);
const evidenceRel = item.type === "blog" ? `output/${item.sourceVideo}/youtube-schedule.json` : `reuse-output/${item.id}/youtube-schedule.json`;
const previous = readJson(path.join(ROOT, evidenceRel), null);
if (previous?.metricoolId && previous?.scheduleStatus === "scheduled") {
  console.log(`[youtube] already scheduled -> Metricool ${previous.metricoolId}`);
  process.exit(0);
}

const sourceVideo = pickYouTubeVideo(item);
if (!sourceVideo.rel) fail(`no YouTube-ready video found for ${id}`);

const publicUrl = await uploadToR2({
  rel: sourceVideo.rel,
  objectKey: objectKeyFor(item, sourceVideo.rel),
});
const youtubeReuse = writeYouTubeMetadata(item, sourceVideo, publicUrl);
const scheduledFor = nextYouTubeSlot();
const body = buildYouTubePayload({ item, youtubeReuse, publicUrl, scheduledFor, publishable });
const result = await createPost(body, { requireMediaCount: 1 });
const data = result.response?.data || {};

if (!Array.isArray(data.media) || data.media.length < 1) {
  if (data.id) await deletePost(data.id);
  fail(`Metricool created YouTube item but did not keep the video media; deleted ${data.id || "unknown id"}`);
}

const evidence = {
  generatedAt: new Date().toISOString(),
  scheduleStatus: "scheduled",
  metricoolId: data.id || "",
  scheduledFor,
  draft: data.draft ?? !publishable,
  autoPublish: data.autoPublish ?? publishable,
  provider: Array.isArray(data.providers) ? data.providers.find((provider) => provider.network === "youtube") || data.providers[0] : null,
  metricoolMedia: data.media || [],
  localVideoPath: sourceVideo.rel,
  publicVideoUrl: publicUrl,
  youtubeReuse,
  request: {
    publicationDate: body.publicationDate,
    text: body.text,
    providers: body.providers,
    autoPublish: body.autoPublish,
    draft: body.draft,
    youtubeData: body.youtubeData,
    media: ["[public R2 video URL]"],
  },
};
writeJson(path.join(ROOT, evidenceRel), evidence);
console.log(`[youtube] scheduled ${sourceVideo.kind} YouTube post -> Metricool ${evidence.metricoolId} at ${scheduledFor}`);

function pickYouTubeVideo(item) {
  const video = item.sourceVideo || sourceFromId(item.id);
  const candidates = [
    { rel: item.resourceVideoPath || "", kind: "standard" },
    { rel: item.resourceThread?.resourceVideoPath || "", kind: "standard" },
    { rel: `output/${video}/horizontal_16x9.mp4`, kind: "standard" },
    { rel: `output/${video}/captioned_horizontal_16x9.mp4`, kind: "standard" },
    { rel: `output/${video}/captioned_vertical_9x16.mp4`, kind: "shorts_candidate" },
    { rel: `output/${video}/vertical_9x16.mp4`, kind: "shorts_candidate" },
  ];
  return candidates.find((candidate) => fs.existsSync(path.join(ROOT, candidate.rel))) || {};
}

function writeYouTubeMetadata(item, sourceVideo, publicUrl) {
  const title = cleanTitle(item.h1Title || item.suggestedTitle || item.title || "Talley Wealth Planning Resource").slice(0, 100);
  const articleUrl = `https://talleywealth.com${item.localPath}`;
  const description = [
    item.candidateSummary || item.description || item.recommendationReason || "",
    "",
    `Read the full article: ${articleUrl}`,
    "",
    "For educational purposes only. This is not individualized financial, legal, tax, or investment advice.",
  ].filter(Boolean).join("\n").trim();
  const metadata = {
    title,
    description,
    articleUrl,
    standardVideoPath: sourceVideo.kind === "standard" ? sourceVideo.rel : "",
    shortsVideoPath: sourceVideo.kind !== "standard" ? sourceVideo.rel : "",
    publicVideoUrl: publicUrl,
    metadataPath: item.type === "blog" ? `output/${item.sourceVideo}/youtube-reuse.json` : `reuse-output/${item.id}/youtube-reuse.json`,
    metricoolReady: true,
    defaultYouTubeFormat: sourceVideo.kind === "standard" ? "standard_video" : "shorts_candidate",
  };
  writeJson(path.join(ROOT, metadata.metadataPath), metadata);
  return metadata;
}

function buildYouTubePayload({ youtubeReuse, publicUrl, scheduledFor, publishable }) {
  return {
    publicationDate: { dateTime: scheduledFor, timezone: process.env.METRICOOL_TIMEZONE || "America/New_York" },
    text: youtubeReuse.description,
    providers: [{ network: "youtube" }],
    autoPublish: publishable,
    draft: !publishable,
    hasNotReadNotes: false,
    saveExternalMediaFiles: true,
    media: [publicUrl],
    mediaAltText: [null],
    shortener: false,
    smartLinkData: { ids: [] },
    youtubeData: {
      title: youtubeReuse.title,
      privacyStatus: "public",
      madeForKids: false,
      category: "Education",
      tags: ["Talley Wealth", "Financial Planning", "Retirement Planning"],
    },
  };
}

async function createPost(body, options = {}) {
  const qs = new URLSearchParams({
    userId: process.env.METRICOOL_USER_ID,
    blogId: process.env.METRICOOL_BRAND_ID_TALLEY_WEALTH,
    integrationSource: "CodexLocal",
  });
  const response = await fetch(`https://app.metricool.com/api/v2/scheduler/posts?${qs}`, {
    method: "POST",
    headers: { "X-Mc-Auth": process.env.METRICOOL_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const parsed = parseMaybeJson(text);
  if (!response.ok) {
    writeJson(path.join(ROOT, "work", "metricool-youtube-error.json"), { generatedAt: new Date().toISOString(), status: response.status, response: parsed, request: { ...body, media: ["[public R2 video URL]"] } });
    throw new Error(`[youtube] Metricool POST failed ${response.status}: ${String(text).slice(0, 1000)}`);
  }
  const requiredMedia = options.requireMediaCount || 0;
  const actualMedia = Array.isArray(parsed?.data?.media) ? parsed.data.media.length : 0;
  if (actualMedia < requiredMedia) {
    const id = parsed?.data?.id;
    if (id) await deletePost(id);
    throw new Error(`[youtube] Metricool returned insufficient media (${actualMedia}/${requiredMedia}); deleted ${id || "unknown id"}`);
  }
  return { status: response.status, response: parsed };
}

async function deletePost(metricoolId) {
  const qs = new URLSearchParams({
    userId: process.env.METRICOOL_USER_ID,
    blogId: process.env.METRICOOL_BRAND_ID_TALLEY_WEALTH,
    integrationSource: "CodexLocal",
  });
  const response = await fetch(`https://app.metricool.com/api/v2/scheduler/posts/${encodeURIComponent(metricoolId)}?${qs}`, {
    method: "DELETE",
    headers: { "X-Mc-Auth": process.env.METRICOOL_API_KEY, "Content-Type": "application/json" },
  });
  return { status: response.status, response: parseMaybeJson(await response.text()) };
}

async function uploadToR2({ rel, objectKey }) {
  const file = path.join(ROOT, rel);
  const body = fs.readFileSync(file);
  const publicBaseUrl = String(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, "");
  const url = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
  const headers = signRequest({
    method: "PUT",
    url,
    body,
    headers: {
      "content-type": contentTypeFor(rel),
      "x-amz-content-sha256": sha256Hex(body),
      "x-amz-date": amzDate(new Date()),
    },
  });
  const response = await fetch(url, { method: "PUT", headers, body });
  const text = await response.text();
  if (!response.ok) throw new Error(`[youtube] R2 upload failed ${response.status}: ${text.slice(0, 1000)}`);
  return `${publicBaseUrl}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
}

function objectKeyFor(item, rel) {
  const prefix = cleanPrefix(process.env.R2_KEY_PREFIX || "talley-pipeline");
  const slug = item.slug || slugify(item.h1Title || item.title || item.id);
  const ext = path.extname(rel).toLowerCase() || ".mp4";
  return [prefix, "resource-youtube", item.sourceVideo || sourceFromId(item.id), slug, `source-video${ext}`].join("/");
}

function nextYouTubeSlot() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(10, 0, 0, 0);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() + 1);
  if (day === 6) d.setDate(d.getDate() + 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T10:00:00`;
}

function signRequest({ method, url, body, headers }) {
  const parsed = new URL(url);
  const dateStamp = headers["x-amz-date"].slice(0, 8);
  const region = "auto";
  const service = "s3";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const host = parsed.host;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `content-type:${headers["content-type"]}`,
    `host:${host}`,
    `x-amz-content-sha256:${headers["x-amz-content-sha256"]}`,
    `x-amz-date:${headers["x-amz-date"]}`,
  ].join("\n") + "\n";
  const canonicalRequest = [
    method,
    parsed.pathname,
    parsed.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    headers["x-amz-content-sha256"],
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    headers["x-amz-date"],
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${process.env.R2_SECRET_ACCESS_KEY}`, dateStamp), region), service), "aws4_request");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  return {
    ...headers,
    host,
    authorization: `AWS4-HMAC-SHA256 Credential=${process.env.R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  return "application/octet-stream";
}

function sha256Hex(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function hmac(key, value) { return crypto.createHmac("sha256", key).update(value).digest(); }
function amzDate(date) { return date.toISOString().replace(/[:-]|\.\d{3}/g, ""); }
function cleanPrefix(value) { return String(value || "").replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/"); }
function sourceFromId(value) { return String(value || "").split("__")[0].replace(/-/g, "_").toUpperCase(); }
function slugify(value) { return String(value || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "resource-youtube"; }
function cleanTitle(value) { return String(value || "").replace(/^#+\s*/, "").replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim(); }
function parseMaybeJson(text) { try { return JSON.parse(text); } catch { return text; } }
function readJson(file, fallback) { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; } }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
function fail(message) { console.error(`[youtube] ${message}`); process.exit(1); }

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
