#!/usr/bin/env node
// longform-workflow.mjs <action> <reuse-id> [baseUrl]
// Gated local workflow for blog and Rich Resource Page candidates.
// No live publishing, deploys, uploads, sends, or social scheduling.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const BACKLOG = path.join(ROOT, "reuse-backlog.json");
const GENERATED = path.join(SITE, "src", "data", "talley-wealth", "generated-blog-posts.ts");
const action = process.argv[2] || "";
const id = process.argv[3] || "";
const baseUrl = (process.argv[4] || "http://localhost:5181").replace(/\/$/, "");

const SUPPORTED = new Set(["blog", "video_explainer_page"]);
const STATUS = {
  candidate: "candidate",
  draft: "draft_generated",
  staged: "staged_preview",
  approvedForCompliance: "approved_for_compliance",
  pdf: "pdf_created",
  email: "compliance_email_drafted",
  sent: "sent_to_compliance",
  ready: "ready_to_publish",
  published: "published",
  declined: "declined",
};

if (!action || !id) {
  console.error("usage: node scripts/longform-workflow.mjs <generate-draft|preview|stage|print-pdf|draft-compliance-email|mark-sent|mark-ready|prepare-publish> <reuse-id> [baseUrl]");
  process.exit(1);
}

let backlog = readJson(BACKLOG, []);
const item = backlog.find((entry) => entry?.id === id);
if (!item) fail(`reuse item not found: ${id}`);
if (!SUPPORTED.has(item.type)) fail(`unsupported long-form type for this workflow: ${item.type}`);

try {
  if (action === "generate-draft") generateDraft(item);
  else if (action === "preview") previewItem(item);
  else if (action === "stage") stageItem(item);
  else if (action === "print-pdf") printPdf(item);
  else if (action === "draft-compliance-email") draftComplianceEmail(item);
  else if (action === "mark-sent") markSent(item);
  else if (action === "mark-ready") markReady(item);
  else if (action === "prepare-publish") preparePublish(item);
  else fail(`unknown action: ${action}`);
  saveBacklog();
} catch (error) {
  fail(error.message || String(error));
}

function previewItem(item) {
  generateDraft(item);
  stageItem(item);
}

function generateDraft(item) {
  if (item.type === "blog") {
    const threads = run("node", ["scripts/build-resource-threads.mjs"]);
    if (threads.ok) refreshItem(item);
    const r = run("node", ["scripts/generate-blog-article.mjs", item.sourceVideo, "--no-stage"]);
    if (!r.ok) throw new Error(r.output || "blog draft generation failed");
    const rel = `output/${item.sourceVideo}/blog-draft.md`;
    if (!exists(rel)) throw new Error(`blog draft was not created at ${rel}`);
    updateItem(item, {
      draftPath: rel,
      status: item.status === STATUS.declined ? item.status : STATUS.draft,
      workflowStatus: STATUS.draft,
    });
    console.log(`[longform] ${item.id}: generated blog draft -> ${rel}`);
    return;
  }

  const r = run("node", ["scripts/generate-reuse-draft.mjs", item.id]);
  if (!r.ok) throw new Error(r.output || "reuse draft generation failed");
  backlog = readJson(BACKLOG, backlog);
  const refreshed = backlog.find((entry) => entry?.id === item.id);
  if (refreshed) Object.assign(item, refreshed);
  const rel = item.draftPath || `reuse-output/${item.id}/video-explainer-page.md`;
  if (!exists(rel)) throw new Error(`rich resource draft was not created at ${rel}`);
  updateItem(item, {
    draftPath: rel,
    status: item.status === STATUS.declined ? item.status : STATUS.draft,
    workflowStatus: STATUS.draft,
  });
  console.log(`[longform] ${item.id}: generated Rich Resource Page draft -> ${rel}`);
}

function refreshItem(item) {
  backlog = readJson(BACKLOG, backlog);
  const refreshed = backlog.find((entry) => entry?.id === item.id);
  if (refreshed) Object.assign(item, refreshed);
}

