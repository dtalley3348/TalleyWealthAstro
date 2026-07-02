#!/usr/bin/env node
// should-discard-transcript.mjs <audio.json>
// Exits 10 when a transcript is pure outro/filler and should not enter review.
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: should-discard-transcript.mjs <audio.json>");
  process.exit(2);
}

const body = JSON.parse(fs.readFileSync(file, "utf8"));
const text = normalize(body.text || (body.segments || []).map((s) => s.text).join(" "));

if (!text) {
  console.log("[discard] empty transcript");
  process.exit(10);
}

const words = text.split(/\s+/).filter(Boolean);
const compact = text.replace(/[^a-z0-9]+/g, " ").trim();
const fillerPatterns = [
  /^thanks? for watching$/,
  /^thank you for watching$/,
  /^thanks? for watching see you next time$/,
  /^thanks? for watching bye$/,
  /^thanks?$/,
  /^thank you$/,
  /^bye$/,
];

if (words.length <= 8 && fillerPatterns.some((re) => re.test(compact))) {
  console.log(`[discard] pure sign-off transcript: ${text}`);
  process.exit(10);
}

console.log("[discard] keep");
process.exit(0);

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/[!?.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
