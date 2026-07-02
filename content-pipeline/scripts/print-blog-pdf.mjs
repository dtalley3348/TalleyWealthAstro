// print-blog-pdf.mjs <videoName> [baseUrl]
// Prints the staged local blog page to output/<name>/compliance/<slug>.pdf.
// Requires the Astro dev/preview server to be running.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2];
const baseUrl = (process.argv[3] || "http://localhost:5181").replace(/\/$/, "");
if (!name) { console.error("usage: node scripts/print-blog-pdf.mjs <videoName> [baseUrl]"); process.exit(1); }

const outDir = path.join(ROOT, "output", name);
const metaPath = path.join(outDir, "blog-page.json");
const meta = readJson(metaPath, null);
if (!meta?.localPath || !meta?.slug) {
  console.error(`[pdf] ${name}: no staged blog metadata at output/${name}/blog-page.json`);
  process.exit(1);
}

const chrome = findChrome();
if (!chrome) {
  console.error("[pdf] Chrome not found. Install Google Chrome or Chromium to print compliance PDFs.");
  process.exit(1);
}

const pdfPath = path.join(outDir, "compliance", `${meta.slug}.pdf`);
fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
const url = `${baseUrl}${meta.localPath}`;
const r = spawnSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--print-to-pdf=${pdfPath}`,
  url,
], { encoding: "utf8" });

if (r.status !== 0 || !fs.existsSync(pdfPath)) {
  console.error(`[pdf] failed to print ${url}`);
  if (r.stderr) console.error(r.stderr.trim());
  process.exit(r.status || 1);
}

meta.localUrl = url;
meta.pdfPath = path.relative(ROOT, pdfPath);
meta.pdfCreatedAt = new Date().toISOString();
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
console.log(`[pdf] ${name}: ${meta.pdfPath}`);

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}
function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  return candidates.find((p) => fs.existsSync(p)) || "";
}