function stageItem(item) {
  if (!item.draftPath || !exists(item.draftPath)) generateDraft(item);

  if (item.type === "blog") {
    const r = run("node", ["scripts/stage-blog.mjs", item.sourceVideo]);
    if (!r.ok) throw new Error(r.output || "blog staging failed");
    const meta = readJson(path.join(ROOT, "output", item.sourceVideo, "blog-page.json"), {});
    updateItem(item, {
      workflowStatus: STATUS.staged,
      status: STATUS.staged,
      slug: meta.slug || item.slug || "",
      stagedPath: "src/data/talley-wealth/generated-blog-posts.ts",
      localPath: meta.localPath || "",
      localUrl: meta.localUrl || "",
      pdfPath: meta.pdfPath || item.pdfPath || "",
      stagedAt: meta.stagedAt || new Date().toISOString(),
      sourceMomentCount: meta.sourceMomentCount || 0,
      sourceMomentsPath: meta.sourceMomentsPath || "",
      candidateScore: meta.candidateScore || item.candidateScore,
      candidateSummary: meta.candidateSummary || item.candidateSummary || "",
      primaryCategory: meta.primaryCategory || item.primaryCategory || "",
      tags: Array.isArray(meta.tags) ? meta.tags : item.tags,
      audienceLane: meta.audienceLane || item.audienceLane || item.audience || "",
      contentFormat: meta.contentFormat || item.contentFormat || "Blog article",
      decisionTheme: meta.decisionTheme || item.decisionTheme || "",
      sourceBasis: meta.sourceBasis || item.sourceBasis || null,
      h1Title: meta.h1Title || item.h1Title || item.suggestedTitle || item.title || "",
      seoTitle: meta.seoTitle || item.seoTitle || "",
      titleRationale: meta.titleRationale || item.titleRationale || "",
      youtubeReuse: meta.youtubeReuse || item.youtubeReuse || null,
      compliancePackage: meta.compliancePackage || item.compliancePackage || null,
      resourceThread: meta.resourceThread || item.resourceThread || null,
      resourceThreadStatus: meta.resourceThreadStatus || item.resourceThreadStatus || "",
      sourceVideoIds: Array.isArray(meta.sourceVideoIds) ? meta.sourceVideoIds : (Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : [item.sourceVideo].filter(Boolean)),
	      resourceVideoPath: meta.resourceVideoPath || item.resourceVideoPath || "",
	      transcriptBundlePath: meta.transcriptBundlePath || item.transcriptBundlePath || "",
	      cleanSocialVideoPath: meta.cleanSocialVideoPath || item.cleanSocialVideoPath || "",
	      previewNeedsRegeneration: false,
	      previewSourceVideoIds: Array.isArray(meta.sourceVideoIds) ? meta.sourceVideoIds : (Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : [item.sourceVideo].filter(Boolean)),
	      resourceThreadUpdatedAt: item.resourceThreadUpdatedAt || item.resourceThread?.updatedAt || "",
	      contentKind: "blog",
      layoutVariant: "rich_resource_page",
      publicationStatus: "preview",
    });
    console.log(`[longform] ${item.id}: staged blog preview -> ${item.localUrl || item.localPath}`);
    return;
  }

  const draft = read(path.join(ROOT, item.draftPath)).trim();
  if (!draft) throw new Error(`empty draft: ${item.draftPath}`);
  const sourceVideo = item.sourceVideo || sourceFromId(item.id);
  const title = cleanTitle(item.suggestedTitle || item.title || firstHeading(draft) || sourceVideo);
  const slug = uniqueSlug(slugify(title), item.id);
  const post = {
    sourceVideo,
    reuseId: item.id,
    contentKind: "video_explainer_page",
    layoutVariant: "rich_resource_page",
    publicationStatus: "preview",
    slug,
    title,
    description: descriptionFrom(draft, item),
    category: categoryFor(item),
    date: today(),
    image: stageCover(slug, sourceVideo),
    author: "David Talley, CFP®, EA",
    readTime: "",
    tags: tagsFor(item),
    featured: false,
    duration: null,
    videoUrl: null,
    body: markdownToBlocks(stripFrontmatter(stripFirstHeading(draft))),
  };
  const posts = readGeneratedPosts(GENERATED)
    .filter((p) => p.reuseId !== item.id && p.slug !== slug);
  posts.unshift(post);
  writeGeneratedPosts(GENERATED, posts);

  const relMeta = `reuse-output/${item.id}/page.json`;
  const meta = {
    reuseId: item.id,
    sourceVideo,
    contentKind: "video_explainer_page",
    layoutVariant: "rich_resource_page",
    publicationStatus: "preview",
    slug,
    localPath: `/resources/blog/${slug}`,
    localUrl: `${baseUrl}/resources/blog/${slug}`,
    stagedPath: "src/data/talley-wealth/generated-blog-posts.ts",
    stagedAt: new Date().toISOString(),
    pdfPath: `reuse-output/${item.id}/compliance/${slug}.pdf`,
  };
  writeJson(path.join(ROOT, relMeta), meta);
  updateItem(item, {
    workflowStatus: STATUS.staged,
    status: STATUS.staged,
    slug,
    stagedPath: meta.stagedPath,
    localPath: meta.localPath,
    localUrl: meta.localUrl,
    pdfPath: meta.pdfPath,
    stagedAt: meta.stagedAt,
    pageMetaPath: relMeta,
    contentKind: "video_explainer_page",
    layoutVariant: "rich_resource_page",
    publicationStatus: "preview",
  });
  console.log(`[longform] ${item.id}: staged Rich Resource Page preview -> ${meta.localUrl}`);
}

