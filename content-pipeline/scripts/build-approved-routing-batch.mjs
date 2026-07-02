#!/usr/bin/env node
// Builds the approved cross-brand scheduling batch from:
// - already-scheduled posts that should be recreated on a better-fit brand
// - approved repurpose seed rewrites for newly launched properties
//
// This script writes local files only. Apply with apply-approved-routing-batch.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK = path.join(ROOT, "work");
const OUT = path.join(ROOT, "output");

const SHADOW_PATH = path.join(WORK, "metricool-shadow-reroute.json");
const SEED_PATH = path.join(WORK, "repurpose-seed-plan.json");
const ENGINE_PATH = path.join(WORK, "metricool-engine.json");
const INDEX_PATH = path.join(ROOT, "content-index.json");
const JSON_OUT = path.join(WORK, "approved-routing-batch.json");
const CSV_OUT = path.join(WORK, "approved-routing-batch.csv");
const MD_OUT = path.join(WORK, "approved-routing-batch.md");

const args = new Set(process.argv.slice(2));
const now = new Date();
const guardMinutes = numberArg("--guard-minutes=", 90);
const repurposeStart = dateArg("--repurpose-start=") || nextDateString(now, 2);
const minSameSourceGapDays = numberArg("--same-source-gap-days=", 5);

const shadow = readJson(SHADOW_PATH, null);
const seed = readJson(SEED_PATH, null);
const engine = readJson(ENGINE_PATH, { planner: [] });
const index = readJson(INDEX_PATH, { records: [] });
if (!shadow || !seed) {
  console.error("[approved-routing-batch] missing shadow reroute or repurpose seed plan. Rebuild those first.");
  process.exit(1);
}

const plannerByMetricoolId = new Map((engine.planner || []).filter((item) => item.id).map((item) => [String(item.id), item]));
const titles = new Map((index.records || []).map((record) => [record.id || record.name, record.title || record.id || record.name]));
const occupied = new Set();
const sameSourceDates = new Map();
const rows = [];
const skipped = [];

seedOccupancyFromPlanner(engine.planner || []);
buildMoveRows();
buildRepurposeRows();

