#!/usr/bin/env node
// build-content-index.mjs
// Scans local pipeline outputs and writes durable inventory files.
// No posting, publishing, uploads, or scheduling.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const WORK = path.join(ROOT, "work");
const QUEUE = path.join(ROOT, "approval-queue");
const INDEX = path.join(ROOT, "content-index.json");
const CSV = path.join(ROOT, "content-inventory.csv");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const readJson = (p, fallback) => {
  try { return JSON.parse(read(p)); } catch (_) { return fallback; }
};
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const approvals = new Set(readJson(path.join(ROOT, "approvals.json"), []));
const assetDecisions = readJson(path.join(ROOT, "asset-decisions.json"), {});
const schedule = readJson(path.join(ROOT, "schedule.json"), []);
const reuseBacklog = readJson(path.join(ROOT, "reuse-backlog.json"), []);
const distributionRouting = readJson(path.join(ROOT, "distribution-routing.json"), { records: [] });
const distributionByVideo = new Map((distributionRouting.records || []).map((record) => [record.sourceVideo, record]));
const blogCompanionPrompts = readJson(path.join(ROOT, "blog-companion-prompts.json"), { items: [] });

const names = new Set();
if (fs.existsSync(OUT)) {
  for (const name of fs.readdirSync(OUT)) {
    const dir = path.join(OUT, name);
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory() && name !== "broll-overlays" && isReviewReady(name)) names.add(name);
  }
}
if (fs.existsSync(QUEUE)) {
  for (const file of fs.readdirSync(QUEUE)) {
    if (file.endsWith(".md") && file !== ".gitkeep") {
      const name = path.basename(file, ".md");
      if (isReviewReady(name)) names.add(name);
    }
  }
}

const records = [...names].sort().map(buildRecord);
const payload = {
  generatedAt: new Date().toISOString(),
  root: ROOT,
  count: records.length,
  records,
};

fs.writeFileSync(INDEX, JSON.stringify(payload, null, 2));
fs.writeFileSync(CSV, toCsv(records));

if (!records.length) console.log("[index] no videos found; wrote empty content-index.json and content-inventory.csv");
else console.log(`[index] wrote ${records.length} record(s) -> content-index.json, content-inventory.csv`);

function buildRecord(name) {
  const outDir = path.join(OUT, name);
  const workDir = path.join(WORK, name);
  const audioPath = path.join(workDir, "audio.json");
  const audio = readJson(audioPath, {});
  const contentLogPath = path.join(outDir, "content-log.json");
  const contentLog = readJson(contentLogPath, {});
  const socialPackPath = path.join(outDir, "social-pack.md");
  const socialPack = read(socialPackPath);
  const xPackPath = path.join(outDir, "x-pack.json");
  const xPack = readJson(xPackPath, null);
  const approvalPath = path.join(QUEUE, `${name}.md`);
  const approvalMd = read(approvalPath);
  const statPaths = [
    audioPath,
    contentLogPath,
    socialPackPath,
    xPackPath,
    approvalPath,
    path.join(outDir, "blog-draft.md"),
  ].filter((p) => fs.existsSync(p));
  const times = statPaths.flatMap((p) => {
    const st = fs.statSync(p);
    return [st.birthtimeMs, st.mtimeMs].filter(Boolean);
  });
  const createdAt = times.length ? new Date(Math.min(...times)).toISOString() : "";
  const updatedAt = times.length ? new Date(Math.max(...times)).toISOString() : "";
  const transcriptText = normalize(audio.text || (audio.segments || []).map((s) => s.text).join(" "));
  const followUpCue = detectFollowUpCue(transcriptText);
  const followUpTarget = followUpCue ? matchFollowUpTarget(followUpCue, reuseBacklog, name) : null;
  const blogCompanionCue = detectBlogCompanionCue(transcriptText);
  const blogCompanionTarget = blogCompanionCue ? matchBlogCompanionTarget(blogCompanionCue, blogCompanionPrompts.items || []) : null;
  const scheduled = Array.isArray(schedule) ? schedule.filter((row) => row.video === name) : [];
  const outputPaths = collectOutputPaths(name);

  return {
    id: name,
    name,
    promptId: contentLog.promptId || "",
    recordingPromptId: contentLog.recordingPromptId || contentLog.promptId || "",
    title: contentLog.title || extractSocialField(socialPack, "Title") || xPack?.title || name,
    triage: contentLog.triage || extractSocialField(socialPack, "Suggested triage") || "",
    pillar: contentLog.pillar || extractSocialField(socialPack, "Pillar") || "",
    personaFit: contentLog.personaFit || {},
    distributionRecommendations: contentLog.distributionRecommendations || distributionByVideo.get(name) || {},
    routingRecommendations: contentLog.routingRecommendations || {},
    followUpCue,
    followUpTarget,
    blogCompanionCue,
    blogCompanionTarget,
    transcriptText,
    transcriptPath: fs.existsSync(audioPath) ? path.relative(ROOT, audioPath) : "",
    bestSourceLines: bestSourceLines({ socialPack, xPack, transcriptText }),
    blogDraftExists: fs.existsSync(path.join(outDir, "blog-draft.md")),
    approvalStatus: approvals.has(name) ? "approved" : approvalMd ? "pending" : (contentLog.approvalStatus || "unqueued"),
    approved: approvals.has(name),
    assetDecisions: assetDecisions[name] || {},
    scheduledAssets: scheduled.map((row) => ({ date: row.date, time: row.time, platform: row.platformLabel || row.platform, asset: row.asset })),
    outputPaths,
    createdAt: contentLog.createdAt || createdAt,
    updatedAt,
    reuseStatusSummary: summarizeReuse(name),
  };
}

