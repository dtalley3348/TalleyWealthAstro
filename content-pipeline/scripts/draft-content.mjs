#!/usr/bin/env node
// draft-content.mjs <video-name>
// Local Phase 2 writer for the Talley content pipeline.
// It reads work/<name>/audio.json plus the local knowledge docs and writes:
// - output/<name>/social-pack.md
// - output/<name>/carousel/slides.json
// - output/<name>/blog-draft.md when the model classifies it as Website/Core
// - output/<name>/content-log.json
// No posting, no uploads. Safe to run repeatedly.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const name = process.argv[2];
if (!name) {
  console.error("usage: node scripts/draft-content.mjs <video-name>");
  process.exit(1);
}

loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(SITE, ".env.local"));

const OUT = path.join(ROOT, "output", name);
const WORK = path.join(ROOT, "work", name);
const QUEUE = path.join(ROOT, "approval-queue", `${name}.md`);
const transcriptPath = path.join(WORK, "audio.json");
const transcriptJson = readJson(transcriptPath, null);
if (!transcriptJson) {
  console.error(`[draft] missing transcript: ${transcriptPath}`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const transcript = normalize(transcriptJson.text || (transcriptJson.segments || []).map((s) => s.text).join(" "));
if (!transcript) {
  console.error(`[draft] transcript has no text: ${transcriptPath}`);
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4.1";
if (!apiKey) {
  writeMissingKeyPacket(model);
  console.log(`[draft] ${name}: skipped AI drafting because OPENAI_API_KEY is not set`);
  process.exit(0);
}

const prompt = buildPrompt();
let result;
try {
  result = await callOpenAI({ apiKey, model, prompt });
} catch (error) {
  writeApiErrorPacket(error);
  console.log(`[draft] ${name}: AI drafting blocked; see output/${name}/draft-error.md`);
  process.exit(0);
}
const parsed = parseJsonResult(result);
try {
  validateDraft(parsed);
} catch (error) {
  writeSchemaErrorPacket(error, parsed, result);
  console.log(`[draft] ${name}: AI draft schema mismatch; see output/${name}/draft-schema-error.md`);
  process.exit(0);
}
writeOutputs(parsed);
const written = parsed.hold
  ? "social-pack.md, content-log.json, approval note"
  : `social-pack.md, carousel/slides.json, content-log.json${parsed.blogDraft ? ", blog-draft.md" : ""}`;
console.log(`[draft] ${name}: wrote ${written}`);

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }
function readJson(p, fallback) { try { return JSON.parse(read(p)); } catch { return fallback; } }
function normalize(s) { return String(s || "").replace(/[\u2014\u2013]/g, ", ").replace(/\s+/g, " ").trim(); }
function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of read(file).split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

function buildPrompt() {
  const docs = [
    ["DRAFTING-PLAYBOOK.md", read(path.join(ROOT, "DRAFTING-PLAYBOOK.md"))],
    ["BLOG-RESOURCE-BLUEPRINT.md", read(path.join(ROOT, "BLOG-RESOURCE-BLUEPRINT.md"))],
    ["PHASE2-OUTPUT-MAP.md", read(path.join(ROOT, "PHASE2-OUTPUT-MAP.md"))],
    ["content-engine.md", read(path.join(SITE, "docs/content-engine.md"))],
    ["voice-guide.md", read(path.join(SITE, "docs/knowledge/voice-guide.md"))],
    ["point-of-view-map.md", read(path.join(SITE, "docs/knowledge/point-of-view-map.md"))],
    ["interpretation-layer.md", read(path.join(SITE, "docs/knowledge/interpretation-layer.md"))],
    ["social-content-principles.md", read(path.join(SITE, "docs/knowledge/social-content-principles.md"))],
  ].filter(([, body]) => body.trim()).map(([title, body]) => `## ${title}\n${body.slice(0, 12000)}`).join("\n\n");

  return `You are the local drafting engine for Talley Wealth. Produce review-ready draft assets from one video transcript. Nothing will be posted automatically.

Follow these rules strictly:
- Write in David Talley's voice: warm, direct, plain English, not salesy.
- No em dashes and no exclamation points.
- Do not use banned claims: fee-only, no commissions, no product sales, guaranteed outcomes, best advisor, beats the market, eliminates risk.
- Hedge planning/tax claims with may, might, could, can help evaluate, can model, can coordinate.
- If the transcript is off-brand, testimonial-like, or not Talley Wealth education, set hold=true and explain why.
- Preserve strong source language from the transcript when it sounds like David.
- Carousel must have 6 to 8 slides using kinds cover, point, number, quote, cta. Each slide needs index and total.
- Last carousel slide should ask to save/share/follow, not book a call.
- Blog is only for Website Asset or Core POV Asset. Otherwise use empty string.
- Use a channelScope to keep broad/general POV from going everywhere by default. Core planning education can go broad. Adjacent business-owner POV usually fits LinkedIn and X first, sometimes Instagram/Facebook, rarely Google Business Profile, and usually not blog/site.
- Always recommend asset routing separately from triage. Explain whether the transcript deserves a blog, landing page, Learning Center/FAQ, one-pager, email, and website reuse.
- Always include a video_explainer_page recommendation. This is a richer video-derived resource page, not a normal blog. Recommend yes when the transcript has a durable question, emotional/practical/decision tension, strong Talley point of view, enough substance for 3-6 teaching sections, examples/analogies/misconceptions, or "someone needs to say this plainly" energy. Recommend maybe when the idea is good but thin or better as part of a cluster. Recommend no when it is only a short social take, too narrow, repetitive, incomplete, promotional, or would become generic filler.
- A blog is appropriate when the transcript answers one durable educational question with enough substance for a useful answer-first article. Use BLOG-RESOURCE-BLUEPRINT.md as the controlling standard for blog eligibility and blog structure.
- A landing page is not routine per video. Recommend it only when the topic is a repeatable high-intent decision, package support page, referral asset, or future destination URL. Do not write the landing page here; flag the opportunity.
- A one-pager is appropriate when the idea would be useful for referral partners, client education, Keystone fit, retirement transition handouts, or business-owner planning explanations.
- An email is appropriate only when the idea is strong enough or broad enough for a planning note.
- Recommend property-level distribution separately from platform copy. Pick one primary property and only recommend a secondary when the idea genuinely belongs in both places after rewriting.
- Properties are Talley Wealth, Talley Tax, Retire With Talley, and David Talley Personal.
- Talley Wealth is the main advisory/planning brand.
- Talley Tax is the separate tax business. Do not make it sound like an advisory or investment firm.
- Retire With Talley is retirement education from David Talley and Talley Wealth, not a separate advisory firm.
- David Talley Personal is broader founder/thinking content. Preserve AI, leadership, TEDx, CrushingIt.ai, advisor/founder POV, and better-decision themes when they fit.
- If writing a blog, make it site-ready: answer-first opening, situation-first framing, deeper-problem section, clear H2 structure, 3 to 5 decision factors, at least one practical added-value block, balanced risks/limits, 3 to 5 useful internal links where appropriate, local/client-fit context when natural, educational disclaimer, and no filler.
- For blog-worthy or rich-resource assets, include 1 to 3 sourceMoments only when a timestamped video moment directly sharpens a section or FAQ answer. Do not create more than 3. Do not include timestamps just to decorate the page.
- Do not invent citations, client facts, credentials, or source links. Use only internal links that are obviously relevant from the existing site/docs.
- Return ONLY valid JSON matching the schema below.

Schema:
{
  "hold": false,
  "holdReason": "",
  "triage": "Post Only | Caption / Post | Website Asset | Core POV Asset",
  "pillar": "short content pillar label",
  "title": "asset title",
  "interpretation": {
    "surfaceQuestion": "",
    "deeperProblem": "",
    "beliefChallenged": "",
    "organizingThesis": ""
  },
  "personaFit": {
    "primaryLane": "retirement transition | business owner profit-to-wealth | secondary complexity | referral partner | general POV",
    "fitStrength": "direct | partial | adjacent | no fit",
    "notes": ""
  },
  "channelScope": {
    "recommendedDefault": "broad | selective | hold",
    "reason": "",
    "primaryChannels": [],
    "useCautionChannels": [],
    "avoidChannels": []
  },
  "distributionRecommendations": {
    "primaryProperty": "Talley Wealth | Talley Tax | Retire With Talley | David Talley Personal",
    "primaryReason": "",
    "confidence": "low | medium | high",
    "secondary": [
      {
        "property": "Talley Wealth | Talley Tax | Retire With Talley | David Talley Personal",
        "level": "recommended_secondary | optional_secondary | manual_review",
        "reason": "",
        "rewriteRequired": true
      }
    ],
    "exclusions": [
      {"property": "", "reason": ""}
    ]
  },
  "routingRecommendations": {
    "blog": {"recommend": "yes | no | maybe", "reason": "", "confidence": "low | medium | high"},
    "landingPage": {"recommend": "yes | no | maybe", "reason": "", "candidateAngle": "", "confidence": "low | medium | high"},
    "learningCenterOrFaq": {"recommend": "yes | no | maybe", "reason": "", "candidateQuestion": "", "confidence": "low | medium | high"},
    "onePager": {"recommend": "yes | no | maybe", "reason": "", "candidateUse": "", "confidence": "low | medium | high"},
    "email": {"recommend": "yes | no | maybe", "reason": "", "candidateAudience": "", "confidence": "low | medium | high"},
    "websiteReuse": {"recommend": "yes | no | maybe", "reason": "", "candidateLocation": "", "confidence": "low | medium | high"},
    "video_explainer_page": {
      "recommend": "yes | no | maybe",
      "confidence": "low | medium | high",
      "reason": "",
      "suggestedTitle": "",
      "coreQuestion": "",
      "whyThisCouldBeDurable": "",
      "suggestedSections": [],
      "relatedAssetIdeas": []
    }
  },
  "social": {
    "LinkedIn": "",
    "Instagram": "",
    "Facebook": "",
    "X / Twitter (thread)": "",
    "Short caption (for the captioned Reel/Short itself)": "",
    "Google Business Profile": "",
    "YouTube": ""
  },
  "carousel": [
    {"kind":"cover","eyebrow":"","headline":"","body":"","index":1,"total":7},
    {"kind":"point","eyebrow":"","headline":"","body":"","index":2,"total":7},
    {"kind":"number","number":"","numberCaption":"","index":3,"total":7},
    {"kind":"quote","quote":"","attribution":"David Talley","index":4,"total":7},
    {"kind":"point","eyebrow":"","headline":"","body":"","index":5,"total":7},
    {"kind":"point","eyebrow":"","headline":"","body":"","index":6,"total":7},
    {"kind":"cta","eyebrow":"","headline":"","body":"","ctaPrimary":"","ctaSecondary":"","index":7,"total":7}
  ],
  "blogDraft": "",
  "sourceMoments": [
    {
      "timestamp": "0:42",
      "seconds": 42,
      "label": "Why return comes after time horizon and volatility",
      "question": "What should I ask before targeting a rate of return?",
      "answer": "Start with how long the dollars need to last and how much volatility you can actually live with.",
      "transcriptExcerpt": "short exact or lightly cleaned transcript line from this moment",
      "sectionId": "optional-section-anchor"
    }
  ],
  "compliance": {
    "claimsRequiringReview": [],
    "disclosuresUsed": [],
    "approvalNotes": []
  }
}

Knowledge docs:
${docs}

Transcript for ${name}:
${transcript}`;
}

async function callOpenAI({ apiKey, model, prompt }) {
  let lastBody = "";
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        input: prompt,
        text: { format: { type: "json_object" } }
      })
    });
    const body = await response.text();
    lastBody = body;
    if (response.ok) {
      const json = JSON.parse(body);
      const direct = json.output_text || collectOutputText(json);
      if (direct && direct.trim()) return direct;
      return body;
    }
    if (response.status === 429 && attempt < 4) {
      const retrySeconds = Number((body.match(/try again in ([0-9.]+)s/i) || [])[1] || 8);
      await new Promise((resolve) => setTimeout(resolve, Math.ceil(retrySeconds * 1000) + 1500));
      continue;
    }
    throw new Error(`[draft] OpenAI API error ${response.status}: ${body}`);
  }
  throw new Error(`[draft] OpenAI API error after retries: ${lastBody}`);
}

