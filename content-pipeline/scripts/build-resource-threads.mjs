#!/usr/bin/env node
// build-resource-threads.mjs
// Connects Part 2 follow-up recordings back to blog/resource candidates.
// It also prepares clean follow-up media and a combined 16:9 resource video
// for blog embeds, YouTube, and compliance packages.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX_PATH = path.join(ROOT, "content-index.json");
const BACKLOG_PATH = path.join(ROOT, "reuse-backlog.json");
const THREADS_PATH = path.join(ROOT, "resource-threads.json");
const BLOG_COMPANION_RECORDINGS_PATH = path.join(ROOT, "blog-companion-recordings.json");

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const readJson = (file, fallback) => { try { return JSON.parse(read(file)); } catch (_) { return fallback; } };
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
};
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const index = readJson(INDEX_PATH, { records: [] });
const backlog = readJson(BACKLOG_PATH, []);
const prior = readJson(THREADS_PATH, { threads: [] });
const priorById = new Map((prior.threads || []).map((thread) => [thread.primaryReuseId, thread]));
const recordsById = new Map((index.records || []).map((record) => [record.id, record]));
const blogItems = (Array.isArray(backlog) ? backlog : []).filter((item) => item?.type === "blog" && item?.id);
const followUpsByTarget = new Map();

for (const record of index.records || []) {
  const target = record.followUpTarget;
  if (!target?.id) continue;
  if (!followUpsByTarget.has(target.id)) followUpsByTarget.set(target.id, []);
  followUpsByTarget.get(target.id).push(record);
}

const threads = blogItems.map((item) => buildThread(item)).filter(Boolean);
const blogCompanionRecordings = buildBlogCompanionRecordings();
writeJson(THREADS_PATH, {
  generatedAt: new Date().toISOString(),
  threads,
});
writeJson(BLOG_COMPANION_RECORDINGS_PATH, {
  generatedAt: new Date().toISOString(),
  recordings: blogCompanionRecordings,
});
syncBacklog(threads);
console.log(`[threads] wrote ${threads.length} resource thread(s) -> resource-threads.json`);
console.log(`[threads] wrote ${blogCompanionRecordings.length} blog companion recording(s) -> blog-companion-recordings.json`);

function buildThread(item) {
  const previous = priorById.get(item.id) || {};
  const followUps = (followUpsByTarget.get(item.id) || []).sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
  const sourceVideoIds = unique([item.sourceVideo, ...followUps.map((record) => record.id)].filter(Boolean));
  const baseScore = Math.max(
    scoreReuseCandidate(item),
    Number(item.candidateScore || 0),
    Number(previous.candidateScore || 0),
  );
  const followUpVideoIds = followUps.map((record) => record.id);
  const threadDirRel = `output/${item.sourceVideo}/resource-thread/${slugify(item.id)}`;
  const cleanExports = followUps.map((record) => prepareCleanFollowUp(record)).filter(Boolean);
  const resourceVideoPath = sourceVideoIds.length > 1
    ? buildCombinedVideo({ item, sourceVideoIds, threadDirRel, cleanExports })
    : (previous.resourceVideoPath || "");
  const transcriptBundlePath = sourceVideoIds.length > 1
    ? buildTranscriptBundle({ item, sourceVideoIds, threadDirRel, cleanExports, resourceVideoPath })
    : (previous.transcriptBundlePath || "");
  const score = scoreWithFollowUps(baseScore, { followUpVideoIds, resourceVideoPath });
  const previewNeedsRegeneration = Boolean((item.localUrl || item.localPath) && !sameSet(stagedSourceVideoIdsFor(item), sourceVideoIds));
  const threadStatus = statusFor({ score, followUpVideoIds, resourceVideoPath, item, previewNeedsRegeneration });
  return {
    primaryReuseId: item.id,
    sourceVideo: item.sourceVideo || "",
    sourceVideoIds,
    followUpVideoIds,
    threadStatus,
    candidateScore: score,
    followUpCue: followUpCueFor(item),
    resourceVideoPath,
    transcriptBundlePath,
    cleanSocialVideoPath: cleanExports[0]?.vertical || cleanExports[0]?.captionedVertical || "",
    cleanFollowUpExports: cleanExports,
    previewNeedsRegeneration,
    updatedAt: new Date().toISOString(),
  };
}

