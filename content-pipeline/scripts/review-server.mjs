// review-server.mjs
// A small local web app for reviewing and approving content. No external deps.
// Open http://localhost:4505 . Approve persists to approvals.json. The cover toggle
// regenerates a video's cover (smart frame or title card). "Build draft schedule"
// runs the scheduler, dry-run payload builder, and R2 media staging. "Schedule live"
// is a separate confirmed action guarded by METRICOOL_LIVE_WRITE.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { renderReviewPage } from "./review-page-template.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const QUEUE = path.join(ROOT, "approval-queue");
const APPROVALS = path.join(ROOT, "approvals.json");
const ASSET_DECISIONS = path.join(ROOT, "asset-decisions.json");
const REUSE_BACKLOG = path.join(ROOT, "reuse-backlog.json");
const BLOG_COMPANION_PROMPTS = path.join(ROOT, "blog-companion-prompts.json");
const BLOG_COMPANION_RECORDINGS = path.join(ROOT, "blog-companion-recordings.json");
const GENERATED_BLOG_POSTS = path.join(path.resolve(ROOT, ".."), "src", "data", "talley-wealth", "generated-blog-posts.ts");
const CONTENT_INDEX = path.join(ROOT, "content-index.json");
const DISTRIBUTION_ROUTING = path.join(ROOT, "distribution-routing.json");
const DISTRIBUTION_PROPERTIES = path.join(ROOT, "distribution-properties.json");
const SOCIAL_LEDGER = path.join(ROOT, "social-surface-ledger.csv");
const CHAT_DIR = path.join(ROOT, "asset-chats");
const PREFERENCES = path.join(ROOT, "content-preferences.md");
const FAILED_DIR = path.join(ROOT, "work", ".failed");
const FAILURE_THUMB_DIR = path.join(ROOT, "work", "failure-thumbs");
const FAILED_OUTPUT_DIR = path.join(ROOT, "work", ".failed-output");
const METRICOOL_ENGINE = path.join(ROOT, "work", "metricool-engine.json");
const METRICOOL_SHADOW_REROUTE = path.join(ROOT, "work", "metricool-shadow-reroute.json");
const REPURPOSE_SEED_PLAN = path.join(ROOT, "work", "repurpose-seed-plan.json");
const SCHEDULE_JOB = path.join(ROOT, "work", "schedule-job.json");
const PORT = 4505;
const mediaPrepRunning = new Set();
let scheduleJobRunning = false;

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(path.resolve(ROOT, ".."), ".env.local"));
const loadApprovals = () => new Set(fs.existsSync(APPROVALS) ? JSON.parse(read(APPROVALS)) : []);
const saveApprovals = (set) => fs.writeFileSync(APPROVALS, JSON.stringify([...set], null, 2));
const loadAssetDecisions = () => fs.existsSync(ASSET_DECISIONS) ? JSON.parse(read(ASSET_DECISIONS)) : {};
const saveAssetDecisions = (obj) => fs.writeFileSync(ASSET_DECISIONS, JSON.stringify(obj, null, 2));
const loadReuseBacklog = () => fs.existsSync(REUSE_BACKLOG) ? JSON.parse(read(REUSE_BACKLOG)) : [];
const saveReuseBacklog = (items) => fs.writeFileSync(REUSE_BACKLOG, JSON.stringify(items, null, 2));
const loadGeneratedBlogPosts = () => {
  const text = read(GENERATED_BLOG_POSTS);
  const match = text.match(/export const generatedBlogPosts[^=]*=\s*(\[[\s\S]*\]);/);
  if (!match) return [];
  try { return JSON.parse(match[1]); } catch (_) { return []; }
};
const saveGeneratedBlogPosts = (posts) => {
  fs.writeFileSync(GENERATED_BLOG_POSTS, `import type { BlogPost } from './site-content';

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
})[] = ${JSON.stringify(posts, null, 2)};
`);
};
const chatPath = (name) => path.join(CHAT_DIR, `${safeName(name)}.json`);
const loadAssetChat = (name) => readJson(chatPath(name), { name, messages: [] });
const saveAssetChat = (name, chat) => {
  fs.mkdirSync(CHAT_DIR, { recursive: true });
  fs.writeFileSync(chatPath(name), JSON.stringify(chat, null, 2));
};
const readJson = (p, fallback = null) => {
  try { return JSON.parse(read(p)); } catch (_) { return fallback; }
};
function runStep(command, args, options = {}) {
  const r = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, ...(options.env || {}) },
  });
  return {
    ok: r.status === 0,
    status: r.status,
    command: [command, ...args].join(" "),
    output: ((r.stdout || "") + (r.stderr || "")).trim(),
  };
}

function runStepAsync(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, ...(options.env || {}) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const append = (chunk) => {
      output = (output + chunk.toString()).slice(-12000);
    };
    child.stdout.on("data", append);
    child.stderr.on("data", append);
    child.on("error", (err) => resolve({
      ok: false,
      status: 1,
      command: [command, ...args].join(" "),
      output: err.message,
    }));
    child.on("close", (status) => resolve({
      ok: status === 0,
      status,
      command: [command, ...args].join(" "),
      output: output.trim(),
    }));
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPreviewUrl(url, { timeoutMs = 12000, intervalMs = 500 } = {}) {
  if (!url) return { ok: false, waitedMs: 0, status: 0, summary: "No preview URL returned" };
  const startedAt = Date.now();
  let lastStatus = 0;
  let lastError = "";
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET", redirect: "manual" });
      lastStatus = response.status;
      if (response.status >= 200 && response.status < 300) {
        return { ok: true, waitedMs: Date.now() - startedAt, status: response.status };
      }
    } catch (error) {
      lastError = error?.message || String(error);
    }
    await sleep(intervalMs);
  }
  return {
    ok: false,
    waitedMs: Date.now() - startedAt,
    status: lastStatus,
    summary: lastStatus ? `Preview route returned ${lastStatus}` : lastError || "Preview route did not respond",
  };
}

function readScheduleJob() {
  return readJson(SCHEDULE_JOB, { status: "idle", steps: [] });
}

function writeScheduleJob(job) {
  fs.mkdirSync(path.dirname(SCHEDULE_JOB), { recursive: true });
  fs.writeFileSync(SCHEDULE_JOB, JSON.stringify(job, null, 2));
}

function scheduleSteps(live) {
  const steps = [
    { id: "status", label: "Check Metricool connection", command: "node", args: ["scripts/sync-metricool-status.mjs"] },
    { id: "list", label: "Refresh Metricool planner", command: "node", args: ["scripts/metricool-live.mjs", "--list"] },
    { id: "engine-before", label: "Reconcile local planner", command: "node", args: ["scripts/sync-metricool-engine.mjs"] },
    { id: "schedule", label: "Build schedule", command: "node", args: ["scripts/schedule.mjs"] },
    { id: "media", label: "Prepare scheduled media", command: "node", args: ["scripts/prepare-scheduled-media.mjs"] },
    { id: "payloads", label: "Build Metricool payloads", command: "node", args: ["scripts/metricool-dry-run.mjs"] },
    { id: "upload", label: "Upload media to R2", command: "node", args: ["scripts/upload-metricool-media-r2.mjs"] },
  ];
  if (live) {
    steps.push({
      id: "write",
      label: "Schedule in Metricool",
      command: "node",
      args: ["scripts/metricool-live.mjs", "--from-schedule", "--include-media", "--publishable", "--confirm-live", "--max=all"],
      env: { METRICOOL_LIVE_WRITE: "true" },
    });
    steps.push({ id: "verify-list", label: "Verify Metricool planner", command: "node", args: ["scripts/metricool-live.mjs", "--list"] });
  }
  steps.push({ id: "engine-after", label: "Refresh Marketing Engine", command: "node", args: ["scripts/sync-metricool-engine.mjs"] });
  steps.push({ id: "content-index", label: "Refresh content inventory", command: "node", args: ["scripts/build-content-index.mjs"] });
  return steps;
}

function summarizeScheduleJob(job, live) {
  const steps = job.steps || [];
  const failed = steps.find((step) => step.status === "failed");
  if (failed) return `Stopped at ${failed.label}: ${(failed.output || "failed").slice(0, 180)}`;
  const write = steps.find((step) => step.id === "write")?.output || "";
  const writeSummary = (write.match(/\[metricool-live\].*/) || [null])[0];
  if (writeSummary) return writeSummary;
  const schedule = steps.find((step) => step.id === "schedule")?.output || "";
  const scheduleSummary = (schedule.match(/\[schedule\].*placed.*/) || [null])[0];
  const upload = steps.find((step) => step.id === "upload")?.output || "";
  const uploadSummary = (upload.match(/\[r2\].*file\(s\).*/) || [null])[0];
  return [scheduleSummary || "Posting plan built", uploadSummary || "Media checked", live ? "Metricool write complete" : "Metricool live write skipped"].join(" | ");
}

function startScheduleJob({ live }) {
  const existing = readScheduleJob();
  if (scheduleJobRunning) return existing;
  if (existing.status === "running") {
    existing.status = "failed";
    existing.completedAt = new Date().toISOString();
    existing.current = "Previous scheduling job was interrupted";
    existing.summary = "The previous scheduling job was interrupted before it finished. Start it again when ready.";
    writeScheduleJob(existing);
  }
  const steps = scheduleSteps(live).map((step) => ({ ...step, status: "pending", output: "" }));
  const job = {
    id: `${Date.now()}`,
    mode: live ? "live" : "plan",
    status: "running",
    startedAt: new Date().toISOString(),
    completedAt: "",
    current: "Starting",
    summary: live ? "Scheduling approved assets in Metricool..." : "Building posting plan...",
    steps,
  };
  writeScheduleJob(job);
  scheduleJobRunning = true;
  (async () => {
    const working = readScheduleJob();
    try {
      for (let i = 0; i < working.steps.length; i += 1) {
        working.steps[i].status = "running";
        working.steps[i].startedAt = new Date().toISOString();
        working.current = working.steps[i].label;
        writeScheduleJob(working);
        const step = working.steps[i];
        const result = await runStepAsync(step.command, step.args, { env: step.env || {} });
        working.steps[i] = {
          ...step,
          status: result.ok ? "complete" : "failed",
          completedAt: new Date().toISOString(),
          output: result.output,
          command: result.command,
          exitStatus: result.status,
        };
        working.current = result.ok ? `${step.label} complete` : `${step.label} failed`;
        writeScheduleJob(working);
        if (!result.ok) throw new Error(result.output || `${step.label} failed`);
      }
      working.status = "complete";
      working.completedAt = new Date().toISOString();
      working.current = live ? "Scheduled in Metricool" : "Posting plan ready";
      working.summary = summarizeScheduleJob(working, live);
      writeScheduleJob(working);
    } catch (err) {
      working.status = "failed";
      working.completedAt = new Date().toISOString();
      working.summary = err.message || "Scheduling job failed";
      writeScheduleJob(working);
    } finally {
      scheduleJobRunning = false;
    }
  })();
  return job;
}

