// stage-blog.mjs <videoName>
// Converts output/<name>/blog-draft.md into a generated Astro blog entry.
// The page renders locally at /resources/blog/<slug>; nothing is deployed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const name = process.argv[2];
if (!name) { console.error("usage: node scripts/stage-blog.mjs <videoName>"); process.exit(1); }

const outDir = path.join(ROOT, "output", name);
const draftPath = path.join(outDir, "blog-draft.md");
if (!fs.existsSync(draftPath)) {
  console.log(`[blog] ${name}: no blog draft to stage`);
  process.exit(0);
}

const log = readJson(path.join(outDir, "content-log.json"), {});
const resourceThread = loadResourceThread(name);
const social = read(path.join(outDir, "social-pack.md"));
const draft = read(draftPath).trim();
if (!draft) {
  console.log(`[blog] ${name}: empty blog draft`);
  process.exit(0);
}

const title = selectTitle(draft, log, social, name);
const slug = uniqueSlug(slugify(title || name), name);
const category = categoryFor(log.pillar || log.triage || title);
const body = markdownToBlocks(stripFirstHeading(draft));
const image = heroImageFor(category, title);
const sourceMoments = normalizeSourceMoments(readJson(path.join(outDir, "source-moments.json"), null) ?? log.sourceMoments ?? []);
const resourceSpec = normalizeResourceSpec(readJson(path.join(outDir, "resource-spec.json"), null), title) || buildMinimalResourceSpec(draft, title);
const description = deckFrom(resourceSpec, draft, title);
const stagedVideo = stageSourceVideo(slug);
const tags = tagsFor(category, `${title} ${description} ${log.pillar || ""}`);
const h1Title = title;
const seoTitle = buildSeoTitle(title);
const titleRationale = titleRationaleFor(title, log, social);
const candidateScore = Math.max(Number(log.candidateScore || scoreFromLog(log)), Number(resourceThread?.candidateScore || 0));
const candidateSummary = summarizeCandidate(log, description);
const audienceLane = String(log.audienceLane || log.audience || log.personaFit?.primaryLane || "").trim();
const contentFormat = "Blog article";
const decisionTheme = decisionThemeFor(title, category);
const sourceBasis = buildSourceBasis({ sourceMoments, transcriptPath: path.join(workDirFor(name), "audio.json") });
const youtubeReuse = null;
const compliancePackage = null;
const post = {
  contentKind: "blog",
  layoutVariant: "rich_resource_page",
  publicationStatus: "preview",
  slug,
  title,
  h1Title,
  seoTitle,
  titleRationale,
  description,
  category,
  primaryCategory: category,
  date: today(),
  image,
  author: "David Talley, CFP®, EA",
  readTime: "",
  tags,
  candidateScore,
  candidateSummary,
  audienceLane,
  contentFormat,
  decisionTheme,
  sourceBasis,
  featured: false,
  duration: null,
  videoUrl: stagedVideo,
  sourceMoments,
  resourceSpec,
  resourceThread,
  sourceVideoIds: resourceThread?.sourceVideoIds || [name],
  resourceVideoPath: resourceThread?.resourceVideoPath || "",
  transcriptBundlePath: resourceThread?.transcriptBundlePath || "",
  youtubeReuse,
  compliancePackage,
  body,
};

const generatedPath = path.join(SITE, "src", "data", "talley-wealth", "generated-blog-posts.ts");
const posts = readGeneratedPosts(generatedPath).filter((p) => p.sourceVideo !== name && p.slug !== slug);
posts.unshift({ ...post, sourceVideo: name });
writeGeneratedPosts(generatedPath, posts);