rows.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`) || propertyRank(a.property) - propertyRank(b.property));

const summary = {
  totalRows: rows.length,
  moveRows: rows.filter((row) => row.batchKind === "move").length,
  repurposeRows: rows.filter((row) => row.batchKind === "repurpose_seed").length,
  skipped: skipped.length,
  byProperty: countBy(rows, (row) => row.property || "Unknown"),
  byPlatform: countBy(rows, (row) => row.platformLabel || row.platform || "Unknown"),
  firstDate: rows.map((row) => row.date).filter(Boolean).sort()[0] || "",
  lastDate: rows.map((row) => row.date).filter(Boolean).sort().at(-1) || "",
};

const payload = {
  generatedAt: new Date().toISOString(),
  mode: "approved_routing_batch",
  approvalBasis: "David approved the move recommendations and repurpose seed recommendations in chat.",
  safety: {
    liveApplyCreatesReplacementFirst: true,
    liveApplyDeletesOldTalleyWealthPostsOnlyAfterReplacementExists: true,
    guardMinutes,
    minSameSourceGapDays,
  },
  sourceFiles: {
    shadow: "work/metricool-shadow-reroute.json",
    repurposeSeed: "work/repurpose-seed-plan.json",
    metricoolEngine: "work/metricool-engine.json",
  },
  summary,
  rows,
  skipped,
  files: {
    json: "work/approved-routing-batch.json",
    csv: "work/approved-routing-batch.csv",
    markdown: "work/approved-routing-batch.md",
  },
};

fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2));
fs.writeFileSync(CSV_OUT, toCsv(rows));
fs.writeFileSync(MD_OUT, toMarkdown(payload));

console.log(`[approved-routing-batch] wrote ${summary.totalRows} row(s): ${summary.moveRows} move, ${summary.repurposeRows} repurpose; skipped ${summary.skipped} -> work/approved-routing-batch.json`);

function buildMoveRows() {
  const moveRows = (shadow.rows || []).filter((row) => row.canMoveThisPost);
  for (const row of moveRows) {
    const planner = plannerByMetricoolId.get(String(row.metricoolId));
    if (!planner) {
      skip("move_missing_planner_item", row, "Could not find the full Metricool planner item text for this move candidate.");
      continue;
    }
    if (!isFarEnoughFuture(row.date, row.time)) {
      skip("move_too_close", row, `Scheduled inside the ${guardMinutes}-minute live-write guard.`);
      continue;
    }
    const asset = row.asset || planner.asset || "";
    if (!isSupportedApplyAsset(row.platform, asset)) {
      skip("move_unsupported_asset", row, `Unsupported apply row: ${row.platform}/${asset}.`);
      continue;
    }
    if (!assetReady(row.sourceVideo, asset, row.platform)) {
      skip("move_missing_media", row, `Missing local media for ${row.sourceVideo}/${asset}/${row.platform}.`);
      continue;
    }
    const scheduleRow = {
      batchKind: "move",
      approvedAction: "recreate_on_target_then_delete_old",
      oldMetricoolId: String(row.metricoolId),
      oldProperty: row.currentProperty || "Talley Wealth",
      oldMetricoolBrand: row.currentMetricoolBrand || row.currentProperty || "Talley Wealth",
      property: row.recommendedPrimary,
      metricoolBrand: row.recommendedPrimary,
      date: row.date,
      time: row.time,
      platform: normalizePlatform(row.platform),
      platformLabel: row.platformLabel || platformLabel(row.platform),
      video: row.sourceVideo,
      sourceVideo: row.sourceVideo,
      sourceTitle: row.title || titles.get(row.sourceVideo) || row.sourceVideo,
      asset,
      text: String(planner.text || "").trim(),
      routeConfidence: row.routeConfidence || "",
      routeReason: row.routeReason || row.reason || "",
    };
    if (!scheduleRow.text) {
      skip("move_missing_text", row, "Metricool planner item did not include post text.");
      continue;
    }
    rows.push(scheduleRow);
    markOccupied(scheduleRow);
  }
}

function buildRepurposeRows() {
  for (const card of seed.cards || []) {
    for (const draft of card.drafts || []) {
      const platform = normalizePlatform(draft.platform);
      const asset = assetForDraft(draft, platform);
      const base = {
        batchKind: "repurpose_seed",
        approvedAction: "create_destination_native_variant",
        repurposeCardId: card.id,
        property: card.targetProperty,
        metricoolBrand: card.metricoolBrand || card.targetProperty,
        platform,
        platformLabel: draft.platformLabel || platformLabel(platform),
        video: card.sourceVideo,
        sourceVideo: card.sourceVideo,
        sourceTitle: card.title || titles.get(card.sourceVideo) || card.sourceVideo,
        asset,
        text: String(draft.text || "").trim(),
        routeConfidence: card.routeConfidence || "",
        routeReason: card.routeReason || "",
        repurposeAngle: card.angle || "",
        complianceNote: draft.complianceNote || "",
      };
      if (!base.text) {
        skip("repurpose_missing_text", card, `No text for ${card.id}/${platform}.`);
        continue;
      }
      if (!isSupportedApplyAsset(platform, asset)) {
        skip("repurpose_unsupported_asset", card, `Unsupported apply row: ${platform}/${asset}.`);
        continue;
      }
      if (!assetReady(card.sourceVideo, asset, platform)) {
        skip("repurpose_missing_media", card, `Missing local media for ${card.sourceVideo}/${asset}/${platform}.`);
        continue;
      }
      const slot = nextRepurposeSlot({
        property: base.property,
        platform,
        sourceVideo: card.sourceVideo,
        startDate: repurposeStart,
      });
      rows.push({ ...base, date: slot.date, time: slot.time });
      markOccupied({ ...base, date: slot.date, time: slot.time });
    }
  }
}

function seedOccupancyFromPlanner(items) {
  for (const item of items) {
    if (!item.date || !item.time) continue;
    const row = {
      property: item.property || item.metricoolBrand || "Talley Wealth",
      platform: normalizePlatform(item.platform),
      date: item.date,
      time: item.time,
      sourceVideo: item.sourceVideo || "",
    };
    markOccupied(row);
  }
}

function nextRepurposeSlot({ property, platform, sourceVideo, startDate }) {
  const pattern = slotPattern(property, platform);
  const start = parseLocalDate(startDate);
  for (let offset = 0; offset < 84; offset++) {
    const date = addDays(start, offset);
    const weekday = date.getDay();
    for (const time of pattern[weekday] || []) {
      const dateText = formatDate(date);
      const candidate = { property, platform, sourceVideo, date: dateText, time };
      if (isOccupied(candidate)) continue;
      if (!sameSourceGapIsClean(candidate)) continue;
      return { date: dateText, time };
    }
  }
  throw new Error(`[approved-routing-batch] no repurpose slot found for ${property}/${platform}/${sourceVideo}`);
}

function slotPattern(property, platform) {
  const brand = String(property || "");
  const p = normalizePlatform(platform);
  if (brand === "Retire With Talley") {
    if (p === "instagram") return { 2: ["11:00"], 4: ["11:00"], 6: ["10:30"] };
    if (p === "facebook") return { 2: ["17:00"], 4: ["17:00"], 6: ["11:30"] };
    if (p === "linkedin") return { 3: ["08:30"], 5: ["08:30"] };
  }
  if (brand === "Talley Tax") {
    if (p === "instagram") return { 1: ["11:00"], 3: ["11:00"], 5: ["11:00"] };
    if (p === "facebook") return { 1: ["17:00"], 3: ["17:00"], 5: ["13:00"] };
    if (p === "linkedin") return { 2: ["08:30"], 4: ["08:30"] };
    if (p === "gbp") return { 3: ["10:00"] };
  }
  if (brand === "David Talley Personal") {
    if (p === "linkedin") return { 2: ["07:45"], 4: ["07:45"] };
  }
  return { 2: ["10:00"], 4: ["10:00"] };
}

function markOccupied(row) {
  const property = row.property || row.metricoolBrand || "Talley Wealth";
  const platform = normalizePlatform(row.platform);
  occupied.add(`${property}|${platform}|${row.date}|${row.time}`);
  occupied.add(`${property}|${platform}|${row.date}`);
  if (row.sourceVideo) {
    const key = `${property}|${row.sourceVideo}`;
    if (!sameSourceDates.has(key)) sameSourceDates.set(key, []);
    sameSourceDates.get(key).push(row.date);
  }
}

function isOccupied(row) {
  const property = row.property || row.metricoolBrand || "Talley Wealth";
  const platform = normalizePlatform(row.platform);
  return occupied.has(`${property}|${platform}|${row.date}|${row.time}`) || occupied.has(`${property}|${platform}|${row.date}`);
}

function sameSourceGapIsClean(row) {
  const key = `${row.property}|${row.sourceVideo}`;
  const dates = sameSourceDates.get(key) || [];
  const candidate = Date.parse(`${row.date}T12:00:00`);
  return dates.every((date) => {
    const existing = Date.parse(`${date}T12:00:00`);
    return !Number.isFinite(existing) || Math.abs(candidate - existing) >= minSameSourceGapDays * 86400000;
  });
}

function assetForDraft(draft, platform) {
  if (platform === "gbp") return "gbp";
  if (draft.assetSuggestion === "existing_video") return "video";
  if (draft.assetSuggestion === "text_or_existing_video") return platform === "gbp" ? "gbp" : "video";
  return "carousel";
}

function assetReady(video, asset, platform) {
  if (asset === "gbp" || asset === "x_thread" || /^x_extra_/.test(asset)) return true;
  if (asset === "carousel") {
    const dir = path.join(OUT, video, "carousel");
    return fs.existsSync(dir) && fs.readdirSync(dir).some((file) => /^slide-\d+\.png$/.test(file));
  }
  if (asset === "video") {
    const dir = path.join(OUT, video);
    return ["scheduled/captioned_with_cover_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"]
      .some((file) => fs.existsSync(path.join(dir, file)));
  }
  return false;
}

function isSupportedApplyAsset(platform, asset) {
  if (platform === "gbp" && asset === "gbp") return true;
  if (platform === "x" && (asset === "x_thread" || /^x_extra_/.test(asset))) return true;
  return ["instagram", "facebook", "linkedin", "x"].includes(platform) && ["video", "carousel"].includes(asset);
}

function isFarEnoughFuture(date, time) {
  const when = Date.parse(`${date}T${time || "00:00"}:00`);
  if (!Number.isFinite(when)) return false;
  return when > Date.now() + guardMinutes * 60000;
}

function skip(reason, source, note) {
  skipped.push({
    reason,
    note,
    metricoolId: source?.metricoolId || "",
    sourceVideo: source?.sourceVideo || "",
    title: source?.title || source?.sourceTitle || source?.id || "",
    property: source?.recommendedPrimary || source?.targetProperty || "",
    platform: source?.platform || "",
    asset: source?.asset || "",
    date: source?.date || "",
    time: source?.time || "",
  });
}

function toCsv(items) {
  const headers = ["batchKind", "property", "date", "time", "platformLabel", "asset", "sourceVideo", "sourceTitle", "oldMetricoolId", "approvedAction", "text"];
  return [headers.join(","), ...items.map((row) => headers.map((header) => csv(row[header])).join(","))].join("\n");
}

function toMarkdown(payload) {
  const s = payload.summary;
  const move = payload.rows.filter((row) => row.batchKind === "move");
  const repurpose = payload.rows.filter((row) => row.batchKind === "repurpose_seed");
  return [
    "# Approved Routing Batch",
    "",
    `Generated: ${payload.generatedAt}`,
    "",
    "This is the approved live scheduling batch. Applying it recreates move rows on the recommended destination first. Old Talley Wealth posts are deleted only after the replacement row exists.",
    "",
    "## Summary",
    "",
    `- Total rows: ${s.totalRows}`,
    `- Move rows: ${s.moveRows}`,
    `- Repurpose rows: ${s.repurposeRows}`,
    `- Skipped: ${s.skipped}`,
    `- Window: ${s.firstDate || "n/a"} through ${s.lastDate || "n/a"}`,
    "",
    "## Move Rows",
    "",
    table(move.slice(0, 80)),
    "",
    "## Repurpose Rows",
    "",
    table(repurpose.slice(0, 120)),
    "",
    "## Skipped",
    "",
    payload.skipped.length ? skippedTable(payload.skipped) : "_None._",
    "",
  ].join("\n");
}

function table(items) {
  if (!items.length) return "_None._";
  const header = "| Date | Time | Property | Platform | Source | Asset | Action |\n|---|---:|---|---|---|---|---|";
  const lines = items.map((row) => [
    row.date,
    row.time,
    row.property,
    row.platformLabel,
    `${row.sourceVideo} - ${row.sourceTitle}`,
    row.asset,
    row.approvedAction,
  ].map(md).join("|"));
  return [header, ...lines.map((line) => `|${line}|`)].join("\n");
}

function skippedTable(items) {
  const header = "| Reason | Source | Platform | Note |\n|---|---|---|---|";
  return [header, ...items.map((item) => `|${md(item.reason)}|${md(item.sourceVideo || item.title)}|${md(item.platform)}|${md(item.note)}|`)].join("\n");
}

function md(value) {
  return String(value || "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();
}

function csv(value) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function countBy(items, fn) {
  const out = {};
  for (const item of items) {
    const key = fn(item) || "Unknown";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function propertyRank(property) {
  return { "Retire With Talley": 1, "Talley Tax": 2, "David Talley Personal": 3, "Talley Wealth": 4 }[property] || 9;
}

function normalizePlatform(value) {
  const v = String(value || "").toLowerCase();
  if (v === "twitter") return "x";
  if (v === "gmb" || v === "google_business_profile") return "gbp";
  return v;
}

function platformLabel(platform) {
  return { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", x: "X", gbp: "Google Business Profile" }[normalizePlatform(platform)] || platform || "Unknown";
}

function numberArg(prefix, fallback) {
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  if (!found) return fallback;
  const value = Number(found.slice(prefix.length));
  return Number.isFinite(value) ? value : fallback;
}

function dateArg(prefix) {
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  if (!found) return "";
  const value = found.slice(prefix.length);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function nextDateString(date, days) {
  return formatDate(addDays(date, days));
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDays(date, days) {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