function prepareCleanFollowUp(record) {
  const cutStart = cueEndSecond(record.id);
  if (!(cutStart > 0)) return null;
  const exports = {
    sourceVideoId: record.id,
    cueRemovedThroughSecond: Math.round(cutStart * 10) / 10,
  };
  const candidates = [
    ["captionedVertical", `output/${record.id}/captioned_vertical_9x16.mp4`, `output/${record.id}/clean-social/captioned_vertical_9x16.mp4`],
    ["vertical", `output/${record.id}/vertical_9x16.mp4`, `output/${record.id}/clean-social/vertical_9x16.mp4`],
    ["horizontal", `output/${record.id}/horizontal_16x9.mp4`, `output/${record.id}/clean-social/horizontal_16x9.mp4`],
    ["square", `output/${record.id}/square_1x1.mp4`, `output/${record.id}/clean-social/square_1x1.mp4`],
  ];
  for (const [key, srcRel, destRel] of candidates) {
    if (!exists(srcRel)) continue;
    if (!exists(destRel)) trimVideo(srcRel, destRel, cutStart);
    if (exists(destRel)) exports[key] = destRel;
  }
  return exports.horizontal || exports.vertical || exports.captionedVertical ? exports : null;
}

function buildBlogCompanionRecordings() {
  return (index.records || [])
    .filter((record) => record.blogCompanionTarget?.slug)
    .map((record) => {
      const cleanExport = prepareCleanFollowUp(record);
      return {
        sourceVideoId: record.id,
        slug: record.blogCompanionTarget.slug,
        promptId: record.blogCompanionTarget.promptId || record.blogCompanionCue?.promptId || "",
        title: record.blogCompanionTarget.title || record.blogCompanionCue?.title || "",
        matchScore: record.blogCompanionTarget.score || 0,
        matchedBy: record.blogCompanionTarget.matchedBy || "",
        cue: record.blogCompanionCue || null,
        cleanSocialVideoPath: cleanExport?.vertical || cleanExport?.captionedVertical || "",
        cleanHorizontalVideoPath: cleanExport?.horizontal || "",
        cleanCaptionedVideoPath: cleanExport?.captionedVertical || "",
        cleanExports: cleanExport || null,
        transcriptPath: record.transcriptPath || `work/${record.id}/audio.json`,
        status: cleanExport ? "ready_for_blog_refresh" : "matched_needs_clean_export",
        updatedAt: new Date().toISOString(),
      };
    });
}

function trimVideo(srcRel, destRel, cutStart) {
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const r = spawnSync("ffmpeg", [
    "-y",
    "-ss", String(Math.max(0, cutStart)),
    "-i", path.join(ROOT, srcRel),
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "20",
    "-c:a", "aac",
    "-movflags", "+faststart",
    dest,
  ], { encoding: "utf8" });
  if (r.status !== 0) {
    fs.rmSync(dest, { force: true });
    console.warn(`[threads] clean trim failed for ${srcRel}: ${String(r.stderr || r.stdout).slice(0, 500)}`);
  }
}

function buildCombinedVideo({ item, sourceVideoIds, threadDirRel, cleanExports }) {
  const destRel = `${threadDirRel}/resource-video.mp4`;
  const inputs = sourceVideoIds
    .map((videoId, index) => index === 0
      ? pickExistingRel([`output/${videoId}/horizontal_16x9.mp4`, `output/${videoId}/captioned_horizontal_16x9.mp4`])
      : cleanExports.find((entry) => entry.sourceVideoId === videoId)?.horizontal || pickExistingRel([`output/${videoId}/horizontal_16x9.mp4`]))
    .filter(Boolean);
  if (inputs.length < 2) return "";
  if (exists(destRel) && !inputsAreNewer(inputs, destRel)) return destRel;
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const args = ["-y"];
  inputs.forEach((rel) => args.push("-i", path.join(ROOT, rel)));
  const filters = [];
  const concatRefs = [];
  inputs.forEach((_, index) => {
    filters.push(`[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}]`);
    filters.push(`[${index}:a]aformat=sample_rates=48000:channel_layouts=stereo[a${index}]`);
    concatRefs.push(`[v${index}][a${index}]`);
  });
  filters.push(`${concatRefs.join("")}concat=n=${inputs.length}:v=1:a=1[v][a]`);
  args.push(
    "-filter_complex", filters.join(";"),
    "-map", "[v]",
    "-map", "[a]",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "20",
    "-c:a", "aac",
    "-movflags", "+faststart",
    dest,
  );
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) {
    fs.rmSync(dest, { force: true });
    console.warn(`[threads] combined video failed for ${item.id}: ${String(r.stderr || r.stdout).slice(0, 800)}`);
    return "";
  }
  return destRel;
}

