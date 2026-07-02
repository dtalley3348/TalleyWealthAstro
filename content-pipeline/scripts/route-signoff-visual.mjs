#!/usr/bin/env node
// route-signoff-visual.mjs <video>
// When the transcript is only sign-off filler, decide whether the visuals are
// still useful b-roll or whether the whole clip should be discarded.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = process.argv[2];
if (!input) {
  console.error("usage: route-signoff-visual.mjs <video>");
  process.exit(2);
}

loadEnv(path.join(ROOT, ".env"));
const abs = path.resolve(ROOT, input);
const duration = Number(execFileSync("ffprobe", [
  "-v", "error",
  "-show_entries", "format=duration",
  "-of", "csv=p=0",
  abs,
], { encoding: "utf8" }).trim()) || 0;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "talley-signoff-"));
try {
  const times = sampleTimes(duration);
  const frames = [];
  for (let i = 0; i < times.length; i++) {
    const frame = path.join(tmp, `frame-${i + 1}.jpg`);
    try {
      execFileSync("ffmpeg", [
        "-y", "-hide_banner", "-loglevel", "error",
        "-ss", String(times[i]),
        "-i", abs,
        "-frames:v", "1",
        "-vf", "scale=640:-1",
        frame,
      ]);
      frames.push({ index: i + 1, file: frame });
    } catch (_) {}
  }
  const decision = await decide(frames);
  console.log(`[signoff-route] ${decision.route}: ${decision.reason}`);
  process.exit(decision.route === "broll" ? 20 : 10);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

function sampleTimes(dur) {
  if (!Number.isFinite(dur) || dur <= 0) return [1];
  return [0.18, 0.5, 0.82]
    .map((p) => Math.max(0.3, Math.min(dur - 0.3, dur * p)))
    .filter((t, i, arr) => i === 0 || Math.abs(t - arr[i - 1]) > 0.5)
    .map((t) => Math.round(t * 100) / 100);
}

async function decide(frames) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !frames.length || typeof fetch !== "function") {
    return { route: "discard", reason: "vision unavailable; conservative discard" };
  }

  const content = [{
    type: "input_text",
    text: `This video transcript is only a sign-off such as "thanks for watching." Decide whether the visuals are still useful raw b-roll for Talley Wealth, or whether the clip should be discarded.

Return only JSON: {"route":"broll"|"discard","reason":"short reason"}

Use "broll" for scenic, lifestyle, local, office, desk, family, nature, travel, or other visually useful footage, even if the audio is filler.
Use "discard" for a talking-head outro, a person speaking to camera, a blank/accidental clip, or anything that is not useful visual source material.
Do not overthink brand fit. A clip can be limited but still b-roll if the visuals are usable.`
  }];

  for (const frame of frames) {
    content.push({ type: "input_text", text: `Frame ${frame.index}` });
    content.push({
      type: "input_image",
      image_url: `data:image/jpeg;base64,${fs.readFileSync(frame.file).toString("base64")}`,
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
    if (!response.ok) throw new Error(body?.error?.message || response.statusText);
    const text = extractText(body);
    const parsed = JSON.parse((text.match(/\{[\s\S]*\}/) || [text])[0]);
    const route = parsed.route === "broll" ? "broll" : "discard";
    return { route, reason: parsed.reason || "vision decision" };
  } catch (err) {
    return { route: "discard", reason: `vision failed: ${err.message}` };
  }
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}

function extractText(body) {
  if (body.output_text) return body.output_text;
  return (body.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}
