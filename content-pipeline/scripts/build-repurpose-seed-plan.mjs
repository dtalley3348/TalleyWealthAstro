#!/usr/bin/env node
// build-repurpose-seed-plan.mjs
// Read-only one-off seeding plan for new destination accounts. It creates
// destination-specific rewritten social drafts from existing source videos.
// It does not schedule, upload, publish, delete, or move anything.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const WORK = path.join(ROOT, "work");
const INDEX_PATH = path.join(ROOT, "content-index.json");
const ROUTING_PATH = path.join(ROOT, "distribution-routing.json");
const PROPERTIES_PATH = path.join(ROOT, "distribution-properties.json");
const SHADOW_PATH = path.join(WORK, "metricool-shadow-reroute.json");
const JSON_OUT = path.join(WORK, "repurpose-seed-plan.json");
const MD_OUT = path.join(WORK, "repurpose-seed-plan.md");
const CSV_OUT = path.join(WORK, "repurpose-seed-plan.csv");

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const readJson = (file, fallback) => {
  try { return JSON.parse(read(file)); } catch (_) { return fallback; }
};

const index = readJson(INDEX_PATH, { records: [] });
const routing = readJson(ROUTING_PATH, { records: [] });
const properties = readJson(PROPERTIES_PATH, { properties: [] });
const shadow = readJson(SHADOW_PATH, { groups: [] });
const records = new Map((index.records || []).map((record) => [record.id || record.name, record]));
const routes = new Map((routing.records || []).map((record) => [record.sourceVideo, record]));
const propertiesByName = new Map((properties.properties || []).map((property) => [property.name, property]));
const moveGroups = new Map((shadow.groups || []).filter((group) => group.movePosts > 0).map((group) => [group.sourceVideo, group]));

const seedSet = [
  { target: "Retire With Talley", sourceVideo: "IMG_4160", priority: "high", angle: "retirement tax window" },
  { target: "Retire With Talley", sourceVideo: "IMG_4164", priority: "high", angle: "enough number" },
  { target: "Retire With Talley", sourceVideo: "IMG_4168", priority: "high", angle: "life after work" },
  { target: "Retire With Talley", sourceVideo: "IMG_4167", priority: "high", angle: "portfolio question before retirement" },
  { target: "Retire With Talley", sourceVideo: "IMG_4156", priority: "medium", angle: "confidence beyond the number" },
  { target: "Retire With Talley", sourceVideo: "IMG_4159", priority: "medium", angle: "spending enough without running out" },
  { target: "Retire With Talley", sourceVideo: "IMG_4134", priority: "medium", angle: "moving wealth outside the business before the next chapter" },
  { target: "Talley Tax", sourceVideo: "IMG_4138", priority: "high", angle: "owner pay and entity decisions" },
  { target: "Talley Tax", sourceVideo: "IMG_4131", priority: "medium", angle: "tax playbook upgrades" },
  { target: "Talley Tax", sourceVideo: "IMG_4133", priority: "medium", angle: "year-round tax planning" },
  { target: "Talley Tax", sourceVideo: "IMG_4160", priority: "medium", angle: "Roth conversion tax-window mechanics" },
  { target: "David Talley Personal", sourceVideo: "IMG_4463", priority: "high", angle: "AI and work" },
];

const cards = seedSet
  .map((seed, index) => buildSeed(seed, index))
  .filter(Boolean);

const summary = {
  totalCards: cards.length,
  totalDrafts: cards.reduce((sum, card) => sum + card.drafts.length, 0),
  byTarget: countBy(cards, (card) => card.targetProperty),
  byPriority: countBy(cards, (card) => card.priority),
  moveOverlap: cards.filter((card) => card.existingMoveAvailable).length,
};

const payload = {
  generatedAt: new Date().toISOString(),
  mode: "read_only_repurpose_seed_plan",
  summary,
  cards,
  files: {
    json: "work/repurpose-seed-plan.json",
    markdown: "work/repurpose-seed-plan.md",
    csv: "work/repurpose-seed-plan.csv",
  },
};

fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2));
fs.writeFileSync(MD_OUT, toMarkdown(payload));
fs.writeFileSync(CSV_OUT, toCsv(cards));

console.log(`[repurpose-seed] wrote ${cards.length} source card(s), ${summary.totalDrafts} rewritten draft(s) -> work/repurpose-seed-plan.json`);

