#!/usr/bin/env node
// metricool-live.mjs
// Guarded Metricool writer. Defaults to no write. It can create text-only X
// items and media drafts/scheduled items when public media URLs are present in
// work/metricool-media-manifest.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv(path.join(ROOT, ".env"));

const args = new Set(process.argv.slice(2));
const apiKey = process.env.METRICOOL_API_KEY || "";
const userId = process.env.METRICOOL_USER_ID || "";
const blogId = process.env.METRICOOL_BRAND_ID_TALLEY_WEALTH || process.env.METRICOOL_BRAND_ID || "";
const timezone = process.env.METRICOOL_TIMEZONE || "America/New_York";
const liveEnabled = String(process.env.METRICOOL_LIVE_WRITE || "").toLowerCase() === "true";
const API_TIMEOUT_MS = Math.max(10000, Number(process.env.METRICOOL_API_TIMEOUT_MS || 45000));

if (!apiKey || !userId || !blogId) {
  console.error("[metricool-live] missing METRICOOL_API_KEY, METRICOOL_USER_ID, or METRICOOL_BRAND_ID");
  process.exit(1);
}

if (args.has("--list")) {
  await listPosts();
  process.exit(0);
}

const deleteArg = process.argv.find((arg) => arg.startsWith("--delete-id="));
if (deleteArg) {
  if (!liveEnabled || !args.has("--confirm-live")) {
    console.error("[metricool-live] delete blocked. Require METRICOOL_LIVE_WRITE=true and --confirm-live.");
    process.exit(2);
  }
  const id = deleteArg.split("=")[1];
  const result = await deletePost(id);
  writeEvidence("metricool-live-delete.json", { mode: "delete", id, result });
  console.log(`[metricool-live] deleted Metricool item ${id}; evidence work/metricool-live-delete.json`);
  process.exit(0);
}

if (!liveEnabled || !args.has("--confirm-live")) {
  console.error("[metricool-live] write blocked. Require METRICOOL_LIVE_WRITE=true and --confirm-live.");
  console.error("[metricool-live] read-only check: node scripts/metricool-live.mjs --list");
  process.exit(2);
}

if (args.has("--smoke-test-x")) {
  const when = nextLocalSlot();
  const body = buildXPayload({
    text: "Metricool API draft test from the Talley local pipeline. Do not publish.",
    dateTime: when,
    draft: true,
    autoPublish: false
  });
  const result = await createPost(body);
  writeEvidence("metricool-live-smoke.json", { mode: "smoke-test-x", request: redactBody(body), result });
  console.log(`[metricool-live] smoke test created Metricool draft/scheduled item; evidence work/metricool-live-smoke.json`);
  process.exit(0);
}

if (args.has("--smoke-test-media")) {
  const when = nextLocalSlot();
  const mediaUrl = await normalizeMediaUrl("https://placehold.co/1080x1080.jpg");
  const body = buildMediaPayload({
    row: { platform: "x", asset: "media_smoke", text: "Metricool media draft test from the Talley local pipeline. Do not publish." },
    mediaUrls: [mediaUrl],
    dateTime: when,
    draft: true,
    autoPublish: false
  });
  const result = await createPost(body, { requireMediaCount: 1 });
  writeEvidence("metricool-live-media-smoke.json", { mode: "smoke-test-media", request: redactBody(body), result });
  console.log(`[metricool-live] media smoke test created Metricool draft item; evidence work/metricool-live-media-smoke.json`);
  process.exit(0);
}