function preRenderApprovedMedia(name) {
  const safe = safeName(name);
  if (!safe || mediaPrepRunning.has(safe)) return;
  const dir = path.join(ROOT, "output", safe);
  if (!fs.existsSync(dir)) return;
  mediaPrepRunning.add(safe);
  fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
  const logPath = path.join(ROOT, "work", "scheduled-media-prerender.log");
  const fd = fs.openSync(logPath, "a");
  const child = spawn("node", ["scripts/prepare-scheduled-media.mjs", safe], {
    cwd: ROOT,
    stdio: ["ignore", fd, fd],
  });
  child.on("close", () => {
    mediaPrepRunning.delete(safe);
    try { fs.closeSync(fd); } catch (_) {}
  });
  child.on("error", () => {
    mediaPrepRunning.delete(safe);
    try { fs.closeSync(fd); } catch (_) {}
  });
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

function safeName(name) {
  return String(name || "asset").replace(/[^A-Za-z0-9_-]/g, "_");
}

function resolveSourcePath(source) {
  if (!source) return "";
  return path.isAbsolute(source) ? source : path.resolve(ROOT, source);
}

function relativeToRoot(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = n;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size >= 10 || unit === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[unit]}`;
}

function formatDuration(seconds) {
  const n = Number(seconds || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  const mins = Math.floor(n / 60);
  const secs = Math.round(n % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function probeVideo(file) {
  if (!file || !fs.existsSync(file)) return {};
  const r = spawnSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration,size",
    "-of", "json",
    file,
  ], { encoding: "utf8", timeout: 5000 });
  if (r.status !== 0) return {};
  try {
    const parsed = JSON.parse(r.stdout || "{}");
    const stream = parsed.streams?.[0] || {};
    return {
      duration: formatDuration(parsed.format?.duration),
      width: stream.width || "",
      height: stream.height || "",
      size: formatBytes(parsed.format?.size),
    };
  } catch (_) {
    return {};
  }
}

function ensureFailureThumb(name, sourceFile) {
  const safe = safeName(name);
  const preferred = [
    path.join(ROOT, "output", safe, "cover.jpg"),
    path.join(ROOT, "output", safe, "cover-smart.jpg"),
    path.join(ROOT, "output", safe, "cover-source.jpg"),
    path.join(FAILED_OUTPUT_DIR, safe, "cover.jpg"),
    path.join(FAILED_OUTPUT_DIR, safe, "cover-smart.jpg"),
    path.join(FAILED_OUTPUT_DIR, safe, "cover-source.jpg"),
  ].find((file) => fs.existsSync(file));
  if (preferred) return relativeToRoot(preferred);

  const debugDir = path.join(ROOT, "work", "debug-frames");
  if (fs.existsSync(debugDir)) {
    const debugFrame = fs.readdirSync(debugDir)
      .filter((file) => file.startsWith(`${safe}-`) && /\.(jpe?g|png)$/i.test(file))
      .sort()[0];
    if (debugFrame) return relativeToRoot(path.join(debugDir, debugFrame));
  }

  if (!sourceFile || !fs.existsSync(sourceFile)) return "";
  fs.mkdirSync(FAILURE_THUMB_DIR, { recursive: true });
  const out = path.join(FAILURE_THUMB_DIR, `${safe}.jpg`);
  if (!fs.existsSync(out)) {
    spawnSync("ffmpeg", [
      "-y",
      "-ss", "00:00:01",
      "-i", sourceFile,
      "-frames:v", "1",
      "-vf", "scale=420:-1",
      out,
    ], { encoding: "utf8", timeout: 12000 });
  }
  return fs.existsSync(out) ? relativeToRoot(out) : "";
}

function partialArtifact(name, label, relPath) {
  const file = path.join(ROOT, relPath);
  return fs.existsSync(file) ? { label, path: relPath.replaceAll(path.sep, "/") } : null;
}

function failedOutputArtifact(name, label, childPath) {
  const relPath = path.join("work", ".failed-output", safeName(name), childPath);
  return partialArtifact(name, label, relPath);
}

function transcriptSnippet(name) {
  const audio = readJson(path.join(ROOT, "work", safeName(name), "audio.json"), null);
  const text = String(audio?.text || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 260) : "";
}

function makeChatAssistantMessage(assetName, message) {
  const lower = String(message || "").toLowerCase();
  let target = "the asset family";
  if (lower.includes("title") || lower.includes("hook") || lower.includes("cover")) target = "the title/cover";
  else if (lower.includes("linkedin")) target = "the LinkedIn caption";
  else if (lower.includes("instagram") || lower.includes("reel")) target = "the Instagram/Reels copy";
  else if (lower.includes("x ") || lower.includes("twitter") || lower.includes("thread")) target = "the X thread/extras";
  else if (lower.includes("blog") || lower.includes("long-form") || lower.includes("long form")) target = "the long-form draft";
  else if (lower.includes("carousel")) target = "the carousel";
  const preferenceCandidate = preferenceFromMessage(message);
  const content = [
    `Logged for ${assetName}.`,
    `Likely target: ${target}.`,
    "For now this note is review guidance; it does not rewrite or publish anything automatically.",
    preferenceCandidate ? "This also looks reusable as a future content preference. Use Promote as preference if you want it to affect later drafts." : "",
  ].filter(Boolean).join(" ");
  return { role: "assistant", content, preferenceCandidate, createdAt: new Date().toISOString() };
}

async function makeActionableChatMessage(assetName, message) {
  const preferenceCandidate = preferenceFromMessage(message);
  const fallback = makeChatAssistantMessage(assetName, message);
  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    return {
      ...fallback,
      content: fallback.content + " OPENAI_API_KEY is not set, so I saved the note but could not draft editable suggestions.",
      suggestions: [],
    };
  }
  try {
    const context = buildEditContext(assetName);
    const raw = await callOpenAIForEdits({
      apiKey,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      prompt: editPrompt(assetName, message, context),
    });
    const parsed = JSON.parse(raw);
    const suggestions = normalizeSuggestions(parsed.suggestions, context);
    const summary = parsed.summary || (suggestions.length ? `I found ${suggestions.length} local edit suggestion(s). Review and apply only the ones you want.` : "I saved the note, but I do not see a safe local edit to apply automatically.");
    return {
      role: "assistant",
      content: summary,
      preferenceCandidate,
      suggestions,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ...fallback,
      content: fallback.content + ` I tried to draft editable suggestions, but the local edit assistant failed: ${err.message}`,
      suggestions: [],
    };
  }
}

function buildEditContext(assetName) {
  const name = safeName(assetName);
  const dir = path.join(OUT, name);
  const socialPack = read(path.join(dir, "social-pack.md"));
  const contentLog = readJson(path.join(dir, "content-log.json"), {});
  const xPack = readJson(path.join(dir, "x-pack.json"), {});
  const carousel = readJson(path.join(dir, "carousel", "slides.json"), []);
  const blogDraft = read(path.join(dir, "blog-draft.md"));
  const transcript = transcriptText(readJson(path.join(ROOT, "work", name, "audio.json"), {}));
  return {
    name,
    title: contentLog.title || titleHook(name) || name,
    social: parseSocial(socialPack),
    xPack,
    carousel: Array.isArray(carousel) ? carousel : [],
    blogDraft: blogDraft.slice(0, 12000),
    transcript: transcript.slice(0, 12000),
    files: {
      socialPack: fs.existsSync(path.join(dir, "social-pack.md")),
      contentLog: fs.existsSync(path.join(dir, "content-log.json")),
      xPack: fs.existsSync(path.join(dir, "x-pack.json")),
      carousel: fs.existsSync(path.join(dir, "carousel", "slides.json")),
      blogDraft: fs.existsSync(path.join(dir, "blog-draft.md")),
    },
  };
}

function transcriptText(audio) {
  if (!audio) return "";
  if (typeof audio.text === "string") return audio.text;
  if (Array.isArray(audio.segments)) return audio.segments.map((s) => s.text || "").join(" ").replace(/\s+/g, " ").trim();
  return "";
}

function editPrompt(assetName, userMessage, context) {
  return `You are the local edit assistant for the Talley Wealth content review app.
The user is asking for a tweak to one generated content asset. Return JSON only.

Safety:
- Do not post, schedule, upload, or publish.
- Do not suggest edits that make performance guarantees, personalized advice, or compliance claims.
- Keep Talley Wealth voice: plain-English, planning-first, human, direct, not hypey.
- Do not add "thanks for watching" style filler.
- Prefer small targeted edits over rewriting everything.

Supported suggestion types:
- content_title: replacement updates content-log title, Social Pack title, X title, carousel cover headline, and active cover.
- social_section: section must be one of LinkedIn, Instagram, Facebook, X / Twitter (thread), Short caption (for the captioned Reel/Short itself), Google Business Profile, YouTube.
- carousel_slide: slideIndex is 1-based, field is one of eyebrow, headline, body, number, numberCaption, quote, attribution, ctaPrimary, ctaSecondary.
- x_thread: index is 0-based.
- x_standalone: index is 0-based.
- blog_draft: replacement is the full revised blog draft.

Return shape:
{
  "summary": "short response to David",
  "suggestions": [
    {
      "type": "social_section | content_title | carousel_slide | x_thread | x_standalone | blog_draft",
      "title": "button/display title",
      "target": "human-readable target",
      "section": "only for social_section",
      "slideIndex": 1,
      "field": "headline",
      "index": 0,
      "current": "exact current text if practical",
      "replacement": "new text",
      "rationale": "why this helps"
    }
  ]
}

User request:
${userMessage}

Asset context:
${JSON.stringify(context, null, 2).slice(0, 26000)}
`;
}

async function callOpenAIForEdits({ apiKey, model, prompt }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, input: prompt, text: { format: { type: "json_object" } } }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}: ${body.slice(0, 500)}`);
  const json = JSON.parse(body);
  return json.output_text || collectOutputText(json) || body;
}

function collectOutputText(value) {
  const found = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.text === "string" && (node.type === "output_text" || node.type === "text")) found.push(node.text);
    if (typeof node.output_text === "string") found.push(node.output_text);
    for (const v of Object.values(node)) {
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === "object") visit(v);
    }
  };
  visit(value);
  return found.join("\n").trim();
}

function normalizeSuggestions(input, context) {
  const allowedSocial = new Set([
    "LinkedIn",
    "Instagram",
    "Facebook",
    "X / Twitter (thread)",
    "Short caption (for the captioned Reel/Short itself)",
    "Google Business Profile",
    "YouTube",
  ]);
  const allowedSlideFields = new Set(["eyebrow", "headline", "body", "number", "numberCaption", "quote", "attribution", "ctaPrimary", "ctaSecondary"]);
  return (Array.isArray(input) ? input : [])
    .map((s, index) => ({ ...s, id: `s${Date.now()}_${index}` }))
    .filter((s) => s && typeof s.replacement === "string" && s.replacement.trim())
    .filter((s) => {
      if (s.type === "content_title") return context.files.contentLog || context.files.socialPack || context.files.carousel;
      if (s.type === "social_section") return context.files.socialPack && allowedSocial.has(s.section);
      if (s.type === "carousel_slide") return context.files.carousel && Number.isInteger(Number(s.slideIndex)) && allowedSlideFields.has(s.field);
      if (s.type === "x_thread") return context.files.xPack && Number.isInteger(Number(s.index));
      if (s.type === "x_standalone") return context.files.xPack && Number.isInteger(Number(s.index));
      if (s.type === "blog_draft") return context.files.blogDraft;
      return false;
    })
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      type: s.type,
      title: String(s.title || labelForSuggestion(s)).slice(0, 100),
      target: String(s.target || labelForSuggestion(s)).slice(0, 140),
      section: s.section || "",
      slideIndex: s.slideIndex ? Number(s.slideIndex) : null,
      field: s.field || "",
      index: Number.isInteger(Number(s.index)) ? Number(s.index) : null,
      current: String(s.current || "").slice(0, 4000),
      replacement: String(s.replacement || "").trim(),
      rationale: String(s.rationale || "").slice(0, 1000),
      appliedAt: "",
    }));
}

function labelForSuggestion(s) {
  if (s.type === "content_title") return "Replace title / cover hook";
  if (s.type === "social_section") return `Replace ${s.section}`;
  if (s.type === "carousel_slide") return `Replace carousel slide ${s.slideIndex} ${s.field}`;
  if (s.type === "x_thread") return `Replace X thread post ${Number(s.index) + 1}`;
  if (s.type === "x_standalone") return `Replace X extra ${Number(s.index) + 1}`;
  if (s.type === "blog_draft") return "Replace blog draft";
  return "Apply edit";
}

