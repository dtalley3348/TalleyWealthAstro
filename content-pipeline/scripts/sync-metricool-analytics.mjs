#!/usr/bin/env node
// sync-metricool-analytics.mjs
// Read-only Metricool analytics sync. It uses the API key already used by the
// scheduler and writes local evidence only.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK = path.join(ROOT, "work");

loadEnv(path.join(ROOT, ".env"));

const token = process.env.METRICOOL_API_KEY || process.env.METRICOOL_API_TOKEN || "";
const userId = process.env.METRICOOL_USER_ID || "";
const blogId = process.env.METRICOOL_BRAND_ID || process.env.METRICOOL_BLOG_ID || "";
const endpointSpec = process.env.METRICOOL_ANALYTICS_ENDPOINTS || "";
const now = new Date();
const end = ymd(now);
const start = ymd(new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000));

const facebookMetrics = [
  { key: "facebook_posts", label: "Facebook posts", endpoint: "api/stats/timeline/fbPosts", aggregate: "sum" },
  { key: "facebook_followers", label: "Facebook followers", endpoint: "api/stats/timeline/fbFollowers", aggregate: "last" },
  { key: "facebook_views", label: "Facebook views", endpoint: "api/stats/timeline/pageImpressions", aggregate: "sum" },
  { key: "facebook_page_visits", label: "Facebook page visits", endpoint: "api/stats/timeline/pageViews", aggregate: "sum" },
  { key: "facebook_reactions", label: "Facebook reactions", endpoint: "api/stats/timeline/dailyReactions", aggregate: "sum" },
  { key: "facebook_comments", label: "Facebook comments", endpoint: "api/stats/timeline/fbComments", aggregate: "sum" },
  { key: "facebook_shares", label: "Facebook shares", endpoint: "api/stats/timeline/dailyShares", aggregate: "sum" },
  { key: "facebook_clicks", label: "Facebook clicks", endpoint: "api/stats/timeline/dailyClicks", aggregate: "sum" },
];

const instagramMetrics = [
  { key: "instagram_followers", label: "Instagram followers", endpoint: "api/stats/timeline/igFollowers", aggregate: "last" },
  { key: "instagram_following", label: "Instagram following", endpoint: "api/stats/timeline/igFollowing", aggregate: "last" },
  { key: "instagram_posts", label: "Instagram posts", endpoint: "api/stats/timeline/igPosts", aggregate: "sum" },
  { key: "instagram_reels", label: "Instagram reels", endpoint: "api/stats/timeline/igReels", aggregate: "sum" },
  { key: "instagram_likes", label: "Instagram likes", endpoint: "api/stats/timeline/igLikes", aggregate: "sum" },
  { key: "instagram_comments", label: "Instagram comments", endpoint: "api/stats/timeline/igComments", aggregate: "sum" },
  { key: "instagram_saves", label: "Instagram saves", endpoint: "api/stats/timeline/igSaved", aggregate: "sum" },
  { key: "instagram_interactions", label: "Instagram interactions", endpoint: "api/stats/timeline/igInteractions", aggregate: "sum" },
  { key: "instagram_post_reach", label: "Instagram post reach", endpoint: "api/stats/timeline/igPostsReach", aggregate: "sum" },
  { key: "instagram_post_views", label: "Instagram post views", endpoint: "api/stats/timeline/igPostsImpressions", aggregate: "sum" },
  { key: "instagram_reel_views", label: "Instagram reel views", endpoint: "api/stats/timeline/igReelsVideoViews", aggregate: "sum" },
  { key: "instagram_reel_interactions", label: "Instagram reel interactions", endpoint: "api/stats/timeline/igReelsInteractions", aggregate: "sum" },
];

fs.mkdirSync(WORK, { recursive: true });

if (!token || !userId || !blogId) {
  const snapshot = {
    generatedAt: new Date().toISOString(),
    status: "not_configured",
    reason: "Metricool API credentials are missing.",
    requiredEnv: ["METRICOOL_API_KEY", "METRICOOL_USER_ID", "METRICOOL_BRAND_ID"],
    range: { start, end },
    metrics: [],
    responses: [],
  };
  writeJson("metricool-analytics.json", snapshot);
  console.log("[metricool-analytics] credentials missing; wrote work/metricool-analytics.json");
  process.exit(0);
}

const requests = [
  ...facebookMetrics.map((metric) => ({ ...metric, network: "facebook", source: "facebook_legacy_stats" })),
  ...instagramMetrics.map((metric) => ({ ...metric, network: "instagram", source: "instagram_legacy_stats" })),
  ...parseEndpoints(endpointSpec).map((endpoint, index) => ({
    key: `custom_${index + 1}`,
    label: endpoint,
    endpoint,
    aggregate: "raw",
    network: "custom",
    source: "custom_endpoint",
  })),
];