if (args.has("--from-schedule")) {
  const schedulePath = path.join(ROOT, "schedule.json");
  if (!fs.existsSync(schedulePath)) {
    console.error("[metricool-live] schedule.json missing. Run node scripts/schedule.mjs first.");
    process.exit(1);
  }
  const ledger = readLiveLedger();
  seedLedgerFromPriorResults(ledger);
  const rows = JSON.parse(fs.readFileSync(schedulePath, "utf8"))
    .filter((row) => row.date !== "OVERFLOW")
    .filter((row) => isLiveSupportedRow(row, args.has("--include-media")));

  const maxArg = process.argv.find((arg) => arg.startsWith("--max="));
  const maxValue = maxArg ? maxArg.split("=")[1] : "";
  const max = maxValue === "all" ? Infinity : maxArg ? Number(maxValue) : 1;
  const skipArg = process.argv.find((arg) => arg.startsWith("--skip="));
  const skip = skipArg ? Number(skipArg.split("=")[1]) : 0;
  const writeLimit = max === Infinity ? Infinity : Number.isFinite(max) && max > 0 ? max : 1;
  const candidateRows = rows.slice(Number.isFinite(skip) && skip > 0 ? skip : 0);
  const results = [];
  let writes = 0;
  for (const row of candidateRows) {
    const key = rowKey(row);
    const existing = existingLedgerEntryFor(row, ledger);
    if (existing?.metricoolId) {
      results.push({ row, skipped: true, reason: mediaChangedAfterLedger(row, existing) ? "already-created-media-may-be-stale" : "already-created", ledger: existing });
      continue;
    }
    if (writes >= writeLimit) break;
    const targetBlogId = brandIdFor(row);
    if (!targetBlogId) {
      results.push({ row, skipped: true, reason: `missing Metricool Brand ID for ${row.metricoolBrand || row.property || "unknown brand"}` });
      continue;
    }
    const body = await buildPayloadForScheduleRow(row, {
      includeMedia: args.has("--include-media"),
      draft: !args.has("--publishable"),
      autoPublish: args.has("--publishable")
    });
    const validation = validateBody(body);
    if (validation.length) {
      results.push({ row, skipped: true, validation });
      continue;
    }
    const requireMediaCount = isMediaRow(row) ? body.media.length : 0;
    const result = await createPost(body, { requireMediaCount, blogId: targetBlogId });
    const entry = ledgerEntryFor(row, result);
    ledger.entries[key] = entry;
    ledger.updatedAt = new Date().toISOString();
    writeLiveLedger(ledger);
    results.push({ row, result, ledger: entry });
    writes += 1;
  }
  writeLiveLedger(ledger);
  writeEvidence("metricool-live-results.json", { mode: "from-schedule", count: results.length, wrote: writes, results });
  console.log(`[metricool-live] wrote ${writes} item(s), skipped ${results.filter((r) => r.skipped).length}; evidence work/metricool-live-results.json`);
  process.exit(0);
}

console.error("[metricool-live] usage:");
console.error("  node scripts/metricool-live.mjs --list");
console.error("  METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --smoke-test-x --confirm-live");
console.error("  METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --smoke-test-media --confirm-live");
console.error("  METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --from-schedule --confirm-live --max=1");
console.error("  METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --from-schedule --include-media --confirm-live --max=1");
console.error("  METRICOOL_LIVE_WRITE=true node scripts/metricool-live.mjs --from-schedule --include-media --confirm-live --max=15 --skip=1");
process.exit(1);

function buildXPayload({ text, thread, dateTime, draft, autoPublish }) {
  const first = String(thread?.[0] || text || "").trim();
  const descendants = Array.isArray(thread) ? thread.slice(1).map((part) => ({
    text: String(part || "").trim(),
    providers: [{ network: "twitter" }],
    autoPublish,
    draft,
    media: [],
    mediaAltText: [],
    shortener: false,
    smartLinkData: { ids: [] },
    twitterData: { tags: [] }
  })) : [];
  return {
    publicationDate: { dateTime, timezone },
    text: first,
    providers: [{ network: "twitter" }],
    autoPublish,
    draft,
    hasNotReadNotes: false,
    media: [],
    mediaAltText: [],
    shortener: false,
    smartLinkData: { ids: [] },
    twitterData: { tags: [] },
    descendants
  };
}

async function buildPayloadForScheduleRow(row, options) {
  const dateTime = `${row.date}T${row.time}:00`;
  if (row.platform === "x" && (row.asset === "x_thread" || /^x_extra_/.test(row.asset))) {
    return buildXPayload({
      text: Array.isArray(row.thread) ? row.thread[0] : row.text,
      thread: Array.isArray(row.thread) ? row.thread : null,
      dateTime,
      draft: options.draft,
      autoPublish: options.autoPublish
    });
  }
  if (row.platform === "gbp" && row.asset === "gbp") {
    return buildTextPayload({
      row,
      provider: providerFor(row.platform),
      dateTime,
      draft: options.draft,
      autoPublish: options.autoPublish
    });
  }
  if (isMediaRow(row)) {
    if (!options.includeMedia) throw new Error(`[metricool-live] media row requires --include-media: ${row.video} ${row.asset} ${row.platform}`);
    const urls = await mediaUrlsForRow(row);
    return buildMediaPayload({ row, mediaUrls: urls, dateTime, draft: options.draft, autoPublish: options.autoPublish });
  }
  throw new Error(`[metricool-live] unsupported schedule row: ${row.video} ${row.asset} ${row.platform}`);
}