function printPdf(item) {
  if (!item.localPath || !item.slug) stageItem(item);
  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome not found. Install Google Chrome or Chromium to print compliance PDFs.");
  const rel = item.type === "blog"
    ? (item.pdfPath || `output/${item.sourceVideo}/compliance/${item.slug}.pdf`)
    : (item.pdfPath || `reuse-output/${item.id}/compliance/${item.slug}.pdf`);
  const pdfAbs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(pdfAbs), { recursive: true });
  const url = `${baseUrl}${item.localPath}`;
  const r = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--print-to-pdf=${pdfAbs}`,
    url,
  ], { encoding: "utf8" });
  if (r.status !== 0 || !fs.existsSync(pdfAbs)) {
    throw new Error(`[pdf] failed to print ${url}\n${(r.stderr || r.stdout || "").trim()}`);
  }
  const now = new Date().toISOString();
  updateItem(item, {
    pdfPath: path.relative(ROOT, pdfAbs),
    pdfCreatedAt: now,
    complianceStatus: item.complianceStatus || "not_submitted",
    workflowStatus: STATUS.pdf,
    status: STATUS.pdf,
  });
  syncPageMeta(item);
  console.log(`[longform] ${item.id}: compliance PDF -> ${item.pdfPath}`);
}

function draftComplianceEmail(item) {
  if (!item.pdfPath || !exists(item.pdfPath)) printPdf(item);
  const rel = `reuse-output/${item.id}/compliance-email-draft.md`;
  const summary = [
    `# Compliance Email Draft: ${item.title}`,
    "",
    "To: Cambridge compliance review",
    `Subject: Website/resource page review - ${item.title}`,
    "",
    "Hi,",
    "",
    "Please review the attached website/resource page draft for compliance approval.",
    "",
    `- Page title: ${item.title}`,
    `- Content type: ${item.typeLabel || labelFor(item.type)}`,
    `- Source video: ${item.sourceVideo}`,
    `- Local preview URL: ${item.localUrl || item.localPath || ""}`,
    `- PDF attachment path: ${item.pdfPath}`,
    `- Draft source: ${item.draftPath || ""}`,
    "",
    "Summary:",
    item.recommendationReason || item.description || "This is a locally staged long-form educational resource drafted from a processed Talley Wealth video.",
    "",
    "Note: This is intended as a website/resource page for compliance review. It has not been published live.",
    "",
    "Thanks,",
    "David",
    "",
    "## Local workflow note",
    "- This file is a local draft only.",
    "- Do not mark sent unless the email is actually sent or a real Gmail draft is created and sent manually.",
  ].join("\n");
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel), summary + "\n");
  updateItem(item, {
    complianceEmailDraftPath: rel,
    complianceEmailDraftedAt: new Date().toISOString(),
    workflowStatus: STATUS.email,
    status: STATUS.email,
  });
  console.log(`[longform] ${item.id}: compliance email draft -> ${rel}`);
}

function markSent(item) {
  updateItem(item, {
    complianceStatus: "sent_to_compliance",
    complianceSentAt: new Date().toISOString(),
    workflowStatus: STATUS.sent,
    status: STATUS.sent,
  });
  console.log(`[longform] ${item.id}: marked sent to compliance`);
}

function markReady(item) {
  updateItem(item, {
    complianceStatus: "approved",
    readyToPublishAt: new Date().toISOString(),
    workflowStatus: STATUS.ready,
    status: STATUS.ready,
  });
  console.log(`[longform] ${item.id}: marked ready to publish`);
}