function applySuggestionToAsset(assetName, suggestion) {
  const name = safeName(assetName);
  const dir = path.join(OUT, name);
  const changed = [];
  if (!fs.existsSync(dir)) throw new Error(`No output folder for ${name}`);

  if (suggestion.type === "content_title") {
    const title = suggestion.replacement.trim();
    const logPath = path.join(dir, "content-log.json");
    const log = readJson(logPath, {});
    if (log && typeof log === "object") {
      log.title = title;
      log.targetQueryOrTopic = title;
      fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
      changed.push("content-log.json");
    }
    const socialPath = path.join(dir, "social-pack.md");
    if (fs.existsSync(socialPath)) {
      fs.writeFileSync(socialPath, replaceFrontMatterLine(read(socialPath), "Title", title));
      changed.push("social-pack.md");
    }
    const xPath = path.join(dir, "x-pack.json");
    const xPack = readJson(xPath, null);
    if (xPack) {
      xPack.title = title;
      fs.writeFileSync(xPath, JSON.stringify(xPack, null, 2));
      fs.writeFileSync(path.join(dir, "x-pack.md"), xPackMarkdown(name, xPack));
      changed.push("x-pack.json", "x-pack.md");
    }
    const slidesPath = path.join(dir, "carousel", "slides.json");
    const slides = readJson(slidesPath, null);
    if (Array.isArray(slides) && slides[0]) {
      slides[0].headline = title;
      fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2));
      changed.push("carousel/slides.json");
      rerenderCarousel(name);
      changed.push("carousel/*.png");
    }
    rerenderCover(name);
    changed.push("cover.jpg");
    refreshIndexes();
    return changed;
  }

  if (suggestion.type === "social_section") {
    const socialPath = path.join(dir, "social-pack.md");
    fs.writeFileSync(socialPath, replaceMarkdownSection(read(socialPath), suggestion.section, suggestion.replacement.trim()));
    changed.push("social-pack.md");
    return changed;
  }

  if (suggestion.type === "carousel_slide") {
    const slidesPath = path.join(dir, "carousel", "slides.json");
    const slides = readJson(slidesPath, []);
    const i = Number(suggestion.slideIndex) - 1;
    if (!slides[i]) throw new Error(`Carousel slide ${suggestion.slideIndex} not found`);
    slides[i][suggestion.field] = suggestion.replacement.trim();
    fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2));
    changed.push("carousel/slides.json");
    rerenderCarousel(name);
    changed.push("carousel/*.png");
    if (i === 0 && suggestion.field === "headline") {
      rerenderCover(name);
      changed.push("cover.jpg");
    }
    return changed;
  }

  if (suggestion.type === "x_thread" || suggestion.type === "x_standalone") {
    const xPath = path.join(dir, "x-pack.json");
    const pack = readJson(xPath, null);
    if (!pack) throw new Error("x-pack.json not found");
    const key = suggestion.type === "x_thread" ? "thread" : "standalone";
    pack[key] ??= [];
    const i = Number(suggestion.index);
    if (!pack[key][i]) throw new Error(`${key} item ${i + 1} not found`);
    pack[key][i] = suggestion.replacement.trim();
    fs.writeFileSync(xPath, JSON.stringify(pack, null, 2));
    fs.writeFileSync(path.join(dir, "x-pack.md"), xPackMarkdown(name, pack));
    changed.push("x-pack.json", "x-pack.md");
    return changed;
  }

  if (suggestion.type === "blog_draft") {
    fs.writeFileSync(path.join(dir, "blog-draft.md"), suggestion.replacement.trim() + "\n");
    changed.push("blog-draft.md");
    const pageMeta = path.join(dir, "blog-page.json");
    if (fs.existsSync(pageMeta)) {
      const r = runStep("node", ["scripts/stage-blog.mjs", name]);
      if (!r.ok) throw new Error(r.output || "Blog restage failed");
      changed.push("blog-page.json");
    }
    refreshIndexes();
    return changed;
  }

  throw new Error(`Unsupported suggestion type: ${suggestion.type}`);
}

function snapshotForSuggestion(assetName, suggestion) {
  const name = safeName(assetName);
  const rels = filesForSuggestionSnapshot(name, suggestion);
  return {
    createdAt: new Date().toISOString(),
    files: rels.map((rel) => {
      const file = path.join(ROOT, rel);
      return {
        rel,
        existed: fs.existsSync(file),
        content: fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "",
      };
    }),
  };
}

function filesForSuggestionSnapshot(name, suggestion) {
  const base = `output/${name}`;
  if (suggestion.type === "content_title") {
    return [
      `${base}/content-log.json`,
      `${base}/social-pack.md`,
      `${base}/x-pack.json`,
      `${base}/x-pack.md`,
      `${base}/carousel/slides.json`,
    ];
  }
  if (suggestion.type === "social_section") return [`${base}/social-pack.md`];
  if (suggestion.type === "carousel_slide") return [`${base}/carousel/slides.json`];
  if (suggestion.type === "x_thread" || suggestion.type === "x_standalone") return [`${base}/x-pack.json`, `${base}/x-pack.md`];
  if (suggestion.type === "blog_draft") return [`${base}/blog-draft.md`];
  return [];
}

function undoSuggestionForAsset(assetName, suggestion) {
  const name = safeName(assetName);
  const undo = suggestion.undo;
  if (!undo || !Array.isArray(undo.files)) throw new Error("No undo snapshot saved for this edit");
  const restored = [];
  for (const file of undo.files) {
    if (!file?.rel || !file.rel.startsWith(`output/${name}/`)) continue;
    const target = path.join(ROOT, file.rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (file.existed) {
      fs.writeFileSync(target, String(file.content || ""));
      restored.push(file.rel);
    } else if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      restored.push(file.rel);
    }
  }
  if (suggestion.type === "content_title" || suggestion.type === "carousel_slide") {
    if (fs.existsSync(path.join(ROOT, "output", name, "carousel", "slides.json"))) rerenderCarousel(name);
    rerenderCover(name);
  }
  if (suggestion.type === "blog_draft" && fs.existsSync(path.join(ROOT, "output", name, "blog-page.json"))) {
    const r = runStep("node", ["scripts/stage-blog.mjs", name]);
    if (!r.ok) throw new Error(r.output || "Blog restage failed");
  }
  refreshIndexes();
  return restored;
}

function replaceFrontMatterLine(md, label, value) {
  const re = new RegExp(`^(\\\\*\\\\*${escapeRegex(label)}:\\\\*\\\\*\\\\s*).*$`, "m");
  if (re.test(md)) return md.replace(re, `$1${value}`);
  return md;
}

function replaceMarkdownSection(md, heading, replacement) {
  const escaped = escapeRegex(heading);
  const re = new RegExp(`(^##\\\\s+${escaped}\\\\s*\\n)([\\\\s\\\\S]*?)(?=\\n---\\s*(?:\\n|$)|\\n##\\\\s+|$)`, "m");
  if (!re.test(md)) throw new Error(`Section not found: ${heading}`);
  return md.replace(re, `$1${replacement.trim()}\\n`);
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rerenderCarousel(name) {
  const slides = path.join("output", name, "carousel", "slides.json");
  const out = path.join("output", name, "carousel");
  const r = runStep("node", ["scripts/render-carousel.mjs", slides, out]);
  if (!r.ok) throw new Error(r.output || "Carousel render failed");
}

function rerenderCover(name) {
  const r = runStep("node", ["scripts/finalize-cover.mjs", name]);
  if (!r.ok) throw new Error(r.output || "Cover render failed");
}

function refreshIndexes() {
  runStep("node", ["scripts/build-content-index.mjs"]);
  runStep("node", ["scripts/build-reuse-backlog.mjs"]);
  runStep("node", ["scripts/build-resource-threads.mjs"]);
  runStep("node", ["scripts/build-content-index.mjs"]);
}

function xPackMarkdown(name, pack) {
  const lines = [`# X Pack: ${name}`, "", `Status: ${pack.status || "ready"}`, `Mode: ${pack.mode || "thread"}`, `Title: ${pack.title || name}`];
  if (pack.approvalNote) lines.push("", "## Recommendation", pack.approvalNote);
  if (Array.isArray(pack.thread) && pack.thread.length) {
    lines.push("", "## Thread", ...pack.thread.map((post, i) => `${i + 1}. ${post}`));
  }
  if (Array.isArray(pack.standalone) && pack.standalone.length) {
    lines.push("", "## Standalone X extras", ...pack.standalone.map((post) => `- ${post}`));
  }
  if (Array.isArray(pack.complianceNotes) && pack.complianceNotes.length) {
    lines.push("", "## Compliance notes", ...pack.complianceNotes.map((note) => `- ${note}`));
  }
  return lines.join("\n") + "\n";
}

function preferenceFromMessage(message) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  const reusableSignals = ["always", "never", "default", "prefer", "avoid", "don't", "do not", "from now on", "going forward"];
  if (!reusableSignals.some((signal) => lower.includes(signal))) return "";
  return text.length > 240 ? text.slice(0, 237) + "..." : text;
}

function appendPreference(assetName, preference) {
  const now = new Date().toISOString();
  const header = fs.existsSync(PREFERENCES)
    ? ""
    : "# Content Pipeline Preferences\n\nLocal guidance promoted from asset chats. Review periodically before turning into prompt rules.\n\n";
  fs.writeFileSync(PREFERENCES, header + `- ${now} (${assetName}): ${preference}\n`, { flag: "a" });
}

function parseSocial(md) {
  const out = {};
  const allowed = new Set([
    "LinkedIn",
    "Instagram",
    "Facebook",
    "X / Twitter (thread)",
    "Short caption (for the captioned Reel/Short itself)",
    "Google Business Profile",
    "YouTube",
  ]);
  md.split(/^##\s+/m).slice(1).forEach((part) => {
    const nl = part.indexOf("\n");
    const h = part.slice(0, nl).trim();
    if (!allowed.has(h)) return;
    const body = part.slice(nl + 1).split(/^---/m)[0].trim();
    if (h && body) out[h] = body;
  });
  return out;
}
function titleHook(name) {
  try {
    const slides = JSON.parse(read(path.join(OUT, name, "carousel", "slides.json")));
    const cover = slides.find((s) => s.kind === "cover");
    if (cover?.headline) return cover.headline;
  } catch (_) {}
  try {
    const log = JSON.parse(read(path.join(OUT, name, "content-log.json")));
    if (log.title) return log.title;
  } catch (_) {}
  return "";
}

function scheduleStatusByVideo() {
  const rows = readJson(path.join(ROOT, "schedule.json"), []) || [];
  const ledger = readJson(path.join(ROOT, "work", "metricool-live-ledger.json"), { entries: {} }) || { entries: {} };
  const metricoolEngine = readJson(METRICOOL_ENGINE, { planner: [] }) || { planner: [] };
  const entries = ledger.entries && typeof ledger.entries === "object" ? ledger.entries : {};
  const byVideo = new Map();
  for (const row of rows.filter((row) => row.date !== "OVERFLOW" && row.video)) {
    if (!byVideo.has(row.video)) byVideo.set(row.video, []);
    byVideo.get(row.video).push(row);
  }
  const out = {};
  for (const [name, videoRows] of byVideo.entries()) {
    const confirmed = [];
    const stale = [];
    for (const row of videoRows) {
      const entry = entries[scheduleRowKey(row)];
      if (!entry?.metricoolId) continue;
      if (mediaChangedAfterLedger(row, entry)) stale.push(row);
      else confirmed.push(row);
    }
    if (stale.length) {
      out[name] = { scheduled: false, scheduleStatus: "metricool_media_stale", scheduleStatusLabel: `Metricool draft needs media refresh (${stale.length}/${videoRows.length})` };
    } else if (confirmed.length === videoRows.length && videoRows.length) {
      const hasLive = confirmed.some((row) => {
        const entry = entries[scheduleRowKey(row)];
        return entry?.autoPublish === true && entry?.draft === false;
      });
      out[name] = {
        scheduled: true,
        scheduleStatus: hasLive ? "metricool_live" : "metricool_draft",
        scheduleStatusLabel: hasLive ? "Metricool live scheduled" : "Metricool draft scheduled"
      };
    } else if (confirmed.length > 0) {
      out[name] = { scheduled: false, scheduleStatus: "partial_metricool_draft", scheduleStatusLabel: `Partial Metricool draft (${confirmed.length}/${videoRows.length})` };
    } else {
      out[name] = { scheduled: false, scheduleStatus: "planned_only", scheduleStatusLabel: "Calendar planned, not in Metricool" };
    }
  }
  for (const [name, metricoolRows] of metricoolStatusByVideo(metricoolEngine.planner).entries()) {
    const published = metricoolRows.filter(metricoolItemPublished).length;
    const open = metricoolRows.length - published;
    const platforms = [...new Set(metricoolRows.map((item) => item.platformLabel || item.platform).filter(Boolean))];
    const dates = metricoolRows.map((item) => item.date).filter(Boolean).sort();
    const through = dates.at(-1) || "";
    out[name] = {
      scheduled: true,
      scheduleStatus: open ? "metricool_planner" : "metricool_published",
      scheduleStatusLabel: open
        ? `Metricool scheduled (${metricoolRows.length} posts${through ? ` through ${through}` : ""})`
        : `Metricool handled (${metricoolRows.length} posts)`,
      scheduledAssets: metricoolRows.map((item) => ({
        date: item.date || "",
        time: item.time || "",
        platform: item.platformLabel || item.platform || "",
        asset: item.asset || "",
      })),
      scheduledPlatforms: platforms,
    };
  }
  return out;
}

