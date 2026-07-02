// trim-range.mjs <silence_log> <duration>
// Parses ffmpeg silencedetect output and prints "START END" (seconds) to keep.
// Only trims LEADING silence (that begins at the very start) and TRAILING
// silence (that runs to the very end). Mid-clip pauses are preserved.
import fs from "node:fs";

const [, , logPath, durArg] = process.argv;
const DUR = parseFloat(durArg);
const log = fs.readFileSync(logPath, "utf8");

const LEAD_PAD = 0.15;
const TAIL_PAD = 0.25;
const EDGE_EPS = 0.4; // how close to start/end counts as edge silence

// Build silence regions in order.
const regions = [];
const re = /silence_(start|end):\s*(-?[0-9.]+)/g;
let m;
let pendingStart = null;
while ((m = re.exec(log)) !== null) {
  const kind = m[1];
  const val = parseFloat(m[2]);
  if (kind === "start") {
    pendingStart = val;
  } else if (kind === "end" && pendingStart !== null) {
    regions.push({ start: pendingStart, end: val });
    pendingStart = null;
  }
}
// A trailing silence that runs to EOF may emit a start with no end.
if (pendingStart !== null) regions.push({ start: pendingStart, end: DUR });

let start = 0;
let end = DUR;

if (regions.length) {
  const first = regions[0];
  // Leading silence only if it begins at (about) zero.
  if (first.start <= 0.5) {
    start = Math.max(0, first.end - LEAD_PAD);
  }
  const last = regions[regions.length - 1];
  // Trailing silence only if it reaches (about) the end of the clip.
  if (last.end >= DUR - EDGE_EPS) {
    end = Math.min(DUR, last.start + TAIL_PAD);
  }
}

if (!(end > start)) {
  start = 0;
  end = DUR;
}

process.stdout.write(`${start.toFixed(3)} ${end.toFixed(3)}`);
