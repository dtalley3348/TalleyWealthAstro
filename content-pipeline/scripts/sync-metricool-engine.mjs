#!/usr/bin/env node
// sync-metricool-engine.mjs
// Builds a local, secret-free dashboard snapshot from Metricool planner data,
// the local schedule, and the local live-write ledger. No writes to Metricool.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK = path.join(ROOT, "work");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const readJson = (p, fallback) => {
  try { return JSON.parse(read(p)); } catch (_) { return fallback; }
};

const metricoolList = readJson(path.join(WORK, "metricool-list.json"), {});
const status = readJson(path.join(WORK, "metricool-status.json"), {});
const ledger = readJson(path.join(WORK, "metricool-live-ledger.json"), { entries: {} });
const schedule = readJson(path.join(ROOT, "schedule.json"), []);
const index = readJson(path.join(ROOT, "content-index.json"), { records: [] });
const dryRun = readJson(path.join(ROOT, "metricool-dry-run.json"), {});
const analytics = readJson(path.join(WORK, "metricool-analytics.json"), { status: "not_configured", responses: [] });
const scheduleRows = Array.isArray(schedule) ? schedule.filter((row) => row.date !== "OVERFLOW") : [];

const records = new Map((Array.isArray(index.records) ? index.records : []).map((record) => [record.id || record.name, record]));
const ledgerByMetricoolId = new Map();
for (const [key, entry] of Object.entries(ledger.entries || {})) {
  if (entry.metricoolId) ledgerByMetricoolId.set(String(entry.metricoolId), { key, entry });
  for (const id of entry.descendantIds || []) ledgerByMetricoolId.set(String(id), { key, entry, descendant: true });
}

const metricoolPosts = flattenMetricoolPosts(metricoolList.response?.data || metricoolList.data || []);
const planner = [];
for (const post of metricoolPosts) {
  const match = ledgerByMetricoolId.get(String(post.id));
  const platform = normalizeNetwork(post.providers?.[0]?.network || match?.entry?.row?.platform || "");
  const fallbackRow = match ? null : fallbackScheduleMatch(post, platform);
  const row = match?.entry?.row || fallbackRow || {};
  planner.push({
    id: String(post.id),
    source: "metricool",
    date: datePart(post.publicationDate?.dateTime),
    time: timePart(post.publicationDate?.dateTime),
    timezone: post.publicationDate?.timezone || "",
    platform: platform || normalizeNetwork(row.platform || ""),
    platformLabel: platformLabel(platform || normalizeNetwork(row.platform || "")),
    providerStatus: post.providers?.[0]?.status || "",
    detailedStatus: post.providers?.[0]?.detailedStatus || "",
    draft: !!post.draft,
    autoPublish: !!post.autoPublish,
    property: propertyFromRow(row),
    metricoolBrand: row.metricoolBrand || row.property || propertyFromRow(row),
    sourceVideo: row.video || "",
    asset: row.asset || "",
    sourceTitle: records.get(row.video)?.title || row.video || "",
    text: String(post.text || "").trim(),
    mediaCount: Array.isArray(post.media) ? post.media.length : 0,
    descendantCount: Array.isArray(post.descendants) ? post.descendants.length : 0,
    ledgerKey: match?.key || (fallbackRow ? "matched-by-text" : ""),
    matchedLocal: !!match || !!fallbackRow,
    matchMethod: match ? "ledger" : fallbackRow ? "text" : "",
    metricoolOnly: !match && !fallbackRow,
  });
}

const metricoolIdsByLedgerKey = new Set(planner.map((item) => item.ledgerKey).filter(Boolean));
for (const row of Array.isArray(schedule) ? schedule : []) {
  if (row.date === "OVERFLOW") continue;
  const ledgerMatch = findLedgerForScheduleRow(row);
  if (ledgerMatch && metricoolIdsByLedgerKey.has(ledgerMatch.key)) continue;
  planner.push({
    id: "",
    source: "local",
    date: row.date || "",
    time: row.time || "",
    timezone: status.timezone || "America/New_York",
    platform: row.platform || "",
    platformLabel: row.platformLabel || platformLabel(row.platform || ""),
    providerStatus: ledgerMatch ? "CREATED_NOT_IN_LIST" : "LOCAL_ONLY",
    detailedStatus: ledgerMatch ? "Created in Metricool, not returned by current planner list" : "Local schedule only",
    draft: false,
    autoPublish: false,
    property: propertyFromRow(row),
    metricoolBrand: row.metricoolBrand || row.property || propertyFromRow(row),
    sourceVideo: row.video || "",
    asset: row.asset || "",
    sourceTitle: records.get(row.video)?.title || row.video || "",
    text: String(row.text || "").trim(),
    mediaCount: 0,
    descendantCount: Array.isArray(row.thread) ? Math.max(0, row.thread.length - 1) : 0,
    ledgerKey: ledgerMatch?.key || "",
    matchedLocal: true,
    metricoolOnly: false,
  });
}