function metricoolStatusByVideo(planner) {
  const byVideo = new Map();
  for (const item of Array.isArray(planner) ? planner : []) {
    if (!item?.sourceVideo || metricoolItemFailed(item)) continue;
    if (!byVideo.has(item.sourceVideo)) byVideo.set(item.sourceVideo, []);
    byVideo.get(item.sourceVideo).push(item);
  }
  return byVideo;
}

function metricoolItemPublished(item) {
  return /PUBLISHED|PUBLICADO|SENT|DONE/i.test(`${item?.providerStatus || ""} ${item?.detailedStatus || ""}`);
}

function metricoolItemFailed(item) {
  return /FAIL|ERROR|REJECT/i.test(`${item?.providerStatus || ""} ${item?.detailedStatus || ""}`);
}

function mediaChangedAfterLedger(row, entry) {
  if (!["video", "carousel"].includes(row.asset)) return false;
  if (!entry.createdAt) return false;
  const mediaTime = latestMediaMtime(row);
  if (!mediaTime) return false;
  const entryTime = Date.parse(entry.createdAt);
  return Number.isFinite(entryTime) && mediaTime > entryTime + 1000;
}

function latestMediaMtime(row) {
  const dir = path.join(ROOT, "output", row.video);
  if (row.asset === "video") {
    const file = ["scheduled/captioned_with_cover_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"]
      .map((candidate) => path.join(dir, candidate))
      .find((candidate) => fs.existsSync(candidate));
    return file ? fs.statSync(file).mtimeMs : 0;
  }
  if (row.asset === "carousel") {
    const carouselDir = path.join(dir, "carousel");
    if (!fs.existsSync(carouselDir)) return 0;
    return fs.readdirSync(carouselDir)
      .filter((file) => /^slide-\d+\.png$/.test(file))
      .map((file) => fs.statSync(path.join(carouselDir, file)).mtimeMs)
      .reduce((max, value) => Math.max(max, value), 0);
  }
  return 0;
}

function scheduleRowKey(row) {
  const content = Array.isArray(row.thread) ? row.thread.join("\n---\n") : String(row.text || "");
  return [row.date, row.time, row.platform, row.video, row.asset, shortHash(content)].join("|");
}

function shortHash(value) {
  let hash = 5381;
  for (const ch of String(value)) hash = ((hash << 5) + hash + ch.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}

function buildData() {
  const approved = loadApprovals();
  const assetDecisions = loadAssetDecisions();
  const distribution = readJson(DISTRIBUTION_ROUTING, { records: [] });
  const distributionByVideo = new Map((distribution.records || []).map((record) => [record.sourceVideo, record]));
  const scheduleStatuses = scheduleStatusByVideo();
  const names = new Set();
  if (fs.existsSync(QUEUE)) {
    for (const file of fs.readdirSync(QUEUE)) {
      if (file.endsWith(".md") && file !== ".gitkeep") {
        const name = path.basename(file, ".md");
        if (isReviewReady(name)) names.add(name);
      }
    }
  }
  if (fs.existsSync(OUT)) {
    for (const item of fs.readdirSync(OUT)) {
      const dir = path.join(OUT, item);
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory() && item !== "broll-overlays" && isReviewReady(item)) names.add(item);
    }
  }

  const data = [];
  for (const name of [...names].sort().reverse()) {
    const dir = path.join(OUT, name);
    const queuePath = path.join(QUEUE, name + ".md");
    const hasOutput = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    const queueMd = read(queuePath);
    if (!hasOutput && !queueMd) continue;

	    const rawVideo = ["captioned_vertical_9x16.mp4", "vertical_9x16.mp4", "portrait_4x5.mp4", "square_1x1.mp4", "horizontal_16x9.mp4"]
	      .map((f) => "output/" + name + "/" + f).find((rel) => fs.existsSync(path.join(ROOT, rel))) || null;
	    const reviewMedia = cleanReviewMediaFor(name);
	    const video = reviewMedia.video || rawVideo;
    const cover = hasOutput && fs.existsSync(path.join(dir, "cover.jpg")) ? "output/" + name + "/cover.jpg" : null;
    const videoPoster = cover;
    const slides = hasOutput && fs.existsSync(path.join(dir, "carousel"))
      ? fs.readdirSync(path.join(dir, "carousel")).filter((f) => f.startsWith("slide-") && f.endsWith(".png")).sort().map((f) => "output/" + name + "/carousel/" + f)
      : [];
    const overlayDir = path.join(OUT, "broll-overlays");
    const overlays = fs.existsSync(overlayDir)
      ? fs.readdirSync(overlayDir).filter((f) => f.startsWith(`${name}_`) && f.endsWith(".mp4"))
          .map((f) => {
            const id = path.basename(f, ".mp4");
            const spec = readJson(path.join(ROOT, "overlay-specs", `${id}.json`), {});
            return {
              name: id,
              file: `output/broll-overlays/${f}`,
              line: spec.line || "",
              caption: spec.caption || "",
              audioBed: spec.audioBed || null,
            };
          })
      : [];
    const socialPack = hasOutput ? read(path.join(dir, "social-pack.md")) : "";
    const social = parseSocial(socialPack);
    const contentLog = hasOutput ? readJson(path.join(dir, "content-log.json"), {}) : {};
    let xPackJson = null;
    xPackJson = readJson(path.join(dir, "x-pack.json"), null);
    const xPack = hasOutput ? read(path.join(dir, "x-pack.md")) : "";
    const blog = hasOutput ? read(path.join(dir, "blog-draft.md")) : "";
    let blogPage = null;
    try { blogPage = JSON.parse(read(path.join(dir, "blog-page.json"))); } catch (_) {}
    const triage = (socialPack.match(/Suggested triage:\*\*\s*(.+)/) || [])[1]?.trim() || (queueMd ? "Pending approval" : "");
    const pillar = (socialPack.match(/Pillar:\*\*\s*(.+)/) || [])[1]?.trim() || "";
    const title = contentLog.title || (socialPack.match(/Title:\*\*\s*(.+)/) || [])[1]?.trim() || titleHook(name) || name;
    const availableAssets = {
      video: !!video,
      carousel: slides.length > 0,
      gbp: Object.keys(social).some((k) => /^Google Business/i.test(k)),
      xThread: xPackJson?.status === "ready" && Array.isArray(xPackJson.thread) && xPackJson.thread.length >= 2,
      xExtras: xPackJson?.status === "ready" && Array.isArray(xPackJson.standalone) && xPackJson.standalone.length > 0,
      blog: !!blog,
      broll: false,
    };
    const scheduleStatus = scheduleStatuses[name] || { scheduled: false, scheduleStatus: "unscheduled", scheduleStatusLabel: "Not scheduled" };
    data.push({
	      name, video, rawVideo, cleanSocialVideo: reviewMedia.video || "", cleanSocialHorizontalVideo: reviewMedia.horizontal || "", cleanSocialCueRemovedThroughSecond: reviewMedia.cueRemovedThroughSecond || 0, cover, videoPoster, slides, social, xPack, blog, blogPage, triage, pillar, title,
      overlays,
      approval: queueMd, hook: titleHook(name), approved: approved.has(name),
      scheduled: scheduleStatus.scheduled,
      scheduleStatus: scheduleStatus.scheduleStatus,
      scheduleStatusLabel: scheduleStatus.scheduleStatusLabel,
      promptId: contentLog.promptId || "",
      recordingPromptId: contentLog.recordingPromptId || contentLog.promptId || "",
      personaFit: contentLog.personaFit || {},
      distributionRecommendations: contentLog.distributionRecommendations || distributionByVideo.get(name) || {},
      routingRecommendations: contentLog.routingRecommendations || {},
      availableAssets,
      assetDecisions: assetDecisions[name] || {},
      coverMode: (assetDecisions[name] || {}).coverMode || "smart",
      chat: loadAssetChat(name),
    });
  }
  return data;
}

function cleanReviewMediaFor(name) {
  const threadsPayload = readJson(path.join(ROOT, "resource-threads.json"), { threads: [] });
  const threads = Array.isArray(threadsPayload.threads) ? threadsPayload.threads : [];
  for (const thread of threads) {
    const found = (thread.cleanFollowUpExports || []).find((entry) => entry?.sourceVideoId === name);
    if (found) {
      return {
        video: pickExistingRel([found.captionedVertical, found.vertical, found.square, found.horizontal]),
        horizontal: pickExistingRel([found.horizontal]),
        cueRemovedThroughSecond: found.cueRemovedThroughSecond || 0,
      };
    }
  }
  const companionPayload = readJson(path.join(ROOT, "blog-companion-recordings.json"), { recordings: [] });
  const recordings = Array.isArray(companionPayload.recordings) ? companionPayload.recordings : [];
  const recording = recordings.find((entry) => entry?.sourceVideoId === name);
  if (recording?.cleanExports) {
    const clean = recording.cleanExports;
    return {
      video: pickExistingRel([clean.captionedVertical, clean.vertical, clean.square, clean.horizontal, recording.cleanSocialVideoPath]),
      horizontal: pickExistingRel([clean.horizontal, recording.cleanHorizontalVideoPath]),
      cueRemovedThroughSecond: clean.cueRemovedThroughSecond || 0,
    };
  }
  return {};
}

function youtubeVideoFor(item) {
  const sourceVideo = item.sourceVideo || sourceFromReuseId(item.id);
  return pickExistingRel([
    item.resourceVideoPath || "",
    item.resourceThread?.resourceVideoPath || "",
    `output/${sourceVideo}/horizontal_16x9.mp4`,
    `output/${sourceVideo}/captioned_horizontal_16x9.mp4`,
    `output/${sourceVideo}/captioned_vertical_9x16.mp4`,
    `output/${sourceVideo}/vertical_9x16.mp4`,
  ]);
}

function sourceFromReuseId(value) {
  return String(value || "").split("__")[0].replace(/-/g, "_").toUpperCase();
}

function pickExistingRel(candidates) {
  return (candidates || []).filter(Boolean).find((rel) => fs.existsSync(path.join(ROOT, rel))) || "";
}