function detectFollowUpCue(transcriptText) {
  const text = normalize(transcriptText);
  const patterns = [
    /\bpart\s+(?:two|2)\s+(?:for|of|on|about|to)[:\s]+(.{8,160}?)(?:[.?!]\s|$)/i,
    /^\s*part\s+(?:two|2)[,:\s]+(.{8,160}?)(?:[.?!]\s|$)/i,
    /\bfollow[-\s]?up\s+(?:for|to|on|about)[:\s]+(.{8,160}?)(?:[.?!]\s|$)/i,
    /\bresource\s+follow[-\s]?up\s+(?:for|to|on|about)[:\s]+(.{8,160}?)(?:[.?!]\s|$)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return cleanCue(match[1]);
  }
  return "";
}

function detectBlogCompanionCue(transcriptText) {
  const text = normalize(transcriptText);
  const promptMatch = text.match(/\b(?:blog\s+)?(?:companion|refresh|update)\s+(?:for|to|on|about)[:\s]+(.{8,180}?)[.?!](?:\s+prompt\s+([a-z0-9_-]+)[.?!])?(?:\s|$)/i);
  if (!promptMatch) return null;
  return {
    title: cleanCue(promptMatch[1]),
    promptId: normalize(promptMatch[2] || ""),
    raw: normalize(promptMatch[0]),
  };
}

