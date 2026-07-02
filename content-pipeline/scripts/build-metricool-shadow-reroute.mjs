#!/usr/bin/env node
// build-metricool-shadow-reroute.mjs
// Read-only migration QA for already-scheduled Metricool posts. It compares
// future scheduled posts against the current multi-property routing logic and
// writes local reports only. It never deletes, reschedules, posts, or uploads.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const WORK = path.join(ROOT, "work");
const ENGINE_PATH = path.join(WORK, "metricool-engine.json");
const INDEX_PATH = path.join(ROOT, "content-index.json");
const ROUTING_PATH = path.join(ROOT, "distribution-routing.json");
const PROPERTIES_PATH = path.join(ROOT, "distribution-properties.json");
const JSON_OUT = path.join(WORK, "metricool-shadow-reroute.json");
const CSV_OUT = path.join(WORK, "metricool-shadow-reroute.csv");
const MD_OUT = path.join(WORK, "metricool-shadow-reroute.md");

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const readJson = (file, fallback) => {
  try { return JSON.parse(read(file)); } catch (_) { return fallback; }
};

const engine = readJson(ENGINE_PATH, { planner: [], generatedAt: "" });
const index = readJson(INDEX_PATH, { records: [] });
const routing = readJson(ROUTING_PATH, { records: [] });
const propertiesConfig = readJson(PROPERTIES_PATH, { defaultProperty: "Talley Wealth", properties: [] });

const records = new Map((index.records || []).map((record) => [record.id || record.name, record]));
const routes = new Map((routing.records || []).map((record) => [record.sourceVideo, record]));
const propertiesByName = new Map((propertiesConfig.properties || []).map((property) => [property.name, property]));
const matchCorpus = buildMatchCorpus(index.records || []);
const now = new Date();

const futurePosts = (engine.planner || [])
  .filter((item) => item.source === "metricool")
  .filter((item) => !isDoneStatus(item))
  .filter((item) => isFutureItem(item, now));

const rows = futurePosts.map((item) => analyzePost(item));
const groups = buildGroups(rows);
const summary = buildSummary(rows, groups);

const payload = {
  generatedAt: new Date().toISOString(),
  mode: "read_only_shadow_reroute",
  source: {
    metricoolEngineGeneratedAt: engine.generatedAt || "",
    metricoolPlannerItems: Array.isArray(engine.planner) ? engine.planner.length : 0,
    futureScheduledItems: futurePosts.length,
    contentRecords: records.size,
    routingRecords: routes.size,
  },
  summary,
  groups,
  rows,
  files: {
    json: "work/metricool-shadow-reroute.json",
    csv: "work/metricool-shadow-reroute.csv",
    markdown: "work/metricool-shadow-reroute.md",
  },
};

fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2));
fs.writeFileSync(CSV_OUT, toCsv(rows));
fs.writeFileSync(MD_OUT, toMarkdown(payload));

console.log(`[shadow-reroute] analyzed ${rows.length} future Metricool post(s); ${summary.moveCandidates} move candidate(s), ${summary.keepAsIs} keep-as-is, ${summary.manualReview} manual review -> work/metricool-shadow-reroute.json`);