function buildSocialSurfaces() {
  const rows = parseCsv(read(SOCIAL_LEDGER)).map((row) => ({
    ...row,
    setupPacket: setupPacketFor(row),
  }));
  const groups = {};
  for (const row of rows) {
    if (!row.property) continue;
    (groups[row.property] ??= []).push(row);
  }
  return {
    generatedAt: fs.existsSync(SOCIAL_LEDGER) ? fs.statSync(SOCIAL_LEDGER).mtime.toISOString() : "",
    rows,
    summary: Object.entries(groups).map(([property, items]) => {
      const blockers = items.filter((row) => socialSurfaceNeedsWork(row));
      return {
        property,
        total: items.length,
        blockers: blockers.length,
        readyish: Math.max(0, items.length - blockers.length),
        nextActions: blockers.slice(0, 5).map((row) => `${row.platform}: ${row.next_action || row.status || "verify"}`),
      };
    }),
  };
}

function setupPacketFor(row) {
  const key = `${row.property}|${row.platform}`.toLowerCase();
  const exact = {
    "talley tax|instagram": "social-setup-payloads/talley-tax-instagram.md",
    "talley tax|facebook": "social-setup-payloads/talley-tax-facebook.md",
    "talley tax|linkedin": "social-setup-payloads/talley-tax-linkedin.md",
    "talley tax|google business profile": "social-setup-payloads/talley-tax-google-business-profile.md",
    "talley tax|x": "social-setup-payloads/talley-tax-x.md",
    "retire with talley|domain": "social-setup-payloads/retire-with-talley-domain.md",
    "retire with talley|instagram": "social-setup-payloads/retire-with-talley-instagram.md",
    "retire with talley|facebook": "social-setup-payloads/retire-with-talley-facebook.md",
    "retire with talley|linkedin": "social-setup-payloads/retire-with-talley-linkedin-showcase.md",
    "retire with talley|x": "social-setup-payloads/retire-with-talley-x.md",
    "david talley personal|website hub": "social-setup-payloads/david-talley-hub.md",
    "david talley personal|linkedin": "social-setup-payloads/david-talley-linkedin.md",
    "david talley personal|x": "social-setup-payloads/david-talley-x.md",
  }[key];
  if (!exact) return "";
  return fs.existsSync(path.join(ROOT, exact)) ? exact : "";
}

function socialSurfaceNeedsWork(row) {
  const hay = [row.status, row.smarsh_status, row.metricool_status, row.starter_posts_status, row.next_action].join(" ").toLowerCase();
  if (hay.includes("deferred") || hay.includes("not_applicable") || hay.includes("not applicable") || hay.includes("do not schedule")) return false;
  if (hay.includes("ready_for_routed_scheduling") || hay.includes("scheduling can begin")) return false;
  if (row.surface_type === "Domain") return false;
  if (row.property === "Talley Wealth" && /existing|connected|verified|live|public/.test(hay) && !/404|not deployed|placeholder/.test(hay)) return false;
  if (row.surface_type === "Website" && /live|existing|verified/.test(hay) && !/404|not deployed/.test(hay)) return false;
  if (row.surface_type === "Website Hub" && /live|existing|verified/.test(hay) && !/404|not deployed/.test(hay)) return false;
  return /(create|pending|needs|hold|unknown|audit|verify|404|not deployed)/.test(hay);
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

function isReviewReady(name) {
  const dir = path.join(OUT, name);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return false;
  if (!fs.existsSync(path.join(dir, "content-log.json"))) return false;
  if (!fs.existsSync(path.join(dir, "social-pack.md"))) return false;
  if (!fs.existsSync(path.join(QUEUE, `${name}.md`))) return false;
  return isValidMedia(path.join(dir, "captioned_vertical_9x16.mp4"));
}

function isValidMedia(file) {
  if (!fs.existsSync(file)) return false;
  const r = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ], { encoding: "utf8" });
  return r.status === 0 && Number(String(r.stdout || "").trim()) > 0;
}
function buildBroll() {
  let lib = [];
  try { lib = JSON.parse(read(path.join(ROOT, "broll-library.json"))); } catch (_) {}
  return lib.map((s) => ({
    name: s.name,
    file: s.file || null,
    frame: s.frames && s.frames[0] ? s.frames[0] : null,
    description: s.description || "",
    mood: s.mood || "",
    status: s.status || "",
    tags: s.tags || [],
    useCases: s.useCases || [],
    avoidWhen: s.avoidWhen || [],
    brandFit: s.brandFit || "",
    approved: !!s.approved,
  }));
}
function buildOverlays() {
  const dir = path.join(OUT, "broll-overlays");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".mp4"))
    .sort()
    .map((f) => ({
      name: path.basename(f, ".mp4"),
      file: `output/broll-overlays/${f}`,
      spec: readJson(path.join(ROOT, "overlay-specs", `${path.basename(f, ".mp4")}.json`), {}),
    }));
}
function buildQuoteReels() {
  const dir = path.join(OUT, "broll-overlays");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".mp4"))
    .sort()
    .map((f) => {
      const id = path.basename(f, ".mp4");
      const spec = readJson(path.join(ROOT, "overlay-specs", `${id}.json`), {});
      const audioStatus = spec.audioBed?.status || "silent";
      return {
        name: id,
        file: `output/broll-overlays/${f}`,
        sourceVideo: spec.sourceVideo || id.split("_")[0] || "",
        line: spec.line || "",
        caption: spec.caption || "",
        audioBed: spec.audioBed || null,
        status: audioStatus === "selected" ? "review later" : "needs native audio",
      };
    });
}
function buildAudioBeds() {
  const manifest = readJson(path.join(ROOT, "audio-beds", "manifest.json"), {});
  const beds = Array.isArray(manifest.beds) ? manifest.beds : [];
  return beds
    .filter((bed) => bed && bed.file)
    .map((bed) => ({
      id: bed.id || "",
      name: bed.name || bed.id || "Audio bed",
      file: bed.file,
      approved: bed.approved !== false,
      enabled: bed.enabled !== false,
      volume: bed.volume ?? manifest.defaultVolume ?? 0.08,
      mood: bed.mood || "",
      tags: bed.tags || [],
      license: bed.license || "",
      exists: fs.existsSync(path.resolve(ROOT, bed.file)),
    }));
}
function buildReuseQueue() {
  const items = loadReuseBacklog();
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && item.id && item.type)
    .map((item) => ({
      id: item.id,
      sourceVideo: item.sourceVideo || "",
      type: item.type || "",
      typeLabel: item.typeLabel || item.type || "",
      title: item.title || item.topic || item.id,
      recommendationReason: item.recommendationReason || "",
      recommendation: item.recommendation || "",
      confidence: item.confidence || "",
      audience: item.audience || "",
      suggestedTitle: item.suggestedTitle || "",
      coreQuestion: item.coreQuestion || "",
      whyThisCouldBeDurable: item.whyThisCouldBeDurable || "",
      suggestedSections: Array.isArray(item.suggestedSections) ? item.suggestedSections : [],
      relatedAssetIdeas: Array.isArray(item.relatedAssetIdeas) ? item.relatedAssetIdeas : [],
      sourceLines: Array.isArray(item.sourceLines) ? item.sourceLines : [],
      candidateScore: item.candidateScore ?? scoreReuseCandidate(item),
      candidateSummary: item.candidateSummary || summarizeReuseCandidate(item),
      primaryCategory: item.primaryCategory || item.category || categoryForReuse(item),
      tags: Array.isArray(item.tags) ? item.tags : tagsForReuse(item),
      audienceLane: item.audienceLane || item.audience || "",
      contentFormat: item.contentFormat || formatForReuse(item),
      decisionTheme: item.decisionTheme || decisionThemeForReuse(item),
      sourceBasis: item.sourceBasis || null,
      h1Title: item.h1Title || item.suggestedTitle || item.title || "",
      seoTitle: item.seoTitle || item.h1Title || item.suggestedTitle || item.title || "",
	      titleRationale: item.titleRationale || "",
	      youtubeReuse: item.youtubeReuse || null,
	      compliancePackage: item.compliancePackage || null,
	      resourceThread: item.resourceThread || null,
	      resourceThreadStatus: item.resourceThreadStatus || item.resourceThread?.threadStatus || "",
	      sourceVideoIds: Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : (Array.isArray(item.resourceThread?.sourceVideoIds) ? item.resourceThread.sourceVideoIds : [item.sourceVideo].filter(Boolean)),
	      resourceVideoPath: item.resourceVideoPath || item.resourceThread?.resourceVideoPath || "",
	      transcriptBundlePath: item.transcriptBundlePath || item.resourceThread?.transcriptBundlePath || "",
	      cleanSocialVideoPath: item.cleanSocialVideoPath || item.resourceThread?.cleanSocialVideoPath || "",
	      youtubeVideoPath: youtubeVideoFor(item),
	      previewNeedsRegeneration: Boolean(item.previewNeedsRegeneration),
	      previewSourceVideoIds: Array.isArray(item.previewSourceVideoIds) ? item.previewSourceVideoIds : [],
	      resourceThreadUpdatedAt: item.resourceThreadUpdatedAt || item.resourceThread?.updatedAt || "",
	      candidateReadiness: item.candidateReadiness || candidateReadinessFor(item),
	      followUpCue: followUpCueFor(item),
	      followUpPrompt: item.followUpPrompt || followUpPromptFor(item),
	      followUpTargetId: item.followUpTargetId || item.id,
	      status: item.status || "candidate",
      workflowStatus: item.workflowStatus || item.status || "candidate",
      complianceStatus: item.complianceStatus || "not_submitted",
      draftPath: item.draftPath && fs.existsSync(path.join(ROOT, item.draftPath)) ? item.draftPath : "",
      stagedPath: item.stagedPath || "",
      localPath: item.localPath || "",
      localUrl: item.localUrl || "",
      slug: item.slug || "",
      pdfPath: item.pdfPath && fs.existsSync(path.join(ROOT, item.pdfPath)) ? item.pdfPath : "",
      pdfCreatedAt: item.pdfCreatedAt || "",
      contentKind: item.contentKind || "",
      layoutVariant: item.layoutVariant || "",
      pageMetaPath: item.pageMetaPath || "",
      complianceEmailDraftPath: item.complianceEmailDraftPath && fs.existsSync(path.join(ROOT, item.complianceEmailDraftPath)) ? item.complianceEmailDraftPath : "",
      complianceEmailDraftedAt: item.complianceEmailDraftedAt || "",
      complianceSentAt: item.complianceSentAt || "",
      readyToPublishAt: item.readyToPublishAt || "",
      publishedAt: item.publishedAt || "",
      publishChecklistPath: item.publishChecklistPath && fs.existsSync(path.join(ROOT, item.publishChecklistPath)) ? item.publishChecklistPath : "",
      personaFit: item.personaFit || {},
      sourceOutputPaths: item.sourceOutputPaths || {},
      notes: item.notes || "",
    }));
}

function buildBlogCompanionPrompts() {
  const promptPayload = readJson(BLOG_COMPANION_PROMPTS, { items: [] });
  const recordingsPayload = readJson(BLOG_COMPANION_RECORDINGS, { recordings: [] });
  const recordings = Array.isArray(recordingsPayload.recordings) ? recordingsPayload.recordings : [];
  return (Array.isArray(promptPayload.items) ? promptPayload.items : [])
    .map((item) => {
      const attached = recordings
        .filter((recording) => recording.slug === item.slug || recording.promptId === item.promptId)
        .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
      const latest = attached[0] || null;
      return {
        ...item,
        attachedVideoIds: attached.map((recording) => recording.sourceVideoId).filter(Boolean),
        attachedRecordings: attached,
        status: latest ? "companion_received" : (item.status || "needs_recording"),
        latestRecording: latest,
        fullPrompt: blogCompanionFullPrompt(item),
      };
    })
    .sort((a, b) => Number(b.refreshPriority || 0) - Number(a.refreshPriority || 0));
}

