// render-cover.mjs <videoName> "<headline>" ["<eyebrow>"]
// Renders the title-card cover for a video and makes it the active cover.
// Output: output/<name>/cover-title.png, and copies it to output/<name>/cover.jpg.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const remotionDir = path.join(ROOT, "remotion");
const [, , name, headline, eyebrow] = process.argv;
if (!name || !headline) { console.error('usage: render-cover.mjs <name> "<headline>" ["<eyebrow>"]'); process.exit(1); }

const dir = path.join(ROOT, "output", name);
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(path.join(remotionDir, "public"), { recursive: true });
fs.writeFileSync(
  path.join(remotionDir, "public", "title-props.json"),
  JSON.stringify({ headline, eyebrow: eyebrow || "" }, null, 2)
);

const outPng = path.join(dir, "cover-title.png");
execSync(`npx remotion still src/index.ts TitleCard "${outPng}" --props=public/title-props.json`, {
  cwd: remotionDir, stdio: "inherit",
});
fs.copyFileSync(outPng, path.join(dir, "cover.jpg")); // make it the active cover
console.log(`[cover] ${name}: title-card cover rendered and set active`);