function buildSeed(seed, order) {
  const record = records.get(seed.sourceVideo);
  if (!record) return null;
  const route = routes.get(seed.sourceVideo) || record.distributionRecommendations || {};
  const property = propertiesByName.get(seed.target);
  if (!property) return null;
  const socialPack = read(path.join(OUT, seed.sourceVideo, "social-pack.md"));
  const meta = parseSocialPack(socialPack);
  const platforms = supportedPlatforms(property).filter((platform) => platform !== "x");
  const drafts = platforms.map((platform) => buildDraft({ seed, record, route, property, meta, platform })).filter(Boolean);
  const moveGroup = moveGroups.get(seed.sourceVideo);
  return {
    id: `${slug(seed.target)}__${seed.sourceVideo}`,
    order: order + 1,
    sourceVideo: seed.sourceVideo,
    title: record.title || meta.title || seed.sourceVideo,
    targetProperty: seed.target,
    metricoolBrand: property.metricoolBrand || seed.target,
    priority: seed.priority,
    angle: seed.angle,
    routeReason: route.primaryProperty === seed.target
      ? route.primaryReason || ""
      : (route.secondary || []).find((item) => item.property === seed.target)?.reason || route.primaryReason || "",
    routeConfidence: route.primaryProperty === seed.target
      ? route.confidence || ""
      : (route.secondary || []).find((item) => item.property === seed.target)?.confidence || "",
    relationshipToMoveReview: moveGroup ? moveGroup.actionLabel : "New destination-specific variants only",
    existingMoveAvailable: !!moveGroup,
    suggestedUse: moveGroup
      ? "Use after the move review if you want extra destination-native versions beyond the posts being moved."
      : "Use as fresh destination-specific posts to seed the new account without changing the Talley Wealth schedule.",
    sourceAssets: sourceAssets(seed.sourceVideo),
    drafts,
  };
}

function buildDraft({ seed, record, property, meta, platform }) {
  const title = record.title || meta.title || seed.sourceVideo;
  const question = stripQuestion(meta.surfaceQuestion) || title;
  const problem = cleanSentence(meta.deeperProblem) || cleanSentence(record.bestSourceLines?.[1]?.text) || cleanSentence(meta.organizingThesis);
  const thesis = cleanSentence(meta.organizingThesis) || cleanSentence(record.bestSourceLines?.[0]?.text) || problem;
  const audience = property.name;
  const link = property.nearTermLink || property.defaultLink || "";
  let text = "";
  if (audience === "Retire With Talley") text = retirementDraft(platform, { title, question, problem, thesis, link });
  else if (audience === "Talley Tax") text = taxDraft(platform, { title, question, problem, thesis, link });
  else if (audience === "David Talley Personal") text = davidDraft(platform, { title, question, problem, thesis, link });
  if (!text) return null;
  return {
    platform,
    platformLabel: platformLabel(platform),
    assetSuggestion: assetSuggestion(seed.sourceVideo, platform),
    status: "drafted_repurpose_variant",
    text,
    complianceNote: "General education. Destination-specific rewrite from an existing source video; no individualized financial, tax, legal, or investment advice.",
  };
}

function retirementDraft(platform, data) {
  const close = "Retirement education from Talley Wealth. General education, not individualized advice.";
  if (platform === "linkedin") return [
    `A lot of retirement confidence comes from asking the better question underneath the obvious one: ${data.question}`,
    "",
    data.problem,
    "",
    data.thesis,
    "",
    "Before work fully stops, this is worth slowing down long enough to model. The goal is not to make retirement more complicated. It is to make sure the decisions you are making actually connect to the life you want after the paycheck changes.",
    "",
    close,
  ].join("\n");
  if (platform === "instagram") return [
    data.question,
    "",
    data.problem,
    "",
    "Before retirement, this is the kind of decision that deserves more than a gut feeling.",
    "",
    "Retirement education from Talley Wealth.",
    "#retirementplanning #pretirement #retirewithtalley",
  ].join("\n");
  if (platform === "facebook") return [
    `${data.question}`,
    "",
    `${data.problem} ${data.thesis}`,
    "",
    close,
  ].join("\n");
  return "";
}

function taxDraft(platform, data) {
  const close = "General education from Talley Tax, not individualized tax advice.";
  if (platform === "linkedin") return [
    `Most tax questions get more useful when you ask what decision created the tax result in the first place.`,
    "",
    data.problem,
    "",
    data.thesis,
    "",
    "That is why some tax conversations need to happen before the return is being prepared. By filing time, some options are already smaller or gone.",
    "",
    close,
  ].join("\n");
  if (platform === "instagram") return [
    "A better tax question:",
    data.question,
    "",
    data.problem,
    "",
    "The return matters. The decisions before the return often matter more.",
    "",
    "#taxplanning #smallbusinesstax #talleytax",
    close,
  ].join("\n");
  if (platform === "facebook") return [
    data.question,
    "",
    `${data.problem} ${data.thesis}`,
    "",
    "For many owners and families, this is not just a filing question. It is a timing and planning question.",
    "",
    close,
  ].join("\n");
  if (platform === "gbp") return [
    data.question,
    "",
    `${data.problem} If this shows up only when the return is being prepared, the conversation may be too late.`,
    "",
    "Talley Tax helps local taxpayers think through tax preparation and year-round tax planning questions. General education, not individualized tax advice.",
  ].join("\n");
  return "";
}

