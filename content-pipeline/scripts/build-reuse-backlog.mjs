#!/usr/bin/env node
// build-reuse-backlog.mjs
// Turns content-index routing recommendations into item-level reuse queue entries.
// Preserves existing statuses/notes/draft paths and never generates drafts itself.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = path.join(ROOT, "content-index.json");
const BACKLOG = path.join(ROOT, "reuse-backlog.json");

const TYPE_MAP = {
  video_explainer_page: { type: "video_explainer_page", label: "Rich Resource Page", detailKeys: ["suggestedTitle", "coreQuestion", "whyThisCouldBeDurable"] },
  blog: { type: "blog", label: "Blog" },
  landingPage: { type: "landing_page_brief", label: "Landing page brief", detailKeys: ["candidateAngle"] },
  learningCenterOrFaq: { type: "learning_center_faq", label: "Learning Center / FAQ", detailKeys: ["candidateQuestion"] },
  onePager: { type: "one_pager", label: "One-pager", detailKeys: ["candidateUse"] },
  email: { type: "email_planning_note", label: "Email planning note", detailKeys: ["candidateAudience"] },
  websiteReuse: { type: "website_reuse_snippet", label: "Website reuse snippet", detailKeys: ["candidateLocation"] },
};
const DISABLED_TYPES = new Set();

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const readJson = (p, fallback) => { try { return JSON.parse(read(p)); } catch (_) { return fallback; } };

if (!fs.existsSync(INDEX)) {
  const r = spawnSync("node", ["scripts/build-content-index.mjs"], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    console.error((r.stdout || "") + (r.stderr || ""));
    process.exit(r.status || 1);
  }
}

const index = readJson(INDEX, { records: [] });
const existing = readJson(BACKLOG, []);
const existingById = new Map((Array.isArray(existing) ? existing : []).filter((item) => item?.id).map((item) => [item.id, item]));
const legacy = (Array.isArray(existing) ? existing : []).filter((item) => item && !item.id);
const generated = [];

