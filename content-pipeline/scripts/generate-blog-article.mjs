#!/usr/bin/env node
// generate-blog-article.mjs <videoName> [--no-stage]
// Creates output/<videoName>/blog-draft.md from the transcript and stages it
// into the local Astro blog draft data. Nothing is deployed or published.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const name = process.argv[2];
const noStage = process.argv.includes("--no-stage");
if (!name) {
  console.error("usage: node scripts/generate-blog-article.mjs <videoName> [--no-stage]");
  process.exit(1);
}

loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(SITE, ".env.local"));

const outDir = path.join(ROOT, "output", name);
const workDir = path.join(ROOT, "work", name);
const transcriptJson = readJson(path.join(workDir, "audio.json"), null);
let transcript = normalize(transcriptJson?.text || (transcriptJson?.segments || []).map((s) => s.text).join(" "));
let timestampedTranscript = buildTimestampedTranscript(transcriptJson);
if (!transcript) {
  console.error(`[blog-article] ${name}: missing transcript at work/${name}/audio.json`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const resourceThread = loadResourceThread(name);
const transcriptBundle = resourceThread?.transcriptBundlePath ? readJson(path.join(ROOT, resourceThread.transcriptBundlePath), null) : null;
if (transcriptBundle?.transcriptText) transcript = normalize(transcriptBundle.transcriptText);
if (transcriptBundle?.timestampedTranscript) timestampedTranscript = transcriptBundle.timestampedTranscript;

const contentLog = {
  ...readJson(path.join(outDir, "content-log.json"), {}),
  resourceThread: resourceThread || null,
  sourceVideoIds: resourceThread?.sourceVideoIds || [name],
  transcriptBundlePath: resourceThread?.transcriptBundlePath || "",
  resourceVideoPath: resourceThread?.resourceVideoPath || "",
};
const socialPack = read(path.join(outDir, "social-pack.md"));
const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-4.1";

let draft = "";
let sourceMoments = normalizeSourceMoments(contentLog.sourceMoments);
let resourceSpec = null;
if (!apiKey) {
  draft = fallbackDraft("OPENAI_API_KEY is not set, so this is a scaffold rather than a finished AI draft.");
  resourceSpec = buildFallbackResourceSpec(draft);
} else {
  try {
    const generated = parseAiDraft(await callOpenAI(buildPrompt(), apiKey, model));
    draft = sanitize(generated.articleMarkdown);
    sourceMoments = normalizeSourceMoments(generated.sourceMoments);
    resourceSpec = normalizeResourceSpec(generated.resourceSpec, firstHeadingFromDraft(draft)) || buildFallbackResourceSpec(draft);
  } catch (error) {
    draft = fallbackDraft(`AI blog drafting was blocked: ${String(error?.message || error).slice(0, 800)}`);
    resourceSpec = buildFallbackResourceSpec(draft);
  }
}

const draftPath = path.join(outDir, "blog-draft.md");
fs.writeFileSync(draftPath, draft.trim() + "\n");
fs.writeFileSync(path.join(outDir, "source-moments.json"), JSON.stringify(sourceMoments, null, 2));
fs.writeFileSync(path.join(outDir, "resource-spec.json"), JSON.stringify(resourceSpec, null, 2));
console.log(`[blog-article] ${name}: wrote output/${name}/blog-draft.md`);

if (noStage) process.exit(0);

const stage = spawnSync("node", ["scripts/stage-blog.mjs", name], { cwd: ROOT, encoding: "utf8" });
process.stdout.write(stage.stdout || "");
process.stderr.write(stage.stderr || "");
if (stage.status !== 0) process.exit(stage.status || 1);

function buildPrompt() {
  const docs = [
    ["OPERATING-BRIEF.md", read(path.join(ROOT, "OPERATING-BRIEF.md"))],
    ["DRAFTING-PLAYBOOK.md", read(path.join(ROOT, "DRAFTING-PLAYBOOK.md"))],
    ["BLOG-RESOURCE-BLUEPRINT.md", read(path.join(ROOT, "BLOG-RESOURCE-BLUEPRINT.md"))],
    ["PHASE2-OUTPUT-MAP.md", read(path.join(ROOT, "PHASE2-OUTPUT-MAP.md"))],
    ["voice-guide.md", read(path.join(SITE, "docs", "knowledge", "voice-guide.md"))],
    ["point-of-view-map.md", read(path.join(SITE, "docs", "knowledge", "point-of-view-map.md"))],
    ["interpretation-layer.md", read(path.join(SITE, "docs", "knowledge", "interpretation-layer.md"))],
    ["compliance-and-disclaimers.md", read(path.join(SITE, "docs", "knowledge", "compliance-and-disclaimers.md"))],
  ].filter(([, body]) => body.trim()).map(([title, body]) => `## ${title}\n${body.slice(0, 9000)}`).join("\n\n");

  return `Create a review-gated Talley Wealth blog/resource article from the available talking-head source material.

This is local draft work only. Do not claim it is published. Do not invent facts, citations, client stories, performance numbers, guarantees, or legal/tax certainty.

Voice:
- David Talley: plain English, warm, direct, practical, slightly conversational.
- No exclamation points.
- No em dashes.
- Do not sound like an AI content brief.
- Keep the article useful even for a skeptical reader who only wants the answer.

Structure:
- Return a clean markdown article, but also return a structured resourceSpec. The resourceSpec is what the preview page will render, so it must be complete.
- Start the markdown with one H1 title.
- Prefer an H1 that matches a real reader/search question when the topic is naturally question-shaped. Otherwise use a clear problem/outcome title.
- Do not use awkward parentheticals in the H1.
- Keep question H1s tight: usually 6 to 11 words. Avoid stacked phrases like "aim for with my investments" or titles that feel like a run-on sentence.
	- The first 2 to 4 paragraphs should answer the reader's question directly before explaining the setup.
	- Use situation-first framing, then name the deeper problem underneath the surface question.
	- Build the middle around a 3 to 5 factor decision framework.
	- Add one practical value block such as a checklist, question list, worked hypothetical, mistake taxonomy, or comparison.
	- Include a short FAQ when natural, with answers that stand alone.
	- Use 4 to 7 H2 sections.
	- The finished resource should feel like a real article, not just a formatted preview. Aim for roughly 1,100 to 1,700 useful words unless the source material genuinely cannot support that.
	- Do not pad. Add depth by explaining tradeoffs, examples, mistakes to avoid, decision paths, and what changes the answer.
- Include a short "What to do next" or "Questions to ask" section when natural.
- Include relevant internal links only when obvious. Use markdown links with local paths.
- End with a short educational disclaimer.
- Do not include metadata, implementation notes, transcript labels, or compliance checklists in the article body.
- Include 1 to 3 sourceMoments only when a timestamped video moment directly sharpens the answer, a decision section, or an FAQ. Do not include timestamps just to decorate the page. Use 0 sourceMoments if the transcript timing does not support them.
- If Resource Thread context is present, treat the combined transcript as the source of truth. Source moments should use combined timestamps for the blog embed and should also preserve which source video the moment came from when possible.
- ResourceSpec must include the rich components that make the page feel like a finished Talley Wealth resource:
  - deck: 1 or 2 short human setup sentences for the hero. This is not an abstract, not SEO copy, and not a truncated excerpt. Avoid formulaic constructions like "not just X, but also Y." It should sound like David setting up the real issue in plain English.
  - shortAnswer: direct answer in 1 paragraph.
  - shortAnswer must not restate the H1. It must answer the reader's question in plain English in at least 18 words.
	  - intro: 2 to 3 plain-English paragraphs after the short answer.
	  - situation: title and 3 to 4 paragraphs.
  - deeperProblem: surfaceQuestion, deeperQuestion, whyItMatters.
	  - framework: title, intro, and exactly 4 to 5 steps when the source supports it.
  - quote: one strong David-style quote, preferably from the transcript or faithful to it.
	  - valueBlock: either a practical comparison table or a checklist. Prefer a table when the topic has categories, options, jobs, timelines, thresholds, or decision paths. Tables should usually have 4 to 6 rows.
	  - risks: title and 2 to 3 paragraphs.
	  - faqs: 4 to 5 follow-up questions with concise answers.
  - relatedLinks: 3 to 5 relevant Talley Wealth internal links from the useful internal paths.
  - cta: title, body, label, href.
  - disclaimer: short educational disclaimer.
- Do not make source moments a top-of-page section. They should support the middle of the article, usually after the decision framework or inside a major answer section.

Useful internal paths when relevant:
- /guide
- /get-started
- /resources/blog
- /retirement-planning
- /investment-management
- /tax-planning
- /business-owner-planning

Knowledge:
${docs}

Content log:
${JSON.stringify(contentLog, null, 2)}

Social pack:
${socialPack.slice(0, 9000)}

Transcript:
${transcript.slice(0, 18000)}

Timestamped transcript:
${timestampedTranscript.slice(0, 18000)}

Return only valid JSON in this shape:
{
  "articleMarkdown": "# Title\\n\\nArticle body...",
  "resourceSpec": {
    "eyebrow": "Short category label",
    "deck": "Short human setup line for the hero.",
    "shortAnswer": "Direct answer paragraph.",
    "intro": ["Paragraph one.", "Paragraph two."],
    "situation": { "title": "The Situation Behind The Question", "body": ["Paragraph."] },
    "deeperProblem": {
      "title": "The Deeper Problem",
      "surfaceQuestion": "What the reader thinks they are asking.",
      "deeperQuestion": "The planning question underneath it.",
      "whyItMatters": "Why this changes the decision."
    },
    "framework": {
      "title": "A Better Decision Framework",
      "intro": "Short setup.",
      "steps": [{ "title": "Step title", "body": "Plain-English explanation." }]
    },
    "quote": { "text": "Strong David-style line.", "cite": "David Talley" },
    "valueBlock": {
      "type": "table",
      "title": "Practical title",
      "intro": "Short setup.",
      "columns": ["Column 1", "Column 2", "Column 3"],
      "rows": [["Cell", "Cell", "Cell"]]
    },
    "risks": { "title": "Risks And Limits", "body": ["Paragraph."] },
    "faqs": [{ "question": "Follow-up question?", "answer": "Concise answer." }],
    "relatedLinks": [{ "title": "Link label", "href": "/path" }],
    "cta": { "title": "CTA title", "body": "CTA body.", "label": "Schedule an Explore Call", "href": "/get-started" },
    "disclaimer": "For discussion purposes only..."
  },
  "sourceMoments": [
    {
      "timestamp": "0:42",
      "seconds": 42,
      "sourceVideoId": "IMG_0000",
      "combinedStartSecond": 42,
      "originalStartSecond": 12,
      "label": "Short source moment label",
      "embedLabel": "Short source moment label",
      "question": "Optional FAQ-style question",
      "questionAnswered": "Optional FAQ-style question",
      "answer": "Optional 1 to 2 sentence answer.",
      "transcriptExcerpt": "Optional short cleaned source line",
      "sectionId": "optional-section-anchor"
    }
  ]
}`;
}

async function callOpenAI(prompt, apiKey, model) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: prompt,
      text: { format: { type: "json_object" } },
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}: ${text.slice(0, 1200)}`);
  const json = JSON.parse(text);
  return json.output_text || collectOutputText(json);
}

function fallbackDraft(reason) {
  const title = contentLog.title || titleFromSocial() || name;
  return `# ${title}

${reason}

This draft needs to be generated again before it is used as a public article.

## Core idea from the recording

${transcript.slice(0, 900)}

## What to build from here

- Answer the reader's question directly in the first paragraph.
- Turn the strongest point from the transcript into the spine of the article.
- Add only relevant Talley Wealth internal links.
- End with a short educational disclaimer.
`;
}

function titleFromSocial() {
  return (socialPack.match(/\*\*Title:\*\*\s*(.+)/) || [])[1]?.trim() || "";
}

function sanitize(value) {
  let out = String(value || "").trim();
  out = out.replace(/```(?:markdown)?/g, "").replace(/```/g, "").trim();
  out = out.replace(/[\u2014\u2013]/g, ", ");
  if (!/^#\s+/m.test(out)) out = `# ${contentLog.title || titleFromSocial() || name}\n\n${out}`;
  return out;
}

