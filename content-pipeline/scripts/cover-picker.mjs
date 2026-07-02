// cover-picker.mjs <videoName>
// Picks a strong face-forward cover frame from a captioned video. It samples several
// caption-adjacent frames, asks the local OpenAI vision key to reject closed eyes and
// awkward expressions when available, then falls back to sharpness/file-size scoring.
// Writes output/<name>/cover.jpg
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2];
if (!name) { console.error("usage: cover-picker.mjs <videoName>"); process.exit(1); }

loadEnv(path.join(ROOT, ".env"));

const dir = path.join(ROOT, "output", name);
const video = ["vertical_9x16.mp4", "captioned_vertical_9x16.mp4"]
  .map((f) => path.join(dir, f)).find((p) => fs.existsSync(p));
if (!video) { console.error(`[cover] no video for ${name}`); process.exit(1); }

const dur = Number(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${video}"`).toString().trim()) || 0;

// Candidate timestamps: caption midpoints plus a light whole-clip spread, skipping
// the very start/end where the speaker is often settling in or ending a thought.
let candidates = new Set();
const capPath = path.join(dir, "captions.json");
if (fs.existsSync(capPath)) {
  const pages = JSON.parse(fs.readFileSync(capPath, "utf8"));
  const mids = pages
    .map((p) => (p.start + p.end) / 2)
    .filter((t) => t > 0.8 && t < dur - 0.5);
  const step = Math.max(1, Math.floor(mids.length / 12));
  for (let i = 0; i < mids.length; i += step) {
    for (const offset of [-0.18, 0, 0.18]) {
      const t = mids[i] + offset;
      if (t > 0.8 && t < dur - 0.5) candidates.add(roundTime(t));
    }
  }
}
for (const pct of [0.1, 0.14, 0.18, 0.23, 0.28, 0.34, 0.4, 0.47, 0.54, 0.62, 0.7, 0.78, 0.86]) {
  const t = dur * pct;
  if (t > 0.8 && t < dur - 0.5) candidates.add(roundTime(t));
}
if (!candidates.size) candidates.add(roundTime(Math.min(1.5, dur / 2)));
candidates = [...candidates].sort((a, b) => a - b).slice(0, 30);

const tmp = path.join(dir, ".cover-cand");
fs.mkdirSync(tmp, { recursive: true });
const frames = [];
candidates.forEach((t, i) => {
  const out = path.join(tmp, `c${i}.jpg`);
  try {
    execSync(`ffmpeg -y -loglevel error -ss ${t.toFixed(2)} -i "${video}" -frames:v 1 -q:v 2 "${out}"`);
    const sz = fs.statSync(out).size;
    frames.push({ index: i + 1, t, path: out, size: sz });
  } catch (_) {}
});

let best = null;
let method = "fallback-sharpness";
let reason = "";
let confidence = null;

if (frames.length) {
  const aiPick = await pickWithVision(frames);
  if (aiPick?.frame) {
    best = aiPick.frame.path;
    method = "vision-open-eyes";
    reason = aiPick.reason || "";
    confidence = aiPick.confidence;
  }
}

if (!best && frames.length) {
  frames.sort((a, b) => b.size - a.size);
  best = frames[0].path;
  reason = "Vision picker unavailable or inconclusive; used sharpest sampled frame.";
}

if (best) {
  fs.copyFileSync(best, path.join(dir, "cover-source.jpg"));
  try {
    execSync(`node scripts/render-smart-cover.mjs "${name}"`, { cwd: ROOT, stdio: "inherit" });
  } catch (err) {
    fs.copyFileSync(best, path.join(dir, "cover.jpg"));
    console.error(`[cover] smart overlay failed, kept raw frame: ${err.message}`);
  }
  fs.writeFileSync(path.join(dir, "cover-meta.json"), JSON.stringify({
    method,
    reason,
    confidence,
    sampledFrames: frames.length,
    generatedAt: new Date().toISOString(),
  }, null, 2));
  console.log(`[cover] ${name}: picked ${method} frame from ${frames.length} candidates -> cover.jpg`);
} else {
  console.error(`[cover] ${name}: could not extract a cover`);
}
// best-effort cleanup
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) {}

function roundTime(t) {
  return Math.round(t * 100) / 100;
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[m[1]] = value;
  }
}

async function pickWithVision(frames) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || typeof fetch !== "function") return null;

  const selected = thinFrames(frames, 16);
  const content = [{
    type: "input_text",
    text: `Choose the best cover frame for a professional financial advisor short-form video.

Return only JSON: {"pick": number, "confidence": 0-1, "reason": string}

Prioritize:
1. David's eyes are clearly open. Reject blinks, closed eyes, and sleepy half-open eyes.
2. Face is visible and reasonably centered.
3. Warm, pleasant, approachable expression if available. Prefer a natural slight smile or relaxed happy look over a flat, stern, tired, or between-sentences face.
4. Natural and trustworthy; do not choose a forced grin if a calmer authentic expression is better.
5. Low motion blur.
6. Not an awkward mid-word mouth shape.
7. Captions/text do not cover the face.

If every image is poor, still pick the least bad frame but use confidence below 0.7.`
  }];

  for (const frame of selected) {
    content.push({ type: "input_text", text: `Candidate ${frame.index}` });
    content.push({
      type: "input_image",
      image_url: `data:image/jpeg;base64,${fs.readFileSync(frame.path).toString("base64")}`,
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4.1",
        input: [{ role: "user", content }],
        temperature: 0,
      }),
    });
    const body = await response.json();
    if (!response.ok) {
      console.error(`[cover] vision picker skipped: ${body?.error?.message || response.statusText}`);
      return null;
    }
    const text = extractText(body);
    const parsed = JSON.parse((text.match(/\{[\s\S]*\}/) || [text])[0]);
    const picked = selected.find((f) => f.index === Number(parsed.pick));
    if (!picked || Number(parsed.confidence) < 0.7) return null;
    return { frame: picked, confidence: Number(parsed.confidence), reason: parsed.reason || "" };
  } catch (err) {
    console.error(`[cover] vision picker skipped: ${err.message}`);
    return null;
  }
}

function thinFrames(frames, max) {
  if (frames.length <= max) return frames;
  const out = [];
  const step = (frames.length - 1) / (max - 1);
  for (let i = 0; i < max; i++) out.push(frames[Math.round(i * step)]);
  return out;
}

function extractText(body) {
  if (body.output_text) return body.output_text;
  return (body.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}