const includedLedgerKeys = new Set(planner.map((item) => item.ledgerKey).filter(Boolean));
const includedMetricoolIds = new Set(planner.map((item) => item.id).filter(Boolean));
for (const [key, entry] of Object.entries(ledger.entries || {})) {
  if (!entry?.metricoolId || includedLedgerKeys.has(key)) continue;
  if (includedMetricoolIds.has(String(entry.metricoolId))) continue;
  const row = entry.row || {};
  if (!row.date || !row.time) continue;
  if (!isFutureItem(row)) continue;
  planner.push({
    id: String(entry.metricoolId),
    source: "ledger",
    date: row.date || "",
    time: row.time || "",
    timezone: entry.publicationDate?.timezone || status.timezone || "America/New_York",
    platform: row.platform || "",
    platformLabel: row.platformLabel || platformLabel(row.platform || ""),
    providerStatus: "CREATED_NOT_IN_LIST",
    detailedStatus: "Created in Metricool from local ledger; not returned by the current planner list",
    draft: !!entry.draft,
    autoPublish: !!entry.autoPublish,
    property: propertyFromRow(row),
    metricoolBrand: row.metricoolBrand || row.property || propertyFromRow(row),
    sourceVideo: row.video || "",
    asset: row.asset || "",
    sourceTitle: records.get(row.video)?.title || row.video || "",
    text: "",
    mediaCount: 0,
    descendantCount: Array.isArray(entry.descendantIds) ? entry.descendantIds.length : 0,
    ledgerKey: key,
    matchedLocal: true,
    matchMethod: "ledger-only",
    metricoolOnly: false,
  });
}