function blogCompanionFullPrompt(item) {
  return [
    `Prompt ID: ${item.promptId}`,
    `Routing cue: Open by saying exactly, "${item.routingCue}"`,
    "",
    `Why this matters: ${item.whyThisMatters}`,
    `Who this is for: ${item.whoThisIsFor}`,
    `Story trigger: ${item.storyTrigger}`,
    `Safe story doorway: ${item.safeStoryDoorway}`,
    `First spoken line after the routing cue: "${item.firstSpokenLine}"`,
    `Turn: ${item.turn}`,
    "Talk path:",
    ...(Array.isArray(item.talkPath) ? item.talkPath.map((line, index) => `${index + 1}. ${line}`) : []),
    `Grounded close: "${item.groundedClose}"`,
    "Do not say:",
    ...(Array.isArray(item.doNotSay) ? item.doNotSay.map((line) => `- ${line}`) : []),
    `Likely use: ${Array.isArray(item.likelyUse) ? item.likelyUse.join(", ") : ""}`,
    `Visual refresh notes: ${item.visualRefreshNotes || ""}`,
  ].filter((line) => line !== null && line !== undefined).join("\n");
}

function scoreReuseCandidate(item) {
  let score = 5;
  const rec = String(item.recommendation || "").toLowerCase();
  const confidence = String(item.confidence || "").toLowerCase();
  if (rec === "yes") score += 2;
  if (rec === "maybe") score += 0.5;
  if (confidence === "high") score += 1.5;
  if (confidence === "medium") score += 0.5;
  if (item.coreQuestion || item.candidateQuestion) score += 0.5;
  if (Array.isArray(item.sourceLines) && item.sourceLines.length >= 3) score += 0.5;
  if (item.status === "declined") score = Math.min(score, 2);
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function summarizeReuseCandidate(item) {
  const text = String(item.recommendationReason || item.whyThisCouldBeDurable || item.coreQuestion || item.candidateQuestion || "").trim();
  if (!text) return "Potential durable resource if the transcript answers a real planning question.";
  const first = text.split(/(?<=[.!?])\s+/)[0] || text;
  return first.length > 180 ? `${first.slice(0, 177).trim()}...` : first;
}

function candidateReadinessFor(item) {
  const score = Number(item.candidateScore ?? scoreReuseCandidate(item));
  const threadStatus = item.resourceThreadStatus || item.resourceThread?.threadStatus || "";
  if (["follow_up_recorded", "ready_for_resource_preview"].includes(threadStatus)) return "follow_up_received";
  if (score >= 8) return "ready_to_draft";
  if (score >= 7) return "strengthen_with_follow_up";
  if (score >= 6) return "source_material_with_follow_up_option";
  return "keep_as_source_material";
}

function followUpCueFor(item) {
  const title = cleanCueTitle(item.h1Title || item.suggestedTitle || item.title || item.coreQuestion || item.id);
  return `Part 2 for: ${title}`;
}

function followUpPromptFor(item) {
  const title = cleanCueTitle(item.h1Title || item.suggestedTitle || item.title || "this topic");
  const question = item.coreQuestion || title;
  const category = categoryForReuse(item);
  const missing = followUpNeedFor(item);
  const promptId = `resource-followup-${slugForPrompt(item.id || title)}`;
  const audience = item.audienceLane || item.audience || audienceForFollowUp(item);
  const firstLine = firstLineForFollowUp(item, question);
  const close = closeForFollowUp(item);
  return [
    `Prompt ID: ${promptId}`,
    `Routing cue: Open by saying exactly, "${followUpCueFor(item)}."`,
    `Why this follow-up matters: This idea is close to a durable article, but it needs one more real explanation before the blog should be generated.`,
    `Who this is for: ${audience}.`,
    `Story trigger: Think of a representative person who would ask, "${question}" and what they would be worried about underneath that question.`,
    `Safe story doorway: Use a composite or pattern, not an identifiable client. Say "picture someone" or "a lot of families run into this" if that feels natural.`,
    `First spoken line after the routing cue: "${firstLine}"`,
    `Turn: Move from the surface question to the planning decision underneath it.`,
    `Talk path: 1. Name the worry. 2. Give one concrete example. 3. Explain the mistake to avoid. 4. Name the better next question.`,
    `What to add: ${missing}`,
    `Grounded close: "${close}"`,
    "Do not say: guaranteed, best return, eliminate risk, tax savings certainty, or anything that sounds like individualized advice.",
    `Likely use: standalone social clip plus added source material for "${title}" before generating the final blog.`,
    `Likely category: ${category}.`,
  ].join("\n");
}

function cleanCueTitle(value) {
  return String(value || "")
    .replace(/\s+\((emotionally and practically|practically and emotionally)\)/ig, "")
    .replace(/\s+\((?:and )?what to do(?: next)?\)/ig, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!]+$/g, "");
}

function followUpNeedFor(item) {
  const hay = `${item.title || ""} ${item.recommendationReason || ""} ${item.coreQuestion || ""}`.toLowerCase();
  if (hay.includes("return") || hay.includes("portfolio") || hay.includes("investment")) {
    return "a concrete example of how timeline and risk tolerance change the return target.";
  }
  if (hay.includes("retirement")) {
    return "a concrete household example that connects the concern to income, taxes, market risk, or timing.";
  }
  if (hay.includes("estate") || hay.includes("inherit")) {
    return "the first 2 or 3 practical steps someone should take and what can go wrong if they skip them.";
  }
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("business")) {
    return "one specific decision point, what information changes the answer, and what timing mistake to avoid.";
  }
  return "a more specific example, the planning decision underneath the topic, and the mistake the article should help the reader avoid.";
}

function audienceForFollowUp(item) {
  const category = categoryForReuse(item);
  if (category.includes("Retirement")) return "Someone close to retirement who wants confidence before making work optional";
  if (category.includes("Business")) return "A business owner trying to connect business cash flow, taxes, and personal wealth";
  if (category.includes("Tax")) return "A taxpayer or owner whose tax question is really a timing and planning question";
  if (category.includes("Estate")) return "A family trying to turn documents or inherited money into practical decisions";
  return "A successful family with several decisions that affect each other";
}

function firstLineForFollowUp(item, question) {
  const hay = `${item.title || ""} ${item.recommendationReason || ""} ${question || ""}`.toLowerCase();
  if (hay.includes("return") || hay.includes("portfolio") || hay.includes("investment")) {
    return "The reason this question gets tricky is that the money probably does not all have the same job.";
  }
  if (hay.includes("retirement")) {
    return "The part people usually miss is that retirement confidence is not just one number.";
  }
  if (hay.includes("estate") || hay.includes("inherit")) {
    return "The document or the account balance is not the whole decision.";
  }
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("business")) {
    return "The tax answer usually depends on the decision that created the tax result.";
  }
  return "The first question is useful, but it is probably not the whole question.";
}

function closeForFollowUp(item) {
  const hay = `${item.title || ""} ${item.recommendationReason || ""}`.toLowerCase();
  if (hay.includes("return") || hay.includes("portfolio") || hay.includes("investment")) {
    return "Before you chase a number, make sure the money has a job.";
  }
  if (hay.includes("retirement")) {
    return "The goal is not a prettier spreadsheet. The goal is a decision you can actually live with.";
  }
  if (hay.includes("business")) {
    return "The business result only matters if it connects back to the owner's life.";
  }
  return "A better question usually leads to a better decision.";
}

function slugForPrompt(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "resource";
}

function categoryForReuse(item) {
  const hay = `${item.title || ""} ${item.recommendationReason || ""} ${item.audience || ""}`.toLowerCase();
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("irs")) return "Tax Planning";
  if (hay.includes("business") || hay.includes("owner") || hay.includes("s-corp")) return "Business Owner Planning";
  if (hay.includes("investment") || hay.includes("portfolio") || hay.includes("return")) return "Investment Management";
  if (hay.includes("estate") || hay.includes("inherit")) return "Estate & Legacy Planning";
  if (hay.includes("retirement") || hay.includes("medicare") || hay.includes("social security")) return "Retirement Planning";
  return "Financial Planning";
}

function tagsForReuse(item) {
  const tags = new Set([categoryForReuse(item)]);
  const hay = `${item.title || ""} ${item.recommendationReason || ""} ${item.audience || ""}`.toLowerCase();
  if (hay.includes("retirement")) tags.add("Retirement");
  if (hay.includes("tax") || hay.includes("roth")) tags.add("Tax");
  if (hay.includes("investment") || hay.includes("portfolio") || hay.includes("return")) tags.add("Investing");
  if (hay.includes("estate") || hay.includes("inherit")) tags.add("Inheritance");
  if (hay.includes("business") || hay.includes("owner")) tags.add("Business Owners");
  return [...tags].slice(0, 5);
}

function formatForReuse(item) {
  if (item.type === "blog") return "Blog article";
  if (item.type === "video_explainer_page") return "Resource page";
  return item.typeLabel || item.type || "Resource";
}

function decisionThemeForReuse(item) {
  const hay = `${item.title || ""} ${item.recommendationReason || ""}`.toLowerCase();
  if (hay.includes("roth")) return "Roth conversion decision";
  if (hay.includes("inherit")) return "Inheritance next steps";
  if (hay.includes("return") || hay.includes("portfolio")) return "Portfolio role and risk";
  if (hay.includes("retirement")) return "Retirement readiness";
  if (hay.includes("estate")) return "Estate follow-through";
  return "Planning decision";
}

function buildInventory() {
  const index = readJson(CONTENT_INDEX, {});
  const records = Array.isArray(index.records) ? index.records : [];
  return records.map((record) => ({
    id: record.id || record.name || "",
    title: record.title || "",
    triage: record.triage || "",
    pillar: record.pillar || "",
    approvalStatus: record.approvalStatus || "",
    approved: !!record.approved,
    blogDraftExists: !!record.blogDraftExists,
    reuseStatusSummary: record.reuseStatusSummary || "",
    publishedUrl: record.publishedUrl || "",
    updatedAt: record.updatedAt || record.createdAt || "",
  }));
}

function buildFailedQueue() {
  if (!fs.existsSync(FAILED_DIR)) return [];
  return fs.readdirSync(FAILED_DIR)
    .filter((file) => file.endsWith(".log"))
    .sort()
    .map((file) => {
      const name = path.basename(file, ".log");
      const logPath = path.join(FAILED_DIR, file);
      const body = read(logPath);
      const fields = Object.fromEntries(body.split(/\r?\n/).map((line) => {
        const i = line.indexOf("=");
        return i > 0 ? [line.slice(0, i), line.slice(i + 1)] : null;
      }).filter(Boolean));
      const sourceFile = resolveSourcePath(fields.source || "");
      const sourceExists = !!sourceFile && fs.existsSync(sourceFile);
      const sourceStat = sourceExists ? fs.statSync(sourceFile) : null;
      const probe = sourceExists ? probeVideo(sourceFile) : {};
      const partials = [
        partialArtifact(name, "Transcript", path.join("work", name, "audio.json")),
        partialArtifact(name, "Cover image", path.join("output", name, "cover.jpg")) || failedOutputArtifact(name, "Cover image", "cover.jpg"),
        partialArtifact(name, "Captioned video", path.join("output", name, "captioned_vertical_9x16.mp4")) || failedOutputArtifact(name, "Captioned video", "captioned_vertical_9x16.mp4"),
        partialArtifact(name, "Clean vertical", path.join("output", name, "vertical_9x16.mp4")) || failedOutputArtifact(name, "Clean vertical", "vertical_9x16.mp4"),
        partialArtifact(name, "Carousel", path.join("output", name, "carousel", "slides.json")) || failedOutputArtifact(name, "Carousel", path.join("carousel", "slides.json")),
        partialArtifact(name, "Social copy", path.join("output", name, "social-pack.md")) || failedOutputArtifact(name, "Social copy", "social-pack.md"),
        partialArtifact(name, "Content log", path.join("output", name, "content-log.json")) || failedOutputArtifact(name, "Content log", "content-log.json"),
      ].filter(Boolean);
      return {
        name,
        status: fields.status || "failed",
        time: fields.time || "",
        source: fields.source || "",
        sourceName: fields.source ? path.basename(fields.source) : "",
        sourceSize: fields.source_size ? formatBytes(fields.source_size) : (sourceStat ? formatBytes(sourceStat.size) : ""),
        sourceModified: fields.source_mtime || (sourceStat ? sourceStat.mtime.toLocaleString() : ""),
        duration: fields.duration || probe.duration || "",
        dimensions: probe.width && probe.height ? `${probe.width} x ${probe.height}` : "",
        message: fields.message || body.trim() || "Pipeline failed.",
        thumbnail: ensureFailureThumb(name, sourceFile),
        partials,
        transcriptSnippet: transcriptSnippet(name),
        logPath: relativeToRoot(logPath),
        rawLog: body.trim(),
        sourceExists,
      };
    });
}