for (const record of index.records || []) {
  const routing = record.routingRecommendations || {};
  for (const [key, config] of Object.entries(TYPE_MAP)) {
    const rec = routing[key] || {};
    const verdict = String(rec.recommend || "").toLowerCase();
    if (!["yes", "maybe"].includes(verdict)) continue;
    const id = stableId(record.id, config.type);
    const prev = existingById.get(id) || {};
    const detail = [rec.reason, ...(config.detailKeys || []).map((k) => rec[k])].filter(Boolean).join(" ");
    const now = new Date().toISOString();
    const draftPath = workflowDraftPath(prev, record, id, config.type);
    const stageMeta = readStageMeta(prev, record, id, config.type);
    const workflowStatus = prev.workflowStatus || workflowStatusFromArtifacts({ prev, draftPath, stageMeta }) || "candidate";
    const topic = cleanPublicTitle(topicFor(record, rec, key));
    generated.push({
      id,
      sourceVideo: record.id,
      type: config.type,
      typeLabel: config.label,
      title: topic,
      topic,
      audience: record.personaFit?.primaryLane || "",
      personaFit: record.personaFit || {},
      distributionRecommendations: record.distributionRecommendations || {},
      recommendation: rec.recommend,
      recommendationReason: detail || rec.reason || "",
      confidence: rec.confidence || "medium",
      suggestedTitle: rec.suggestedTitle || "",
      coreQuestion: rec.coreQuestion || "",
      whyThisCouldBeDurable: rec.whyThisCouldBeDurable || "",
      suggestedSections: Array.isArray(rec.suggestedSections) ? rec.suggestedSections : [],
      relatedAssetIdeas: Array.isArray(rec.relatedAssetIdeas) ? rec.relatedAssetIdeas : [],
      transcriptPath: record.transcriptPath || `work/${record.id}/audio.json`,
      sourceTranscriptPath: record.transcriptPath || `work/${record.id}/audio.json`,
      sourceOutputPaths: record.outputPaths || {},
      sourceLines: record.bestSourceLines || [],
      candidateScore: candidateScoreFor({ prev, stageMeta, rec, record }),
      candidateSummary: prev.candidateSummary || stageMeta.candidateSummary || "",
      primaryCategory: prev.primaryCategory || stageMeta.primaryCategory || "",
      tags: Array.isArray(prev.tags) ? prev.tags : (Array.isArray(stageMeta.tags) ? stageMeta.tags : []),
      audienceLane: prev.audienceLane || stageMeta.audienceLane || record.personaFit?.primaryLane || "",
      contentFormat: prev.contentFormat || stageMeta.contentFormat || (config.type === "blog" ? "Blog article" : ""),
      decisionTheme: prev.decisionTheme || stageMeta.decisionTheme || "",
      sourceBasis: prev.sourceBasis || stageMeta.sourceBasis || null,
      h1Title: cleanPublicTitle(prev.h1Title || stageMeta.h1Title || rec.suggestedTitle || ""),
      seoTitle: prev.seoTitle || stageMeta.seoTitle || "",
      titleRationale: prev.titleRationale || stageMeta.titleRationale || "",
      youtubeReuse: prev.youtubeReuse || stageMeta.youtubeReuse || null,
      compliancePackage: prev.compliancePackage || stageMeta.compliancePackage || null,
      resourceThread: prev.resourceThread || stageMeta.resourceThread || null,
      resourceThreadStatus: prev.resourceThreadStatus || stageMeta.resourceThreadStatus || "",
      sourceVideoIds: Array.isArray(prev.sourceVideoIds) ? prev.sourceVideoIds : (Array.isArray(stageMeta.sourceVideoIds) ? stageMeta.sourceVideoIds : [record.id].filter(Boolean)),
	      resourceVideoPath: prev.resourceVideoPath || stageMeta.resourceVideoPath || "",
	      transcriptBundlePath: prev.transcriptBundlePath || stageMeta.transcriptBundlePath || "",
	      cleanSocialVideoPath: prev.cleanSocialVideoPath || stageMeta.cleanSocialVideoPath || "",
	      previewNeedsRegeneration: Boolean(prev.previewNeedsRegeneration || stageMeta.previewNeedsRegeneration),
	      previewSourceVideoIds: Array.isArray(prev.previewSourceVideoIds) ? prev.previewSourceVideoIds : (Array.isArray(stageMeta.previewSourceVideoIds) ? stageMeta.previewSourceVideoIds : []),
	      resourceThreadUpdatedAt: prev.resourceThreadUpdatedAt || stageMeta.resourceThreadUpdatedAt || "",
	      candidateReadiness: prev.candidateReadiness || stageMeta.candidateReadiness || "",
      followUpCue: prev.followUpCue || stageMeta.followUpCue || "",
      followUpPrompt: prev.followUpPrompt || stageMeta.followUpPrompt || "",
      followUpTargetId: prev.followUpTargetId || stageMeta.followUpTargetId || "",
      status: normalizeWorkflowStatus(prev.status, workflowStatus, config.type),
      workflowStatus,
      complianceStatus: prev.complianceStatus || "not_submitted",
      draftPath,
      stagedPath: prev.stagedPath || stageMeta.stagedPath || "",
      localPath: prev.localPath || stageMeta.localPath || "",
      localUrl: prev.localUrl || stageMeta.localUrl || "",
      slug: prev.slug || stageMeta.slug || "",
      pdfPath: prev.pdfPath || stageMeta.pdfPath || "",
      pdfCreatedAt: prev.pdfCreatedAt || stageMeta.pdfCreatedAt || "",
      pageMetaPath: prev.pageMetaPath || stageMeta.pageMetaPath || "",
      contentKind: prev.contentKind || stageMeta.contentKind || (config.type === "video_explainer_page" ? "video_explainer_page" : config.type === "blog" ? "blog" : ""),
      layoutVariant: prev.layoutVariant || stageMeta.layoutVariant || (config.type === "video_explainer_page" ? "rich_resource_page" : config.type === "blog" ? "article" : ""),
      complianceEmailDraftPath: prev.complianceEmailDraftPath || findComplianceEmailDraft(id),
      complianceEmailDraftedAt: prev.complianceEmailDraftedAt || "",
      complianceSentAt: prev.complianceSentAt || "",
      readyToPublishAt: prev.readyToPublishAt || "",
      publishedAt: prev.publishedAt || "",
      publishChecklistPath: prev.publishChecklistPath || findPublishChecklist(id),
      createdAt: prev.createdAt || now,
      updatedAt: prev.updatedAt || now,
      notes: prev.notes || "",
    });
  }
}

const generatedIds = new Set(generated.map((item) => item.id));
const carried = [...existingById.values()].filter((item) => !generatedIds.has(item.id) && !DISABLED_TYPES.has(item.type));
const next = [...generated, ...carried, ...legacy].sort((a, b) => String(a.id || a.name).localeCompare(String(b.id || b.name)));
fs.writeFileSync(BACKLOG, JSON.stringify(next, null, 2));

console.log(`[reuse] wrote ${generated.length} generated candidate(s), carried ${carried.length} existing item(s)${legacy.length ? `, preserved ${legacy.length} legacy item(s)` : ""} -> reuse-backlog.json`);