function buildTranscriptBundle({ item, sourceVideoIds, threadDirRel, cleanExports, resourceVideoPath }) {
  const sources = [];
  let offset = 0;
  for (const videoId of sourceVideoIds) {
    const audio = readJson(path.join(ROOT, "work", videoId, "audio.json"), {});
    const clean = cleanExports.find((entry) => entry.sourceVideoId === videoId);
    const trimStart = Number(clean?.cueRemovedThroughSecond || 0);
    const segments = (Array.isArray(audio.segments) ? audio.segments : [])
      .map((segment) => {
        const originalStart = Number(segment.start || 0);
        const originalEnd = Number(segment.end || originalStart);
        if (originalEnd <= trimStart) return null;
        return {
          text: normalize(segment.text || ""),
          sourceVideoId: videoId,
          originalStartSecond: Math.max(0, Math.round(originalStart * 10) / 10),
          originalEndSecond: Math.max(0, Math.round(originalEnd * 10) / 10),
          combinedStartSecond: Math.max(0, Math.round((offset + originalStart - trimStart) * 10) / 10),
          combinedEndSecond: Math.max(0, Math.round((offset + originalEnd - trimStart) * 10) / 10),
        };
      })
      .filter((segment) => segment?.text);
    const duration = durationFor(clean?.horizontal || `output/${videoId}/horizontal_16x9.mp4`) || durationFromSegments(segments);
    sources.push({
      sourceVideoId: videoId,
      trimStartSecond: trimStart,
      combinedOffsetSecond: Math.round(offset * 10) / 10,
      transcriptPath: `work/${videoId}/audio.json`,
      segments,
    });
    offset += duration;
  }
  const allSegments = sources.flatMap((source) => source.segments || []);
  const bundle = {
    primaryReuseId: item.id,
    sourceVideoIds,
    resourceVideoPath,
    generatedAt: new Date().toISOString(),
    transcriptText: allSegments.map((segment) => segment.text).join(" "),
    timestampedTranscript: allSegments.map((segment) => `[${timestampFromSeconds(segment.combinedStartSecond)} | ${segment.sourceVideoId} ${timestampFromSeconds(segment.originalStartSecond)}] ${segment.text}`).join("\n"),
    sources,
  };
  const rel = `${threadDirRel}/combined-transcript.json`;
  writeJson(path.join(ROOT, rel), bundle);
  return rel;
}

function syncBacklog(threads) {
  if (!Array.isArray(backlog)) return;
  const byId = new Map(threads.map((thread) => [thread.primaryReuseId, thread]));
  let changed = false;
  for (const item of backlog) {
    const thread = byId.get(item?.id);
    if (!thread) continue;
    const previousSourceVideoIds = Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : [item.sourceVideo].filter(Boolean);
    const stagedSourceVideoIds = stagedSourceVideoIdsFor(item, previousSourceVideoIds);
    const threadChangedPreviewSource = item.localUrl || item.localPath
      ? !sameSet(stagedSourceVideoIds, thread.sourceVideoIds)
      : false;
    item.resourceThread = thread;
    item.resourceThreadStatus = thread.threadStatus;
    item.candidateScore = Math.max(Number(item.candidateScore || 0), Number(thread.candidateScore || 0)) || item.candidateScore || thread.candidateScore;
    item.sourceVideoIds = thread.sourceVideoIds;
    item.resourceVideoPath = thread.resourceVideoPath;
    item.transcriptBundlePath = thread.transcriptBundlePath;
    item.cleanSocialVideoPath = thread.cleanSocialVideoPath;
    item.candidateReadiness = thread.followUpVideoIds.length ? "follow_up_received" : item.candidateReadiness;
    item.previewNeedsRegeneration = Boolean(thread.previewNeedsRegeneration || threadChangedPreviewSource);
    item.previewSourceVideoIds = stagedSourceVideoIds;
    item.resourceThreadUpdatedAt = thread.updatedAt;
    changed = true;
  }
  if (changed) writeJson(BACKLOG_PATH, backlog);
}

function statusFor({ score, followUpVideoIds, resourceVideoPath, item, previewNeedsRegeneration }) {
  if (item.publishPackageCreatedAt || item.compliancePackage?.zipPath) return "package_prepared";
  if (previewNeedsRegeneration && followUpVideoIds.length && resourceVideoPath) return "ready_for_resource_preview";
  if (item.localPath || item.localUrl) return "preview_generated";
  if (followUpVideoIds.length && resourceVideoPath) return "ready_for_resource_preview";
  if (followUpVideoIds.length) return "follow_up_recorded";
  if (score >= 8) return "ready_for_resource_preview";
  if (score >= 7) return "needs_follow_up";
  if (score >= 6) return "source_material_with_follow_up_option";
  return "source_library";
}