const responses = [];
const metrics = [];
for (const request of requests) {
  const url = buildUrl(request.endpoint);
  const startedAt = new Date().toISOString();
  try {
    const res = await fetch(url, { method: "GET", headers: { "X-Mc-Auth": token, "Content-Type": "application/json" } });
    const text = await res.text();
    const body = safeParse(text);
    const normalized = normalizeMetric(request, body);
    responses.push({
      key: request.key,
      label: request.label,
      endpoint: request.endpoint,
      url: redactUrl(url),
      startedAt,
      status: res.status,
      ok: res.ok,
      shape: inferShape(body),
      body,
    });
    metrics.push({ ...normalized, ok: res.ok, status: res.status, source: request.source });
  } catch (error) {
    responses.push({
      key: request.key,
      label: request.label,
      endpoint: request.endpoint,
      url: redactUrl(url),
      startedAt,
      status: 0,
      ok: false,
      error: error.message,
    });
    metrics.push({ key: request.key, label: request.label, value: null, ok: false, status: 0, source: request.source });
  }
}
const connectionChecks = await checkAnalyticsConnections(metrics);

const snapshot = {
  generatedAt: new Date().toISOString(),
  status: responses.every((r) => r.ok) ? "synced" : "partial_or_failed",
  confidence: "facebook_legacy_stats_verified",
  range: { start, end, days: 90 },
  summary: buildSummary(metrics),
  metrics,
  responses,
  connectionChecks,
  notes: [
    "Facebook page and Instagram metrics are synced from Metricool legacy stats endpoints verified with the local API key.",
    "Metricool's newer v2 analytics catalogs are checked separately so unavailable or reconnect-required networks are visible instead of assumed.",
    "Additional platform/post-level analytics can be added as endpoints are verified and the relevant network connections are healthy.",
  ],
};

writeJson("metricool-analytics.json", snapshot);
writeJson(`metricool-raw/analytics-${new Date().toISOString().slice(0, 10)}.json`, snapshot);
console.log(`[metricool-analytics] synced ${metrics.filter((m) => m.ok).length}/${metrics.length} metric(s); status=${snapshot.status}`);

function normalizeMetric(request, body) {
  const series = Array.isArray(body) ? body.map(([date, value]) => ({ date: String(date), value: numberOrNull(value) })) : [];
  const value = request.aggregate === "last" ? lastValue(series) : request.aggregate === "sum" ? sumValues(series) : null;
  return {
    key: request.key,
    label: request.label,
    value,
    aggregate: request.aggregate,
    network: request.network || "unknown",
    points: series.length,
    recent: series.slice(-14),
  };
}

function buildSummary(metrics) {
  const byKey = Object.fromEntries(metrics.map((metric) => [metric.key, metric.value]));
  const engagement = ["facebook_reactions", "facebook_comments", "facebook_shares", "facebook_clicks"].reduce((sum, key) => sum + (Number(byKey[key]) || 0), 0);
  const instagramEngagement = ["instagram_likes", "instagram_comments", "instagram_saves"].reduce((sum, key) => sum + (Number(byKey[key]) || 0), 0);
  return {
    facebookFollowers: byKey.facebook_followers ?? null,
    facebookViews: byKey.facebook_views ?? null,
    facebookPageVisits: byKey.facebook_page_visits ?? null,
    facebookPosts: byKey.facebook_posts ?? null,
    facebookEngagementActions: engagement,
    instagramFollowers: byKey.instagram_followers ?? null,
    instagramPosts: byKey.instagram_posts ?? null,
    instagramReels: byKey.instagram_reels ?? null,
    instagramInteractions: byKey.instagram_interactions ?? instagramEngagement,
    instagramPostReach: byKey.instagram_post_reach ?? null,
    instagramReelViews: byKey.instagram_reel_views ?? null,
  };
}

function buildUrl(endpoint) {
  const base = endpoint.startsWith("http") ? new URL(endpoint) : new URL(endpoint, "https://app.metricool.com/");
  if (!base.searchParams.has("userId")) base.searchParams.set("userId", userId);
  if (!base.searchParams.has("blogId")) base.searchParams.set("blogId", blogId);
  if (!base.searchParams.has("start")) base.searchParams.set("start", start);
  if (!base.searchParams.has("end")) base.searchParams.set("end", end);
  return base.toString();
}

