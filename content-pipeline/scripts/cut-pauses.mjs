#!/usr/bin/env node
// cut-pauses.mjs <input.mp4> <silence.log> <output.mp4> [minGapSec] [padSec]
// Removes long interior silences while leaving a little room on each side.
import fs from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";

const [, , input, logPath, output, minArg, padArg] = process.argv;
if (!input || !logPath || !output) {
  console.error("usage: cut-pauses.mjs <input.mp4> <silence.log> <output.mp4> [minGapSec] [padSec]");
  process.exit(1);
}

const minGap = Number(minArg || process.env.MIDDLE_MIN_SILENCE || 1.2);
const pad = Number(padArg || process.env.MIDDLE_SILENCE_PAD || 0.2);
const duration = Number(execFileSync("ffprobe", [
  "-v", "error",
  "-show_entries", "format=duration",
  "-of", "csv=p=0",
  input,
]).toString().trim());

const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";
const silences = [];
let pending = null;
for (const line of log.split(/\r?\n/)) {
  const start = line.match(/silence_start:\s*([0-9.]+)/);
  if (start) pending = Number(start[1]);
  const end = line.match(/silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)/);
  if (end && pending !== null) {
    silences.push({ start: pending, end: Number(end[1]), duration: Number(end[2]) });
    pending = null;
  }
}

const cuts = silences
  .filter((s) => s.duration >= minGap)
  .map((s) => ({
    start: Math.max(0, s.start + pad),
    end: Math.min(duration, s.end - pad),
    rawStart: s.start,
    rawEnd: s.end,
    rawDuration: s.duration,
  }))
  .filter((c) => c.end - c.start >= 0.15 && c.start > 0.25 && c.end < duration - 0.25);

const reportPath = output.replace(/\.[^.]+$/, ".pause-cuts.json");
if (!cuts.length) {
  fs.copyFileSync(input, output);
  fs.writeFileSync(reportPath, JSON.stringify({ input, output, duration, minGap, pad, cuts: [], removedSec: 0 }, null, 2));
  console.log(`[pause-cut] no interior pauses >= ${minGap}s; copied master`);
  process.exit(0);
}

const keep = [];
let cursor = 0;
for (const cut of cuts) {
  if (cut.start > cursor) keep.push({ start: cursor, end: cut.start });
  cursor = Math.max(cursor, cut.end);
}
if (cursor < duration) keep.push({ start: cursor, end: duration });

const filters = [];
const concatInputs = [];
keep.forEach((seg, i) => {
  filters.push(`[0:v]trim=start=${seg.start.toFixed(3)}:end=${seg.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`);
  filters.push(`[0:a]atrim=start=${seg.start.toFixed(3)}:end=${seg.end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`);
  concatInputs.push(`[v${i}][a${i}]`);
});
filters.push(`${concatInputs.join("")}concat=n=${keep.length}:v=1:a=1[v][a]`);

const tempOutput = `${output}.tmp-${process.pid}.mp4`;

const args = [
  "-nostdin",
  "-y",
  "-loglevel", "error",
  "-i", input,
  "-filter_complex", filters.join(";"),
  "-map", "[v]",
  "-map", "[a]",
  "-c:v", "libx264",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-crf", "19",
  "-preset", "veryfast",
  "-r", "30",
  "-c:a", "aac",
  "-b:a", "192k",
  "-ar", "48000",
  "-movflags", "+faststart",
  tempOutput,
];

const result = spawnSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
if (result.status !== 0) {
  try { fs.rmSync(tempOutput, { force: true }); } catch {}
  process.exit(result.status || 1);
}
fs.renameSync(tempOutput, output);

const removedSec = cuts.reduce((sum, c) => sum + (c.end - c.start), 0);
fs.writeFileSync(reportPath, JSON.stringify({ input, output, duration, minGap, pad, cuts, keep, removedSec }, null, 2));
console.log(`[pause-cut] removed ${removedSec.toFixed(2)}s across ${cuts.length} pause(s) -> ${output}`);
