#!/usr/bin/env node
// classify-visual.mjs <video>
// AI-assisted intake router. Prints exactly one of: talkinghead | broll | uncertain.
// Uses sampled frames plus light audio metadata. No posting or publishing.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/classify-visual.mjs <video>");
  process.exit(2);
}

loadEnv(path.join(ROOT, ".env"));
loadEnv(path.join(path.resolve(ROOT, ".."), ".env.local"));

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || typeof fetch !== "function") {
  console.error("[classify-visual] OpenAI unavailable");
  process.exit(2);
}

const abs = path.resolve(ROOT, input);
const duration = probeDuration(abs);
const audio = probeAudio(abs);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "talley-classify-"));

try {
  const frames = sampleFrames(abs, duration, tmp);
  if (!frames.length) {
    console.error("[classify-visual] no frames sampled");
    process.exit(2);
  }
  const result = await classify({ frames, duration, audio, fileName: path.basename(input) });
  const label = ["talkinghead", "broll", "uncertain"].includes(result.label) ? result.label : "uncertain";
  console.error(`[classify-visual] ${label}: ${result.reason || "vision route"}`);
  console.log(label);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

function probeDuration(file) {
  try {
    return Number(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "csv=p=0",
      file,
    ], { encoding: "utf8" }).trim()) || 0;
  } catch (_) {
    return 0;
  }
}

function probeAudio(file) {
  const hasAudio = spawnSync("ffprobe", [
    "-v", "error",
    "-select_streams", "a",
    "-show_entries", "stream=index",
    "-of", "csv=p=0",
    file,
  ], { encoding: "utf8" });
  const exists = !!String(hasAudio.stdout || "").trim();
  if (!exists) return { exists: false, activeRatio: 0 };

  let silence = 0;
  try {
    const r = spawnSync("ffmpeg", [
      "-nostdin",
      "-i", file,
      "-af", "silencedetect=noise=-30dB:d=0.5",
      "-f", "null",
      "-",
    ], { encoding: "utf8" });
    const log = `${r.stdout || ""}\n${r.stderr || ""}`;
    silence = [...log.matchAll(/silence_duration:\s*([0-9.]+)/g)].reduce((sum, m) => sum + Number(m[1] || 0), 0);
  } catch (_) {}
  const duration = probeDuration(file);
  const activeRatio = duration > 0 ? Math.max(0, Math.min(1, (duration - silence) / duration)) : 0;
  return { exists: true, activeRatio: Number(activeRatio.toFixed(3)) };
}

function sampleFrames(file, duration, dir) {
  const times = sampleTimes(duration);
  const frames = [];
  for (let i = 0; i < times.length; i++) {
    const frame = path.join(dir, `frame-${i + 1}.jpg`);
    try {
      execFileSync("ffmpeg", [
        "-nostdin", "-y", "-hide_banner", "-loglevel", "error",
        "-ss", String(times[i]),
        "-i", file,
        "-frames:v", "1",
        "-vf", "scale=640:-1",
        frame,
      ]);
      frames.push({ index: i + 1, file: frame, time: times[i] });
    } catch (_) {}
  }
  return frames;
}

function sampleTimes(duration) {
  if (!Number.isFinite(duration) || duration <= 0) return [0.5];
  return [0.08, 0.25, 0.5, 0.75, 0.92]
    .map((p) => Math.max(0.25, Math.min(duration - 0.25, duration * p)))
    .filter((t, i, arr) => i === 0 || Math.abs(t - arr[i - 1]) >= 0.35)
    .map((t) => Math.round(t * 100) / 100);
}

async function classify({ frames, duration, audio, fileName }) {
  const content = [{
    type: "input_text",
    text: `Classify this incoming phone video for the Talley Wealth content pipeline.

Return only JSON: {"label":"talkinghead"|"broll"|"uncertain","reason":"short reason"}

Definitions:
- "talkinghead": David or another person is visibly speaking to camera, selfie/front-camera style, interview style, or otherwise clearly delivering spoken content meant to be transcribed and turned into social/video assets.
- "broll": scenic, nature, office, desk, local/lifestyle, family, walking, travel, texture, sign, establishing shot, or other visual source footage that should be banked for future overlay videos. B-roll may have background audio, accidental speech, or no speech.
- "uncertain": use only when the frames are too dark/blurred/ambiguous or the clip appears accidental.

Important:
- Do not classify a scenic/lifestyle clip as talkinghead just because it has audio.
- Do not classify a face briefly visible in a lifestyle scene as talkinghead unless the person is clearly speaking to camera.
- If it looks like a useful visual clip and not a direct-to-camera content take, choose broll.
- If it is a direct-to-camera person speaking, choose talkinghead.

File: ${fileName}
Duration seconds: ${duration || "unknown"}
Audio metadata: ${JSON.stringify(audio)}
`
  }];

  for (const frame of frames) {
    content.push({ type: "input_text", text: `Frame ${frame.index} at ${frame.time}s` });
    content.push({
      type: "input_image",
      image_url: `data:image/jpeg;base64,${fs.readFileSync(frame.file).toString("base64")}`,
    });
  }

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
  return JSON.parse((text.match(/\{[\s\S]*\}/) || [text])[0]);
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
