#!/usr/bin/env node
// Builds platform-ready media variants before upload/scheduling.
// For talking-head videos, this bakes the selected cover into the first 0.8s so
// the scheduled asset matches what David approved in the review app.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schedulePath = path.join(ROOT, "schedule.json");

if (!fs.existsSync(schedulePath)) {
  console.error("[scheduled-media] schedule.json missing. Run node scripts/schedule.mjs first.");
  process.exit(1);
}

const requested = process.argv.slice(2)
  .filter((arg) => !arg.startsWith("--"))
  .map((arg) => safeName(arg))
  .filter(Boolean);
const rows = JSON.parse(fs.readFileSync(schedulePath, "utf8")).filter((row) => row.date !== "OVERFLOW");
const names = requested.length
  ? [...new Set(requested)]
  : [...new Set(rows.filter((row) => row.asset === "video").map((row) => row.video).filter(Boolean))];
let built = 0;
let skipped = 0;
let missing = 0;

for (const name of names) {
  const result = prepareVideoWithCover(name);
  if (result === "built") built += 1;
  else if (result === "skipped") skipped += 1;
  else missing += 1;
}

console.log(`[scheduled-media] built ${built}, skipped ${skipped}, missing ${missing}`);

function safeName(name) {
  return String(name || "").replace(/[^A-Za-z0-9_-]/g, "_");
}

function prepareVideoWithCover(name) {
  const dir = path.join(ROOT, "output", name);
  const cover = path.join(dir, "cover.jpg");
  const source = ["clean-social/captioned_vertical_9x16.mp4", "clean-social/vertical_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"]
    .map((file) => path.join(dir, file))
    .find((file) => fs.existsSync(file));
  if (!fs.existsSync(cover) || !source) return "missing";

  const outDir = path.join(dir, "scheduled");
  const out = path.join(outDir, "captioned_with_cover_9x16.mp4");
  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(out)) {
    const outTime = fs.statSync(out).mtimeMs;
    if (outTime >= fs.statSync(cover).mtimeMs && outTime >= fs.statSync(source).mtimeMs) return "skipped";
  }

  const filter = [
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[v0]",
    "[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[v1]",
    "[2:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[a0]",
    "[1:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[a1]",
    "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]",
  ].join(";");

  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-loop",
    "1",
    "-t",
    "0.8",
    "-i",
    cover,
    "-i",
    source,
    "-f",
    "lavfi",
    "-t",
    "0.8",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-filter_complex",
    filter,
    "-map",
    "[v]",
    "-map",
    "[a]",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "20",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-movflags",
    "+faststart",
    out,
  ];
  const r = spawnSync("ffmpeg", args, { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`[scheduled-media] failed ${name}: ${(r.stderr || r.stdout || "").trim()}`);
    process.exit(r.status || 1);
  }
  return "built";
}