function collectOutputText(value) {
  const found = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.text === "string" && (node.type === "output_text" || node.type === "text")) found.push(node.text);
    if (typeof node.output_text === "string") found.push(node.output_text);
    if (Array.isArray(node)) node.forEach(visit);
    else Object.values(node).forEach(visit);
  };
  visit(value);
  return found.join("\n");
}

function parseJsonResult(text) {
  try { return JSON.parse(text); } catch (e) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw e;
  }
}

function validateDraft(d) {
  if (!d || typeof d !== "object") throw new Error("[draft] model did not return an object");
  if (!d.triage && !d.hold) throw new Error("[draft] missing triage");
  if (!d.social || typeof d.social !== "object") throw new Error("[draft] missing social object");
  if (!Array.isArray(d.carousel)) throw new Error("[draft] missing carousel array");
  if (d.hold && !d.triage) d.triage = "HELD";
  const total = d.carousel.length;
  d.carousel = d.carousel.map((slide, i) => ({ ...slide, index: i + 1, total }));
}

function writeOutputs(d) {
  for (const stale of ["draft-error.md", "draft-request.md"]) {
    try { fs.unlinkSync(path.join(OUT, stale)); } catch (_) {}
  }
  if (d.hold) {
    try { fs.rmSync(path.join(OUT, "carousel"), { recursive: true, force: true }); } catch (_) {}
    try { fs.unlinkSync(path.join(OUT, "blog-draft.md")); } catch (_) {}
    fs.writeFileSync(path.join(OUT, "social-pack.md"), heldMarkdown(d));
  } else {
    fs.writeFileSync(path.join(OUT, "social-pack.md"), socialMarkdown(d));
    const carouselDir = path.join(OUT, "carousel");
    fs.mkdirSync(carouselDir, { recursive: true });
    fs.writeFileSync(path.join(carouselDir, "slides.json"), JSON.stringify(d.carousel, null, 2));
    if (d.blogDraft && String(d.blogDraft).trim()) fs.writeFileSync(path.join(OUT, "blog-draft.md"), d.blogDraft.trim() + "\n");
  }
  fs.writeFileSync(path.join(OUT, "content-log.json"), JSON.stringify(contentLog(d), null, 2));
  updateApprovalQueue(d);
}

