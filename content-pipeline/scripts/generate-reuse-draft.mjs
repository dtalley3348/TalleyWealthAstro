#!/usr/bin/env node
// generate-reuse-draft.mjs <reuse-id>
// generate-reuse-draft.mjs --all-candidates [--type landing_page_brief]
// Creates local markdown drafts in reuse-output/<reuse-id>/.
// No publishing, live site edits, uploads, sends, or scheduling.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const BACKLOG = path.join(ROOT, "reuse-backlog.json");
const OUT = path.join(ROOT, "reuse-output");

const args = process.argv.slice(2);
const allCandidates = args.includes("--all-candidates");
const typeFilter = valueAfter("--type");
const explicitId = args.find((arg) => !arg.startsWith("--") && arg !== typeFilter);

loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(SITE, ".env.local"));

ensureBacklog();
let backlog = readJson(BACKLOG, []);
let items = [];
if (allCandidates) {
  items = backlog.filter((item) => item?.id && ["candidate", "needs_review"].includes(item.status || "candidate"));
  if (typeFilter) items = items.filter((item) => item.type === typeFilter);
} else if (explicitId) {
  const item = backlog.find((entry) => entry.id === explicitId);
  if (!item) {
    console.error(`[reuse-draft] no backlog item found for ${explicitId}`);
    process.exit(1);
  }
  items = [item];
} else {
  console.error("usage: node scripts/generate-reuse-draft.mjs <reuse-id> | --all-candidates [--type landing_page_brief]");
  process.exit(1);
}

if (!items.length) {
  console.log("[reuse-draft] no matching candidates");
  process.exit(0);
}

for (const item of items) await generate(item);
writeBacklog(backlog);
console.log(`[reuse-draft] processed ${items.length} item(s)`);

async function generate(item) {
  const dir = path.join(OUT, item.id);
  fs.mkdirSync(dir, { recursive: true });
  const file = outputFileFor(item.type);
  const outPath = path.join(dir, file);
  const context = buildContext(item);
  let body;
  if (item.type === "blog") {
    body = blogWorkflowNote(item, context);
  } else if (!process.env.OPENAI_API_KEY) {
    body = draftRequest(item, context);
  } else {
    try {
      body = sanitizeDraft(await callOpenAI(item, context));
    } catch (error) {
      body = apiErrorDraft(item, context, error);
    }
  }
  fs.writeFileSync(outPath, body.trim() + "\n");
  const rel = path.relative(ROOT, outPath);
  const idx = backlog.findIndex((entry) => entry.id === item.id);
  const updated = {
    ...item,
    draftPath: rel,
    status: item.status === "approved" || item.status === "published" ? item.status : "drafted",
    complianceStatus: item.complianceStatus || "not_submitted",
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) backlog[idx] = updated;
  Object.assign(item, updated);
  console.log(`[reuse-draft] ${item.id} -> ${rel}`);
}

function ensureBacklog() {
  if (fs.existsSync(BACKLOG)) return;
  const r1 = spawnSync("node", ["scripts/build-content-index.mjs"], { cwd: ROOT, encoding: "utf8" });
  if (r1.status !== 0) throw new Error((r1.stdout || "") + (r1.stderr || ""));
  const r2 = spawnSync("node", ["scripts/build-reuse-backlog.mjs"], { cwd: ROOT, encoding: "utf8" });
  if (r2.status !== 0) throw new Error((r2.stdout || "") + (r2.stderr || ""));
}

function buildContext(item) {
  const transcriptJson = readJson(path.join(ROOT, item.transcriptPath || ""), {});
  const transcript = normalize(transcriptJson.text || (transcriptJson.segments || []).map((s) => s.text).join(" "));
  const socialPack = read(path.join(ROOT, item.sourceOutputPaths?.socialPack || `output/${item.sourceVideo}/social-pack.md`));
  const contentLog = readJson(path.join(ROOT, item.sourceOutputPaths?.contentLog || `output/${item.sourceVideo}/content-log.json`), {});
  const docs = [
    ["OPERATING-BRIEF.md", read(path.join(ROOT, "OPERATING-BRIEF.md"))],
    ["DRAFTING-PLAYBOOK.md", read(path.join(ROOT, "DRAFTING-PLAYBOOK.md"))],
    ["BLOG-RESOURCE-BLUEPRINT.md", read(path.join(ROOT, "BLOG-RESOURCE-BLUEPRINT.md"))],
    ["PHASE2-OUTPUT-MAP.md", read(path.join(ROOT, "PHASE2-OUTPUT-MAP.md"))],
    ["PIPELINE-STATUS.md", read(path.join(ROOT, "PIPELINE-STATUS.md"))],
    ["voice-guide.md", read(path.join(SITE, "docs/knowledge/voice-guide.md"))],
    ["point-of-view-map.md", read(path.join(SITE, "docs/knowledge/point-of-view-map.md"))],
    ["interpretation-layer.md", read(path.join(SITE, "docs/knowledge/interpretation-layer.md"))],
    ["compliance-and-disclaimers.md", read(path.join(SITE, "docs/knowledge/compliance-and-disclaimers.md"))],
  ].filter(([, body]) => body.trim()).map(([title, body]) => `## ${title}\n${body.slice(0, 9000)}`).join("\n\n");
  return { transcript, socialPack, contentLog, docs };
}