planner.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`) || a.platformLabel.localeCompare(b.platformLabel));

const summary = summarize(planner);
const performance = buildPerformance(planner);
const snapshot = {
  generatedAt: new Date().toISOString(),
  status,
  sourceFiles: {
    metricoolList: fs.existsSync(path.join(WORK, "metricool-list.json")),
    liveLedger: fs.existsSync(path.join(WORK, "metricool-live-ledger.json")),
    schedule: fs.existsSync(path.join(ROOT, "schedule.json")),
    dryRunReady: !!dryRun.readyForApiWrite,
  },
  summary,
  planner,
  performance,
  analytics,
};

fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(path.join(WORK, "metricool-engine.json"), JSON.stringify(snapshot, null, 2));
console.log(`[metricool-engine] wrote ${planner.length} planner item(s) -> work/metricool-engine.json`);

function flattenMetricoolPosts(posts) {
  const out = [];
  for (const post of Array.isArray(posts) ? posts : []) {
    out.push(post);
    for (const child of post.descendants || []) out.push({ ...child, isDescendant: true });
  }
  return out;
}

function findLedgerForScheduleRow(row) {
  const entries = Object.entries(ledger.entries || {});
  const matches = entries.map(([key, entry]) => ({ key, entry })).filter(({ entry }) => {
    const r = entry.row || {};
    return r.video === row.video && r.asset === row.asset && r.platform === row.platform && r.date === row.date && r.time === row.time;
  });
  return matches.find(({ key }) => metricoolIdsByLedgerKey.has(key))
    || matches.find(({ entry }) => entry.row?.metricoolBrand || entry.row?.property)
    || matches[0];
}

function summarize(items) {
  const byStatus = countBy(items, (item) => displayStatus(item));
  const byPlatform = countBy(items, (item) => item.platformLabel || "Unknown");
  const byProperty = countBy(items, (item) => item.property || "Unknown");
  const openItems = items.filter((item) => item.date && item.time && !isDoneStatus(item) && isFutureItem(item));
  const nextPost = openItems[0];
  const scheduledThrough = openItems.map((item) => item.date).filter(Boolean).sort().at(-1) || "";
  return {
    total: items.length,
    metricool: items.filter((item) => item.source === "metricool").length,
    localOnly: items.filter((item) => item.source === "local").length,
    metricoolOnly: items.filter((item) => item.metricoolOnly).length,
    pending: items.filter((item) => /PENDING|LOCAL_ONLY|CREATED_NOT_IN_LIST/i.test(item.providerStatus)).length,
    published: items.filter(isPublishedStatus).length,
    failed: items.filter(isFailedStatus).length,
    byStatus,
    byPlatform,
    byProperty,
    scheduledThrough,
    nextPost: nextPost ? {
      date: nextPost.date,
      time: nextPost.time,
      platformLabel: nextPost.platformLabel,
      sourceVideo: nextPost.sourceVideo,
      asset: nextPost.asset,
      title: nextPost.sourceTitle,
    } : null,
  };
}

function propertyFromRow(row) {
  return row?.property || row?.metricoolBrand || "Talley Wealth";
}

function fallbackScheduleMatch(post, platform) {
  const text = normalizedText(post.text);
  if (!text || !platform) return null;
  const postDate = datePart(post.publicationDate?.dateTime);
  let best = null;
  let bestScore = Infinity;
  for (const row of scheduleRows) {
    if (normalizeNetwork(row.platform || "") !== platform) continue;
    if (normalizedText(row.text) !== text) continue;
    const score = dateDistance(postDate, row.date);
    if (score < bestScore) {
      best = row;
      bestScore = score;
    }
  }
  return best;
}

function normalizedText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function dateDistance(a, b) {
  const da = Date.parse(`${a || ""}T12:00:00`);
  const db = Date.parse(`${b || ""}T12:00:00`);
  if (!Number.isFinite(da) || !Number.isFinite(db)) return 999999999;
  return Math.abs(da - db);
}

function buildPerformance(items) {
  const published = items.filter(isPublishedStatus);
  const sourceRollups = [];
  for (const [sourceVideo, group] of groupBy(items.filter((item) => item.sourceVideo), (item) => item.sourceVideo)) {
    sourceRollups.push({
      sourceVideo,
      title: records.get(sourceVideo)?.title || sourceVideo,
      total: group.length,
      published: group.filter(isPublishedStatus).length,
      pending: group.filter((item) => !isDoneStatus(item)).length,
      platforms: [...new Set(group.map((item) => item.platformLabel).filter(Boolean))],
      assets: [...new Set(group.map((item) => item.asset).filter(Boolean))],
    });
  }
  sourceRollups.sort((a, b) => b.total - a.total || a.sourceVideo.localeCompare(b.sourceVideo));
  return {
    mode: "planner_status",
    note: "This is status/performance plumbing from the planner and live ledger. Deeper impressions, clicks, and engagement metrics can be added once the Metricool analytics endpoints are mapped.",
    publishedCount: published.length,
    pendingCount: items.filter((item) => !isDoneStatus(item)).length,
    failedCount: items.filter(isFailedStatus).length,
    sourceRollups,
  };
}

function countBy(items, fn) {
  const out = {};
  for (const item of items) {
    const key = fn(item) || "Unknown";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function groupBy(items, fn) {
  const out = new Map();
  for (const item of items) {
    const key = fn(item);
    if (!out.has(key)) out.set(key, []);
    out.get(key).push(item);
  }
  return out;
}

function displayStatus(item) {
  if (item.source === "local") return "Local only";
  if (item.draft) return "Draft";
  if (isPublishedStatus(item)) return "Published";
  if (isFailedStatus(item)) return "Failed";
  return item.detailedStatus || item.providerStatus || "Scheduled";
}

function isPublishedStatus(item) {
  return /PUBLISHED|PUBLICADO|SENT|DONE/i.test(`${item.providerStatus} ${item.detailedStatus}`);
}

function isFailedStatus(item) {
  return /FAIL|ERROR|REJECT/i.test(`${item.providerStatus} ${item.detailedStatus}`);
}

function isDoneStatus(item) {
  return isPublishedStatus(item) || isFailedStatus(item);
}

function isFutureItem(item) {
  const d = Date.parse(`${item.date || ""}T${item.time || "00:00"}:00`);
  return Number.isFinite(d) && d >= Date.now();
}

function normalizeNetwork(value) {
  const v = String(value || "").toLowerCase();
  if (v === "twitter") return "x";
  if (v === "gmb") return "gbp";
  return v;
}

function platformLabel(platform) {
  return { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", x: "X", gbp: "Google Business Profile", youtube: "YouTube" }[platform] || platform || "Unknown";
}

function datePart(value) {
  return String(value || "").slice(0, 10);
}

function timePart(value) {
  return String(value || "").slice(11, 16);
}