function socialMarkdown(d) {
  const channelScope = getChannelScope(d);
  const parts = [`# Social Pack: ${name}`,
    `**Suggested triage:** ${d.triage}`,
    `**Pillar:** ${d.pillar || ""}`,
    `**Title:** ${d.title || name}`,
    `**Persona lane:** ${d.personaFit?.primaryLane || "Not specified"} (${d.personaFit?.fitStrength || "unknown"})`,
    `**Channel scope:** ${channelScope.recommendedDefault} - ${channelScope.reason}`,
    `**Surface question:** ${d.interpretation?.surfaceQuestion || ""}`,
    `**Deeper problem:** ${d.interpretation?.deeperProblem || ""}`,
    `**Organizing thesis:** ${d.interpretation?.organizingThesis || ""}`,
  ];
  const routing = routingMarkdown(d.routingRecommendations);
  if (routing) parts.push(`\n---\n\n## Asset routing recommendations\n${routing}`);
  const distribution = distributionMarkdown(d.distributionRecommendations);
  if (distribution) parts.push(`\n---\n\n## Distribution recommendation\n${distribution}`);
  for (const [heading, body] of Object.entries(d.social || {})) parts.push(`\n---\n\n## ${heading}\n${String(body).trim()}`);
  parts.push(`\n---\n\n## Compliance notes\n${(d.compliance?.approvalNotes || []).map((x) => `- ${x}`).join("\n") || "- Review before posting."}\n\nDisclosures used:\n${(d.compliance?.disclosuresUsed || []).map((x) => `- ${x}`).join("\n") || "- This is general education, not advice for your specific situation."}`);
  return parts.join("\n") + "\n";
}