function buildTextPayload({ row, provider, dateTime, draft, autoPublish }) {
  return {
    publicationDate: { dateTime, timezone },
    text: String(row.text || "").trim(),
    providers: [{ network: provider }],
    autoPublish,
    draft,
    hasNotReadNotes: false,
    saveExternalMediaFiles: false,
    media: [],
    mediaAltText: [],
    shortener: false,
    smartLinkData: { ids: [] }
  };
}

function buildMediaPayload({ row, mediaUrls, dateTime, draft, autoPublish }) {
  const provider = providerFor(row.platform);
  const body = {
    publicationDate: { dateTime, timezone },
    text: String(row.text || "").trim(),
    providers: [{ network: provider }],
    autoPublish,
    draft,
    hasNotReadNotes: false,
    saveExternalMediaFiles: true,
    media: mediaUrls,
    mediaAltText: mediaUrls.map(() => null),
    shortener: false,
    smartLinkData: { ids: [] }
  };
  if (provider === "twitter") body.twitterData = { tags: [] };
  if (provider === "linkedin") body.linkedinData = { type: "post", previewIncluded: true, publishImagesAsPDF: false };
  if (provider === "facebook") body.facebookData = { type: "POST", title: "" };
  if (provider === "instagram") body.instagramData = { type: ["video", "overlay"].includes(row.asset) ? "REEL" : "POST", showReelOnFeed: true, collaborators: [] };
  return body;
}

function validateBody(body) {
  const errors = [];
  const isTwitterOnly = body.providers?.length === 1 && body.providers[0]?.network === "twitter";
  const hasThread = Array.isArray(body.descendants) && body.descendants.length > 0;
  if (!body.text) errors.push("post text is empty");
  if (isTwitterOnly && (hasThread || !body.media?.length)) {
    const parts = [body.text, ...(body.descendants || []).map((d) => d.text)];
    parts.forEach((part, i) => {
      if (!part) errors.push(`X part ${i + 1} is empty`);
      if (part.length > 280) errors.push(`X part ${i + 1} is ${part.length} chars; limit is 280`);
    });
  }
  return errors;
}