async function checkAnalyticsConnections(metrics = []) {
  const brand = await fetchBrandConnectionEvidence();
  const legacyOkByNetwork = new Set(metrics.filter((metric) => metric.ok).map((metric) => metric.network));
  const networks = [
    { key: "linkedin", label: "LinkedIn", endpointNetwork: "linkedin" },
    { key: "instagram", label: "Instagram", endpointNetwork: "instagram" },
    { key: "x", label: "X", endpointNetwork: "twitter" },
    { key: "gmb", label: "Google Business Profile", endpointNetwork: "gmb" },
    { key: "youtube", label: "YouTube", endpointNetwork: "youtube" },
    { key: "facebook_v2", label: "Facebook v2 catalog", endpointNetwork: "facebook" },
  ];
  const checks = [];
  for (const network of networks) {
    const endpoint = `api/v2/analytics/catalogs/${network.endpointNetwork}/scopes`;
    const url = buildUrl(endpoint);
    try {
      const res = await fetch(url, { method: "GET", headers: { "X-Mc-Auth": token, "Content-Type": "application/json" } });
      const text = await res.text();
      const body = safeParse(text);
      checks.push({
        ...network,
        brandConnection: brand[network.key] || null,
        legacyStatsAvailable: legacyOkByNetwork.has(network.key),
        endpoint,
        status: res.status,
        ok: res.ok,
        scopes: Array.isArray(body?.data) ? body.data : [],
        message: summarizeConnection(network, res.status, body, brand[network.key], legacyOkByNetwork.has(network.key)),
      });
    } catch (error) {
      checks.push({ ...network, brandConnection: brand[network.key] || null, legacyStatsAvailable: legacyOkByNetwork.has(network.key), endpoint, status: 0, ok: false, scopes: [], message: error.message });
    }
  }
  return checks;
}

async function fetchBrandConnectionEvidence() {
  const evidence = {};
  try {
    const url = buildUrl("api/admin/profile");
    const res = await fetch(url, { method: "GET", headers: { "X-Mc-Auth": token, "Content-Type": "application/json" } });
    const blog = safeParse(await res.text());
    if (blog?.instagram || blog?.fbBusinessId) {
      evidence.instagram = {
        connected: !!blog.instagram,
        account: blog.instagram || "",
        connectionType: blog.instagramConnectionType || "",
        fbBusinessId: blog.fbBusinessId || "",
      };
    }
    if (blog?.linkedinCompany) {
      evidence.linkedin = {
        connected: true,
        account: blog.linkedinCompany,
        type: String(blog.linkedinCompany).startsWith("urn:li:person") ? "personal" : "company",
      };
    }
    if (blog?.twitter) evidence.x = { connected: true, account: blog.twitter };
    if (blog?.gmb) evidence.gmb = { connected: true, account: blog.gmb };
    if (blog?.youtube) evidence.youtube = { connected: true, account: blog.youtube };
    if (blog?.facebookPageId) evidence.facebook_v2 = { connected: true, account: blog.facebook || blog.facebookPageId };
  } catch (_) {
    return evidence;
  }
  return evidence;
}

function summarizeConnection(network, status, body, brandConnection = null, legacyStatsAvailable = false) {
  if (legacyStatsAvailable && brandConnection?.connected) {
    return `Connected in Metricool as ${brandConnection.account || network.label}; legacy analytics are syncing locally.`;
  }
  if (status === 200) {
    const scopes = Array.isArray(body?.data) ? body.data : [];
    if (!scopes.length && brandConnection?.connected) {
      return `Connected in Metricool as ${brandConnection.account || network.label}; advanced analytics scopes were not returned.`;
    }
    if (network.key === "linkedin" && scopes.includes("r_member_social")) return "Limited LinkedIn scope is available; Metricool UI still asks for reconnect to unlock full metrics.";
    return scopes.length ? `Available scopes: ${scopes.join(", ")}` : "Connected, but no scopes returned.";
  }
  const detail = typeof body === "string" ? body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : body?.detail || body?.title || "";
  if (/instagram_business connection/i.test(detail) && brandConnection?.connected) {
    return `Connected in Metricool as ${brandConnection.account || "Instagram"}, but this v2 analytics catalog still requires a separate Instagram Business authorization.`;
  }
  if (/instagram_business connection/i.test(detail)) return "Not available: Instagram Business connection is missing.";
  if (/Access not allowed/i.test(detail)) return "Not available through this v2 analytics catalog for the current brand/key.";
  return detail || `Metricool returned ${status}.`;
}

function parseEndpoints(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch (_) {
      return [];
    }
  }
  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}

function inferShape(body) {
  if (Array.isArray(body)) return { kind: "array", rows: body.length };
  if (body && typeof body === "object") return { kind: "object", keys: Object.keys(body).slice(0, 20), dataRows: Array.isArray(body.data) ? body.data.length : undefined };
  return { kind: "text", chars: String(body || "").length };
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return String(text || "").slice(0, 5000);
  }
}

function numberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sumValues(series) {
  return series.reduce((sum, point) => sum + (Number(point.value) || 0), 0);
}

function lastValue(series) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].value !== null) return series[i].value;
  }
  return null;
}

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function redactUrl(value) {
  return new URL(value).toString();
}

function writeJson(relative, data) {
  const file = path.join(WORK, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}