function routingMarkdown(routing) {
  if (!routing || typeof routing !== "object") return "";
  const labels = {
    blog: "Blog",
    landingPage: "Landing page",
    learningCenterOrFaq: "Learning Center / FAQ",
    onePager: "One-pager",
    email: "Email",
    websiteReuse: "Website reuse",
    video_explainer_page: "Rich Resource Page",
  };
  return Object.entries(labels).map(([key, label]) => {
    const item = routing[key] || {};
    const verdict = item.recommend || "not specified";
    const confidence = item.confidence ? `, ${item.confidence} confidence` : "";
    const details = [item.reason, item.candidateAngle, item.candidateQuestion, item.candidateUse, item.candidateAudience, item.candidateLocation, item.suggestedTitle, item.coreQuestion, item.whyThisCouldBeDurable]
      .filter(Boolean)
      .join(" ");
    return `- **${label}:** ${verdict}${confidence}${details ? `, ${details}` : ""}`;
  }).join("\n");
}

function distributionMarkdown(distribution) {
  if (!distribution || typeof distribution !== "object") return "";
  const lines = [];
  if (distribution.primaryProperty) {
    lines.push(`- **Primary property:** ${distribution.primaryProperty}${distribution.confidence ? ` (${distribution.confidence} confidence)` : ""}${distribution.primaryReason ? `, ${distribution.primaryReason}` : ""}`);
  }
  for (const item of distribution.secondary || []) {
    if (!item?.property) continue;
    lines.push(`- **${humanize(item.level || "secondary")}:** ${item.property}${item.reason ? `, ${item.reason}` : ""}${item.rewriteRequired ? " Rewrite for this property." : ""}`);
  }
  for (const item of distribution.exclusions || []) {
    if (!item?.property) continue;
    lines.push(`- **Do not route by default:** ${item.property}${item.reason ? `, ${item.reason}` : ""}`);
  }
  return lines.join("\n");
}