function analyzePost(item) {
  const direct = item.sourceVideo && records.has(item.sourceVideo)
    ? { sourceVideo: item.sourceVideo, method: item.matchMethod || "planner", confidence: "high", score: 100, matchedTextType: item.asset || "" }
    : null;
  const fallback = direct ? null : matchByText(item);
  const match = direct || fallback || { sourceVideo: item.sourceVideo || "", method: item.sourceVideo ? "missing_local_record" : "unmatched", confidence: "none", score: 0, matchedTextType: "" };
  const record = records.get(match.sourceVideo);
  const route = routeFor(match.sourceVideo, record);
  const currentProperty = item.property || item.metricoolBrand || propertiesConfig.defaultProperty || "Talley Wealth";
  const recommendedPrimary = route.primaryProperty || propertiesConfig.defaultProperty || "Talley Wealth";
  const routeReady = route.schedulingReady !== false;
  const targetSupportsPlatform = supportsPlatform(recommendedPrimary, item.platform);
  const selectedDestinations = schedulableDestinations(route, item.platform);
  const decision = decide({
    item,
    match,
    route,
    currentProperty,
    recommendedPrimary,
    routeReady,
    targetSupportsPlatform,
    selectedDestinations,
  });

  return {
    metricoolId: item.id || "",
    date: item.date || "",
    time: item.time || "",
    platform: item.platform || "",
    platformLabel: item.platformLabel || platformLabel(item.platform),
    asset: item.asset || "",
    currentProperty,
    currentMetricoolBrand: item.metricoolBrand || currentProperty,
    sourceVideo: match.sourceVideo || "",
    title: record?.title || item.sourceTitle || match.sourceVideo || "Unmatched Metricool post",
    matchStatus: match.method,
    matchConfidence: match.confidence,
    matchScore: match.score,
    matchedTextType: match.matchedTextType || "",
    recommendedPrimary,
    recommendedDestinations: selectedDestinations,
    routeConfidence: route.confidence || "",
    routeReason: route.primaryReason || "",
    scorecard: route.scorecard || {},
    decision: decision.code,
    actionLabel: decision.label,
    reason: decision.reason,
    canMoveThisPost: decision.canMove,
    unsupportedPlatform: !!(route.primaryProperty && !targetSupportsPlatform),
    providerStatus: item.providerStatus || "",
    detailedStatus: item.detailedStatus || "",
    postTextExcerpt: excerpt(item.text, 220),
  };
}

function decide({ item, match, route, currentProperty, recommendedPrimary, routeReady, targetSupportsPlatform, selectedDestinations }) {
  if (!match.sourceVideo || !records.has(match.sourceVideo)) {
    return {
      code: "manual_match",
      label: "Manual match needed",
      reason: "This Metricool post could not be confidently tied back to a local source video, so the engine should not reroute it yet.",
      canMove: false,
    };
  }
  if (!route.primaryProperty) {
    return {
      code: "manual_review",
      label: "Manual review",
      reason: "The source video has no current distribution route. Refresh distribution routing before moving it.",
      canMove: false,
    };
  }
  if (currentProperty === recommendedPrimary) {
    return {
      code: "keep_as_is",
      label: `Keep on ${currentProperty}`,
      reason: "The scheduled post already lives on the current recommended primary property.",
      canMove: false,
    };
  }
  if (!routeReady) {
    return {
      code: "leave_alone_setup_blocked",
      label: `Leave on ${currentProperty} for now`,
      reason: `${recommendedPrimary} is the routing recommendation, but setup/readiness is not clean enough for a migration recommendation.`,
      canMove: false,
    };
  }
  if (!targetSupportsPlatform) {
    return {
      code: "leave_alone_platform_gap",
      label: `Leave this ${platformLabel(item.platform)} post on ${currentProperty}`,
      reason: `${recommendedPrimary} is the source-level recommendation, but ${platformLabel(item.platform)} is not currently configured for that destination. Move supported asset types only.`,
      canMove: false,
    };
  }
  if (!selectedDestinations.includes(recommendedPrimary)) {
    return {
      code: "manual_review",
      label: "Manual review",
      reason: `${recommendedPrimary} is recommended, but this asset/platform pair was not included in schedulable destinations.`,
      canMove: false,
    };
  }
  return {
    code: `move_to_${slug(recommendedPrimary)}`,
    label: `Move to ${recommendedPrimary}`,
    reason: `The source routes primary to ${recommendedPrimary}. This scheduled ${platformLabel(item.platform)} post is currently under ${currentProperty}.`,
    canMove: true,
  };
}

function routeFor(sourceVideo, record) {
  return routes.get(sourceVideo) || record?.distributionRecommendations || {};
}

function schedulableDestinations(route, platform) {
  const out = [];
  if (route.primaryProperty && route.schedulingReady !== false && supportsPlatform(route.primaryProperty, platform)) out.push(route.primaryProperty);
  for (const item of route.secondary || []) {
    if (item.level !== "recommended_secondary") continue;
    if (item.rewriteRequired === true) continue;
    if (item.setup?.schedulingReady === false) continue;
    if (supportsPlatform(item.property, platform)) out.push(item.property);
  }
  return [...new Set(out)];
}

