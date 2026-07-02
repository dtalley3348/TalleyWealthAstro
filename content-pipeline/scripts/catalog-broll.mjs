// catalog-broll.mjs <video>
// Adds a b-roll clip to the library: copies it into broll/clips, samples 3 frames
// into broll/frames/<name>, and appends a stub entry to broll-library.json.
// The frames get a description + tags added later (by Claude, viewing them).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const LIB = path.join(ROOT, "broll-library.json");
const CLIPS = path.join(ROOT, "broll", "clips");
const FRAMES = path.join(ROOT, "broll", "frames");

const input = process.argv[2];
if (!input) { console.error("usage: catalog-broll.mjs <video>"); process.exit(1); }

const ext = path.extname(input);
const name = path.basename(input, ext);

const lib = fs.existsSync(LIB) ? JSON.parse(fs.readFileSync(LIB, "utf8")) : [];
if (lib.some((e) => e.name === name)) {
  console.log(`[broll] ${name} already cataloged`);
  process.exit(0);
}

fs.mkdirSync(CLIPS, { recursive: true });
const frameDir = path.join(FRAMES, name);
fs.mkdirSync(frameDir, { recursive: true });

const dest = path.join(CLIPS, name + ext);
if (!fs.existsSync(dest)) fs.copyFileSync(input, dest);

const probe = JSON.parse(
  execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of json "${dest}"`
  ).toString()
);
const w = probe.streams?.[0]?.width ?? null;
const h = probe.streams?.[0]?.height ?? null;
const dur = Number(probe.format?.duration ?? 0);

const frames = [];
[0.15, 0.5, 0.85].forEach((frac, i) => {
  const t = Math.max(0, dur * frac);
  const out = path.join(frameDir, `f${i + 1}.jpg`);
  execSync(`ffmpeg -y -loglevel error -ss ${t.toFixed(2)} -i "${dest}" -frames:v 1 -vf scale=320:-1 "${out}"`);
  frames.push(path.relative(ROOT, out));
});

lib.push({
  name,
  file: path.relative(ROOT, dest),
  duration: Number(dur.toFixed(2)),
  width: w,
  height: h,
  orientation: w && h ? (h >= w ? "vertical" : "horizontal") : null,
  frames,
  description: "",
  tags: [],
  status: "needs-description",
  added: new Date().toISOString().slice(0, 10),
});
fs.writeFileSync(LIB, JSON.stringify(lib, null, 2));
console.log(`[broll] cataloged ${name} (${frames.length} frames) -> needs description`);