function buildMetricoolEngine() {
  const engine = readJson(METRICOOL_ENGINE, null);
  if (engine) return engine;
  return {
    generatedAt: "",
    status: readJson(path.join(ROOT, "work", "metricool-status.json"), {}),
    summary: {},
    planner: [],
    performance: {
      mode: "empty",
      note: "Metricool engine data has not been synced yet.",
      sourceRollups: [],
    },
  };
}

function page() {
  return renderReviewPage({
    data: buildData(),
    failedQueue: buildFailedQueue(),
    metricoolEngine: buildMetricoolEngine(),
    metricoolShadowReroute: readJson(METRICOOL_SHADOW_REROUTE, { summary: {}, groups: [], rows: [], files: {} }),
    repurposeSeedPlan: readJson(REPURPOSE_SEED_PLAN, { summary: {}, cards: [], files: {} }),
    scheduleJob: readScheduleJob(),
    broll: buildBroll(),
    overlays: buildOverlays(),
    quoteReels: buildQuoteReels(),
    audioBeds: buildAudioBeds(),
    reuseQueue: buildReuseQueue(),
    blogCompanionPrompts: buildBlogCompanionPrompts(),
    blogCompanionRecordings: readJson(BLOG_COMPANION_RECORDINGS, { recordings: [] }),
    inventory: buildInventory(),
    socialSurfaces: buildSocialSurfaces(),
    distributionProperties: readJson(DISTRIBUTION_PROPERTIES, { properties: [] }),
    liveMode: String(process.env.METRICOOL_LIVE_WRITE || "").toLowerCase() === "true",
  });
}