function stableId(video, type) {
  return `${slug(video)}__${type}`;
}
function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}
function topicFor(record, rec, key) {
  return rec.suggestedTitle || rec.coreQuestion || rec.candidateQuestion || rec.candidateAngle || rec.candidateUse || rec.candidateAudience || rec.candidateLocation || record.title || record.id;
}
function cleanPublicTitle(value) {
  return String(value || "")
    .replace(/\s+\((emotionally and practically|practically and emotionally)\)/ig, "")
    .replace(/\s+\((?:and )?what to do(?: next)?\)/ig, "")
    .replace(/\s+/g, " ")
    .trim();
}
function findDraftPath(id, type) {
  const file = {
    video_explainer_page: "video-explainer-page.md",
    landing_page_brief: "landing-page-brief.md",
    learning_center_faq: "learning-center-faq-draft.md",
    one_pager: "one-pager-draft.md",
    email_planning_note: "email-planning-note.md",
    website_reuse_snippet: "website-snippet-packet.md",
    blog: "blog-workflow-note.md",
  }[type];
  const rel = file ? `reuse-output/${id}/${file}` : "";
  return rel && fs.existsSync(path.join(ROOT, rel)) ? rel : "";
}
function workflowDraftPath(prev, record, id, type) {
  if (type === "blog") {
    const blogDraft = record.outputPaths?.blogDraft || `output/${record.id}/blog-draft.md`;
    if (blogDraft && fs.existsSync(path.join(ROOT, blogDraft))) return blogDraft;
    if (prev.draftPath && fs.existsSync(path.join(ROOT, prev.draftPath)) && !prev.draftPath.endsWith("/blog-workflow-note.md")) return prev.draftPath;
    return prev.draftPath || findDraftPath(id, type);
  }
  if (prev.draftPath && fs.existsSync(path.join(ROOT, prev.draftPath))) return prev.draftPath;
  return findDraftPath(id, type);
}
function readStageMeta(prev, record, id, type) {
  const rel = type === "blog"
    ? `output/${record.id}/blog-page.json`
    : `reuse-output/${id}/page.json`;
  const meta = readJson(path.join(ROOT, rel), {});
  if (!meta || typeof meta !== "object") return {};
  return {
    ...meta,
    pageMetaPath: rel,
    stagedPath: meta.stagedPath || (meta.slug ? "src/data/talley-wealth/generated-blog-posts.ts" : ""),
    contentKind: meta.contentKind || (type === "blog" ? "blog" : type === "video_explainer_page" ? "video_explainer_page" : ""),
    layoutVariant: meta.layoutVariant || (type === "blog" ? "article" : type === "video_explainer_page" ? "rich_resource_page" : ""),
  };
}
function workflowStatusFromArtifacts({ prev, draftPath, stageMeta }) {
  if (prev.publishedAt || prev.status === "published") return "published";
  if (prev.readyToPublishAt || prev.status === "ready_to_publish") return "ready_to_publish";
  if (prev.complianceSentAt || prev.complianceStatus === "sent_to_compliance") return "sent_to_compliance";
  if (prev.complianceEmailDraftPath || findComplianceEmailDraft(prev.id || "")) return "compliance_email_drafted";
  if (prev.pdfCreatedAt || stageMeta.pdfCreatedAt) return "pdf_created";
  if (prev.localPath || stageMeta.localPath) return "staged_preview";
  if (draftPath) return "draft_generated";
  return "";
}
function normalizeWorkflowStatus(status, workflowStatus, type) {
  const current = String(status || "");
  if (["blog", "video_explainer_page"].includes(type)) {
    if (current === "declined" || current === "published" || current === "ready_to_publish" || current === "sent_to_compliance") return current;
    if (current === "approved") return "ready_to_publish";
    if (current === "needs_review") return current;
    if (current === "drafted") return workflowStatus || "draft_generated";
    return current || workflowStatus || "candidate";
  }
  return current || workflowStatus || "candidate";
}
function scoreReuseCandidate({ rec, sourceLines, status }) {
  let score = 5;
  const recommend = String(rec?.recommend || "").toLowerCase();
  const confidence = String(rec?.confidence || "").toLowerCase();
  if (recommend === "yes") score += 2;
  if (recommend === "maybe") score += 0.5;
  if (confidence === "high") score += 1.5;
  if (confidence === "medium") score += 0.5;
  if (rec?.coreQuestion || rec?.candidateQuestion) score += 0.5;
  if (Array.isArray(sourceLines) && sourceLines.length >= 3) score += 0.5;
  if (status === "declined") score = Math.min(score, 2);
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}
function candidateScoreFor({ prev, stageMeta, rec, record }) {
  const computed = scoreReuseCandidate({ rec, sourceLines: record.bestSourceLines || [], status: prev.status });
  const stored = [
    prev.candidateScore,
    stageMeta.candidateScore,
    prev.resourceThread?.candidateScore,
    stageMeta.resourceThread?.candidateScore,
  ]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  return Math.max(computed, ...stored);
}
function findComplianceEmailDraft(id) {
  const rel = `reuse-output/${id}/compliance-email-draft.md`;
  return id && fs.existsSync(path.join(ROOT, rel)) ? rel : "";
}
function findPublishChecklist(id) {
  const rel = `reuse-output/${id}/publish-checklist.md`;
  return id && fs.existsSync(path.join(ROOT, rel)) ? rel : "";
}
