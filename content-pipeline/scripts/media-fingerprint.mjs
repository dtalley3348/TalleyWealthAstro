#!/usr/bin/env node
// media-fingerprint.mjs
// Tracks processed media fingerprints so repeated iPhone/iCloud saves with new
// filenames do not get processed again.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB = path.join(ROOT, "work", "media-fingerprints.json");

const [mode, file, nameArg] = process.argv.slice(2);
if (!["check", "register"].includes(mode) || !file) {
  console.error("usage: media-fingerprint.mjs check|register <file> [name]");
  process.exit(2);
}

const abs = path.resolve(ROOT, file);
const name = nameArg || path.basename(abs, path.extname(abs));
const db = readJson(DB, { items: [] });
const item = buildItem(abs, name);
const existing = db.items.find((x) => x.fingerprint === item.fingerprint && x.name !== name);

if (mode === "check") {
  if (existing) {
    console.log(`[fingerprint] ${name} duplicates ${existing.name}`);
    process.exit(10);
  }
  console.log(`[fingerprint] ${name} new`);
  process.exit(0);
}

const current = db.items.findIndex((x) => x.name === name);
if (current >= 0) db.items[current] = item;
else db.items.push(item);
db.items.sort((a, b) => a.name.localeCompare(b.name));
fs.mkdirSync(path.dirname(DB), { recursive: true });
fs.writeFileSync(DB, JSON.stringify(db, null, 2));
console.log(`[fingerprint] registered ${name}`);

function buildItem(target, mediaName) {
  const probe = JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size:stream=index,codec_type,codec_name,width,height,avg_frame_rate",
    "-of", "json",
    target,
  ], { encoding: "utf8" }));
  const video = (probe.streams || []).find((s) => s.codec_type === "video") || {};
  const durationMs = Math.round(Number(probe.format?.duration || 0) * 1000);
  const size = Number(probe.format?.size || fs.statSync(target).size);
  const frameRate = normalizeRate(video.avg_frame_rate || "");
  const fingerprint = [
    size,
    durationMs,
    video.codec_name || "",
    video.width || "",
    video.height || "",
    frameRate,
  ].join(":");
  return {
    name: mediaName,
    fingerprint,
    file: path.relative(ROOT, target),
    size,
    durationMs,
    width: video.width || null,
    height: video.height || null,
    codec: video.codec_name || "",
    frameRate,
    registeredAt: new Date().toISOString(),
  };
}

function normalizeRate(value) {
  const [a, b] = String(value).split("/").map(Number);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !b) return String(value || "");
  return String(Math.round((a / b) * 1000) / 1000);
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