async function callOpenAI(item, context) {
  const prompt = `You are drafting a local, review-gated reuse artifact for Talley Wealth.

Rules:
- Nothing is being published. Write a local markdown draft only.
- Write in David Talley's voice: warm, direct, plain English, not salesy.
- No em dashes and no exclamation points.
- Do not use banned claims: fee-only, no commissions, no product sales, guaranteed outcomes, best advisor, beats the market, eliminates risk.
- Hedge planning/tax/legal claims with may, might, could, can help evaluate, can model, can coordinate.
- Include a practical compliance notes section at the end.
- Do not invent citations, client facts, or live URLs.
- Landing page output must be a brief, not finished page copy.
- One-pager output should be markdown first, not a designed PDF.
- Website snippet packet should preserve reusable David language, possible FAQ copy, page-section ideas, internal-link suggestions, and candidate fit.
- Email planning note should be selective and plain-English.
- Video explainer page output should be a rich resource page draft, not a blog post and not a live page. Use a human/problem-based title, answer-first opening, what you will learn, story/teaching sections from the transcript, examples or a classroom version when useful, try-it prompts when useful, FAQ, glossary only if useful, transcript, related resources or next step CTA, and reuse notes. Preserve David's point of view from the transcript and do not turn it into generic advisor SEO copy.
- When useful, include a short "Timestamped source moments" section with 1 to 3 moments. Each moment should include timestamp, question or label, 1 to 2 sentence answer, and a short source line. Use these sparingly for the source video moments that clarify an FAQ or major decision section, not for decoration.

Reuse item:
${JSON.stringify(item, null, 2)}

Knowledge docs:
${context.docs}

Source content log:
${JSON.stringify(context.contentLog, null, 2)}

Source social pack:
${context.socialPack.slice(0, 10000)}

Transcript:
${context.transcript.slice(0, 16000)}

Return only the markdown draft for this reuse type: ${item.type}.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1",
      input: prompt,
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}: ${text.slice(0, 1200)}`);
  const json = JSON.parse(text);
  const draft = json.output_text || collectOutputText(json);
  if (!draft.trim()) throw new Error("OpenAI returned no draft text");
  return draft;
}

function draftRequest(item, context) {
  return `# Draft Request: ${item.title}

Reuse item: \`${item.id}\`
Type: ${item.typeLabel || item.type}
Source video: ${item.sourceVideo}

OPENAI_API_KEY is not set, so no AI reuse draft was generated.

To generate this later:

\`\`\`bash
cd ${ROOT}
node scripts/generate-reuse-draft.mjs ${item.id}
\`\`\`

## Recommendation

${item.recommendationReason || "No recommendation reason recorded."}

## Source Lines

${(item.sourceLines || []).map((line) => `- ${line.text}`).join("\n") || "- None captured."}

## Transcript Path

\`${item.transcriptPath}\`

## Compliance Notes

- This is a draft request only.
- Any website, blog, one-pager, or email output needs human review before use.
- Website-bound material should go through the Cambridge PDF approval workflow before publishing.

## Transcript Excerpt

${context.transcript.slice(0, 3000)}
`;
}

function apiErrorDraft(item, context, error) {
  return `# Draft Blocked: ${item.title}

Reuse item: \`${item.id}\`
Type: ${item.typeLabel || item.type}
Source video: ${item.sourceVideo}

The local reuse generator reached the AI drafting step but could not complete it.

## Error

\`\`\`
${String(error?.message || error)}
\`\`\`

## Rerun

\`\`\`bash
cd ${ROOT}
node scripts/generate-reuse-draft.mjs ${item.id}
\`\`\`

## Compliance Notes

- Nothing was published or sent.
- Review any future generated draft before use.

## Transcript Excerpt

${context.transcript.slice(0, 3000)}
`;
}

function blogWorkflowNote(item, context) {
  return `# Blog Candidate: ${item.title}

Source video: ${item.sourceVideo}
Reuse item: \`${item.id}\`

This item is in the reuse queue because the routing layer recommended a blog. Blog drafting is still handled by the existing video workflow and lives at:

\`${item.sourceOutputPaths?.blogDraft || `output/${item.sourceVideo}/blog-draft.md`}\`

## Recommendation

${item.recommendationReason || "No recommendation reason recorded."}

## Suggested Next Step

- If a blog draft already exists, stage it with \`scripts/stage-blog.mjs ${item.sourceVideo}\`.
- If no blog draft exists, rerun or upgrade the existing blog workflow for this source video.
- Generate the webpage PDF for Cambridge review before publishing.

## Source Lines

${(item.sourceLines || []).map((line) => `- ${line.text}`).join("\n") || "- None captured."}

## Compliance Notes

- This is a local workflow note, not a published blog.
- Website-bound content requires review and Cambridge PDF approval before it goes live.

## Transcript Excerpt

${context.transcript.slice(0, 3000)}
`;
}

function outputFileFor(type) {
  return {
    video_explainer_page: "video-explainer-page.md",
    landing_page_brief: "landing-page-brief.md",
    learning_center_faq: "learning-center-faq-draft.md",
    one_pager: "one-pager-draft.md",
    email_planning_note: "email-planning-note.md",
    website_reuse_snippet: "website-snippet-packet.md",
    blog: "blog-workflow-note.md",
  }[type] || "reuse-draft.md";
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

function sanitizeDraft(text) {
  let out = String(text || "").trim();
  const fence = out.match(/^```(?:markdown|md)?\s*([\s\S]*?)\s*```$/i);
  if (fence) out = fence[1].trim();
  return out
    .replace(/[\u2014\u2013]/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,(\S)/g, ", $1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n {1,}/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function valueAfter(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : "";
}
function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }
function readJson(p, fallback) { try { return JSON.parse(read(p)); } catch { return fallback; } }
function writeBacklog(items) { fs.writeFileSync(BACKLOG, JSON.stringify(items, null, 2)); }
function normalize(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of read(file).split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