const meta = {
  sourceVideo: name,
  contentKind: "blog",
  layoutVariant: "rich_resource_page",
  publicationStatus: "preview",
  slug,
  h1Title,
  seoTitle,
  titleRationale,
  localPath: `/resources/blog/${slug}`,
  localUrl: `http://localhost:5181/resources/blog/${slug}`,
  stagedPath: "src/data/talley-wealth/generated-blog-posts.ts",
  stagedAt: new Date().toISOString(),
  pdfPath: `output/${name}/compliance/${slug}.pdf`,
  sourceMomentCount: sourceMoments.length,
  sourceMomentsPath: `output/${name}/source-moments.json`,
  resourceThread,
  resourceThreadStatus: resourceThread?.threadStatus || "",
  sourceVideoIds: resourceThread?.sourceVideoIds || [name],
  resourceVideoPath: resourceThread?.resourceVideoPath || "",
  transcriptBundlePath: resourceThread?.transcriptBundlePath || "",
	  cleanSocialVideoPath: resourceThread?.cleanSocialVideoPath || "",
	  previewNeedsRegeneration: false,
	  previewSourceVideoIds: resourceThread?.sourceVideoIds || [name],
	  resourceThreadUpdatedAt: resourceThread?.updatedAt || "",
	  candidateScore,
  candidateSummary,
  primaryCategory: category,
  tags,
  audienceLane,
  contentFormat,
  decisionTheme,
  sourceBasis,
  youtubeReuse,
  compliancePackage,
};
fs.mkdirSync(path.join(outDir, "compliance"), { recursive: true });
fs.writeFileSync(path.join(outDir, "blog-page.json"), JSON.stringify(meta, null, 2));
console.log(`[blog] ${name}: staged /resources/blog/${slug}`);

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }
function readJson(p, fallback) { try { return JSON.parse(read(p)); } catch { return fallback; } }
function matchLine(text, re) { return (text.match(re) || [])[1]?.trim() || ""; }
function today() { return new Date().toISOString().slice(0, 10); }
function workDirFor(videoName) { return path.join(ROOT, "work", videoName); }
function loadResourceThread(videoName) {
  const payload = readJson(path.join(ROOT, "resource-threads.json"), { threads: [] });
  const threads = Array.isArray(payload.threads) ? payload.threads : [];
  return threads.find((thread) => thread?.sourceVideo === videoName && Array.isArray(thread.sourceVideoIds) && thread.sourceVideoIds.length > 1) || null;
}
function cleanTitle(value) {
  const title = String(value || "")
    .replace(/^#+\s*/, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s+\((emotionally and practically|practically and emotionally)\)/ig, "")
    .replace(/\s+\((?:and )?what to do(?: next)?\)/ig, "")
    .replace(/\s+/g, " ")
    .trim();
  return polishTitle(title);
}
function selectTitle(md, logValue, socialText, fallback) {
  const candidates = [
    firstHeading(md),
    logValue.h1Title,
    logValue.title,
    matchLine(socialText, /\*\*Title:\*\*\s*(.+)/),
    fallback,
  ].map(cleanTitle).filter(Boolean);
  const title = candidates.find((candidate) => titleLooksReadable(candidate)) || candidates[0] || fallback;
  return cleanTitle(title);
}
function titleLooksReadable(value) {
  const title = cleanTitle(value);
  if (!title || title.length > 95) return false;
  const words = title.split(/\s+/).filter(Boolean);
  if (/\?$/.test(title) && (words.length > 11 || title.length > 68)) return false;
  if (/\b(aim for with|should i get with|should i have on)\b/i.test(title)) return false;
  if (/\([^)]{12,}\)/.test(title)) return false;
  if (/^(untitled|generated|draft)$/i.test(title)) return false;
  return true;
}
function polishTitle(value) {
  let title = String(value || "").trim();
  title = title.replace(/\bWhat Rate of Return Should I Aim For With My Investments\??/i, "What Return Should I Expect From My Investments?");
  title = title.replace(/\bWhat Rate of Return Should I Get\??/i, "What Return Should I Expect From My Investments?");
  title = title.replace(/\bWhat Rate of Return Should I Have on My Investments\??/i, "What Return Should I Expect From My Investments?");
  title = title.replace(/\bWhy 'What Rate of Return Should I Get\?' Is the Wrong Investing Question\b/i, "What Return Should I Expect From My Investments?");
  return title.trim();
}
function buildSeoTitle(value) {
  const title = cleanTitle(value);
  if (!title) return "Talley Wealth Planning Resource";
  return title.length <= 58 ? title : `${title.slice(0, 55).replace(/\s+\S*$/, "")}...`;
}
function titleRationaleFor(title, logValue, socialText) {
  const question = cleanOptional(logValue.coreQuestion || matchLine(socialText, /\*\*Question:\*\*\s*(.+)/));
  if (question && normalizeForCompare(title).includes(normalizeForCompare(question).slice(0, 24))) {
    return "Uses the reader's likely question as the H1 so the article starts with search intent.";
  }
  return "Uses a clear problem or outcome title instead of an internal content label.";
}
function firstHeading(md) { return (md.match(/^#\s+(.+)$/m) || md.match(/^##\s+(.+)$/m) || [])[1] || ""; }
function stripFirstHeading(md) { return md.replace(/^#\s+.+\n+/, "").trim(); }
function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "generated-blog-draft";
}
function uniqueSlug(base, fallback) {
  const posts = readGeneratedPosts(path.join(SITE, "src", "data", "talley-wealth", "generated-blog-posts.ts"));
  const current = posts.find((p) => p.sourceVideo === fallback);
  if (current?.slug) return current.slug;
  const existing = new Set(posts.map((p) => p.slug));
  if (!existing.has(base)) return base;
  return `${base}-${slugify(fallback).slice(0, 20)}`;
}
function categoryFor(text) {
  const hay = String(text || "").toLowerCase();
  if (hay.includes("business") || hay.includes("s-corp") || hay.includes("owner")) return "Business Owner Planning";
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("rmd")) return "Tax Planning";
  if (hay.includes("retirement") || hay.includes("medicare") || hay.includes("social security")) return "Retirement Planning";
  if (hay.includes("investment") || hay.includes("portfolio")) return "Investment Management";
  return "Financial Planning";
}
function tagsFor(category, text) {
  const tags = new Set([category]);
  const hay = String(text || "").toLowerCase();
  if (hay.includes("retirement")) tags.add("Retirement Planning");
  if (hay.includes("tax") || hay.includes("roth")) tags.add("Tax Planning");
  if (hay.includes("business") || hay.includes("owner")) tags.add("Business Owners");
  if (hay.includes("medicare") || hay.includes("health")) tags.add("Healthcare");
  if (hay.includes("investment") || hay.includes("portfolio") || hay.includes("return")) tags.add("Investment Management");
  if (hay.includes("estate") || hay.includes("inherit")) tags.add("Estate Planning");
  return [...tags];
}
function scoreFromLog(logValue) {
  let score = 6;
  const confidence = String(logValue.confidence || logValue.routingConfidence || "").toLowerCase();
  if (confidence === "high") score += 1.5;
  if (confidence === "medium") score += 0.5;
  if (logValue.coreQuestion || logValue.title) score += 0.5;
  if (Array.isArray(logValue.sourceMoments) && logValue.sourceMoments.length) score += 0.5;
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}
function summarizeCandidate(logValue, fallback) {
  const text = String(logValue.candidateSummary || logValue.recommendationReason || logValue.reason || fallback || "").replace(/\s+/g, " ").trim();
  if (!text || isBoilerplate(text)) return "Strong candidate for a durable resource because it answers a planning question in plain English.";
  const sentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || text;
  return completeSentence(sentence, 180);
}
function decisionThemeFor(title, category) {
  const hay = `${title} ${category}`.toLowerCase();
  if (hay.includes("inherit") || hay.includes("estate")) return "Inheritance and estate decisions";
  if (hay.includes("return") || hay.includes("portfolio") || hay.includes("investment")) return "Investment decision framing";
  if (hay.includes("retirement") || hay.includes("number")) return "Retirement readiness";
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("rmd")) return "Tax strategy timing";
  if (hay.includes("business") || hay.includes("owner")) return "Business owner planning";
  return "Planning decision";
}
function buildSourceBasis({ sourceMoments, transcriptPath }) {
  const inputs = ["transcript"];
  if (Array.isArray(sourceMoments) && sourceMoments.length) inputs.push("timestamped transcript");
  if (fs.existsSync(transcriptPath)) inputs.push("source video transcript file");
  return {
    inputs,
    generatedFrom: ["content-log/intermediate strategy layer", "social-pack/reuse layer", "blog resource blueprint"],
    notes: "Shown only in the review UI so the public article can stay clean.",
  };
}
function pickExistingRel(candidates) {
  return candidates.find((rel) => fs.existsSync(path.join(ROOT, rel))) || "";
}
function excerptFrom(md, title) {
  const lines = stripFirstHeading(md)
    .split(/\n{2,}/)
    .map((s) => s.replace(/^#+\s*/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
    .filter((s) => s && !s.startsWith("#") && !isBoilerplate(s));
  const first = lines.find((s) => s.length > 80) || lines[0] || title;
  return completeSentence(first.replace(/\s+/g, " "), 210);
}
function deckFrom(spec, md, title) {
  const candidates = [
    spec?.deck,
    spec?.description,
    spec?.shortAnswer,
    ...(Array.isArray(spec?.intro) ? spec.intro : []),
    excerptFrom(md, title),
  ];
  for (const candidate of candidates) {
    const deck = completeSentence(candidate, 190);
    if (deck && deck.length >= 45 && deckLooksHuman(deck) && !normalizeForCompare(deck).includes(normalizeForCompare(title).slice(0, 34))) {
      return deck;
    }
  }
  return completeSentence(excerptFrom(md, title), 190) || title;
}
function deckLooksHuman(value) {
  const text = String(value || "");
  if (/\bnot just\b.+\bbut also\b/i.test(text)) return false;
  if (/\bmeaningful experiences, memories, or generosity\b/i.test(text)) return false;
  if (/\blegally and practically\b/i.test(text) && /\backnowledge any emotional/i.test(text)) return false;
  return true;
}
function firstSentence(value) {
  const text = String(value || "").trim();
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return (match?.[0] || text).trim();
}
function completeSentence(value, limit = 190) {
  const text = String(value || "").trim();
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").replace(/(?:\.{3}|…)$/, ".").trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
  let result = "";
  for (const sentence of sentences) {
    const next = `${result} ${sentence.trim()}`.trim();
    if (next.length > limit && result) break;
    if (next.length > limit) break;
    result = next;
    if (result.length >= 70) break;
  }
  if (!result && cleaned.length <= limit) result = cleaned;
  if (!result) {
    result = cleaned
      .slice(0, limit)
      .replace(/\s+(?:and|but|or|because|that|which|where|when|while|with|to|for)\s+\S*$/i, "")
      .replace(/[,:;]\s+[^,:;]*$/, "")
      .replace(/\s+\S*$/, "")
      .trim();
  }
  return /[.!?]$/.test(result) ? result : `${result}.`;
}
function isBoilerplate(value) {
  const text = String(value || "").toLowerCase();
  return text.startsWith("by david talley")
    || text.includes("talley wealth |")
    || text.includes("northeast tennessee retirement")
    || text === "local draft preview";
}
function markdownToBlocks(md) {
  return md
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}
function stageCover(slug) {
  const src = path.join(outDir, "cover.jpg");
  if (!fs.existsSync(src)) return "/brands/talley-wealth/blog/retirement-number-hero.jpg";
  const rel = path.join("brands", "talley-wealth", "blog", "generated", `${slug}.jpg`);
  const dest = path.join(SITE, "public", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return `/${rel.split(path.sep).join("/")}`;
}
function heroImageFor(category, title) {
  const hay = `${category} ${title}`.toLowerCase();
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("irs")) return "/brands/talley-wealth/blog/tax-planning-hero.jpg";
  if (hay.includes("investment") || hay.includes("portfolio") || hay.includes("return")) return "/brands/talley-wealth/tri-cities-landscape.jpg";
  if (hay.includes("retirement") || hay.includes("social security") || hay.includes("medicare")) return "/brands/talley-wealth/tri-cities-landscape.jpg";
  return "/brands/talley-wealth/tri-cities-landscape.jpg";
}
function stageSourceVideo(slug) {
  const candidates = [
    resourceThread?.resourceVideoPath ? path.join(ROOT, resourceThread.resourceVideoPath) : "",
    path.join(outDir, "horizontal_16x9.mp4"),
    path.join(outDir, "captioned_vertical_9x16.mp4"),
    path.join(outDir, "vertical_9x16.mp4")
  ].filter(Boolean);
  const src = candidates.find((candidate) => fs.existsSync(candidate));
  if (!src) return null;
  const rel = path.join("brands", "talley-wealth", "blog", "generated", `${slug}.mp4`);
  const dest = path.join(SITE, "public", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return `/${rel.split(path.sep).join("/")}`;
}
function normalizeSourceMoments(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const seconds = Number(item?.seconds ?? item?.combinedStartSecond ?? secondsFromTimestamp(item?.timestamp));
      const timestamp = String(item?.timestamp || timestampFromSeconds(seconds)).trim();
      const label = String(item?.label || item?.question || "").trim();
      if (!Number.isFinite(seconds) || seconds < 0 || !label) return null;
      return {
        timestamp,
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
function normalizeResourceSpec(value, title = "") {
  if (!value || typeof value !== "object") return undefined;
  const spec = {
    eyebrow: cleanOptional(value.eyebrow),
    deck: cleanOptional(value.deck),
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
    const repaired = repairShortAnswer(spec, draft, title);
    spec.shortAnswer = repaired || undefined;
  }
  if (!spec.shortAnswer || !spec.framework?.steps?.length) return undefined;
  return spec;
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
function repairShortAnswer(spec, md, title) {
  const candidates = [
    ...(Array.isArray(spec.intro) ? spec.intro : []),
    ...stripFirstHeading(md)
      .split(/\n{2,}/)
      .map((chunk) => chunk.replace(/^#+\s*/, "").trim())
      .filter(Boolean),
  ];
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
function buildMinimalResourceSpec(md, title) {
  const paragraphs = stripFirstHeading(md)
    .split(/\n{2,}/)
    .map((chunk) => chunk.replace(/^#+\s*/, "").trim())
    .filter((chunk) => chunk && !/^[-*]\s+/.test(chunk));
  const shortAnswer = paragraphs.find((chunk) => shortAnswerIsUseful(chunk, title))
    || "Start by naming the decision underneath the question, then match the money, risk, tax issues, and timing to that decision before choosing an action.";
  return {
    eyebrow: categoryFor(title),
    shortAnswer,
    intro: paragraphs.filter((chunk) => chunk !== shortAnswer).slice(0, 2),
    situation: { title: "The Situation Behind The Question", body: paragraphs.slice(0, 3) },
    deeperProblem: {
      title: "The Deeper Problem",
      surfaceQuestion: title,
      deeperQuestion: "What decision is this question really trying to support?",
      whyItMatters: "A better frame keeps the article from turning into generic advice and points the reader toward the planning context that matters.",
    },
    framework: {
      title: "A Better Decision Framework",
      intro: "Use these filters before deciding what to do next.",
      steps: [
        { title: "Name The Real Decision", body: "Start by identifying what the question is supposed to help you decide." },
        { title: "Check The Planning Context", body: "Look at timing, taxes, risk, cash flow, and family priorities together." },
        { title: "Choose The Move That Fits", body: "The best action should fit the plan, not just the isolated account or tactic." },
      ],
    },
    quote: { text: "The first question is not always the real question.", cite: "David Talley" },
    valueBlock: {
      type: "checklist",
      title: "Questions To Bring To A Planning Conversation",
      items: [
        "What decision am I actually trying to make?",
        "What timing, tax, income, and risk factors could change the answer?",
        "What would make this advice wrong for my situation?",
      ],
    },
    risks: { title: "Risks And Limits", body: paragraphs.slice(-2) },
    faqs: [
      { question: "Is this individualized advice?", answer: "No. Use it as education and a way to prepare better questions for your own planning conversation." },
      { question: "What should I do next?", answer: "Write down the decision you need to make, the timeline, and what would make the choice feel risky." },
      { question: "When does this need a planner?", answer: "It usually deserves deeper planning when taxes, retirement income, estate issues, or investment risk overlap." },
    ],
    relatedLinks: [
      { title: "Retirement planning for income, taxes, and investment risk", href: "/retirement-planning" },
      { title: "Investment management built around the plan", href: "/investment-management" },
      { title: "Tax planning connected to the rest of the plan", href: "/tax-planning" },
    ],
    cta: { title: "Start With The Real Question", body: "If this question is on your mind, an Explore Call can help determine whether a deeper planning process makes sense.", label: "Schedule an Explore Call", href: "/get-started" },
    disclaimer: "For discussion purposes only. This is not individualized legal, tax, investment, or financial advice.",
  };
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
    .map((step) => ({ title: cleanOptional(step?.title), body: cleanOptional(step?.body) }))
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
  return text ? { text, cite: cleanOptional(value.cite) || "David Talley" } : undefined;
}
function normalizeValueBlock(value) {
  if (!value || typeof value !== "object") return undefined;
  const type = value.type === "checklist" ? "checklist" : "table";
  const base = { type, title: cleanOptional(value.title), intro: cleanOptional(value.intro) };
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
    title: cleanOptional(value.title),
    body: cleanOptional(value.body),
    label: cleanOptional(value.label),
    href: cleanOptional(value.href),
  };
}
function cleanStringArray(value) {
  const items = Array.isArray(value) ? value : (typeof value === "string" ? [value] : []);
  return items.map((item) => cleanOptional(item)).filter(Boolean);
}
function readGeneratedPosts(file) {
  const text = read(file);
  const m = text.match(/export const generatedBlogPosts[^=]*=\s*(\[[\s\S]*\]);/);
  if (!m) return [];
  try { return JSON.parse(m[1]); } catch { return []; }
}
function writeGeneratedPosts(file, posts) {
  const serializable = posts.map(({ sourceVideo, ...post }) => ({ sourceVideo, ...post }));
  fs.writeFileSync(file, `import type { BlogPost } from './site-content';

// Auto-written by content-pipeline long-form staging scripts.
// Drafts here render locally through /resources/blog/[slug] for review and PDF capture.
export const generatedBlogPosts: (BlogPost & {
  sourceVideo?: string;
	  reuseId?: string;
	  contentKind?: 'blog' | 'video_explainer_page';
	  layoutVariant?: 'article' | 'rich_resource_page';
	  publicationStatus?: 'preview' | 'approved' | 'published';
    sourceMoments?: BlogPost['sourceMoments'];
    resourceSpec?: BlogPost['resourceSpec'];
	})[] = ${JSON.stringify(serializable, null, 2)};
`);
}
