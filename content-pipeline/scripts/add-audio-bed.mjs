#!/usr/bin/env node
// add-audio-bed.mjs <audio-file> [--name "..."] [--mood "..."] [--volume 0.08]
// Copies an owned/licensed instrumental track into audio-beds/library and enables it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AUDIO_EXTS, clampVolume, readAudioManifest, safeSlug, writeAudioManifest } from "./audio-bed-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/add-audio-bed.mjs <audio-file> [--name \"Warm Ambient\"] [--mood \"calm, steady\"] [--volume 0.08]");
  process.exit(1);
}

const source = path.resolve(input);
if (!fs.existsSync(source)) {
  console.error(`[audio-bed] missing file: ${input}`);
  process.exit(1);
}

const ext = path.extname(source).toLowerCase();
if (!AUDIO_EXTS.has(ext)) {
  console.error(`[audio-bed] unsupported extension: ${ext}. Use mp3, m4a, wav, or aac.`);
  process.exit(1);
}

const opts = parseOpts(process.argv.slice(3));
const name = opts.name || path.basename(source, ext).replace(/[-_]+/g, " ");
const id = safeSlug(opts.id || name);
const destRel = path.join("audio-beds", "library", `${id}${ext}`);
const destAbs = path.join(ROOT, destRel);
fs.mkdirSync(path.dirname(destAbs), { recursive: true });
fs.copyFileSync(source, destAbs);

const manifest = readAudioManifest(ROOT);
manifest.beds = Array.isArray(manifest.beds) ? manifest.beds : [];
const entry = {
  id,
  name,
  file: destRel,
  approved: true,
  enabled: true,
  volume: clampVolume(opts.volume ?? manifest.defaultVolume ?? 0.08),
  mood: opts.mood || "calm, steady, unobtrusive",
  tags: splitList(opts.tags || "instrumental, ambient, background"),
  useCases: splitList(opts.useCases || "b-roll overlay shorts"),
  license: opts.license || "Confirm owned/licensed before live use.",
  added: new Date().toISOString().slice(0, 10),
};
const i = manifest.beds.findIndex((bed) => bed.id === id);
if (i >= 0) manifest.beds[i] = { ...manifest.beds[i], ...entry };
else manifest.beds.push(entry);
writeAudioManifest(ROOT, manifest);

console.log(`[audio-bed] added ${entry.name} -> ${entry.file} at volume ${entry.volume}`);

function parseOpts(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    const value = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
    out[key] = value;
  }
  return out;
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