async function createPost(body, options = {}) {
  const validation = validateBody(body);
  if (validation.length) throw new Error(validation.join("; "));
  const targetBlogId = options.blogId || blogId;
  const qs = new URLSearchParams({ userId, blogId: targetBlogId, integrationSource: "CodexLocal" });
  const response = await fetchWithTimeout(`https://app.metricool.com/api/v2/scheduler/posts?${qs}`, {
    method: "POST",
    headers: { "X-Mc-Auth": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }, `POST ${body.providers?.[0]?.network || "provider"} ${body.publicationDate?.dateTime || ""}`);
  const text = await response.text();
  const parsed = parseMaybeJson(text);
  if (!response.ok) {
    writeEvidence("metricool-live-error.json", { status: response.status, response: parsed, request: redactBody(body) });
    throw new Error(`[metricool-live] POST failed ${response.status}: ${text.slice(0, 1000)}`);
  }
  const required = options.requireMediaCount || 0;
  if (required > 0) {
    const media = parsed?.data?.media;
    const actual = Array.isArray(media) ? media.length : 0;
    if (actual < required) {
      const id = parsed?.data?.id;
      if (id) await deletePost(id);
      writeEvidence("metricool-live-media-error.json", { status: response.status, response: parsed, request: redactBody(body), requiredMedia: required, actualMedia: actual, deletedId: id || null });
      throw new Error(`[metricool-live] Metricool created the item but did not keep the media (${actual}/${required}); deleted ${id || "unknown id"}`);
    }
  }
  return { status: response.status, response: parsed };
}

function brandIdFor(row) {
  const brand = String(row.metricoolBrand || row.property || "Talley Wealth");
  const key = brand.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const value = process.env[`METRICOOL_BRAND_ID_${key}`];
  if (value) return value;
  return brand === "Talley Wealth" ? blogId : "";
}

async function mediaUrlsForRow(row) {
  const manifest = readJson(path.join(ROOT, "work", "metricool-media-manifest.json"), null);
  if (!manifest) throw new Error("[metricool-live] media manifest missing. Run node scripts/prepare-metricool-media.mjs first.");
  const key = `${row.video}|${row.asset}|${row.platform}`;
  const item = manifest.assets?.[key] || manifest.assets?.[`${row.video}|${row.asset}|${row.platformLabel}`];
  if (!item?.ready || !Array.isArray(item.publicUrls) || !item.publicUrls.length) {
    throw new Error(`[metricool-live] no ready public media URLs for ${key}`);
  }
  const out = [];
  for (const url of item.publicUrls) out.push(await normalizeMediaUrl(url));
  return out;
}

async function normalizeMediaUrl(url) {
  const qs = new URLSearchParams({ url });
  const response = await fetchWithTimeout(`https://app.metricool.com/api/actions/normalize/image/url?${qs}`, {
    headers: { "X-Mc-Auth": apiKey }
  }, `normalize media ${url}`);
  const text = (await response.text()).trim();
  if (!response.ok) throw new Error(`[metricool-live] normalize failed ${response.status} for ${url}: ${text.slice(0, 500)}`);
  if (!/^https?:\/\//i.test(text)) throw new Error(`[metricool-live] normalize returned non-url for ${url}: ${text.slice(0, 500)}`);
  return text;
}

function isLiveSupportedRow(row, includeMedia) {
  if (row.platform === "x" && (row.asset === "x_thread" || /^x_extra_/.test(row.asset))) return true;
  if (row.platform === "gbp" && row.asset === "gbp") return true;
  if (includeMedia && isMediaRow(row)) return true;
  return false;
}

function isMediaRow(row) {
  return ["video", "carousel"].includes(row.asset) && ["instagram", "facebook", "linkedin", "x"].includes(row.platform);
}

function mediaChangedAfterLedger(row, entry) {
  if (!isMediaRow(row) || !entry.createdAt) return false;
  const mediaTime = latestMediaMtime(row);
  if (!mediaTime) return false;
  const entryTime = Date.parse(entry.createdAt);
  return Number.isFinite(entryTime) && mediaTime > entryTime + 1000;
}

function latestMediaMtime(row) {
  const dir = path.join(ROOT, "output", row.video);
  if (row.asset === "video") {
    const file = ["scheduled/captioned_with_cover_9x16.mp4", "clean-social/captioned_vertical_9x16.mp4", "clean-social/vertical_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"]
      .map((candidate) => path.join(dir, candidate))
      .find((candidate) => fs.existsSync(candidate));
    return file ? fs.statSync(file).mtimeMs : 0;
  }
  if (row.asset === "carousel") {
    const carouselDir = path.join(dir, "carousel");
    if (!fs.existsSync(carouselDir)) return 0;
    return fs.readdirSync(carouselDir)
      .filter((file) => /^slide-\d+\.png$/.test(file))
      .map((file) => fs.statSync(path.join(carouselDir, file)).mtimeMs)
      .reduce((max, value) => Math.max(max, value), 0);
  }
  return 0;
}

function providerFor(platform) {
  return {
    linkedin: "linkedin",
    instagram: "instagram",
    facebook: "facebook",
    x: "twitter",
    gbp: "gmb",
  }[platform] || platform.toLowerCase();
}

async function deletePost(id) {
  if (!/^\d+$/.test(String(id))) throw new Error(`Invalid Metricool post id: ${id}`);
  const qs = new URLSearchParams({ userId, blogId, integrationSource: "CodexLocal" });
  const response = await fetchWithTimeout(`https://app.metricool.com/api/v2/scheduler/posts/${encodeURIComponent(id)}?${qs}`, {
    method: "DELETE",
    headers: { "X-Mc-Auth": apiKey, "Content-Type": "application/json" }
  }, `DELETE ${id}`);
  const text = await response.text();
  const parsed = parseMaybeJson(text);
  if (!response.ok) {
    writeEvidence("metricool-live-delete-error.json", { status: response.status, response: parsed, id });
    throw new Error(`[metricool-live] DELETE failed ${response.status}: ${text.slice(0, 1000)}`);
  }
  return { status: response.status, response: parsed };
}

async function listPosts() {
  const today = new Date();
  const end = new Date();
  end.setDate(today.getDate() + 120);
  const qs = new URLSearchParams({
    userId,
    blogId,
    integrationSource: "CodexLocal",
    start: `${today.toISOString().slice(0, 10)}T00:00:00`,
    end: `${end.toISOString().slice(0, 10)}T23:59:59`,
    timezone,
    extendedRange: "true"
  });
  const response = await fetchWithTimeout(`https://app.metricool.com/api/v2/scheduler/posts?${qs}`, {
    headers: { "X-Mc-Auth": apiKey }
  }, "list scheduler posts");
  const text = await response.text();
  const parsed = parseMaybeJson(text);
  writeEvidence("metricool-list.json", { status: response.status, response: parsed });
  if (!response.ok) throw new Error(`[metricool-live] list failed ${response.status}: ${text.slice(0, 1000)}`);
  const count = Array.isArray(parsed) ? parsed.length : Array.isArray(parsed?.data) ? parsed.data.length : "unknown";
  console.log(`[metricool-live] listed posts; count=${count}; evidence work/metricool-list.json`);
}

function nextLocalSlot() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(9, 15, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T09:15:00`;
}

function writeEvidence(file, data) {
  fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "work", file), JSON.stringify({ generatedAt: new Date().toISOString(), ...data }, null, 2));
}

async function fetchWithTimeout(url, options = {}, label = "Metricool request") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`${label} timed out after ${API_TIMEOUT_MS}ms`)), API_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError" || /timed out/i.test(String(error?.message || ""))) {
      throw new Error(`[metricool-live] ${label} timed out after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function readLiveLedger() {
  const p = path.join(ROOT, "work", "metricool-live-ledger.json");
  const ledger = readJson(p, null);
  if (ledger && typeof ledger === "object" && ledger.entries && typeof ledger.entries === "object") return ledger;
  return { generatedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), entries: {} };
}

function writeLiveLedger(ledger) {
  fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "work", "metricool-live-ledger.json"), JSON.stringify(ledger, null, 2));
}