function parseAiDraft(value) {
  const text = String(value || "").trim();
  const candidates = [
    text,
    (text.match(/```json\s*([\s\S]*?)```/i) || [])[1],
    (text.match(/```\s*([\s\S]*?)```/i) || [])[1],
    (text.match(/\{[\s\S]*\}/) || [])[0],
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") {
        return {
          articleMarkdown: String(parsed.articleMarkdown || parsed.markdown || parsed.article || "").trim() || text,
          resourceSpec: parsed.resourceSpec || parsed.resource || null,
          sourceMoments: Array.isArray(parsed.sourceMoments) ? parsed.sourceMoments : [],
        };
      }
    } catch (_) {
      // Fall back to treating the model output as markdown.
    }
  }
  return { articleMarkdown: text, resourceSpec: null, sourceMoments: [] };
}

function normalize(value) {
  return String(value || "").replace(/[\u2014\u2013]/g, ", ").replace(/\s+/g, " ").trim();
}

function buildTimestampedTranscript(json) {
  const segments = Array.isArray(json?.segments) ? json.segments : [];
  return segments
    .map((segment) => {
      const seconds = Number(segment?.start ?? segment?.seek ?? 0);
      const text = normalize(segment?.text || "");
      if (!text) return "";
      return `[${timestampFromSeconds(seconds)}] ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

function normalizeSourceMoments(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const seconds = Number(item?.seconds ?? item?.combinedStartSecond ?? secondsFromTimestamp(item?.timestamp));
      const label = String(item?.label || item?.question || "").replace(/[\u2014\u2013]/g, ", ").trim();
      if (!Number.isFinite(seconds) || seconds < 0 || !label) return null;
      return {
        timestamp: String(item?.timestamp || timestampFromSeconds(seconds)).trim(),
        seconds: Math.round(seconds),
        sourceVideoId: cleanOptional(item?.sourceVideoId),
        combinedStartSecond: Number.isFinite(Number(item?.combinedStartSecond)) ? Math.round(Number(item.combinedStartSecond)) : Math.round(seconds),
        originalStartSecond: Number.isFinite(Number(item?.originalStartSecond)) ? Math.round(Number(item.originalStartSecond)) : undefined,
        label,
        embedLabel: cleanOptional(item?.embedLabel || item?.label),
        question: cleanOptional(item?.question),
        questionAnswered: cleanOptional(item?.questionAnswered || item?.question),
        answer: cleanOptional(item?.answer),
        transcriptExcerpt: cleanOptional(item?.transcriptExcerpt),
        sectionId: cleanOptional(item?.sectionId),
      };
    })
    .filter(Boolean)
    .slice(0, 3);
}

function loadResourceThread(videoName) {
  const payload = readJson(path.join(ROOT, "resource-threads.json"), { threads: [] });
  const threads = Array.isArray(payload.threads) ? payload.threads : [];
  return threads.find((thread) => thread?.sourceVideo === videoName && thread?.sourceVideoIds?.length > 1) || null;
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
  const cleaned = String(value || "").replace(/[\u2014\u2013]/g, ", ").trim();
  return cleaned || undefined;
}

function normalizeResourceSpec(value, title = "") {
  if (!value || typeof value !== "object") return null;
  const spec = {
    eyebrow: cleanOptional(value.eyebrow),
    deck: cleanHeroDeck(value.deck),
    shortAnswer: cleanOptional(value.shortAnswer),
    intro: cleanStringArray(value.intro).slice(0, 4),
    situation: normalizeSection(value.situation),
    deeperProblem: normalizeDeeperProblem(value.deeperProblem),
    framework: normalizeFramework(value.framework),
    quote: normalizeQuote(value.quote),
    valueBlock: normalizeValueBlock(value.valueBlock),
    risks: normalizeSection(value.risks),
    faqs: normalizeFaqs(value.faqs),
    relatedLinks: normalizeLinks(value.relatedLinks),
    cta: normalizeCta(value.cta),
    disclaimer: cleanOptional(value.disclaimer),
  };
  if (spec.shortAnswer && !shortAnswerIsUseful(spec.shortAnswer, title)) {
    spec.shortAnswer = repairShortAnswer(spec, title);
  }
  if (!spec.shortAnswer || !spec.framework?.steps?.length) return null;
  return spec;
}

function cleanHeroDeck(value) {
  const text = cleanOptional(value);
  if (!text) return undefined;
  const cleaned = text.replace(/(?:\.{3}|…)$/, ".").replace(/\s+/g, " ").trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
  const firstTwo = sentences.slice(0, 2).join(" ").trim();
  const deck = firstTwo || cleaned;
  if (/\bnot just\b.+\bbut also\b/i.test(deck)) return undefined;
  return deck.length <= 190 ? deck : deck.slice(0, 190).replace(/\s+\S*$/, "").replace(/[,:;]\s+[^,:;]*$/, "").trim() + ".";
}

function shortAnswerIsUseful(value, title = "") {
  const answer = String(value || "").replace(/\s+/g, " ").trim();
  const words = answer.split(/\s+/).filter(Boolean);
  if (words.length < 18) return false;
  const answerNorm = normalizeForCompare(answer);
  const titleNorm = normalizeForCompare(title);
  if (titleNorm && (answerNorm === titleNorm || (answerNorm.startsWith(titleNorm) && words.length < 35))) return false;
  const titleWords = importantWords(title);
  if (titleWords.length >= 3) {
    const answerWords = new Set(importantWords(answer));
    const overlap = titleWords.filter((word) => answerWords.has(word)).length / titleWords.length;
    if (overlap > 0.85 && words.length < 34) return false;
  }
  return /\b(should|need|start|depends|because|means|helps|ask|look|avoid|decide|plan|if|before)\b/i.test(answer);
}

function repairShortAnswer(spec, title) {
  const candidates = [
    ...(Array.isArray(spec.intro) ? spec.intro : []),
    spec.situation?.body?.[0],
    spec.deeperProblem?.whyItMatters,
  ].filter(Boolean);
  return candidates.find((candidate) => shortAnswerIsUseful(candidate, title)) || "";
}

function normalizeForCompare(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function importantWords(value) {
  const stop = new Set(["the", "and", "or", "but", "with", "that", "this", "what", "why", "how", "should", "would", "could", "when", "your", "you", "for", "from", "into", "after", "before", "about", "does", "did", "is", "are", "was", "were", "have", "has"]);
  return normalizeForCompare(value).split(" ").filter((word) => word.length > 2 && !stop.has(word));
}

function normalizeSection(value) {
  if (!value || typeof value !== "object") return undefined;
  const title = cleanOptional(value.title);
  const body = cleanStringArray(value.body).slice(0, 5);
  if (!title && !body.length) return undefined;
  return { title, body };
}

function normalizeDeeperProblem(value) {
  if (!value || typeof value !== "object") return undefined;
  const deeper = {
    title: cleanOptional(value.title) || "The Deeper Problem",
    surfaceQuestion: cleanOptional(value.surfaceQuestion),
    deeperQuestion: cleanOptional(value.deeperQuestion),
    whyItMatters: cleanOptional(value.whyItMatters),
  };
  if (!deeper.surfaceQuestion && !deeper.deeperQuestion && !deeper.whyItMatters) return undefined;
  return deeper;
}

function normalizeFramework(value) {
  if (!value || typeof value !== "object") return undefined;
  const steps = Array.isArray(value.steps) ? value.steps : [];
  const cleanSteps = steps
    .map((step) => ({
      title: cleanOptional(step?.title),
      body: cleanOptional(step?.body),
    }))
    .filter((step) => step.title && step.body)
    .slice(0, 5);
  if (!cleanSteps.length) return undefined;
  return {
    title: cleanOptional(value.title) || "A Better Decision Framework",
    intro: cleanOptional(value.intro),
    steps: cleanSteps,
  };
}

function normalizeQuote(value) {
  if (!value || typeof value !== "object") return undefined;
  const text = cleanOptional(value.text);
  if (!text) return undefined;
  return { text, cite: cleanOptional(value.cite) || "David Talley" };
}

function normalizeValueBlock(value) {
  if (!value || typeof value !== "object") return undefined;
  const type = value.type === "checklist" ? "checklist" : "table";
  const base = {
    type,
    title: cleanOptional(value.title) || (type === "checklist" ? "Questions To Bring To A Planning Conversation" : "A Simple Way To Think About The Decision"),
    intro: cleanOptional(value.intro),
  };
  if (type === "checklist") {
    const items = cleanStringArray(value.items).slice(0, 8);
    return items.length ? { ...base, items } : undefined;
  }
  const columns = cleanStringArray(value.columns).slice(0, 4);
  const rows = Array.isArray(value.rows)
    ? value.rows.map((row) => cleanStringArray(row).slice(0, columns.length || 4)).filter((row) => row.length)
    : [];
  return columns.length >= 2 && rows.length ? { ...base, columns, rows: rows.slice(0, 6) } : undefined;
}

function normalizeFaqs(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({ question: cleanOptional(item?.question), answer: cleanOptional(item?.answer) }))
    .filter((item) => item.question && item.answer)
    .slice(0, 5);
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const title = cleanOptional(item?.title || item?.label);
      const href = cleanOptional(item?.href);
      if (!title || !href || !href.startsWith("/")) return null;
      return { title, href };
    })
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeCta(value) {
  if (!value || typeof value !== "object") return undefined;
  return {
    title: cleanOptional(value.title) || "Start With The Real Question",
    body: cleanOptional(value.body),
    label: cleanOptional(value.label) || "Schedule an Explore Call",
    href: cleanOptional(value.href) || "/get-started",
  };
}

function cleanStringArray(value) {
  const items = Array.isArray(value) ? value : (typeof value === "string" ? [value] : []);
  return items.map((item) => cleanOptional(item)).filter(Boolean);
}

function buildFallbackResourceSpec(md) {
  const title = firstHeadingFromDraft(md) || contentLog.title || titleFromSocial() || name;
  const paragraphs = md
    .replace(/^#\s+.+\n+/, "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk && !chunk.startsWith("#") && !chunk.startsWith("---") && !/^- /.test(chunk));
  const shortAnswer = paragraphs.find((chunk) => shortAnswerIsUseful(chunk, title))
    || "Start by naming the decision underneath the question, then match the money, risk, tax issues, and timing to that decision before choosing an action.";
  return {
    eyebrow: categoryLabel(contentLog.pillar || title),
    shortAnswer,
    intro: paragraphs.filter((chunk) => chunk !== shortAnswer).slice(0, 2),
    situation: {
      title: "The Situation Behind The Question",
      body: paragraphs.slice(1, 3),
    },
    deeperProblem: {
      title: "The Deeper Problem",
      surfaceQuestion: extractBoldLine(md, "Surface question") || title,
      deeperQuestion: extractBoldLine(md, "Deeper problem") || "What planning decision is underneath the first question?",
      whyItMatters: extractBoldLine(md, "Why it matters") || "The wrong framing can lead to decisions that look reasonable in isolation but do not fit the full plan.",
    },
    framework: {
      title: "A Better Decision Framework",
      intro: "Use these filters before deciding what to do next.",
      steps: extractSteps(md),
    },
    quote: {
      text: extractDavidLine(md) || "The first question is not always the real question.",
      cite: "David Talley",
    },
    valueBlock: fallbackValueBlock(title),
    risks: {
      title: "Risks And Limits",
      body: paragraphs.slice(-3, -1),
    },
    faqs: extractFaqs(md),
    relatedLinks: [
      { title: "Retirement planning for income, taxes, and investment risk", href: "/retirement-planning" },
      { title: "Investment management built around the plan", href: "/investment-management" },
      { title: "Tax planning connected to the rest of the plan", href: "/tax-planning" },
      { title: "Schedule an Explore Call", href: "/get-started" },
    ],
    cta: {
      title: "Start With The Real Question",
      body: "If this question is on your mind, an Explore Call can help determine whether a deeper planning process makes sense.",
      label: "Schedule an Explore Call",
      href: "/get-started",
    },
    disclaimer: "For discussion purposes only. This is not individualized legal, tax, investment, or financial advice.",
  };
}

function firstHeadingFromDraft(md) {
  return (String(md || "").match(/^#\s+(.+)$/m) || [])[1]?.trim() || "";
}

function extractBoldLine(md, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, "i");
  return (String(md || "").match(re) || [])[1]?.trim() || "";
}

function extractSteps(md) {
  const steps = [];
  const re = /^###\s+(?:\d+\.\s*)?(.+)\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/gm;
  let match;
  while ((match = re.exec(md)) && steps.length < 5) {
    const title = match[1].trim();
    const body = match[2].replace(/\n+/g, " ").trim();
    if (title && body) steps.push({ title, body });
  }
  return steps.length ? steps : [
    { title: "Name The Real Decision", body: "Start by identifying what question you are actually trying to answer." },
    { title: "Check The Planning Context", body: "Look at taxes, timing, risk, cash flow, and family priorities together." },
    { title: "Choose The Move That Fits The Plan", body: "The best next step should fit the larger plan, not just the isolated account or tactic." },
  ];
}

function extractDavidLine(md) {
  const pov = String(md || "").match(/##\s+David[^\n]*\n+([\s\S]*?)(?=\n##\s+|$)/i);
  return pov?.[1]?.replace(/\*/g, "").replace(/\s+/g, " ").trim().slice(0, 220) || "";
}

function fallbackValueBlock(title) {
  const hay = String(title || "").toLowerCase();
  if (hay.includes("inherit")) {
    return {
      type: "table",
      title: "A Simple Way To Sort The Inherited Money",
      intro: "The right next step depends on what kind of asset you inherited and what job it now needs to do.",
      columns: ["Inherited asset", "First planning question", "What to check before changing it"],
      rows: [
        ["Cash or savings", "Does this need to support near-term needs or sit in reserve?", "Liquidity, FDIC limits, household cash flow, and emergency reserves."],
        ["Investment account", "Does the risk fit your timeline now?", "Cost basis, tax exposure, diversification, and your own risk tolerance."],
        ["Inherited IRA", "What withdrawal rules now apply?", "Beneficiary type, required timelines, tax bracket, and income coordination."],
        ["Real estate", "Should we keep, sell, rent, or divide it?", "Title, expenses, family dynamics, tax basis, and liquidity needs."],
      ],
    };
  }
  return {
    type: "checklist",
    title: "Questions To Bring To A Planning Conversation",
    items: [
      "What decision am I actually trying to make?",
      "What tax, timing, income, or risk issue could change the answer?",
      "What would happen if I did nothing for another year?",
      "How does this decision connect to the rest of the plan?",
      "What would make this choice easier to explain to my family?",
    ],
  };
}

function extractFaqs(md) {
  const faqs = [];
  const chunks = String(md || "").split(/\n{2,}/);
  for (const chunk of chunks) {
    const match = chunk.match(/^\*\*([^*?]+\?)\*\*\s*\n?([\s\S]+)/);
    if (match) faqs.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  return faqs.slice(0, 5);
}

function categoryLabel(value) {
  const hay = String(value || "").toLowerCase();
  if (hay.includes("tax") || hay.includes("roth")) return "Tax Planning";
  if (hay.includes("retirement")) return "Retirement Planning";
  if (hay.includes("investment") || hay.includes("portfolio")) return "Plan Before Portfolio";
  if (hay.includes("business")) return "Business Owner Planning";
  return "Planning Decision";
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

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file, fallback) {
  try { return JSON.parse(read(file)); } catch { return fallback; }
}

function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of read(file).split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}
