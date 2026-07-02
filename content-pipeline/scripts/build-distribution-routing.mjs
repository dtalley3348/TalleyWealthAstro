#!/usr/bin/env node
// build-distribution-routing.mjs
// Builds property-level routing recommendations for processed videos.
// This is read-only with respect to external systems: no posting, uploads, sends, or scheduling.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(ROOT, "content-index.json");
const CONFIG = path.join(ROOT, "distribution-properties.json");
const LEDGER = path.join(ROOT, "social-surface-ledger.csv");
const OUT = path.join(ROOT, "distribution-routing.json");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const readJson = (p, fallback) => {
  try { return JSON.parse(read(p)); } catch (_) { return fallback; }
};

if (!fs.existsSync(INDEX)) {
  const r = spawnSync("node", ["scripts/build-content-index.mjs"], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    console.error((r.stdout || "") + (r.stderr || ""));
    process.exit(r.status || 1);
  }
}

const index = readJson(INDEX, { records: [] });
const config = readJson(CONFIG, { properties: [] });
const ledgerRows = parseCsv(read(LEDGER));
const readiness = buildReadiness(ledgerRows);
const records = (index.records || []).map((record) => routeRecord(record, config, readiness));
const payload = {
  generatedAt: new Date().toISOString(),
  configVersion: config.version || 1,
  count: records.length,
  readiness,
  records,
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));

for (const route of records) mergeIntoContentLog(route);

console.log(`[distribution] wrote ${records.length} routing record(s) -> distribution-routing.json`);

function routeRecord(record, config, readiness) {
  const properties = Object.fromEntries((config.properties || []).map((item) => [item.name, item]));
  const hay = normalize([
    record.title,
    record.triage,
    record.pillar,
    record.personaFit?.primaryLane,
    record.personaFit?.fitStrength,
    record.bestSourceLines?.map((line) => line.text).join(" "),
    record.transcriptText,
  ].filter(Boolean).join(" ")).toLowerCase();
  const scores = {
    "Talley Wealth": 0,
    "Talley Tax": 0,
    "Retire With Talley": 0,
    "David Talley Personal": 0,
  };
  const reasons = {
    "Talley Wealth": [],
    "Talley Tax": [],
    "Retire With Talley": [],
    "David Talley Personal": [],
  };

  addScore(scores, reasons, "Talley Wealth", 1, "Default advisory/planning destination.");

  scoreIf(hay, "Talley Tax", 5, [
    ["s corp", "S corp / entity-tax mechanics."],
    ["reasonable compensation", "reasonable compensation mechanics."],
    ["payroll", "payroll or owner-pay tax mechanics."],
    ["tax prepar", "tax preparation context."],
    ["tax return", "tax return context."],
    ["irs", "IRS or tax notice context."],
    ["estimated tax", "estimated-tax planning."],
    ["pass-through", "pass-through entity mechanics."],
    ["schedule c", "Schedule C / entity mechanics."],
    ["net income", "business income mechanics."],
    ["deduction", "deduction/tax mechanics."],
  ], scores, reasons);

  scoreIf(hay, "Retire With Talley", 5, [
    ["retirement paycheck", "retirement paycheck decision."],
    ["paycheck stops", "transition from work paycheck to retirement income."],
    ["social security", "Social Security decision."],
    ["medicare", "Medicare decision."],
    ["roth", "Roth / retirement tax-window decision."],
    ["rmd", "RMD / retirement tax-window decision."],
    ["irmaa", "IRMAA / retirement tax-window decision."],
    ["tax window", "retirement tax-window decision."],
    ["401(k)", "401(k) near-retirement decision."],
    ["401k", "401(k) near-retirement decision."],
    ["sequence", "sequence-risk / spending framework."],
    ["inflation", "inflation-risk retirement framework."],
    ["withdrawal", "retirement withdrawal decision."],
    ["work stops", "life after work context."],
    ["retire", "retirement-stage education."],
  ], scores, reasons);

  scoreIf(hay, "Talley Wealth", 4, [
    ["profit into personal wealth", "business profit-to-wealth planning."],
    ["business owner", "business-owner planning."],
    ["portfolio", "portfolio / investment planning."],
    ["investment", "investment planning."],
    ["estate", "estate / continuity planning."],
    ["keystone", "Keystone / advisory workflow."],
    ["financial plan", "financial planning context."],
    ["cash flow", "cash-flow planning."],
    ["roth", "retirement tax-window planning."],
    ["rmd", "retirement tax-window planning."],
  ], scores, reasons);

  scoreIf(hay, "David Talley Personal", 4, [
    ["ai", "AI / systems / builder content."],
    ["founder", "founder POV."],
    ["leadership", "leadership POV."],
    ["industry", "advisory industry observation."],
    ["content engine", "building the content system."],
    ["i have this view", "David-forward judgment."],
  ], scores, reasons);

  const lane = String(record.personaFit?.primaryLane || "").toLowerCase();
  if (lane.includes("retirement")) addScore(scores, reasons, "Retire With Talley", 4, "Persona lane is retirement-stage.");
  if (lane.includes("business owner")) addScore(scores, reasons, "Talley Wealth", 4, "Persona lane is business-owner planning.");
  if (lane.includes("general pov")) addScore(scores, reasons, "David Talley Personal", 3, "Persona lane is general POV.");
  if (lane.includes("secondary complexity")) addScore(scores, reasons, "Talley Wealth", 2, "Complex planning topic belongs on the main advisory brand.");

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] || "Talley Wealth";
  const second = sorted[1]?.[0] || "";
  const third = sorted[2]?.[0] || "";
  const primaryScore = scores[primary] || 0;
  const secondaryScore = second ? scores[second] || 0 : 0;

  const secondary = [];
  if (second && secondaryScore >= 5 && primaryScore - secondaryScore <= 3) {
    secondary.push(secondaryRoute(second, "recommended_secondary", scores, reasons, readiness));
  } else if (second && secondaryScore >= 4) {
    secondary.push(secondaryRoute(second, "optional_secondary", scores, reasons, readiness));
  }
  if (third && scores[third] >= 5 && !secondary.some((item) => item.property === third)) {
    secondary.push(secondaryRoute(third, "optional_secondary", scores, reasons, readiness));
  }

  const exclusions = Object.keys(scores)
    .filter((name) => name !== primary && !secondary.some((item) => item.property === name))
    .map((name) => ({
      property: name,
      level: scores[name] <= 1 ? "exclude" : "manual_review",
      reason: scores[name] <= 1 ? "No strong fit signal in the source asset." : "Some fit signal exists, but not enough to recommend routing by default.",
      setup: setupFor(name, readiness),
    }));

  const setup = setupFor(primary, readiness);
  return {
    sourceVideo: record.id,
    title: record.title,
    primaryProperty: primary,
    primaryPropertyId: propertyId(properties[primary]),
    primaryReason: compactReasons(reasons[primary]),
    confidence: confidenceFor(primaryScore),
    scorecard: scores,
    secondary,
    exclusions,
    schedulingReady: setup.schedulingReady,
    setup,
    schedulingInstruction: setup.schedulingReady
      ? "Eligible for scheduling after normal asset approval."
      : "Recommendation only. Do not schedule to this property until the ledger shows Smarsh and Metricool are connected.",
    generatedAt: new Date().toISOString(),
  };
}