function send(res, code, body, type = "text/html") { res.writeHead(code, { "Content-Type": type }); res.end(body); }

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "GET" && u.pathname === "/") return send(res, 200, page());
  if (req.method === "GET" && u.pathname === "/schedule-job") return send(res, 200, JSON.stringify(readScheduleJob()), "application/json");

  if (req.method === "GET" && u.pathname === "/favicon.png") {
    const fp = path.resolve(ROOT, "..", "public", "brands", "talley-wealth", "favicon.png");
    if (!fs.existsSync(fp)) return send(res, 404, "not found", "text/plain");
    res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-cache" });
    return fs.createReadStream(fp).pipe(res);
  }

  if (req.method === "GET" && u.pathname.startsWith("/media/")) {
    const rel = decodeURIComponent(u.pathname.slice("/media/".length));
    const fp = path.resolve(ROOT, rel);
    const under = (base) => fp === base || fp.startsWith(`${base}${path.sep}`);
    const okWorkFile = [
      path.join(ROOT, "work", "metricool-shadow-reroute.md"),
      path.join(ROOT, "work", "metricool-shadow-reroute.csv"),
      path.join(ROOT, "work", "metricool-shadow-reroute.json"),
      path.join(ROOT, "work", "repurpose-seed-plan.md"),
      path.join(ROOT, "work", "repurpose-seed-plan.csv"),
      path.join(ROOT, "work", "repurpose-seed-plan.json"),
    ].includes(fp);
    const okBase = okWorkFile || fp === path.join(ROOT, "SOCIAL-SURFACE-ACTION-PACKET.md") || under(path.join(ROOT, "social-setup-payloads")) || under(path.join(ROOT, "brand-assets")) || under(path.join(ROOT, "output")) || under(path.join(ROOT, "broll")) || under(path.join(ROOT, "audio-beds")) || under(path.join(ROOT, "reuse-output")) || under(FAILURE_THUMB_DIR) || under(FAILED_OUTPUT_DIR) || under(path.join(ROOT, "work", "debug-frames"));
    if (!okBase || !fs.existsSync(fp)) return send(res, 404, "not found", "text/plain");
    const ext = path.extname(fp).toLowerCase();
    const types = { ".mp4": "video/mp4", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".md": "text/markdown; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".json": "application/json; charset=utf-8", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".aac": "audio/aac", ".wav": "audio/wav" };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    return fs.createReadStream(fp).pipe(res);
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      const data = body ? JSON.parse(body) : {};
      if (u.pathname === "/approve") {
        const set = loadApprovals();
        const name = safeName(data.name);
        if (data.approved) {
          set.add(name);
          preRenderApprovedMedia(name);
        } else {
          set.delete(name);
        }
        saveApprovals(set);
        runStep("node", ["scripts/build-content-index.mjs"]);
        return send(res, 200, JSON.stringify({ ok: true }), "application/json");
      }
      if (u.pathname === "/asset-toggle") {
        const decisions = loadAssetDecisions();
        decisions[data.name] ??= {};
        decisions[data.name][data.asset] = data.enabled !== false;
        saveAssetDecisions(decisions);
        return send(res, 200, JSON.stringify({ ok: true }), "application/json");
      }
      if (u.pathname === "/cover") {
        const r = data.mode === "title"
          ? spawnSync("node", ["scripts/render-cover.mjs", data.name, data.headline || data.name, "Talley Wealth"], { cwd: ROOT })
          : spawnSync("node", ["scripts/cover-picker.mjs", data.name], { cwd: ROOT });
        if (r.status === 0) {
          const decisions = loadAssetDecisions();
          decisions[data.name] ??= {};
          decisions[data.name].coverMode = data.mode === "title" ? "title" : "smart";
          decisions[data.name].coverPath = `output/${safeName(data.name)}/cover.jpg`;
          saveAssetDecisions(decisions);
        }
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: ((r.stdout || "") + (r.stderr || "")).trim() }), "application/json");
      }
      if (u.pathname === "/reuse-save") {
	        const steps = [
	          runStep("node", ["scripts/build-content-index.mjs"]),
	          runStep("node", ["scripts/build-reuse-backlog.mjs"]),
	          runStep("node", ["scripts/build-resource-threads.mjs"]),
	          runStep("node", ["scripts/build-content-index.mjs"]),
	        ];
        const failed = steps.find((step) => !step.ok);
        return send(res, 200, JSON.stringify({
          ok: !failed,
          summary: failed ? `Reuse refresh failed: ${failed.output.slice(0, 180)}` : "Reuse queue refreshed",
          steps,
        }), "application/json");
      }
      if (u.pathname === "/reuse-clear-blog-previews") {
        const backlog = loadReuseBacklog();
        let changed = 0;
        for (const item of backlog) {
          if (!item || item.type !== "blog") continue;
          if (item.status === "declined" || item.status === "published") continue;
          const hadPreview = item.localUrl || item.localPath || item.stagedPath || item.workflowStatus === "staged_preview" || item.status === "staged_preview";
          if (!hadPreview && !item.draftPath && !item.slug && !item.pdfPath && !item.compliancePackage) continue;
          delete item.localUrl;
          delete item.localPath;
          delete item.stagedPath;
          delete item.draftPath;
          delete item.slug;
          delete item.pdfPath;
          delete item.pdfCreatedAt;
          delete item.sourceMomentCount;
          delete item.sourceMomentsPath;
          delete item.compliancePackage;
          delete item.youtubeReuse;
          delete item.publishPackagePath;
          delete item.publishPackageCreatedAt;
          item.status = "candidate";
          item.workflowStatus = "candidate";
          item.publicationStatus = "preview";
          item.updatedAt = new Date().toISOString();
          changed += 1;
        }
        saveReuseBacklog(backlog);
        const beforePosts = loadGeneratedBlogPosts();
        const afterPosts = beforePosts.filter((post) => !(post.contentKind === "blog" && post.publicationStatus !== "published"));
        saveGeneratedBlogPosts(afterPosts);
        return send(res, 200, JSON.stringify({
          ok: true,
          summary: `Cleared ${changed} blog preview card(s) and removed ${beforePosts.length - afterPosts.length} generated preview post(s).`,
        }), "application/json");
      }
      if (u.pathname === "/reuse-generate") {
        const backlog = loadReuseBacklog();
        const item = backlog.find((entry) => entry.id === data.id);
        const longform = item && ["blog", "video_explainer_page"].includes(item.type);
        const r = longform
          ? spawnSync("node", ["scripts/longform-workflow.mjs", "generate-draft", data.id], { cwd: ROOT, encoding: "utf8" })
          : spawnSync("node", ["scripts/generate-reuse-draft.mjs", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "Draft generated" }), "application/json");
      }
      if (u.pathname === "/longform-stage") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "preview", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "Preview staged" }), "application/json");
      }
      if (u.pathname === "/blog-preview") {
        const backlog = loadReuseBacklog();
        const item = backlog.find((entry) => entry.id === data.id);
        if (!item) return send(res, 404, JSON.stringify({ ok: false, summary: "Blog candidate not found" }), "application/json");
        if (item.type !== "blog") return send(res, 400, JSON.stringify({ ok: false, summary: "Generate blog preview only works for blog candidates" }), "application/json");
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "preview", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        const refreshed = loadReuseBacklog().find((entry) => entry.id === data.id) || item;
        const previewReady = r.status === 0 ? await waitForPreviewUrl(refreshed.localUrl || "") : { ok: false, waitedMs: 0, status: 0, summary: "Preview staging failed" };
        return send(res, 200, JSON.stringify({
          ok: r.status === 0 && previewReady.ok,
          summary: previewReady.ok ? (out || "Resource blog preview staged") : `Resource blog preview staged, but the local route is not ready yet: ${previewReady.summary}`,
          localUrl: refreshed.localUrl || "",
          localPath: refreshed.localPath || "",
          draftPath: refreshed.draftPath || "",
          sourceMomentCount: refreshed.sourceMomentCount || 0,
          status: refreshed.status || "",
          previewReady: previewReady.ok,
          previewStatus: previewReady.status,
          previewWaitedMs: previewReady.waitedMs,
        }), "application/json");
      }
      if (u.pathname === "/longform-pdf") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "print-pdf", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "PDF created" }), "application/json");
      }
      if (u.pathname === "/longform-email-draft") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "draft-compliance-email", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "Compliance email draft created" }), "application/json");
      }
      if (u.pathname === "/longform-mark-sent") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "mark-sent", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "Marked sent to compliance" }), "application/json");
      }
      if (u.pathname === "/longform-mark-ready") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "mark-ready", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out || "Marked ready to publish" }), "application/json");
      }
      if (u.pathname === "/longform-prepare-publish") {
        const r = spawnSync("node", ["scripts/longform-workflow.mjs", "prepare-publish", data.id], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        const item = loadReuseBacklog().find((entry) => entry?.id === data.id) || {};
        const packagePath = item.compliancePackage?.zipPath || item.publishPackagePath || "";
        return send(res, 200, JSON.stringify({
          ok: r.status === 0,
          summary: out || "Package prepared and YouTube queued",
          packagePath,
          packageUrl: packagePath ? `/media/${packagePath}` : "",
          youtube: item.youtubeReuse || null,
        }), "application/json");
      }
      if (u.pathname === "/reuse-status") {
        const allowed = new Set(["candidate", "drafted", "draft_generated", "staged_preview", "approved_for_compliance", "pdf_created", "compliance_email_drafted", "sent_to_compliance", "ready_to_publish", "needs_review", "approved", "declined", "published", "website_backlog"]);
        if (!allowed.has(data.status)) return send(res, 400, JSON.stringify({ ok: false, summary: "Invalid status" }), "application/json");
        const backlog = loadReuseBacklog();
        const item = backlog.find((entry) => entry.id === data.id);
        if (!item) return send(res, 404, JSON.stringify({ ok: false, summary: "Reuse item not found" }), "application/json");
        item.status = data.status;
        item.workflowStatus = data.status;
        item.updatedAt = new Date().toISOString();
        saveReuseBacklog(backlog);
        return send(res, 200, JSON.stringify({ ok: true, summary: `Marked ${data.status}` }), "application/json");
      }
      if (u.pathname === "/reuse-compliance") {
        const allowed = new Set(["not_submitted", "sent_to_compliance", "approved", "published"]);
        if (!allowed.has(data.status)) return send(res, 400, JSON.stringify({ ok: false, summary: "Invalid compliance status" }), "application/json");
        const backlog = loadReuseBacklog();
        const item = backlog.find((entry) => entry.id === data.id);
        if (!item) return send(res, 404, JSON.stringify({ ok: false, summary: "Reuse item not found" }), "application/json");
        item.complianceStatus = data.status;
        item.updatedAt = new Date().toISOString();
        saveReuseBacklog(backlog);
        return send(res, 200, JSON.stringify({ ok: true, summary: `Compliance marked ${data.status}` }), "application/json");
      }
      if (u.pathname === "/chat-add") {
        const name = safeName(data.name);
        const message = String(data.message || "").trim();
        if (!message) return send(res, 400, JSON.stringify({ ok: false, summary: "Message is empty" }), "application/json");
        const chat = loadAssetChat(name);
        chat.name = name;
        chat.messages ??= [];
        chat.messages.push({ role: "user", content: message, createdAt: new Date().toISOString() });
        chat.messages.push(await makeActionableChatMessage(name, message));
        saveAssetChat(name, chat);
        return send(res, 200, JSON.stringify({ ok: true, summary: "Chat saved", chat }), "application/json");
      }
      if (u.pathname === "/chat-apply") {
        const name = safeName(data.name);
        const messageIndex = Number(data.messageIndex);
        const suggestionId = String(data.suggestionId || "");
        const chat = loadAssetChat(name);
        const msg = Array.isArray(chat.messages) ? chat.messages[messageIndex] : null;
        const suggestion = msg?.suggestions?.find((s) => s.id === suggestionId);
        if (!suggestion) return send(res, 404, JSON.stringify({ ok: false, summary: "Suggestion not found" }), "application/json");
        if (suggestion.appliedAt) return send(res, 200, JSON.stringify({ ok: true, summary: "Already applied", chat }), "application/json");
        try {
          suggestion.undo = snapshotForSuggestion(name, suggestion);
          const changed = applySuggestionToAsset(name, suggestion);
          suggestion.appliedAt = new Date().toISOString();
          suggestion.changed = changed;
          chat.messages.push({
            role: "assistant",
            content: `Applied local edit: ${suggestion.title}. Changed: ${changed.join(", ")}.`,
            createdAt: new Date().toISOString(),
          });
          saveAssetChat(name, chat);
          return send(res, 200, JSON.stringify({ ok: true, summary: `Applied: ${changed.join(", ")}`, chat, changed }), "application/json");
        } catch (err) {
          return send(res, 500, JSON.stringify({ ok: false, summary: err.message, chat }), "application/json");
        }
      }
      if (u.pathname === "/chat-undo") {
        const name = safeName(data.name);
        const messageIndex = Number(data.messageIndex);
        const suggestionId = String(data.suggestionId || "");
        const chat = loadAssetChat(name);
        const msg = Array.isArray(chat.messages) ? chat.messages[messageIndex] : null;
        const suggestion = msg?.suggestions?.find((s) => s.id === suggestionId);
        if (!suggestion) return send(res, 404, JSON.stringify({ ok: false, summary: "Suggestion not found" }), "application/json");
        if (!suggestion.appliedAt) return send(res, 400, JSON.stringify({ ok: false, summary: "That suggestion has not been applied" }), "application/json");
        try {
          const restored = undoSuggestionForAsset(name, suggestion);
          suggestion.undoneAt = new Date().toISOString();
          suggestion.appliedAt = "";
          chat.messages.push({
            role: "assistant",
            content: `Restored previous version for: ${suggestion.title}. Restored: ${restored.join(", ")}.`,
            createdAt: new Date().toISOString(),
          });
          saveAssetChat(name, chat);
          return send(res, 200, JSON.stringify({ ok: true, summary: `Restored: ${restored.join(", ")}`, chat, restored }), "application/json");
        } catch (err) {
          return send(res, 500, JSON.stringify({ ok: false, summary: err.message, chat }), "application/json");
        }
      }
      if (u.pathname === "/chat-promote") {
        const name = safeName(data.name);
        const index = Number(data.index);
        const chat = loadAssetChat(name);
        const msg = Array.isArray(chat.messages) ? chat.messages[index] : null;
        const preference = msg?.preferenceCandidate || "";
        if (!preference) return send(res, 400, JSON.stringify({ ok: false, summary: "No preference candidate on that message" }), "application/json");
        appendPreference(name, preference);
        msg.preferencePromotedAt = new Date().toISOString();
        saveAssetChat(name, chat);
        return send(res, 200, JSON.stringify({ ok: true, summary: "Preference saved" }), "application/json");
      }
      if (u.pathname === "/schedule") {
        const job = startScheduleJob({ live: false });
        return send(res, 200, JSON.stringify({ ok: job.status !== "failed", summary: job.status === "running" ? "Posting plan job started" : job.summary, job }), "application/json");
      }
      if (u.pathname === "/metricool-sync") {
        const steps = [
          runStep("node", ["scripts/sync-metricool-status.mjs"]),
          runStep("node", ["scripts/metricool-live.mjs", "--list"]),
          runStep("node", ["scripts/sync-metricool-engine.mjs"]),
        ];
        const failed = steps.find((step) => !step.ok);
        const engine = readJson(METRICOOL_ENGINE, {});
        const count = engine.summary?.total ?? engine.planner?.length ?? 0;
        const summary = failed
          ? `Stopped at ${failed.command}: ${failed.output.slice(0, 180) || "failed"}`
          : `Metricool synced: ${count} planner item(s)`;
        return send(res, 200, JSON.stringify({ ok: !failed, summary, steps }), "application/json");
      }
      if (u.pathname === "/shadow-reroute") {
        const steps = [
          runStep("node", ["scripts/sync-metricool-status.mjs"]),
          runStep("node", ["scripts/metricool-live.mjs", "--list"]),
          runStep("node", ["scripts/sync-metricool-engine.mjs"]),
          runStep("node", ["scripts/build-content-index.mjs"]),
          runStep("node", ["scripts/build-distribution-routing.mjs"]),
          runStep("node", ["scripts/build-metricool-shadow-reroute.mjs"]),
        ];
        const failed = steps.find((step) => !step.ok);
        const report = readJson(METRICOOL_SHADOW_REROUTE, { summary: {} });
        const s = report.summary || {};
        const summary = failed
          ? `Stopped at ${failed.command}: ${failed.output.slice(0, 180) || "failed"}`
          : `Shadow reroute complete: ${s.moveCandidates || 0} move candidate(s), ${s.keepAsIs || 0} keep-as-is, ${s.manualReview || 0} manual review`;
        return send(res, 200, JSON.stringify({ ok: !failed, summary, steps, report }), "application/json");
      }
      if (u.pathname === "/repurpose-seed") {
        const steps = [
          runStep("node", ["scripts/build-content-index.mjs"]),
          runStep("node", ["scripts/build-distribution-routing.mjs"]),
          runStep("node", ["scripts/build-repurpose-seed-plan.mjs"]),
        ];
        const failed = steps.find((step) => !step.ok);
        const report = readJson(REPURPOSE_SEED_PLAN, { summary: {} });
        const s = report.summary || {};
        const summary = failed
          ? `Stopped at ${failed.command}: ${failed.output.slice(0, 180) || "failed"}`
          : `Repurpose seed plan ready: ${s.totalCards || 0} source card(s), ${s.totalDrafts || 0} rewritten draft(s)`;
        return send(res, 200, JSON.stringify({ ok: !failed, summary, steps, report }), "application/json");
      }
      if (u.pathname === "/analytics-sync") {
        const steps = [
          runStep("node", ["scripts/sync-metricool-analytics.mjs"]),
          runStep("node", ["scripts/sync-metricool-engine.mjs"]),
        ];
        const failed = steps.find((step) => !step.ok);
        const engine = readJson(METRICOOL_ENGINE, {});
        const status = engine.analytics?.status || "unknown";
        const summary = failed
          ? `Stopped at ${failed.command}: ${failed.output.slice(0, 180) || "failed"}`
          : `Analytics refresh: ${status}`;
        return send(res, 200, JSON.stringify({ ok: !failed, summary, steps }), "application/json");
      }
      if (u.pathname === "/failure-clear") {
        const name = safeName(data.name);
        fs.rmSync(path.join(FAILED_DIR, `${name}.log`), { force: true });
        return send(res, 200, JSON.stringify({ ok: true, summary: "Failure cleared" }), "application/json");
      }
      if (u.pathname === "/failure-retry") {
        const name = safeName(data.name);
        fs.rmSync(path.join(FAILED_DIR, `${name}.log`), { force: true });
        fs.rmSync(path.join(ROOT, "work", ".done", name), { force: true });
        const r = spawnSync("launchctl", ["kickstart", "-k", `gui/${process.getuid()}/com.talley.contentpipeline`], { cwd: ROOT, encoding: "utf8" });
        const out = ((r.stdout || "") + (r.stderr || "")).trim();
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: r.status === 0 ? "Retry queued" : (out || "Retry kickstart failed") }), "application/json");
      }
      if (u.pathname === "/schedule-live") {
        const liveEnabled = String(process.env.METRICOOL_LIVE_WRITE || "").toLowerCase() === "true";
        if (!liveEnabled) return send(res, 403, JSON.stringify({ ok: false, summary: "Live scheduling is not armed. Set METRICOOL_LIVE_WRITE=true to enable." }), "application/json");
        const job = startScheduleJob({ live: true });
        return send(res, 200, JSON.stringify({ ok: job.status !== "failed", summary: job.status === "running" ? "Metricool scheduling job started" : job.summary, job }), "application/json");
      }
      if (u.pathname === "/blog-generate") {
        const r = spawnSync("node", ["scripts/generate-blog-article.mjs", data.name], { cwd: ROOT, encoding: "utf8" });
        const out = (r.stdout || "") + (r.stderr || "");
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out.trim() || "Blog draft created" }), "application/json");
      }
      if (u.pathname === "/stage-blog") {
        const r = spawnSync("node", ["scripts/stage-blog.mjs", data.name], { cwd: ROOT, encoding: "utf8" });
        const out = (r.stdout || "") + (r.stderr || "");
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out.trim() || "Blog staged" }), "application/json");
      }
      if (u.pathname === "/print-blog-pdf") {
        const r = spawnSync("node", ["scripts/print-blog-pdf.mjs", data.name], { cwd: ROOT, encoding: "utf8" });
        const out = (r.stdout || "") + (r.stderr || "");
        return send(res, 200, JSON.stringify({ ok: r.status === 0, summary: out.trim() || "PDF created" }), "application/json");
      }
      if (u.pathname === "/broll-approve") {
        const libPath = path.join(ROOT, "broll-library.json");
        let lib = []; try { lib = JSON.parse(read(libPath)); } catch (_) {}
        const e = lib.find((x) => x.name === data.name);
        if (e) { e.approved = !!data.approved; fs.writeFileSync(libPath, JSON.stringify(lib, null, 2)); }
        return send(res, 200, JSON.stringify({ ok: !!e }), "application/json");
      }
      send(res, 404, JSON.stringify({ ok: false }), "application/json");
    });
    return;
  }
  send(res, 404, "not found", "text/plain");
});

server.listen(PORT, "127.0.0.1", () => console.log(`[review] http://localhost:${PORT}`));
