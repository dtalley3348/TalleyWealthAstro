#!/usr/bin/env node
// select-audio-bed.mjs <overlay-spec.json>
// Prints the audio-bed decision that render-overlay.mjs will use.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectAudioBedForSpec } from "./audio-bed-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.argv[2];
if (!specPath) {
  console.error("usage: node scripts/select-audio-bed.mjs <overlay-spec.json>");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(path.resolve(specPath), "utf8"));
console.log(JSON.stringify(selectAudioBedForSpec(ROOT, spec), null, 2));