function preparePublish(item) {
  if (!item.localPath || !item.slug) stageItem(item);
  if (!item.pdfPath || !exists(item.pdfPath)) printPdf(item);

  const slug = item.slug || slugify(item.title || item.id);
  const packageDirRel = item.type === "blog"
    ? `output/${item.sourceVideo}/compliance/${slug}-package`
    : `reuse-output/${item.id}/compliance/${slug}-package`;
  const packageDir = path.join(ROOT, packageDirRel);
  if (fs.existsSync(packageDir)) fs.rmSync(packageDir, { recursive: true, force: true });
  fs.mkdirSync(packageDir, { recursive: true });

  const videoPath = pickSourceVideo(item);
  const transcriptPath = pickExistingRel([
    item.transcriptBundlePath || item.resourceThread?.transcriptBundlePath || "",
    `work/${item.sourceVideo}/audio.json`,
    item.transcriptPath || "",
    item.sourceTranscriptPath || "",
  ]);
  const sourceMomentsPath = pickExistingRel([
    item.sourceMomentsPath || "",
    `output/${item.sourceVideo}/source-moments.json`,
  ]);
  const resourceSpecPath = pickExistingRel([
    `output/${item.sourceVideo}/resource-spec.json`,
  ]);
  const youtubeReuse = loadYouTubeReuse(item);
  const manifestRel = item.type === "blog"
    ? `output/${item.sourceVideo}/compliance/${slug}-package-metadata.json`
    : `reuse-output/${item.id}/compliance/${slug}-package-metadata.json`;
  const manifest = {
    reuseId: item.id,
    sourceVideo: item.sourceVideo,
    contentKind: item.contentKind || item.type,
    title: item.h1Title || item.suggestedTitle || item.title,
    localPath: item.localPath,
    localUrl: item.localUrl,
    pdfPath: item.pdfPath,
    videoPath,
    transcriptPath,
    sourceMomentsPath,
    resourceSpecPath,
    sourceBasis: item.sourceBasis || null,
    youtubeReuse,
    preparedAt: new Date().toISOString(),
    note: "Local compliance package. This action creates a ZIP with the webpage PDF and source video, then queues the resource video to YouTube through Metricool. It does not publish the website article or submit anything to compliance.",
  };
  writeJson(path.join(ROOT, manifestRel), manifest);

  copyIfExists(item.pdfPath, packageDir, "webpage.pdf");
  copyIfExists(videoPath, packageDir, "source-video.mp4");

  const zipRel = `${packageDirRel}.zip`;
  const zipAbs = path.join(ROOT, zipRel);
  if (fs.existsSync(zipAbs)) fs.rmSync(zipAbs);
  const zip = spawnSync("zip", ["-qr", zipAbs, "."], { cwd: packageDir, encoding: "utf8" });
  if (zip.status !== 0 || !fs.existsSync(zipAbs)) {
    throw new Error(`[package] failed to create ZIP\n${(zip.stderr || zip.stdout || "").trim()}`);
  }

  const compliancePackage = {
    pdfPath: item.pdfPath,
    videoPath,
    metadataPath: manifestRel,
    zipPath: zipRel,
    createdAt: manifest.preparedAt,
  };
  const youtubeSchedule = scheduleYouTube(item);
  updateItem(item, {
    compliancePackage,
    youtubeReuse: youtubeSchedule ? { ...youtubeReuse, ...youtubeSchedule } : youtubeReuse,
    publishPackagePath: zipRel,
    publishPackageCreatedAt: manifest.preparedAt,
    updatedAt: manifest.preparedAt,
  });
  syncPageMeta(item);
  console.log(`[longform] ${item.id}: publish package -> ${zipRel}`);
}

function updateItem(item, patch) {
  Object.assign(item, patch, { updatedAt: new Date().toISOString() });
  const idx = backlog.findIndex((entry) => entry?.id === item.id);
  if (idx >= 0) backlog[idx] = { ...backlog[idx], ...item };
}

