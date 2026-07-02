#!/usr/bin/env node
// backfill-video-explainer-pages.mjs
// Adds video_explainer_page routing recommendations to existing content logs.
// It does not generate drafts, publish, schedule, or overwrite existing
// video_explainer_page recommendations.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const WORK = path.join(ROOT, "work");

if (!fs.existsSync(OUT)) {
  console.log("[explainer-backfill] no output directory found");
  process.exit(0);
}

let updated = 0;
let skipped = 0;
for (const name of fs.readdirSync(OUT).sort()) {
  const dir = path.join(OUT, name);
  if (!fs.statSync(dir).isDirectory() || name === "broll-overlays") continue;
  const logPath = path.join(dir, "content-log.json");
  const audioPath = path.join(WORK, name, "audio.json");
  if (!fs.existsSync(logPath) || !fs.existsSync(audioPath)) continue;
  const log = readJson(logPath, null);
  const audio = readJson(audioPath, {});
  if (!log || typeof log !== "object") continue;
  log.routingRecommendations ??= {};
  if (log.routingRecommendations.video_explainer_page) {
    skipped++;
    continue;
  }
  const transcript = normalize(audio.text || (audio.segments || []).map((s) => s.text).join(" "));
  log.routingRecommendations.video_explainer_page = recommendExplainer({ name, log, transcript });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  updated++;
}

console.log(`[explainer-backfill] added ${updated} video_explainer_page recommendation(s), skipped ${skipped} existing`);

function recommendExplainer({ name, log, transcript }) {
  const routing = log.routingRecommendations || {};
  const title = log.title || name;
  const text = `${title} ${log.pillar || ""} ${transcript}`.toLowerCase();
  const words = transcript.split(/\s+/).filter(Boolean).length;
  let score = 0;

  if (words >= 160) score += 2;
  else if (words >= 80) score += 1;
  if (["website asset", "core pov asset"].includes(String(log.triage || "").toLowerCase())) score += 2;
  if (String(log.personaFit?.fitStrength || "").toLowerCase() === "direct") score += 1;
  if (["yes", "maybe"].includes(String(routing.blog?.recommend || "").toLowerCase())) score += routing.blog.recommend === "yes" ? 2 : 1;
  if (["yes", "maybe"].includes(String(routing.learningCenterOrFaq?.recommend || "").toLowerCase())) score += 1;
  if (["yes", "maybe"].includes(String(routing.websiteReuse?.recommend || "").toLowerCase())) score += 1;
  if (/(retirement|business owner|tax|investment|portfolio|cash flow|estate|medicare|social security|roth|succession)/i.test(text)) score += 1;
  if (/(wrong question|misconception|most people|actually|what happens|what do you want|why|how|should|before|after work|number)/i.test(text)) score += 1;
  if (/(example|recent meeting|conversation|imagine|classroom|story|someone|client|executive)/i.test(text)) score += 1;

  const recommend = score >= 6 ? "yes" : score >= 4 ? "maybe" : "no";
  const confidence = score >= 7 ? "high" : score >= 4 ? "medium" : "low";
  const coreQuestion = coreQuestionFor({ title, routing, transcript });
  const suggestedTitle = titleFor({ title, coreQuestion });
  const reason = reasonFor({ recommend, confidence, title, words, routing, text });

  return {
    recommend,
    confidence,
    reason,
    suggestedTitle,
    coreQuestion,
    whyThisCouldBeDurable: durabilityFor({ recommend, title, coreQuestion, routing, text }),
    suggestedSections: sectionsFor({ title, coreQuestion, text, transcript }),
    relatedAssetIdeas: relatedIdeasFor({ routing, title }),
  };
}

function coreQuestionFor({ title, routing, transcript }) {
  const faq = routing.learningCenterOrFaq?.candidateQuestion;
  if (faq) return cleanSentence(faq);
  const firstQuestion = String(transcript || "").match(/[^.!?]*\?/)?.[0];
  if (firstQuestion && firstQuestion.length < 160) return cleanSentence(firstQuestion);
  const lower = title.toLowerCase();
  if (lower.includes("rate of return")) return "What should I ask before I worry about my investment rate of return?";
  if (lower.includes("retirement")) return "What should I think about beyond the numbers before I retire?";
  return `What should I understand about ${title.replace(/[?.!]+$/g, "")}?`;
}

function titleFor({ title, coreQuestion }) {
  if (title && title.length <= 86) return title;
  return coreQuestion.replace(/\?$/, "");
}

function reasonFor({ recommend, confidence, title, words, routing, text }) {
  if (recommend === "yes") {
    return `This has enough substance and point of view for a durable resource page: ${title}. It connects to a real planning tension and can support multiple teaching sections.`;
  }
  if (recommend === "maybe") {
    return `This has useful resource-page potential, but may need tighter framing or supporting material before becoming a standalone rich page.`;
  }
  return `This looks better suited for shorter social reuse than a standalone rich resource page.`;
}

function durabilityFor({ recommend, title, coreQuestion, routing, text }) {
  if (recommend === "no") return "The idea does not yet appear durable enough for a standalone resource page.";
  const lane = /retirement/i.test(text) ? "retirement transition" : /business/i.test(text) ? "business-owner planning" : /tax/i.test(text) ? "tax-aware planning" : "planning education";
  return `The core question, "${coreQuestion}", can recur in ${lane} conversations and gives the transcript a useful home beyond the original social post.`;
}

function sectionsFor({ title, coreQuestion, text, transcript }) {
  const sections = [
    "Short answer",
    "Why this question matters",
    "What the usual framing misses",
    "The classroom version",
    "Questions to ask yourself",
    "FAQ",
    "Transcript",
    "Related resources and next step",
    "Reuse notes",
  ];
  if (/story|recent meeting|executive|conversation|client/i.test(transcript)) sections.splice(2, 0, "The story behind the lesson");
  if (/term|definition|glossary|volatility|sequence|rmd|roth|medicare|tax/i.test(text)) sections.splice(-3, 0, "Useful terms");
  return [...new Set(sections)];
}

function relatedIdeasFor({ routing, title }) {
  const ideas = ["Social caption refresh", "Carousel expansion", "FAQ entry"];
  if (["yes", "maybe"].includes(String(routing.blog?.recommend || "").toLowerCase())) ideas.push("Companion blog article");
  if (["yes", "maybe"].includes(String(routing.email?.recommend || "").toLowerCase())) ideas.push("Planning-note email");
  if (["yes", "maybe"].includes(String(routing.websiteReuse?.recommend || "").toLowerCase())) ideas.push("Website section or pull quote");
  ideas.push(`Internal link cluster for: ${title}`);
  return [...new Set(ideas)];
}

function cleanSentence(value) {
  return normalize(value).replace(/\s+/g, " ").replace(/^["']|["']$/g, "");
}

function normalize(value) {
  return String(value || "").replace(/[\u2014\u2013]/g, ", ").replace(/\s+/g, " ").trim();
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