function supportsPlatform(propertyName, platform) {
  const property = propertiesByName.get(propertyName);
  const supported = property?.primaryPlatforms || [];
  return supported.map(normalizePlatform).includes(normalizePlatform(platform));
}

function buildGroups(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const key = row.sourceVideo || `unmatched:${row.metricoolId}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return [...grouped.entries()].map(([key, items]) => groupFor(key, items)).sort(groupSort);
}

function groupFor(key, items) {
  const moveItems = items.filter((item) => item.canMoveThisPost);
  const manualItems = items.filter((item) => item.decision === "manual_match" || item.decision === "manual_review");
  const unsupported = items.filter((item) => item.decision === "leave_alone_platform_gap");
  const keep = items.filter((item) => item.decision === "keep_as_is");
  const recommendedPrimary = mostCommon(items.map((item) => item.recommendedPrimary));
  const currentProperties = unique(items.map((item) => item.currentProperty));
  const platforms = unique(items.map((item) => item.platformLabel));
  const routeReason = items.find((item) => item.routeReason)?.routeReason || "";
  const firstDate = items.map((item) => item.date).filter(Boolean).sort()[0] || "";
  const lastDate = items.map((item) => item.date).filter(Boolean).sort().at(-1) || "";
  const sourceVideo = items[0]?.sourceVideo || "";
  const title = items[0]?.title || "Unmatched Metricool post";
  const suggestedAction = groupAction({ items, moveItems, manualItems, unsupported, keep, recommendedPrimary, currentProperties });
  return {
    key,
    sourceVideo,
    title,
    recommendedPrimary,
    currentProperties,
    platforms,
    firstDate,
    lastDate,
    scheduledPosts: items.length,
    movePosts: moveItems.length,
    keepPosts: keep.length,
    manualPosts: manualItems.length,
    unsupportedPosts: unsupported.length,
    routeConfidence: mostCommon(items.map((item) => item.routeConfidence).filter(Boolean)),
    routeReason,
    suggestedAction: suggestedAction.code,
    actionLabel: suggestedAction.label,
    reason: suggestedAction.reason,
    itemMetricoolIds: items.map((item) => item.metricoolId).filter(Boolean),
  };
}

function groupAction({ items, moveItems, manualItems, unsupported, keep, recommendedPrimary, currentProperties }) {
  const current = currentProperties.join(", ") || "current property";
  if (manualItems.length === items.length) {
    return {
      code: "manual_review",
      label: "Manual review before changing anything",
      reason: "The source match or distribution route is not confident enough for a migration recommendation.",
    };
  }
  if (moveItems.length && unsupported.length) {
    return {
      code: "move_supported_leave_platform_gap",
      label: `Move ${moveItems.length}; leave ${unsupported.length}`,
      reason: `Move the supported scheduled posts to ${recommendedPrimary}, but leave unsupported platform posts on ${current} unless a replacement asset is created.`,
    };
  }
  if (moveItems.length) {
    return {
      code: `move_to_${slug(recommendedPrimary)}`,
      label: `Move scheduled posts to ${recommendedPrimary}`,
      reason: `The current routing logic says this source belongs primarily on ${recommendedPrimary}.`,
    };
  }
  if (unsupported.length && keep.length) {
    return {
      code: "keep_with_platform_gap_note",
      label: `Keep current schedule; note platform gap`,
      reason: `The source leans ${recommendedPrimary}, but some current platforms are not available there. Keep the current schedule unless you want replacement assets.`,
    };
  }
  return {
    code: "keep_as_is",
    label: `Keep scheduled on ${current}`,
    reason: "The current schedule already matches the routing recommendation or should stay because the target platform is unavailable.",
  };
}

function buildSummary(rows, groups) {
  return {
    totalFutureScheduled: rows.length,
    matched: rows.filter((row) => row.sourceVideo && row.matchConfidence !== "none").length,
    unmatched: rows.filter((row) => row.decision === "manual_match").length,
    keepAsIs: rows.filter((row) => row.decision === "keep_as_is").length,
    moveCandidates: rows.filter((row) => row.canMoveThisPost).length,
    manualReview: rows.filter((row) => row.decision === "manual_match" || row.decision === "manual_review").length,
    platformGaps: rows.filter((row) => row.decision === "leave_alone_platform_gap").length,
    sourceGroups: groups.length,
    sourceGroupsWithMoves: groups.filter((group) => group.movePosts > 0).length,
    byDecision: countBy(rows, (row) => row.decision),
    byRecommendedPrimary: countBy(rows, (row) => row.recommendedPrimary || "Unknown"),
    byCurrentProperty: countBy(rows, (row) => row.currentProperty || "Unknown"),
    byPlatform: countBy(rows, (row) => row.platformLabel || "Unknown"),
    scheduledThrough: rows.map((row) => row.date).filter(Boolean).sort().at(-1) || "",
  };
}

function buildMatchCorpus(recordsList) {
  const corpus = [];
  for (const record of recordsList) {
    const sourceVideo = record.id || record.name;
    if (!sourceVideo) continue;
    addCorpus(corpus, sourceVideo, "title", record.title);
    addCorpus(corpus, sourceVideo, "transcript", record.transcriptText);
    for (const line of record.bestSourceLines || []) addCorpus(corpus, sourceVideo, line.label || "source-line", line.text);
    const dir = path.join(OUT, sourceVideo);
    const social = parseSocialPack(read(path.join(dir, "social-pack.md")));
    for (const [label, text] of Object.entries(social)) addCorpus(corpus, sourceVideo, `social:${label}`, text);
    const xPack = readJson(path.join(dir, "x-pack.json"), null);
    if (xPack?.thread) addCorpus(corpus, sourceVideo, "x:thread", xPack.thread.join("\n\n"));
    for (const [index, text] of (xPack?.standalone || []).entries()) addCorpus(corpus, sourceVideo, `x:standalone:${index + 1}`, text);
  }
  return corpus;
}

function addCorpus(corpus, sourceVideo, type, value) {
  const text = normalizeText(value);
  if (!text || text.length < 20) return;
  corpus.push({ sourceVideo, type, text, tokens: tokens(text) });
}

function matchByText(item) {
  const text = normalizeText(item.text);
  if (!text) return null;
  const postTokens = tokens(text);
  let best = null;
  for (const entry of matchCorpus) {
    const score = textScore(text, postTokens, entry);
    if (!best || score > best.score) best = { ...entry, score };
  }
  if (!best || best.score < 55) return null;
  return {
    sourceVideo: best.sourceVideo,
    method: best.score >= 92 ? "text_exact_or_contained" : "text_similarity",
    confidence: best.score >= 92 ? "high" : best.score >= 72 ? "medium" : "low",
    score: Math.round(best.score),
    matchedTextType: best.type,
  };
}

function textScore(text, postTokens, entry) {
  if (text === entry.text) return 100;
  if (text.length > 80 && entry.text.includes(text)) return 96;
  if (entry.text.length > 80 && text.includes(entry.text)) return 94;
  const overlap = tokenOverlap(postTokens, entry.tokens);
  const lengthPenalty = Math.min(text.length, entry.text.length) / Math.max(text.length, entry.text.length);
  return (overlap * 85) + (lengthPenalty * 15);
}

function tokenOverlap(a, b) {
  if (!a.size || !b.size) return 0;
  let hit = 0;
  for (const token of a) if (b.has(token)) hit += 1;
  return hit / Math.max(a.size, b.size);
}

function tokens(text) {
  const stop = new Set(["this", "that", "with", "from", "your", "have", "what", "when", "where", "about", "there", "their", "more", "into", "because", "just", "really", "general", "education", "advice", "specific", "situation"]);
  return new Set(String(text || "").toLowerCase().match(/[a-z0-9]{4,}/g)?.filter((token) => !stop.has(token)) || []);
}

function parseSocialPack(markdown) {
  const out = {};
  String(markdown || "").split(/^##\s+/m).slice(1).forEach((part) => {
    const nl = part.indexOf("\n");
    if (nl < 0) return;
    const heading = part.slice(0, nl).trim();
    const body = part.slice(nl + 1).split(/^---/m)[0].trim();
    if (heading && body) out[heading] = body;
  });
  return out;
}

function toCsv(rows) {
  const headers = [
    "metricoolId", "date", "time", "platformLabel", "asset", "currentProperty", "sourceVideo", "title",
    "matchConfidence", "recommendedPrimary", "routeConfidence", "decision", "actionLabel", "reason", "postTextExcerpt",
  ];
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\n");
}

function toMarkdown(payload) {
  const s = payload.summary;
  const moveGroups = payload.groups.filter((group) => group.movePosts > 0).slice(0, 40);
  const reviewGroups = payload.groups.filter((group) => group.suggestedAction !== "keep_as_is" && group.movePosts === 0).slice(0, 40);
  const keepGroups = payload.groups.filter((group) => group.suggestedAction === "keep_as_is").slice(0, 20);
  return [
    "# Metricool Shadow Reroute",
    "",
    `Generated: ${payload.generatedAt}`,
    "",
    "Read-only migration QA. This report does not delete, reschedule, post, publish, upload, or change anything in Metricool.",
    "",
    "## Summary",
    "",
    `- Future scheduled posts reviewed: ${s.totalFutureScheduled}`,
    `- Matched to local source videos: ${s.matched}`,
    `- Move candidates: ${s.moveCandidates}`,
    `- Keep as-is: ${s.keepAsIs}`,
    `- Platform gaps: ${s.platformGaps}`,
    `- Manual review / unmatched: ${s.manualReview}`,
    `- Scheduled through: ${s.scheduledThrough || "unknown"}`,
    "",
    "## Move Candidates",
    "",
    markdownTable(moveGroups),
    "",
    "## Review / Platform Gap",
    "",
    markdownTable(reviewGroups),
    "",
    "## Keep As-Is Sample",
    "",
    markdownTable(keepGroups),
    "",
    "## Decision Counts",
    "",
    "```json",
    JSON.stringify(s.byDecision, null, 2),
    "```",
    "",
  ].join("\n");
}

