import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const AUDIO_EXTS = new Set([".mp3", ".m4a", ".wav", ".aac"]);

export function readAudioManifest(root) {
  const manifestPath = path.join(root, "audio-beds", "manifest.json");
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (_) {
    return { version: 1, defaultVolume: 0.08, beds: [] };
  }
}

export function writeAudioManifest(root, manifest) {
  const manifestPath = path.join(root, "audio-beds", "manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

export function approvedAudioBeds(root) {
  const manifest = readAudioManifest(root);
  const beds = Array.isArray(manifest.beds) ? manifest.beds : [];
  return beds
    .filter((bed) => bed && bed.approved !== false && bed.enabled !== false)
    .filter((bed) => bed.file && AUDIO_EXTS.has(path.extname(bed.file).toLowerCase()))
    .filter((bed) => fs.existsSync(path.resolve(root, bed.file)))
    .map((bed) => ({
      ...bed,
      volume: clampVolume(bed.volume ?? manifest.defaultVolume ?? 0.08),
    }));
}

export function selectAudioBedForSpec(root, spec) {
  if (spec.audioBed === "silent" || spec.audioBedId === "silent") {
    return { status: "silent", reason: "Spec requested silence." };
  }

  const beds = approvedAudioBeds(root);
  if (!beds.length) {
    return {
      status: "silent",
      reason: "No approved audio beds are available.",
    };
  }

  if (spec.audioBedId) {
    const explicit = beds.find((bed) => bed.id === spec.audioBedId);
    if (explicit) return selection(explicit, "explicit");
  }

  const mood = String(spec.mood || spec.tone || spec.line || "").toLowerCase();
  const scored = beds.map((bed) => {
    const hay = [bed.mood, ...(bed.tags || []), ...(bed.useCases || [])].join(" ").toLowerCase();
    const score = ["calm", "steady", "warm", "reflective", "optimistic", "quiet"]
      .reduce((sum, word) => sum + (mood.includes(word) && hay.includes(word) ? 2 : 0), 0);
    return { bed, score };
  });
  const bestScore = Math.max(...scored.map((item) => item.score));
  const candidates = scored.filter((item) => item.score === bestScore).map((item) => item.bed);
  const index = deterministicIndex(String(spec.id || spec.line || "overlay"), candidates.length);
  return selection(candidates[index], bestScore > 0 ? "mood-match" : "approved-rotation");
}

export function copyAudioBedToRemotion(root, remotionDir, bed) {
  if (!bed || bed.status === "silent" || !bed.file) return null;
  const source = path.resolve(root, bed.file);
  if (!fs.existsSync(source)) return null;
  const ext = path.extname(source).toLowerCase();
  const publicName = `audio-bed-${safeSlug(bed.id || "selected")}${ext}`;
  const publicPath = path.join(remotionDir, "public", publicName);
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.copyFileSync(source, publicPath);
  return publicName;
}

export function safeSlug(value) {
  return String(value || "audio-bed")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "audio-bed";
}

export function clampVolume(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.08;
  return Math.max(0, Math.min(0.25, n));
}

function deterministicIndex(seed, length) {
  if (length <= 1) return 0;
  const hex = crypto.createHash("sha1").update(seed).digest("hex").slice(0, 8);
  return Number.parseInt(hex, 16) % length;
}

function selection(bed, reason) {
  return {
    status: "selected",
    reason,
    id: bed.id,
    name: bed.name || bed.id,
    file: bed.file,
    mood: bed.mood || "",
    volume: bed.volume,
    license: bed.license || "",
  };
}
