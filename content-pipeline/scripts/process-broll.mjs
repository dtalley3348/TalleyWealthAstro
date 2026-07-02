// process-broll.mjs <video>
// Slices a raw b-roll clip into usable segments and catalogs each one.
// - If the clip has scene cuts (multiple shots), it splits on them.
// - Long shots (and single continuous takes) are sub-sliced into ~7s windows.
// - Very short fragments (<3s) are dropped.
// Each segment is copied to broll/clips, gets one sampled frame, and is added to
// broll-library.json. If OPENAI_API_KEY is available, the sampled frame is
// described and tagged for later matching.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const LIB = path.join(ROOT, "broll-library.json");
const CLIPS = path.join(ROOT, "broll", "clips");
const FRAMES = path.join(ROOT, "broll", "frames");

const TARGET = 7;   // target segment length (seconds)
const MIN = 3;      // drop segments shorter than this
const MAX = 10;     // shots longer than this get sub-sliced

const input = process.argv[2];
if (!input) { console.error("usage: process-broll.mjs <video>"); process.exit(1); }
const name = path.basename(input, path.extname(input));
loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(path.resolve(ROOT, ".."), ".env.local"));

const sh = (c) => execSync(c, { stdio: ["ignore", "pipe", "pipe"] }).toString();

const dur = Number(sh(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${input}"`).trim()) || 0;
if (dur <= 0) { console.error(`[broll] could not read duration for ${name}`); process.exit(1); }

// Detect scene-cut timestamps.
let cuts = [];
try {
  const log = execSync(
    `ffmpeg -i "${input}" -filter:v "select='gt(scene,0.4)',showinfo" -an -f null - 2>&1`,
    { stdio: ["ignore", "pipe", "pipe"] }
  ).toString();
  cuts = [...log.matchAll(/pts_time:([0-9.]+)/g)].map((m) => Number(m[1])).filter((t) => t > 1 && t < dur - 1);
} catch (_) { cuts = []; }

// Build shot boundaries, then sub-slice long shots into ~TARGET windows.
const bounds = [0, ...cuts, dur];
const segments = [];
for (let i = 0; i < bounds.length - 1; i++) {
  let a = bounds[i], b = bounds[i + 1];
  const shot = b - a;
  if (shot < MIN) continue;
  if (shot <= MAX) { segments.push([a, b]); continue; }
  const n = Math.round(shot / TARGET);
  const step = shot / n;
  for (let k = 0; k < n; k++) {
    const s = a + k * step, e = k === n - 1 ? b : a + (k + 1) * step;
    if (e - s >= MIN) segments.push([s, e]);
  }
}
if (!segments.length) segments.push([0, Math.min(dur, MAX)]);

fs.mkdirSync(CLIPS, { recursive: true });
const lib = fs.existsSync(LIB) ? JSON.parse(fs.readFileSync(LIB, "utf8")) : [];
let added = 0;

for (const [[s, e], idx] of segments.map((seg, i) => [seg, i])) {
  const segName = `${name}_seg${String(idx + 1).padStart(2, "0")}`;
  if (lib.some((x) => x.name === segName)) continue;
  const dest = path.join(CLIPS, `${segName}.mp4`);
  execSync(
    `ffmpeg -y -loglevel error -ss ${s.toFixed(2)} -to ${e.toFixed(2)} -i "${input}" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset veryfast -an -movflags +faststart "${dest}"`
  );
  const frameDir = path.join(FRAMES, segName);
  fs.mkdirSync(frameDir, { recursive: true });
  const frame = path.join(frameDir, "f1.jpg");
  execSync(`ffmpeg -y -loglevel error -ss ${((e - s) / 2).toFixed(2)} -i "${dest}" -frames:v 1 -vf scale=320:-1 "${frame}"`);
  const probe = JSON.parse(
    sh(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of json "${dest}"`)
  );
  const w = probe.streams?.[0]?.width ?? null, h = probe.streams?.[0]?.height ?? null;
  const ai = await describeFrame(frame, { segName, duration: e - s, orientation: w && h ? (h >= w ? "vertical" : "horizontal") : null });
  lib.push({
    name: segName,
    parent: name,
    file: path.relative(ROOT, dest),
    duration: Number((e - s).toFixed(2)),
    width: w, height: h,
    orientation: w && h ? (h >= w ? "vertical" : "horizontal") : null,
    frames: [path.relative(ROOT, frame)],
    description: ai.description || "",
    tags: ai.tags || [],
    mood: ai.mood || "",
    visualCategory: ai.visualCategory || "",
    useCases: ai.useCases || [],
    avoidWhen: ai.avoidWhen || [],
    brandFit: ai.brandFit || "",
    qualityNotes: ai.qualityNotes || "",
    approved: false,
    status: ai.description ? "ready" : "needs-description",
    added: new Date().toISOString().slice(0, 10),
  });
  added++;
}

fs.writeFileSync(LIB, JSON.stringify(lib, null, 2));
console.log(`[broll] ${name}: ${segments.length} segments, ${added} new -> library`);

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }
function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of read(file).split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

async function describeFrame(frame, meta) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return {};
  try {
    const image = fs.readFileSync(frame).toString("base64");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: `Describe this b-roll frame for the Talley Wealth content bank.

Return only JSON:
{
  "description": "one concrete sentence describing what is visible",
  "visualCategory": "nature | office | desk | local | lifestyle | abstract | travel | home | other",
  "tags": ["5-10 short tags"],
  "mood": "short phrase",
  "useCases": ["2-5 Talley Wealth content uses"],
  "avoidWhen": ["when this would feel off-brand or misleading"],
  "brandFit": "excellent | good | limited | avoid",
  "qualityNotes": "short practical note on framing, motion, lighting, or eyes/people if relevant"
}

Prefer grounded descriptions. Do not invent locations, people, money imagery, or financial meaning. Nature can be useful as calm texture, but flag it as limited if it is generic. Clip metadata: ${JSON.stringify(meta)}` },
            { type: "input_image", image_url: `data:image/jpeg;base64,${image}` }
          ]
        }]
      })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(body).slice(0, 500));
    const text = extractText(body);
    return JSON.parse((text.match(/\{[\s\S]*\}/) || [text])[0]);
  } catch (e) {
    console.error(`[broll] AI description skipped for ${meta.segName}: ${e.message}`);
    return {};
  }
}

function extractText(body) {
  const chunks = [];
  const visit = (node) => {
    if (!node) return;
    if (typeof node === "string") return;
    if (typeof node !== "object") return;
    if ((node.type === "output_text" || node.type === "text") && typeof node.text === "string") chunks.push(node.text);
    if (Array.isArray(node)) node.forEach(visit);
    else Object.values(node).forEach(visit);
  };
  visit(body);
  return chunks.join("\n");
}
