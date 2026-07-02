// schedule.mjs
// Turns approved videos into a staggered posting calendar across platforms.
// Reads approvals.json (array of approved video names); if absent, uses every video
// in output/ that has a social-pack.md. Writes schedule.json and schedule.csv.
//
// Rules: per-platform daily caps + best-time windows; a video's pieces are spaced apart
// on a platform; the same asset is desynced across platforms; fills out to a horizon.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
loadDotenv(path.join(ROOT, ".env"));

// ---- config (healthy starting rates) ----
const TIMES = {
  linkedin: ["08:00"],
  instagram: ["11:00", "17:00"],
  facebook: ["09:00"],
  gbp: ["10:00"],
  x: ["09:30", "21:00"],
};
const ASSET_PLATFORMS = {
  video: ["instagram", "facebook", "linkedin"],
  carousel: ["instagram", "linkedin", "facebook"],
  gbp: ["gbp"],
};
const SAME_VIDEO_MIN_DAYS = 3; // gap between a video's posts on one platform
const CROSS_PLATFORM_MIN_DAYS = 1; // same asset must land on different days per platform
const BASE_HORIZON = Math.max(30, Number(process.env.SCHEDULE_HORIZON_DAYS || 90));
const MAX_HORIZON = Math.max(BASE_HORIZON, Number(process.env.SCHEDULE_MAX_HORIZON_DAYS || 730));
const PLATFORM_LABEL = { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", x: "X", gbp: "Google Business Profile" };
const PLATFORM_BY_LABEL = Object.fromEntries(Object.entries(PLATFORM_LABEL).map(([key, label]) => [label, key]));
const TODAY = new Date();
const distributionConfig = readJson(path.join(ROOT, "distribution-properties.json"), { defaultProperty: "Talley Wealth", properties: [] });
const propertyByName = new Map((distributionConfig.properties || []).map((property) => [property.name, property]));
const propertyById = new Map((distributionConfig.properties || []).map((property) => [property.id, property]));
const distributionRouting = readJson(path.join(ROOT, "distribution-routing.json"), { records: [] });
const routeByVideo = new Map((distributionRouting.records || []).map((record) => [record.sourceVideo, record]));

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
function parseSocial(md) {
  const out = {};
  md.split(/^##\s+/m).slice(1).forEach((part) => {
    const nl = part.indexOf("\n");
    const h = part.slice(0, nl).trim();
    const body = part.slice(nl + 1).split(/^---/m)[0].trim();
    if (h && body) out[h] = body;
  });
  return out;
}
function captionFor(social, platform) {
  const want = { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", x: "X", gbp: "Google Business" };
  const key = Object.keys(social).find((k) => k.toLowerCase().startsWith(want[platform].toLowerCase()));
  return key ? social[key] : "";
}
function carouselCaptionFor(name, platform, fallback) {
  const slides = readJson(path.join(OUT, name, "carousel", "slides.json"), []);
  const cover = Array.isArray(slides) ? slides.find((slide) => slide.kind === "cover") || slides[0] : null;
  const headline = String(cover?.headline || "").trim();
  const body = String(cover?.body || "").trim();
  if (!headline && !body) return fallback;
  const base = [headline, body].filter(Boolean).join("\n\n");
  const disclosure = "Educational only. Not individualized financial, tax, or investment advice.";
  if (platform === "instagram") return `${base}\n\nSwipe through for the planning questions.\n\n${disclosure}`;
  if (platform === "linkedin") return `${base}\n\nI turned this into a carousel because the question is easier to scan one decision at a time.\n\n${disclosure}`;
  if (platform === "facebook") return `${base}\n\nA few planning questions to sit with before making the number the goal.\n\n${disclosure}`;
  return fallback;
}
function readJson(p, fallback) { try { return JSON.parse(read(p)); } catch { return fallback; } }
function assetKey(row) {
  return [row.property || row.metricoolBrand || "Talley Wealth", row.video || row.sourceVideo || "", row.asset || "", row.platform || ""].join("|");
}
function dayIndexFromToday(dateString) {
  if (!dateString || dateString === "OVERFLOW") return null;
  const today = Date.UTC(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  const parts = String(dateString).slice(0, 10).split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const then = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  return Math.round((then - today) / 86400000) - 1;
}
function existingMetricoolReservations() {
  const empty = { assets: new Set(), dayCount: {}, lastVideoDay: {}, assetDays: {} };
  const engine = readJson(path.join(ROOT, "work", "metricool-engine.json"), {});
  const planner = Array.isArray(engine.planner) ? engine.planner : [];
  for (const item of planner) {
    if (item.source !== "metricool") continue;
    if (/failed|error|deleted/i.test(String(item.detailedStatus || item.providerStatus || ""))) continue;
    const platform = item.platform || PLATFORM_BY_LABEL[item.platformLabel] || "";
    const property = item.property || item.metricoolBrand || "Talley Wealth";
    if (!platform) continue;
    const day = dayIndexFromToday(item.date);
    if (day !== null && day >= 0 && day < MAX_HORIZON) {
      empty.dayCount[`${property}|${platform}|${day}`] = (empty.dayCount[`${property}|${platform}|${day}`] || 0) + 1;
    }
    if (!item.sourceVideo || !item.asset) continue;
    empty.assets.add(assetKey({ property, video: item.sourceVideo, asset: item.asset, platform }));
    if (day === null || day < 0) continue;
    const lastKey = `${property}|${item.sourceVideo}|${platform}`;
    empty.lastVideoDay[lastKey] = Math.max(empty.lastVideoDay[lastKey] ?? -Infinity, day);
    (empty.assetDays[`${property}|${item.sourceVideo}|${item.asset}`] ??= new Set()).add(day);
  }
  return empty;
}
function assetEnabled(decisions, name, asset) {
  const item = decisions[name] || {};
  return item[asset] !== false;
}
function overlayFilesFor(name) {
  const dir = path.join(OUT, "broll-overlays");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.startsWith(`${name}_`) && file.endsWith(".mp4")).sort();
}
function xEnabled() {
  const setting = String(process.env.METRICOOL_ENABLE_X || "auto").toLowerCase();
  if (["1", "true", "yes"].includes(setting)) return true;
  if (["0", "false", "no"].includes(setting)) return false;
  const statusPath = path.join(ROOT, "work", "metricool-status.json");
  const status = readJson(statusPath, {});
  if (process.env.DEBUG_SCHEDULE_X) console.log("[schedule:debug] metricool status", statusPath, JSON.stringify({ x: status.x, xHandle: status.xHandle }));
  return status.x === true || status.x === "true" || !!status.xHandle;
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

const X_ENABLED = xEnabled();
console.log(`[schedule] X ${X_ENABLED ? "enabled" : "disabled"} (${String(process.env.METRICOOL_ENABLE_X || "auto")})`);
const RATES = { linkedin: 1, instagram: 2, facebook: 1, gbp: 1, ...(X_ENABLED ? { x: 2 } : {}) };
const existing = existingMetricoolReservations();

// approved set
let approved;
const apPath = path.join(ROOT, "approvals.json");
if (fs.existsSync(apPath)) approved = new Set(JSON.parse(read(apPath)));
const assetDecisions = readJson(path.join(ROOT, "asset-decisions.json"), {});

// Build the list of posts to place.
const posts = [];
for (const name of fs.readdirSync(OUT).sort()) {
  const dir = path.join(OUT, name);
  if (!fs.statSync(dir).isDirectory() || name === "broll-overlays") continue;
  if (!fs.existsSync(path.join(dir, "social-pack.md"))) continue;
  if (approved && !approved.has(name)) continue;
  const social = parseSocial(read(path.join(dir, "social-pack.md")));
  const route = routeByVideo.get(name) || {};
  const selectedProperties = selectedRouteProperties(name, route, assetDecisions);

  const assets = [];
  if (["captioned_vertical_9x16.mp4", "vertical_9x16.mp4"].some((f) => fs.existsSync(path.join(dir, f)))) assets.push("video");
  if (fs.existsSync(path.join(dir, "carousel", "slide-01.png"))) assets.push("carousel");
  if (captionFor(social, "gbp")) assets.push("gbp");
  const xPack = readJson(path.join(dir, "x-pack.json"), null);

  for (const propertyName of selectedProperties) {
    const property = propertyFor(propertyName);
    const supported = supportedPlatforms(property);
    if (!routeReadyForProperty(route, property.name)) continue;

    if (supported.has("x") && X_ENABLED && assetEnabled(assetDecisions, name, "xThread") && xPack?.status === "ready" && Array.isArray(xPack.thread) && xPack.thread.length >= 2) {
      addPost({ property: property.name, metricoolBrand: property.metricoolBrand || property.name, video: name, asset: "x_thread", platform: "x", text: xPack.thread.join("\n\n"), thread: xPack.thread });
    }
    if (supported.has("x") && X_ENABLED && assetEnabled(assetDecisions, name, "xExtras") && xPack?.status === "ready" && Array.isArray(xPack.standalone)) {
      xPack.standalone
        .map((text) => String(text || "").trim())
        .filter(Boolean)
        .slice(0, 4)
        .forEach((text, index) => addPost({ property: property.name, metricoolBrand: property.metricoolBrand || property.name, video: name, asset: `x_extra_${index + 1}`, platform: "x", text }));
    }

    for (const asset of assets)
      for (const platform of ASSET_PLATFORMS[asset]) {
        if (!supported.has(platform)) continue;
        if (!assetEnabled(assetDecisions, name, asset)) continue;
        const baseCaption = captionFor(social, platform);
        const text = asset === "carousel" ? carouselCaptionFor(name, platform, baseCaption) : baseCaption;
        if (!text) continue;
        addPost({ property: property.name, metricoolBrand: property.metricoolBrand || property.name, video: name, asset, platform, text });
      }
  }
}

function addPost(post) {
  if (existing.assets.has(assetKey(post))) return;
  posts.push(post);
}

// Interleave so one video doesn't cluster: round-robin by video.
const byVideo = {};
posts.forEach((p) => (byVideo[p.video] ??= []).push(p));
const queues = Object.values(byVideo);
const order = [];
let i = 0;
while (queues.some((q) => q.length)) { const q = queues[i % queues.length]; if (q.length) order.push(q.shift()); i++; }
const totalDailyCapacity = Object.values(RATES).reduce((sum, n) => sum + Number(n || 0), 0) || 1;
const HORIZON = Math.min(MAX_HORIZON, Math.max(BASE_HORIZON, Math.ceil(order.length / totalDailyCapacity) + 45));

// Greedy slot assignment.
const dayCount = { ...existing.dayCount };          // `${platform}|${day}` -> used count
const lastVideoDay = { ...existing.lastVideoDay };  // `${video}|${platform}` -> last day used
const assetDays = { ...existing.assetDays };        // `${video}|${asset}` -> Set of days used (cross-platform)
const scheduled = [];

for (const p of order) {
  let placed = false;
  for (let day = 0; day < HORIZON && !placed; day++) {
    const capKey = `${p.property || "Talley Wealth"}|${p.platform}|${day}`;
    if ((dayCount[capKey] || 0) >= RATES[p.platform]) continue;
    const lv = lastVideoDay[`${p.property || "Talley Wealth"}|${p.video}|${p.platform}`];
    if (lv !== undefined && day - lv < SAME_VIDEO_MIN_DAYS) continue;
    const used = assetDays[`${p.property || "Talley Wealth"}|${p.video}|${p.asset}`] || new Set();
    if ([...used].some((d) => Math.abs(d - day) < CROSS_PLATFORM_MIN_DAYS)) continue;

    const slotIndex = dayCount[capKey] || 0;
    const time = TIMES[p.platform][slotIndex % TIMES[p.platform].length];
    dayCount[capKey] = slotIndex + 1;
    lastVideoDay[`${p.property || "Talley Wealth"}|${p.video}|${p.platform}`] = day;
    (assetDays[`${p.property || "Talley Wealth"}|${p.video}|${p.asset}`] ??= new Set()).add(day);

    const date = new Date(); date.setDate(date.getDate() + day + 1);
    const dstr = date.toISOString().slice(0, 10);
    scheduled.push({ date: dstr, time, property: p.property || "Talley Wealth", metricoolBrand: p.metricoolBrand || "Talley Wealth", platform: p.platform, platformLabel: PLATFORM_LABEL[p.platform], video: p.video, asset: p.asset, text: p.text, ...(p.thread ? { thread: p.thread } : {}) });
    placed = true;
  }
  if (!placed) scheduled.push({ date: "OVERFLOW", time: "", property: p.property || "Talley Wealth", metricoolBrand: p.metricoolBrand || "Talley Wealth", platform: p.platform, platformLabel: PLATFORM_LABEL[p.platform], video: p.video, asset: p.asset, text: p.text, ...(p.thread ? { thread: p.thread } : {}) });
}

function selectedRouteProperties(name, route, decisions) {
  const explicit = decisions[name]?.routeProperties;
  if (explicit && typeof explicit === "object") {
    const selected = Object.entries(explicit).filter(([, enabled]) => enabled !== false).map(([property]) => property).filter(Boolean);
    if (selected.length) return selected;
  }
  return [route.primaryProperty || distributionConfig.defaultProperty || "Talley Wealth"];
}

function propertyFor(nameOrId) {
  return propertyByName.get(nameOrId) || propertyById.get(nameOrId) || {
    id: "talley_wealth",
    name: "Talley Wealth",
    metricoolBrand: "Talley Wealth",
    primaryPlatforms: ["instagram", "facebook", "linkedin", "gbp", "x"],
  };
}

function supportedPlatforms(property) {
  const values = Array.isArray(property.primaryPlatforms) ? property.primaryPlatforms : [];
  return new Set(values.map(normalizePlatform).filter(Boolean));
}

function normalizePlatform(value) {
  const v = String(value || "").toLowerCase();
  if (v === "linkedin_showcase" || v === "linkedin_personal") return "linkedin";
  if (v === "google_business_profile") return "gbp";
  return v;
}

function routeReadyForProperty(route, propertyName) {
  if (!route?.primaryProperty) return propertyName === "Talley Wealth";
  if (route.primaryProperty === propertyName) return route.schedulingReady !== false;
  const secondary = (route.secondary || []).find((item) => item.property === propertyName);
  return secondary?.setup?.schedulingReady === true && secondary.level === "recommended_secondary" && secondary.rewriteRequired !== true;
}

scheduled.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
fs.writeFileSync(path.join(ROOT, "schedule.json"), JSON.stringify(scheduled, null, 2));

// readable CSV
const esc = (s) => `"${String(s).replace(/"/g, '""').replace(/\n/g, " ")}"`;
const rows = [["date", "time", "property", "platform", "video", "asset", "text"].join(",")];
for (const s of scheduled) rows.push([s.date, s.time, s.property || "Talley Wealth", s.platformLabel, s.video, s.asset, esc(s.text.slice(0, 120))].join(","));
fs.writeFileSync(path.join(ROOT, "schedule.csv"), rows.join("\n"));

const overflow = scheduled.filter((s) => s.date === "OVERFLOW").length;
const placed = scheduled.length - overflow;
console.log(`[schedule] ${placed} posts placed over ${HORIZON} days, ${overflow} overflow (would bank / extend horizon).`);
const perPlat = {};
scheduled.filter((s) => s.date !== "OVERFLOW").forEach((s) => (perPlat[s.platformLabel] = (perPlat[s.platformLabel] || 0) + 1));
console.log("[schedule] per platform:", JSON.stringify(perPlat));