function cueEndSecond(videoId) {
  const audio = readJson(path.join(ROOT, "work", videoId, "audio.json"), {});
  const segments = Array.isArray(audio.segments) ? audio.segments : [];
  let combined = "";
  for (const segment of segments.slice(0, 12)) {
    combined = normalize(`${combined} ${segment.text || ""}`);
    if (/\bpart\s+(?:two|2)\s+(?:for|of|on|about|to)[:\s]+.{8,180}?[.?!](?:\s|$)/i.test(combined)
      || /^\s*part\s+(?:two|2)[,:\s]+.{8,180}?[.?!](?:\s|$)/i.test(combined)
      || /\bfollow[-\s]?up\s+(?:for|to|on|about)[:\s]+.{8,180}?[.?!](?:\s|$)/i.test(combined)
      || /\bresource\s+follow[-\s]?up\s+(?:for|to|on|about)[:\s]+.{8,180}?[.?!](?:\s|$)/i.test(combined)
      || /\b(?:blog\s+)?(?:companion|refresh|update)\s+(?:for|to|on|about)[:\s]+.{8,180}?[.?!](?:\s+prompt\s+[a-z0-9_-]+[.?!])?(?:\s|$)/i.test(combined)) {
      const end = Number(segment.end ?? segment.start ?? 0);
      return Math.max(0, end + 0.15);
    }
  }
  if (/^\s*(?:part\s+(?:two|2)(?:\s+(?:for|of|on|about|to)|[,:\s]+)|(?:blog\s+)?(?:companion|refresh|update)\s+(?:for|to|on|about)|follow[-\s]?up\s+(?:for|to|on|about)|resource\s+follow[-\s]?up\s+(?:for|to|on|about))[:\s]+/i.test(normalize(audio.text || ""))) {
    return Math.min(5, Number(segments[0]?.end || 4));
  }
  return 0;
}

function pickExistingRel(candidates) {
  return candidates.find((rel) => rel && exists(rel)) || "";
}

function durationFor(rel) {
  if (!rel || !exists(rel)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(ROOT, rel)], { encoding: "utf8" });
  return r.status === 0 ? Number(String(r.stdout || "").trim()) || 0 : 0;
}

function inputsAreNewer(inputs, destRel) {
  const destPath = path.join(ROOT, destRel);
  if (!fs.existsSync(destPath)) return true;
  const destTime = fs.statSync(destPath).mtimeMs;
  return inputs.some((rel) => fs.existsSync(path.join(ROOT, rel)) && fs.statSync(path.join(ROOT, rel)).mtimeMs > destTime + 1000);
}

function durationFromSegments(segments) {
  return Math.max(0, ...segments.map((segment) => Number(segment.combinedEndSecond || 0)));
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

function scoreWithFollowUps(baseScore, { followUpVideoIds, resourceVideoPath }) {
  const count = Array.isArray(followUpVideoIds) ? followUpVideoIds.length : 0;
  if (!count) return baseScore;
  const lift = Math.min(2, 1.2 + (count - 1) * 0.4 + (resourceVideoPath ? 0.3 : 0));
  const score = Math.max(8, Number(baseScore || 0) + lift);
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function sameSet(a, b) {
  const left = new Set((Array.isArray(a) ? a : []).filter(Boolean));
  const right = new Set((Array.isArray(b) ? b : []).filter(Boolean));
  if (left.size !== right.size) return false;
  for (const value of left) if (!right.has(value)) return false;
  return true;
}

function stagedSourceVideoIdsFor(item, fallback = null) {
  const fallbackIds = fallback || (Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : [item.sourceVideo].filter(Boolean));
  if (!item?.sourceVideo) return fallbackIds;
  const stagedMeta = readJson(path.join(ROOT, "output", item.sourceVideo, "blog-page.json"), {});
  return Array.isArray(stagedMeta.sourceVideoIds) && stagedMeta.sourceVideoIds.length ? stagedMeta.sourceVideoIds : fallbackIds;
}

function followUpCueFor(item) {
  return `Part 2 for: ${cleanCueTitle(item.h1Title || item.suggestedTitle || item.title || item.coreQuestion || item.id)}`;
}

function cleanCueTitle(value) {
  return String(value || "")
    .replace(/\s+\((emotionally and practically|practically and emotionally)\)/ig, "")
    .replace(/\s+\((?:and )?what to do(?: next)?\)/ig, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!]+$/g, "");
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "resource-thread";
}

function normalize(value) {
  return String(value || "").replace(/[\u2014\u2013]/g, ", ").replace(/\s+/g, " ").trim();
}

function timestampFromSeconds(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