function syncPageMeta(item) {
  const metaRel = item.type === "blog" ? `output/${item.sourceVideo}/blog-page.json` : (item.pageMetaPath || `reuse-output/${item.id}/page.json`);
  const metaPath = path.join(ROOT, metaRel);
  const meta = readJson(metaPath, {});
  writeJson(metaPath, {
    ...meta,
    reuseId: item.id,
    sourceVideo: item.sourceVideo,
    slug: item.slug,
    localPath: item.localPath,
    localUrl: item.localUrl,
    pdfPath: item.pdfPath,
    pdfCreatedAt: item.pdfCreatedAt,
    compliancePackage: item.compliancePackage || null,
    youtubeReuse: item.youtubeReuse || null,
    resourceThread: item.resourceThread || null,
    resourceThreadStatus: item.resourceThreadStatus || item.resourceThread?.threadStatus || "",
    sourceVideoIds: Array.isArray(item.sourceVideoIds) ? item.sourceVideoIds : [item.sourceVideo].filter(Boolean),
    resourceVideoPath: item.resourceVideoPath || item.resourceThread?.resourceVideoPath || "",
    transcriptBundlePath: item.transcriptBundlePath || item.resourceThread?.transcriptBundlePath || "",
	    cleanSocialVideoPath: item.cleanSocialVideoPath || item.resourceThread?.cleanSocialVideoPath || "",
	    previewNeedsRegeneration: Boolean(item.previewNeedsRegeneration),
	    previewSourceVideoIds: Array.isArray(item.previewSourceVideoIds) ? item.previewSourceVideoIds : [],
	    resourceThreadUpdatedAt: item.resourceThreadUpdatedAt || item.resourceThread?.updatedAt || "",
	    candidateScore: item.candidateScore,
    candidateSummary: item.candidateSummary || "",
    primaryCategory: item.primaryCategory || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    audienceLane: item.audienceLane || "",
    contentFormat: item.contentFormat || "",
    decisionTheme: item.decisionTheme || "",
    sourceBasis: item.sourceBasis || null,
    h1Title: item.h1Title || "",
    seoTitle: item.seoTitle || "",
    titleRationale: item.titleRationale || "",
    publicationStatus: item.publicationStatus || "preview",
  });
  syncGeneratedPostMeta(item);
}

function syncGeneratedPostMeta(item) {
  if (!item.slug || !fs.existsSync(GENERATED)) return;
  const posts = readGeneratedPosts(GENERATED);
  let changed = false;
  const next = posts.map((post) => {
    const matches = post.slug === item.slug || post.sourceVideo === item.sourceVideo || post.reuseId === item.id;
    if (!matches) return post;
    changed = true;
    return {
      ...post,
      candidateScore: item.candidateScore ?? post.candidateScore,
      candidateSummary: item.candidateSummary || post.candidateSummary,
      primaryCategory: item.primaryCategory || post.primaryCategory || post.category,
      tags: Array.isArray(item.tags) && item.tags.length ? item.tags : post.tags,
      audienceLane: item.audienceLane || post.audienceLane,
      contentFormat: item.contentFormat || post.contentFormat,
      decisionTheme: item.decisionTheme || post.decisionTheme,
      sourceBasis: item.sourceBasis || post.sourceBasis,
      h1Title: item.h1Title || post.h1Title || post.title,
      seoTitle: item.seoTitle || post.seoTitle || post.title,
      titleRationale: item.titleRationale || post.titleRationale,
      youtubeReuse: item.youtubeReuse || post.youtubeReuse || null,
      compliancePackage: item.compliancePackage || post.compliancePackage || null,
      resourceThread: item.resourceThread || post.resourceThread || null,
      resourceThreadStatus: item.resourceThreadStatus || post.resourceThreadStatus || "",
      sourceVideoIds: Array.isArray(item.sourceVideoIds) && item.sourceVideoIds.length ? item.sourceVideoIds : post.sourceVideoIds,
      resourceVideoPath: item.resourceVideoPath || post.resourceVideoPath || "",
      transcriptBundlePath: item.transcriptBundlePath || post.transcriptBundlePath || "",
      cleanSocialVideoPath: item.cleanSocialVideoPath || post.cleanSocialVideoPath || "",
    };
  });
  if (changed) writeGeneratedPosts(GENERATED, next);
}

function run(command, args) {
  const r = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", env: process.env });
  return { ok: r.status === 0, status: r.status, output: ((r.stdout || "") + (r.stderr || "")).trim() };
}