function matchFollowUpTarget(cue, backlog, currentVideoName = "") {
  const needle = comparable(cue);
  if (!needle) return null;
  const candidates = (Array.isArray(backlog) ? backlog : [])
    .filter((item) => item && item.id)
    .filter((item) => !currentVideoName || item.sourceVideo !== currentVideoName)
    .map((item) => {
      const labels = [
        item.h1Title,
        item.suggestedTitle,
        item.title,
        item.coreQuestion,
        item.followUpCue && String(item.followUpCue).replace(/^part\s+(?:two|2)\s+for[:\s]+/i, ""),
      ].filter(Boolean);
      const best = labels
        .map((label) => ({ label, score: similarity(needle, comparable(label)) }))
        .sort((a, b) => b.score - a.score)[0];
      return best ? { id: item.id, sourceVideo: item.sourceVideo || "", title: best.label, score: best.score, type: item.type || "" } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best && best.score >= 0.72 ? best : null;
}

function matchBlogCompanionTarget(cue, prompts) {
  const items = Array.isArray(prompts) ? prompts : [];
  const promptNeedle = comparable(cue.promptId || "");
  if (promptNeedle) {
    const byPrompt = items.find((item) => comparable(item.promptId || "") === promptNeedle);
    if (byPrompt) return blogCompanionTargetFor(byPrompt, 1, "prompt_id");
  }
  const titleNeedle = comparable(cue.title || "");
  if (!titleNeedle) return null;
  const candidates = items
    .map((item) => {
      const labels = [item.title, item.slug, item.routingCue].filter(Boolean);
      const best = labels
        .map((label) => ({ label, score: similarity(titleNeedle, comparable(label)) }))
        .sort((a, b) => b.score - a.score)[0];
      return best ? { item, score: best.score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best && best.score >= 0.68 ? blogCompanionTargetFor(best.item, best.score, "title") : null;
}

function blogCompanionTargetFor(item, score, matchedBy) {
  return {
    slug: item.slug || "",
    promptId: item.promptId || "",
    title: item.title || "",
    score,
    matchedBy,
    type: "existing_blog_companion",
  };
}

function cleanCue(value) {
  return normalize(value).replace(/^["']|["']$/g, "").replace(/[.?!]+$/g, "").trim();
}

function comparable(value) {
  return normalize(value).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function similarity(a, b) {
  const aw = new Set(a.split(" ").filter((word) => word.length > 2));
  const bw = new Set(b.split(" ").filter((word) => word.length > 2));
  if (!aw.size || !bw.size) return 0;
  const overlap = [...aw].filter((word) => bw.has(word)).length;
  return overlap / Math.max(aw.size, bw.size);
}

function collectOutputPaths(name) {
  const base = `output/${name}`;
  const paths = {
    outputDir: exists(base) ? `${base}/` : "",
    socialPack: exists(`${base}/social-pack.md`) ? `${base}/social-pack.md` : "",
    contentLog: exists(`${base}/content-log.json`) ? `${base}/content-log.json` : "",
    xPack: exists(`${base}/x-pack.json`) ? `${base}/x-pack.json` : "",
    blogDraft: exists(`${base}/blog-draft.md`) ? `${base}/blog-draft.md` : "",
    approvalNote: exists(`approval-queue/${name}.md`) ? `approval-queue/${name}.md` : "",
    captionedVideo: exists(`${base}/captioned_vertical_9x16.mp4`) ? `${base}/captioned_vertical_9x16.mp4` : "",
    cleanSocialCaptionedVideo: exists(`${base}/clean-social/captioned_vertical_9x16.mp4`) ? `${base}/clean-social/captioned_vertical_9x16.mp4` : "",
    cleanSocialVerticalVideo: exists(`${base}/clean-social/vertical_9x16.mp4`) ? `${base}/clean-social/vertical_9x16.mp4` : "",
    cleanSocialHorizontalVideo: exists(`${base}/clean-social/horizontal_16x9.mp4`) ? `${base}/clean-social/horizontal_16x9.mp4` : "",
    cover: exists(`${base}/cover.jpg`) ? `${base}/cover.jpg` : "",
    carousel: exists(`${base}/carousel/slides.json`) ? `${base}/carousel/slides.json` : "",
    transcript: exists(`work/${name}/audio.json`) ? `work/${name}/audio.json` : "",
  };
  const overlayDir = path.join(OUT, "broll-overlays");
  paths.brollOverlays = fs.existsSync(overlayDir)
    ? fs.readdirSync(overlayDir).filter((file) => file.startsWith(`${name}_`) && file.endsWith(".mp4")).map((file) => `output/broll-overlays/${file}`)
    : [];
  return paths;
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

function bestSourceLines({ socialPack, xPack, transcriptText }) {
  const lines = [];
  for (const label of ["Organizing thesis", "Deeper problem", "Surface question"]) {
    const value = extractSocialField(socialPack, label);
    if (value) lines.push({ source: "social-pack", label, text: value });
  }
  const shortCaption = extractSocialSection(socialPack, "Short caption (for the captioned Reel/Short itself)");
  if (shortCaption) lines.push({ source: "social-pack", label: "short caption", text: shortCaption });
  if (xPack?.thread?.[0]) lines.push({ source: "x-pack", label: "thread opener", text: xPack.thread[0] });
  if (Array.isArray(xPack?.standalone)) {
    xPack.standalone.slice(0, 2).forEach((text, i) => lines.push({ source: "x-pack", label: `standalone ${i + 1}`, text }));
  }
  if (!lines.length && transcriptText) {
    const sentence = transcriptText.split(/(?<=[.!?])\s+/).find((s) => s.length > 30) || transcriptText.slice(0, 220);
    lines.push({ source: "transcript", label: "first usable line", text: sentence });
  }
  return lines.map((item) => ({ ...item, text: normalize(item.text).slice(0, 500) })).filter((item) => item.text);
}

function summarizeReuse(name) {
  const items = Array.isArray(reuseBacklog)
    ? reuseBacklog.filter((item) => item.sourceVideo === name || item.sourceVideo === name || item.name === name)
    : [];
  if (!items.length) return "none";
  const counts = {};
  for (const item of items) counts[item.status || "candidate"] = (counts[item.status || "candidate"] || 0) + 1;
  return Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ");
}

function extractSocialField(md, label) {
  const re = new RegExp(`\\*\\*${escapeRe(label)}:\\*\\*\\s*(.+)`);
  return normalize((md.match(re) || [])[1] || "");
}

function extractSocialSection(md, heading) {
  const parts = md.split(/^##\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const h = part.slice(0, nl).trim();
    if (h === heading) return normalize(part.slice(nl + 1).split(/^---/m)[0]);
  }
  return "";
}

function toCsv(records) {
  const headers = [
    "id", "prompt_id", "recording_prompt_id", "title", "triage", "pillar", "persona_lane", "fit_strength", "approval_status",
    "blog_draft_exists", "reuse_status_summary", "transcript_path", "output_dir", "updated_at"
  ];
  const rows = [headers.join(",")];
  for (const r of records) {
    rows.push([
      r.id,
      r.promptId,
      r.recordingPromptId,
      r.title,
      r.triage,
      r.pillar,
      r.personaFit?.primaryLane || "",
      r.personaFit?.fitStrength || "",
      r.approvalStatus,
      r.blogDraftExists ? "true" : "false",
      r.reuseStatusSummary,
      r.transcriptPath,
      r.outputPaths?.outputDir || "",
      r.updatedAt,
    ].map(csvCell).join(","));
  }
  return rows.join("\n") + "\n";
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}
function normalize(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function escapeRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
