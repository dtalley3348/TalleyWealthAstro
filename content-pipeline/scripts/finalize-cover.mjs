// finalize-cover.mjs <videoName>
// Refreshes the active cover after drafting has created the final title/hook.
// A good smart face frame stays active, but it must be re-rendered with the final
// content title instead of the pre-draft filename fallback.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2];
if (!name) { console.error("usage: finalize-cover.mjs <videoName>"); process.exit(1); }

const dir = path.join(ROOT, "output", name);
const metaPath = path.join(dir, "cover-meta.json");
let meta = {};
try { meta = JSON.parse(fs.readFileSync(metaPath, "utf8")); } catch (_) {}

const headline = coverHeadline();

if (meta.method === "vision-open-eyes") {
  const r = spawnSync("node", ["scripts/render-smart-cover.mjs", name, headline], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status || 1);
  console.log(`[cover] ${name}: smart face cover refreshed with final title`);
  process.exit(0);
}

const r = spawnSync("node", ["scripts/render-cover.mjs", name, headline, "Talley Wealth"], {
  cwd: ROOT,
  stdio: "inherit",
});
if (r.status !== 0) process.exit(r.status || 1);
console.log(`[cover] ${name}: smart frame was not confident; title card set active`);

function coverHeadline() {
  try {
    const slides = JSON.parse(fs.readFileSync(path.join(dir, "carousel", "slides.json"), "utf8"));
    const headline = slides.find((s) => s.kind === "cover" && s.headline)?.headline;
    if (headline) return headline;
  } catch (_) {}
  try {
    const log = JSON.parse(fs.readFileSync(path.join(dir, "content-log.json"), "utf8"));
    if (log.title) return log.title;
  } catch (_) {}
  return name;
}