function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }
function readJson(file, fallback) { try { return JSON.parse(read(file)); } catch { return fallback; } }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
function saveBacklog() { fs.writeFileSync(BACKLOG, JSON.stringify(backlog, null, 2)); }
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function pickExistingRel(candidates) {
  return candidates.filter(Boolean).find((rel) => fs.existsSync(path.join(ROOT, rel))) || "";
}
function pickSourceVideo(item) {
  if (item.type === "blog") {
    return pickExistingRel([
      item.resourceVideoPath || "",
      item.resourceThread?.resourceVideoPath || "",
      `output/${item.sourceVideo}/horizontal_16x9.mp4`,
      `output/${item.sourceVideo}/captioned_horizontal_16x9.mp4`,
      `output/${item.sourceVideo}/captioned_vertical_9x16.mp4`,
      `output/${item.sourceVideo}/vertical_9x16.mp4`,
    ]);
  }
  return pickExistingRel([
    `output/${item.sourceVideo}/horizontal_16x9.mp4`,
    `output/${item.sourceVideo}/captioned_horizontal_16x9.mp4`,
    `output/${item.sourceVideo}/captioned_vertical_9x16.mp4`,
    `output/${item.sourceVideo}/vertical_9x16.mp4`,
  ]);
}
function copyIfExists(rel, destDir, destName) {
  if (!rel || !exists(rel)) return "";
  const dest = path.join(destDir, destName || path.basename(rel));
  fs.copyFileSync(path.join(ROOT, rel), dest);
  return dest;
}
function loadYouTubeReuse(item) {
  const rel = pickExistingRel([
    item.youtubeReuse?.metadataPath || "",
    `output/${item.sourceVideo}/youtube-reuse.json`,
  ]);
  const existing = rel ? readJson(path.join(ROOT, rel), null) : null;
  if (existing && typeof existing === "object") return { ...existing, metadataPath: rel };
  const title = cleanTitle(item.h1Title || item.suggestedTitle || item.title || item.id).slice(0, 100);
  const metadataPath = item.type === "blog" ? `output/${item.sourceVideo}/youtube-reuse.json` : `reuse-output/${item.id}/youtube-reuse.json`;
  const youtube = {
    title,
    description: [
      item.description || item.recommendationReason || "",
      "",
      item.localPath ? `Read the full Talley Wealth article: ${item.localPath}` : "",
      "",
      "For educational purposes only. This is not individualized financial, legal, tax, or investment advice.",
    ].filter(Boolean).join("\n"),
    standardVideoPath: pickSourceVideo(item),
    shortsVideoPath: pickExistingRel([
      `output/${item.sourceVideo}/captioned_vertical_9x16.mp4`,
      `output/${item.sourceVideo}/vertical_9x16.mp4`,
      `output/${item.sourceVideo}/square_1x1.mp4`,
    ]),
    thumbnailPath: pickExistingRel([`output/${item.sourceVideo}/cover.jpg`, `output/${item.sourceVideo}/thumbnail.jpg`]),
    metadataPath,
    metricoolReady: false,
  };
  writeJson(path.join(ROOT, metadataPath), youtube);
  return youtube;
}
function scheduleYouTube(item) {
  const result = run("node", ["scripts/schedule-resource-youtube.mjs", item.id, "--publishable"]);
  const scheduleRel = item.type === "blog"
    ? `output/${item.sourceVideo}/youtube-schedule.json`
    : `reuse-output/${item.id}/youtube-schedule.json`;
  const schedule = readJson(path.join(ROOT, scheduleRel), null);
  if (!result.ok) {
    return {
      metadataPath: item.youtubeReuse?.metadataPath || `output/${item.sourceVideo}/youtube-reuse.json`,
      scheduleStatus: "failed",
      scheduleError: result.output || "YouTube scheduling failed",
      scheduleEvidencePath: scheduleRel,
    };
  }
  return {
    ...(schedule?.youtubeReuse || {}),
    scheduleStatus: "scheduled",
    metricoolId: schedule?.metricoolId || "",
    metricoolProvider: schedule?.provider || null,
    scheduledFor: schedule?.scheduledFor || "",
    scheduleEvidencePath: scheduleRel,
  };
}
function fail(message) { console.error(`[longform] ${message}`); process.exit(1); }
function today() { return new Date().toISOString().slice(0, 10); }
function sourceFromId(value) { return String(value || "").split("__")[0].replace(/-/g, "_").toUpperCase(); }
function cleanTitle(value) { return String(value || "").replace(/^#+\s*/, "").replace(/^["']|["']$/g, "").trim(); }
function firstHeading(md) { return (md.match(/^#\s+(.+)$/m) || md.match(/^##\s+(.+)$/m) || [])[1] || ""; }
function stripFirstHeading(md) { return md.replace(/^#\s+.+\n+/, "").trim(); }
function stripFrontmatter(md) { return md.replace(/^---\n[\s\S]*?\n---\n+/, "").trim(); }
function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 76) || "generated-resource-page";
}
function uniqueSlug(base, reuseId) {
  const existing = new Set(readGeneratedPosts(GENERATED).map((p) => p.slug));
  const current = readGeneratedPosts(GENERATED).find((p) => p.reuseId === reuseId);
  if (current?.slug) return current.slug;
  if (!existing.has(base)) return base;
  return `${base}-${slugify(reuseId).slice(0, 18)}`;
}
function descriptionFrom(md, item) {
  const front = stripFirstHeading(stripFrontmatter(md))
    .split(/\n{2,}/)
    .map((s) => s.replace(/^#+\s*/, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
    .filter((s) => s && !s.startsWith("#") && !/^[-*]\s+/.test(s));
  return completeSentence(item.coreQuestion || front.find((s) => s.length > 80) || item.recommendationReason || item.title || "", 210);
}
function completeSentence(value, limit = 210) {
  const text = String(value || "").replace(/\s+/g, " ").replace(/(?:\.{3}|…)$/, ".").trim();
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
  let result = "";
  for (const sentence of sentences) {
    const next = `${result} ${sentence.trim()}`.trim();
    if (next.length > limit && result) break;
    if (next.length > limit) break;
    result = next;
    if (result.length >= 70) break;
  }
  if (!result && text.length <= limit) result = text;
  if (!result) {
    result = text
      .slice(0, limit)
      .replace(/\s+(?:and|but|or|because|that|which|where|when|while|with|to|for)\s+\S*$/i, "")
      .replace(/[,:;]\s+[^,:;]*$/, "")
      .replace(/\s+\S*$/, "")
      .trim();
  }
  return /[.!?]$/.test(result) ? result : `${result}.`;
}
function markdownToBlocks(md) {
  return String(md || "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}
function categoryFor(item) {
  const hay = `${item.title} ${item.audience} ${item.recommendationReason} ${JSON.stringify(item.personaFit || {})}`.toLowerCase();
  if (hay.includes("business") || hay.includes("owner") || hay.includes("s-corp")) return "Business Owner Planning";
  if (hay.includes("tax") || hay.includes("roth") || hay.includes("rmd")) return "Tax Planning";
  if (hay.includes("investment") || hay.includes("portfolio") || hay.includes("return")) return "Investment Management";
  if (hay.includes("retirement") || hay.includes("medicare") || hay.includes("social security")) return "Retirement Planning";
  return "Financial Planning";
}
function tagsFor(item) {
  const tags = new Set([categoryFor(item), "Rich Resource"]);
  const hay = `${item.title} ${item.recommendationReason}`.toLowerCase();
  if (hay.includes("retirement")) tags.add("Retirement Planning");
  if (hay.includes("tax") || hay.includes("roth")) tags.add("Tax Planning");
  if (hay.includes("business") || hay.includes("owner")) tags.add("Business Owners");
  if (hay.includes("investment") || hay.includes("portfolio")) tags.add("Investment Management");
  return [...tags];
}
function stageCover(slug, sourceVideo) {
  const src = path.join(ROOT, "output", sourceVideo, "cover.jpg");
  if (!fs.existsSync(src)) return "/brands/talley-wealth/blog/retirement-number-hero.jpg";
  const rel = path.join("brands", "talley-wealth", "blog", "generated", `${slug}.jpg`);
  const dest = path.join(SITE, "public", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return `/${rel.split(path.sep).join("/")}`;
}
function readGeneratedPosts(file) {
  const text = read(file);
  const m = text.match(/export const generatedBlogPosts[^=]*=\s*(\[[\s\S]*\]);/);
  if (!m) return [];
  try { return JSON.parse(m[1]); } catch { return []; }
}
function writeGeneratedPosts(file, posts) {
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
	})[] = ${JSON.stringify(posts, null, 2)};
`);
}
function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  return candidates.find((p) => fs.existsSync(p)) || "";
}
function labelFor(type) {
  if (type === "blog") return "Blog";
  if (type === "video_explainer_page") return "Rich Resource Page";
  return type;
}
