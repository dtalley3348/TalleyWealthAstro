#!/usr/bin/env node
// prepare-metricool-media.mjs
// Builds work/metricool-media-manifest.json from schedule.json and copies the
// local media files into a deployable public folder. This does not upload or
// schedule anything. The resulting URLs must be publicly reachable before the
// live Metricool writer will use them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv(path.join(ROOT, ".env"));

const schedulePath = path.join(ROOT, "schedule.json");
if (!fs.existsSync(schedulePath)) {
  console.error("[metricool-media] schedule.json missing. Run node scripts/schedule.mjs first.");
  process.exit(1);
}

const publicDir = path.resolve(ROOT, process.env.METRICOOL_MEDIA_PUBLIC_DIR || "../public/pipeline-media");
const baseUrl = String(process.env.METRICOOL_MEDIA_BASE_URL || "https://talleywealth.com/pipeline-media").replace(/\/+$/, "");
const rows = JSON.parse(fs.readFileSync(schedulePath, "utf8")).filter((row) => row.date !== "OVERFLOW");
const manifest = {
  generatedAt: new Date().toISOString(),
  publicDir,
  baseUrl,
  note: "Files are copied locally only. Deploy/serve publicDir at baseUrl before live media scheduling.",
  assets: {}
};

for (const row of rows) {
  const key = keyFor(row);
  if (manifest.assets[key]) continue;
  const files = localFilesFor(row);
  if (!files.length) continue;
  manifest.assets[key] = {
    video: row.video,
    asset: row.asset,
    platform: row.platform,
    localFiles: [],
    publicUrls: [],
    ready: false
  };
  for (const rel of files) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) {
      manifest.assets[key].localFiles.push({ path: rel, missing: true });
      continue;
    }
    const destRel = path.posix.join(row.video, row.asset, path.basename(rel));
    const dest = path.join(publicDir, destRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    const publicUrl = `${baseUrl}/${destRel.split(path.sep).join("/")}`;
    manifest.assets[key].localFiles.push({ path: rel, stagedPath: path.relative(ROOT, dest) });
    manifest.assets[key].publicUrls.push(publicUrl);
  }
  manifest.assets[key].ready = manifest.assets[key].publicUrls.length > 0 && manifest.assets[key].localFiles.every((f) => !f.missing);
}

fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "work", "metricool-media-manifest.json"), JSON.stringify(manifest, null, 2));
const count = Object.keys(manifest.assets).length;
const ready = Object.values(manifest.assets).filter((x) => x.ready).length;
console.log(`[metricool-media] staged ${ready}/${count} media asset(s) -> work/metricool-media-manifest.json`);
console.log(`[metricool-media] public dir: ${publicDir}`);
console.log(`[metricool-media] base URL:   ${baseUrl}`);

function localFilesFor(row) {
  const dir = path.join("output", row.video);
  if (row.asset === "video") {
    const candidates = ["clean-social/captioned_vertical_9x16.mp4", "clean-social/vertical_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"];
    return candidates.map((f) => path.join(dir, f)).filter((rel) => fs.existsSync(path.join(ROOT, rel))).slice(0, 1);
  }
  if (row.asset === "carousel") {
    const cdir = path.join(ROOT, dir, "carousel");
    if (!fs.existsSync(cdir)) return [];
    return fs.readdirSync(cdir)
      .filter((f) => /^slide-\d+\.png$/.test(f))
      .sort()
      .map((f) => path.join(dir, "carousel", f));
  }
  return [];
}

function keyFor(row) {
  return `${row.video}|${row.asset}|${row.platform}`;
}

function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}