function heldMarkdown(d) {
  return `# Social Pack: ${name}\n\n**Suggested triage:** HELD\n**Pillar:** ${d.pillar || "Needs review"}\n\n## What the video actually is\n${d.title || name}\n\n---\n\n## Why I held it instead of drafting the usual assets\n${d.holdReason || "The transcript needs David review before this becomes a Talley Wealth content asset."}\n\n---\n\n## My recommendation\nDo not auto-schedule. Review manually and decide whether this belongs in the Talley Wealth content engine.\n`;
}

function contentLog(d) {
  return {
    title: d.title || name,
    format: "video repurpose pack",
    sourceVideo: name,
    promptId: d.promptId || "",
    recordingPromptId: d.recordingPromptId || d.promptId || "",
    triage: d.hold ? "HELD" : d.triage,
    pillar: d.pillar || "",
    personaFit: d.personaFit || {},
    distributionRecommendations: d.distributionRecommendations || {},
    routingRecommendations: d.routingRecommendations || {},
    sourceMoments: normalizeSourceMoments(d.sourceMoments),
    targetAudience: "Talley Wealth audience",
    targetQueryOrTopic: d.title || "",
    claimsRequiringReview: d.compliance?.claimsRequiringReview || [],
    disclosuresUsed: d.compliance?.disclosuresUsed || [],
    approvalStatus: "pending",
    approvalDate: "",
    publishedUrl: "",
    archiveLocation: `output/${name}/`,
    createdAt: new Date().toISOString()
  };
}

function normalizeSourceMoments(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const seconds = Number(item?.seconds ?? secondsFromTimestamp(item?.timestamp));
      const timestamp = String(item?.timestamp || timestampFromSeconds(seconds)).trim();
      const label = String(item?.label || item?.question || "").trim();
      if (!Number.isFinite(seconds) || seconds < 0 || !label) return null;
      return {
        timestamp,
        seconds: Math.round(seconds),
        label,
        question: cleanOptional(item?.question),
        answer: cleanOptional(item?.answer),
        transcriptExcerpt: cleanOptional(item?.transcriptExcerpt),
        sectionId: cleanOptional(item?.sectionId)
      };
    })
    .filter(Boolean)
    .slice(0, 3);
}