function scoreIf(hay, property, points, tests, scores, reasons) {
  for (const [needle, reason] of tests) {
    if (matchesNeedle(hay, needle)) addScore(scores, reasons, property, points, reason);
  }
}

function matchesNeedle(hay, needle) {
  const text = String(hay || "");
  const target = String(needle || "").toLowerCase();
  if (!target) return false;
  if (["ai", "irs", "rmd"].includes(target)) return new RegExp(`\\b${escapeRegex(target)}\\b`, "i").test(text);
  return text.includes(target);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addScore(scores, reasons, property, points, reason) {
  scores[property] = (scores[property] || 0) + points;
  if (reason && !reasons[property].includes(reason)) reasons[property].push(reason);
}

function secondaryRoute(property, level, scores, reasons, readiness) {
  return {
    property,
    level,
    reason: compactReasons(reasons[property]),
    confidence: confidenceFor(scores[property] || 0),
    setup: setupFor(property, readiness),
    rewriteRequired: true,
  };
}

function setupFor(property, readiness) {
  const item = readiness[property] || {};
  return {
    status: item.status || "unknown",
    schedulingReady: !!item.schedulingReady,
    blockers: item.blockers || ["No ledger row found."],
  };
}

function confidenceFor(score) {
  if (score >= 10) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function compactReasons(items) {
  const clean = (items || []).filter(Boolean);
  if (!clean.length) return "Best available fit based on the current source asset.";
  return clean.slice(0, 3).join(" ");
}

function buildReadiness(rows) {
  const out = {};
  const grouped = groupBy(rows.filter((row) => row.property), (row) => row.property);
  for (const [property, items] of Object.entries(grouped)) {
    const surfaceRows = items.filter((row) => trackedSurface(row));
    const schedulableRows = surfaceRows.filter((row) => schedulableSurface(row));
    const blockers = [];
    const activeExisting = property === "Talley Wealth";
    const metricoolPending = schedulableRows.filter((row) => !metricoolReady(row.metricool_status, activeExisting));
    const smarshPending = schedulableRows.filter((row) => archiveRequired(row) && !archiveReady(row.smarsh_status, activeExisting));
    const surfacePending = schedulableRows.filter((row) => surfaceNeedsWork(row, activeExisting));

    if (metricoolPending.length) blockers.push("Metricool brand/platform connection is not verified.");
    if (smarshPending.length) blockers.push("Smarsh archiving is not verified or not marked not-applicable.");
    if (surfacePending.length) blockers.push("One or more destination surfaces still need create/verify/connect work.");

    const hasConnectedMetricool = schedulableRows.some((row) => metricoolReady(row.metricool_status, activeExisting));
    const setupPending = blockers.length > 0;
    const schedulingReady = activeExisting
      ? hasConnectedMetricool
      : schedulableRows.length > 0 && !setupPending;

    out[property] = {
      status: activeExisting && hasConnectedMetricool ? "active_existing" : setupPending ? "setup_pending" : "verify",
      schedulingReady,
      blockers: activeExisting && hasConnectedMetricool ? [] : blockers,
      rowCount: surfaceRows.length,
    };
  }
  return out;
}

function trackedSurface(row) {
  return ["Social", "Page", "Company Page", "Showcase Page", "Personal Profile", "Google Business Profile", "GBP", "Website", "Website Hub", "Domain"].includes(row.surface_type);
}

function schedulableSurface(row) {
  const hay = [row.status, row.target_name_or_handle, row.metricool_status, row.starter_posts_status, row.next_action].join(" ").toLowerCase();
  if (hay.includes("deferred") || hay.includes("not_applicable") || hay.includes("not applicable") || hay.includes("do not schedule") || row.target_name_or_handle === "N/A") return false;
  return ["Social", "Page", "Company Page", "Showcase Page", "Personal Profile", "Google Business Profile", "GBP"].includes(row.surface_type);
}

function metricoolReady(value, activeExisting = false) {
  const text = String(value || "").toLowerCase();
  if (!text || pendingText(text)) return false;
  if (text.includes("connected") || text.includes("verified")) return true;
  return activeExisting && text.includes("existing");
}

function archiveRequired(row) {
  const text = String(row.smarsh_status || "").trim().toLowerCase();
  return text !== "n/a" && !text.includes("not applicable") && !text.includes("waived");
}

function archiveReady(value, activeExisting = false) {
  const text = String(value || "").toLowerCase();
  if (!text) return false;
  if (text === "n/a" || text.includes("not applicable") || text.includes("waived")) return true;
  if (text.includes("connected") || text.includes("verified")) return true;
  return activeExisting && text.includes("existing");
}

function surfaceNeedsWork(row, activeExisting = false) {
  if (activeExisting) return false;
  const text = [row.status, row.next_action, row.notes].join(" ").toLowerCase();
  if (row.surface_type === "Website" && text.includes("live") && !pendingText(text)) return false;
  return pendingText(text);
}

function pendingText(value) {
  const text = String(value || "").toLowerCase();
  return [
    "pending",
    "create",
    "needs",
    "hold",
    "unknown",
    "audit",
    "verify",
    "unverified",
    "404",
    "placeholder",
    "not_deployed",
    "not deployed",
    "not_redirect",
    "not redirect",
    "exists per david",
    "likely_available",
  ].some((word) => text.includes(word));
}

function mergeIntoContentLog(route) {
  const file = path.join(ROOT, "output", route.sourceVideo, "content-log.json");
  const log = readJson(file, null);
  if (!log || typeof log !== "object") return;
  log.distributionRecommendations = {
    primaryProperty: route.primaryProperty,
    primaryReason: route.primaryReason,
    confidence: route.confidence,
    secondary: route.secondary,
    schedulingReady: route.schedulingReady,
    schedulingInstruction: route.schedulingInstruction,
    setup: route.setup,
    updatedAt: route.generatedAt,
  };
  fs.writeFileSync(file, JSON.stringify(log, null, 2));
}

function propertyId(property) {
  return property?.id || slug(property?.name || "");
}

function parseCsv(text) {
  const lines = String(text || "").split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
  });
}

function splitCsvLine(line) {
  const cells = [];
  let cur = "";
  let quote = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && quote && next === '"') {
      cur += '"';
      i += 1;
    } else if (ch === '"') {
      quote = !quote;
    } else if (ch === "," && !quote) {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((cell) => cell.trim());
}

function groupBy(items, fn) {
  const out = {};
  for (const item of items) (out[fn(item)] ??= []).push(item);
  return out;
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "property";
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