function markdownTable(groups) {
  if (!groups.length) return "_None._";
  const header = "| Source | Recommended | Posts | Action | Why |\n|---|---:|---:|---|---|";
  const rows = groups.map((group) => [
    group.sourceVideo ? `${group.sourceVideo} - ${group.title}` : group.title,
    group.recommendedPrimary,
    String(group.scheduledPosts),
    group.actionLabel,
    group.reason || group.routeReason || "",
  ].map(markdownCell).join("|"));
  return [header, ...rows.map((row) => `|${row}|`)].join("\n");
}

function markdownCell(value) {
  return String(value || "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();
}

function countBy(items, fn) {
  const out = {};
  for (const item of items) {
    const key = fn(item) || "Unknown";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function groupSort(a, b) {
  const rank = (group) => group.movePosts ? 0 : group.manualPosts ? 1 : group.unsupportedPosts ? 2 : 3;
  return rank(a) - rank(b) || b.movePosts - a.movePosts || a.firstDate.localeCompare(b.firstDate);
}

function isFutureItem(item, compareTo) {
  const d = Date.parse(`${item.date || ""}T${item.time || "00:00"}:00`);
  if (!Number.isFinite(d)) return false;
  return d >= compareTo.getTime();
}

function isDoneStatus(item) {
  return /PUBLISHED|PUBLICADO|SENT|DONE|FAIL|ERROR|REJECT/i.test(`${item.providerStatus || ""} ${item.detailedStatus || ""}`);
}

function normalizePlatform(value) {
  const v = String(value || "").toLowerCase();
  if (v === "twitter") return "x";
  if (v === "gmb" || v === "google_business_profile") return "gbp";
  if (v === "linkedin_showcase" || v === "linkedin_personal") return "linkedin";
  return v;
}

function platformLabel(platform) {
  return { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", x: "X", gbp: "Google Business Profile", youtube: "YouTube" }[normalizePlatform(platform)] || platform || "Unknown";
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function excerpt(value, length) {
  const text = normalizeText(value);
  return text.length > length ? `${text.slice(0, length - 1)}...` : text;
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function mostCommon(values) {
  const counts = countBy(values.filter(Boolean), (value) => value);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "property";
}