function seedLedgerFromPriorResults(ledger) {
  const previous = readJson(path.join(ROOT, "work", "metricool-live-results.json"), null);
  if (!Array.isArray(previous?.results)) return;
  let changed = false;
  for (const item of previous.results) {
    if (!item?.row || !item?.result?.response?.data?.id) continue;
    const key = rowKey(item.row);
    if (ledger.entries[key]?.metricoolId) continue;
    ledger.entries[key] = ledgerEntryFor(item.row, item.result);
    changed = true;
  }
  if (changed) {
    ledger.updatedAt = new Date().toISOString();
    writeLiveLedger(ledger);
  }
}

function existingLedgerEntryFor(row, ledger) {
  const direct = ledger.entries?.[rowKey(row)];
  if (direct) return direct;
  // Older ledger entries were written before property/brand was part of the
  // idempotency key. They all represent Talley Wealth rows, so only use that
  // fallback for Talley Wealth. Otherwise cross-brand moves would be blocked.
  const brand = String(row.metricoolBrand || row.property || "Talley Wealth");
  if (brand !== "Talley Wealth") return null;
  return ledger.entries?.[legacyRowKey(row)] || null;
}

function rowKey(row) {
  const content = Array.isArray(row.thread) ? row.thread.join("\n---\n") : String(row.text || "");
  return [
    row.metricoolBrand || row.property || "Talley Wealth",
    row.date,
    row.time,
    row.platform,
    row.video,
    row.asset,
    shortHash(content)
  ].join("|");
}

function legacyRowKey(row) {
  const content = Array.isArray(row.thread) ? row.thread.join("\n---\n") : String(row.text || "");
  return [
    row.date,
    row.time,
    row.platform,
    row.video,
    row.asset,
    shortHash(content)
  ].join("|");
}

function ledgerEntryFor(row, result) {
  const data = result?.response?.data || {};
  return {
    key: rowKey(row),
    createdAt: new Date().toISOString(),
    metricoolId: data.id || null,
    descendantIds: Array.isArray(data.descendants) ? data.descendants.map((d) => d.id).filter(Boolean) : [],
    status: result?.status || null,
    draft: data.draft ?? null,
    autoPublish: data.autoPublish ?? null,
    providerStatuses: Array.isArray(data.providers) ? data.providers : [],
    publicationDate: data.publicationDate || null,
    row: {
      date: row.date,
      time: row.time,
      property: row.property || row.metricoolBrand || "Talley Wealth",
      metricoolBrand: row.metricoolBrand || row.property || "Talley Wealth",
      platform: row.platform,
      platformLabel: row.platformLabel,
      video: row.video,
      asset: row.asset
    }
  };
}

function shortHash(value) {
  let hash = 5381;
  for (const ch of String(value)) hash = ((hash << 5) + hash + ch.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}

function redactBody(body) {
  return JSON.parse(JSON.stringify(body));
}

function parseMaybeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
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