function davidDraft(platform, data) {
  if (platform !== "linkedin") return "";
  return [
    `I keep coming back to this question: ${data.question}`,
    "",
    data.problem,
    "",
    data.thesis,
    "",
    "The interesting part is not whether the tool is impressive. It is whether it changes the way good work actually gets done. That is where I think a lot of leaders, advisors, and business owners need to pay attention.",
    "",
    "Just a working note, not a polished thesis.",
  ].join("\n");
}

function sourceAssets(sourceVideo) {
  const dir = path.join(OUT, sourceVideo);
  const assets = [];
  if (fs.existsSync(path.join(dir, "captioned_vertical_9x16.mp4")) || fs.existsSync(path.join(dir, "vertical_9x16.mp4"))) assets.push("video");
  if (fs.existsSync(path.join(dir, "carousel", "slides.json"))) assets.push("carousel");
  return assets;
}

function assetSuggestion(sourceVideo, platform) {
  const assets = sourceAssets(sourceVideo);
  if (platform === "gbp") return "text_or_existing_video";
  if (assets.includes("carousel")) return "existing_carousel";
  if (assets.includes("video")) return "existing_video";
  return "text_only";
}

function parseSocialPack(markdown) {
  const text = String(markdown || "");
  const field = (label) => (text.match(new RegExp(`\\*\\*${escapeRegex(label)}:\\*\\*\\s*([^\\n]+)`)) || [])[1]?.trim() || "";
  const sections = {};
  text.split(/^##\s+/m).slice(1).forEach((part) => {
    const nl = part.indexOf("\n");
    if (nl < 0) return;
    const heading = part.slice(0, nl).trim();
    const body = part.slice(nl + 1).split(/^---/m)[0].trim();
    if (heading && body) sections[heading] = body;
  });
  return {
    title: field("Title"),
    surfaceQuestion: field("Surface question"),
    deeperProblem: field("Deeper problem"),
    organizingThesis: field("Organizing thesis"),
    sections,
  };
}

function supportedPlatforms(property) {
  return [...new Set((property.primaryPlatforms || []).map(normalizePlatform).filter(Boolean))];
}

function normalizePlatform(value) {
  const v = String(value || "").toLowerCase();
  if (v === "linkedin_showcase" || v === "linkedin_personal") return "linkedin";
  if (v === "google_business_profile") return "gbp";
  return v;
}

function platformLabel(platform) {
  return { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", gbp: "Google Business Profile" }[platform] || platform || "Unknown";
}

function toMarkdown(payload) {
  const lines = [
    "# Repurpose Seed Plan",
    "",
    `Generated: ${payload.generatedAt}`,
    "",
    "Read-only. These are destination-specific rewrites from existing source videos. Nothing has been scheduled or posted.",
    "",
    "## Summary",
    "",
    `- Source cards: ${payload.summary.totalCards}`,
    `- Drafted variants: ${payload.summary.totalDrafts}`,
    `- Move-overlap cards: ${payload.summary.moveOverlap}`,
    "",
  ];
  for (const card of payload.cards) {
    lines.push(`## ${card.targetProperty}: ${card.title}`);
    lines.push("");
    lines.push(`Source: ${card.sourceVideo}`);
    lines.push(`Priority: ${card.priority}`);
    lines.push(`Why: ${card.routeReason || card.angle}`);
    lines.push(`Use: ${card.suggestedUse}`);
    lines.push("");
    for (const draft of card.drafts) {
      lines.push(`### ${draft.platformLabel} (${draft.assetSuggestion})`);
      lines.push("");
      lines.push(draft.text);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function toCsv(cards) {
  const headers = ["id", "sourceVideo", "targetProperty", "priority", "platformLabel", "assetSuggestion", "text"];
  const rows = [headers.join(",")];
  for (const card of cards) {
    for (const draft of card.drafts) {
      rows.push([
        card.id,
        card.sourceVideo,
        card.targetProperty,
        card.priority,
        draft.platformLabel,
        draft.assetSuggestion,
        draft.text,
      ].map(csvCell).join(","));
    }
  }
  return rows.join("\n");
}

function countBy(items, fn) {
  const out = {};
  for (const item of items) {
    const key = fn(item) || "Unknown";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function stripQuestion(value) {
  return String(value || "").trim().replace(/\?+$/, "?");
}

function cleanSentence(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function slug(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "item";
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
