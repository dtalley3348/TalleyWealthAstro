#!/usr/bin/env node
// render-smart-cover.mjs <videoName> ["headline"]
// Renders the active smart-frame source with a headline overlay.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const remotionDir = path.join(ROOT, "remotion");
const [, , name, headlineArg] = process.argv;
if (!name) {
  console.error("usage: render-smart-cover.mjs <videoName> [headline]");
  process.exit(1);
}

const dir = path.join(ROOT, "output", name);
const source = ["cover-source.jpg", "cover-frame.jpg", "cover.jpg"]
  .map((file) => path.join(dir, file))
  .find((file) => fs.existsSync(file));
if (!source) {
  console.error(`[cover] ${name}: no smart cover source frame`);
  process.exit(1);
}

const headline = headlineArg || coverHeadline(name);
fs.mkdirSync(path.join(remotionDir, "public"), { recursive: true });
fs.copyFileSync(source, path.join(remotionDir, "public", "smart-cover-source.jpg"));
fs.writeFileSync(
  path.join(remotionDir, "public", "smart-cover-props.json"),
  JSON.stringify({ imageFile: "smart-cover-source.jpg", headline, eyebrow: "Talley Wealth" }, null, 2)
);

const out = path.join(dir, "cover-smart.jpg");
execSync(`npx remotion still src/index.ts SmartCover "${out}" --props=public/smart-cover-props.json`, {
  cwd: remotionDir,
  stdio: "inherit",
});
fs.copyFileSync(out, path.join(dir, "cover.jpg"));
console.log(`[cover] ${name}: smart cover rendered and set active`);

function coverHeadline(videoName) {
  const slidesPath = path.join(ROOT, "output", videoName, "carousel", "slides.json");
  try {
    const slides = JSON.parse(fs.readFileSync(slidesPath, "utf8"));
    const cover = slides.find((slide) => slide.kind === "cover");
    if (cover?.headline) return cover.headline;
  } catch (_) {}
  try {
    const log = JSON.parse(fs.readFileSync(path.join(ROOT, "output", videoName, "content-log.json"), "utf8"));
    if (log.title) return log.title;
  } catch (_) {}
  return videoName;
}