function secondsFromTimestamp(value) {
  const parts = String(value || "").split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function timestampFromSeconds(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

function cleanOptional(value) {
  const cleaned = String(value || "").trim();
  return cleaned || undefined;
}

function updateApprovalQueue(d) {
  const channelScope = getChannelScope(d);
  const status = d.hold ? "Held for manual review" : "Ready for content review";
  const triage = d.hold ? "Held" : humanize(d.triage || "Needs review");
  const quickRead = d.hold
    ? `The video processed successfully, but the drafting layer held it because it does not look ready for the Talley Wealth public content engine.`
    : `The video processed successfully and the content draft is ready to review in the local app. Approving it makes the selected assets eligible for dry-run scheduling.`;
  const created = [
    "Captioned vertical video for Reels/Shorts style review.",
    "Clean exports in vertical, portrait, square, and horizontal formats.",
    "Transcript and content log for audit trail.",
    d.hold ? "A short held-note explaining why normal drafting stopped." : "Social captions for the active platforms.",
    d.hold ? "Carousel, blog, and X extras were not drafted because this clip was held." : "Carousel draft, X pack, and blog draft when the routing decision calls for them."
  ];
  const reviewItems = d.hold ? [
    "If this was only a system test, leave it unapproved.",
    "If you want to use it publicly, decide which channel it belongs on before scheduling.",
    "Do not approve it for the normal Talley Wealth queue unless the topic fits the brand."
  ] : [
    "Watch the captioned video and make sure the cover frame, captions, and cut points feel right.",
    "Scan the social copy for tone, accuracy, and compliance comfort.",
    "Turn off any asset toggles in the review app that should not be scheduled.",
    "Approve only when the whole asset family is ready to move forward."
  ];
  const files = [
    `Main video: output/${name}/captioned_vertical_9x16.mp4`,
    `Clean videos: output/${name}/vertical_9x16.mp4, portrait_4x5.mp4, square_1x1.mp4, horizontal_16x9.mp4`,
    `Social pack: output/${name}/social-pack.md`,
    `Transcript: work/${name}/audio.json`,
    `Content log: output/${name}/content-log.json`
  ];
  if (!d.hold) {
    files.push(`Carousel: output/${name}/carousel/slides.json`);
    if (d.blogDraft) files.push(`Blog draft: output/${name}/blog-draft.md`);
  }
  const md = `# Review: ${name}

Status: ${status}
Generated: ${formatDate(new Date())}

## Quick read
${quickRead}

## Content decision
- Triage: ${triage}
- Pillar: ${d.pillar || "Needs review"}
- Channel scope: ${humanize(channelScope.recommendedDefault)} - ${channelScope.reason}
${d.hold ? `- Hold reason: ${d.holdReason || "This needs David review before it becomes a Talley Wealth content asset."}` : ""}

## Channel guidance
- Best fit: ${listOrFallback(channelScope.primaryChannels, "Decide during review")}
- Use caution: ${listOrFallback(channelScope.useCautionChannels, "None flagged")}
- Avoid by default: ${listOrFallback(channelScope.avoidChannels, "None flagged")}

## What was created
${created.map((item) => `- ${item}`).join("\n")}

## What to review
${reviewItems.map((item) => `- ${item}`).join("\n")}

## Files
${files.map((item) => `- ${item}`).join("\n")}

## Compliance checkpoints
- Review all copy before posting.
- Get Cambridge PDF approval before publishing long-form or website copy.
- Mark approved only after the public-facing asset family is ready.
`;
  fs.writeFileSync(QUEUE, md);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(date);
}

function humanize(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getChannelScope(d) {
  const scope = d.channelScope && typeof d.channelScope === "object" ? d.channelScope : {};
  const primaryLane = String(d.personaFit?.primaryLane || "").toLowerCase();
  const fit = String(d.personaFit?.fitStrength || "").toLowerCase();
  const triage = String(d.triage || "").toLowerCase();
  const isAdjacent = fit === "adjacent" || primaryLane.includes("general pov");
  const isCore = ["website asset", "core pov asset"].includes(triage) || fit === "direct";
  const recommendedDefault = scope.recommendedDefault || (d.hold ? "hold" : isAdjacent && !isCore ? "selective" : "broad");
  const fallback = recommendedDefault === "selective"
    ? {
        reason: "This is useful POV, but it is not core planning education, so it should not automatically go everywhere.",
        primaryChannels: ["LinkedIn", "X"],
        useCautionChannels: ["Instagram", "Facebook"],
        avoidChannels: ["Google Business Profile", "Blog/site"]
      }
    : recommendedDefault === "hold"
      ? {
          reason: "This needs a human decision before it belongs in the public content queue.",
          primaryChannels: [],
          useCautionChannels: [],
          avoidChannels: ["All scheduled channels"]
        }
      : {
          reason: "This fits the main Talley Wealth content lanes closely enough for normal review.",
          primaryChannels: ["LinkedIn", "Instagram", "Facebook", "Google Business Profile", "X"],
          useCautionChannels: [],
          avoidChannels: []
        };
  return {
    recommendedDefault,
    reason: scope.reason || fallback.reason,
    primaryChannels: Array.isArray(scope.primaryChannels) && scope.primaryChannels.length ? scope.primaryChannels : fallback.primaryChannels,
    useCautionChannels: Array.isArray(scope.useCautionChannels) ? scope.useCautionChannels : fallback.useCautionChannels,
    avoidChannels: Array.isArray(scope.avoidChannels) ? scope.avoidChannels : fallback.avoidChannels
  };
}

function listOrFallback(items, fallback) {
  return Array.isArray(items) && items.length ? items.join(", ") : fallback;
}

function writeSchemaErrorPacket(error, parsed, raw) {
  fs.writeFileSync(path.join(OUT, "draft-schema-error.md"), `# Draft schema mismatch for ${name}

The OpenAI call succeeded, but the returned JSON did not match the pipeline schema.

## Error
\`\`\`
${String(error?.message || error)}
\`\`\`

## Top-level keys
\`\`\`
${JSON.stringify(Object.keys(parsed || {}), null, 2)}
\`\`\`

## Parsed JSON
\`\`\`json
${JSON.stringify(parsed, null, 2).slice(0, 12000)}
\`\`\`
`);
  const current = read(QUEUE);
  if (current && !current.includes("draft-schema-error.md")) {
    fs.writeFileSync(QUEUE, current.replace("## Drafts (Phase 2 - not yet generated)", "## Drafts")
      .replace("- [ ] Blog post", `- [ ] AI drafting schema mismatch: output/${name}/draft-schema-error.md\n- [ ] Blog post`));
  }
}

function writeApiErrorPacket(error) {
  const msg = String(error?.message || error || "Unknown API error");
  const errorPath = path.join(OUT, "draft-error.md");
  fs.writeFileSync(errorPath, `# Drafting blocked for ${name}

The local AI drafting step reached OpenAI but could not generate assets.

## Error
\`\`\`
${msg}
\`\`\`

## What this means
The video outputs are still valid. Social captions, carousel wording, and blog draft were not generated.

Most common fix: check OpenAI Platform billing/credits for the account that owns this API key, then rerun:

\`node scripts/draft-content.mjs ${name}\`
`);
  const current = read(QUEUE);
  if (current && !current.includes("draft-error.md")) {
    fs.writeFileSync(QUEUE, current.replace("## Drafts (Phase 2 - not yet generated)", "## Drafts")
      .replace("- [ ] Blog post", `- [ ] AI drafting blocked: output/${name}/draft-error.md\n- [ ] Blog post`));
  }
}

function writeMissingKeyPacket(model) {
  const promptPath = path.join(OUT, "draft-request.md");
  fs.writeFileSync(promptPath, `# Draft request for ${name}\n\nOPENAI_API_KEY is not set, so the local passive writer could not generate the social pack, carousel, or blog draft.\n\nSet OPENAI_API_KEY in content-pipeline/.env, then rerun:\n\n\`node scripts/draft-content.mjs ${name}\`\n\nConfigured model default: ${model}\n\n## Transcript\n${transcript}\n`);
  const current = read(QUEUE);
  if (current && !current.includes("draft-request.md")) {
    fs.writeFileSync(QUEUE, current.replace("## Drafts (Phase 2 - not yet generated)", "## Drafts")
      .replace("- [ ] Blog post", `- [ ] AI drafting blocked: output/${name}/draft-request.md\n- [ ] Blog post`));
  }
}
