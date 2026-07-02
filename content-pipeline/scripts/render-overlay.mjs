// render-overlay.mjs <spec.json>
// Renders one text-on-b-roll short from a spec: { id, clip, line }
//   clip = path (relative to content-pipeline) to a b-roll segment
// Output: output/broll-overlays/<id>.mp4
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { copyAudioBedToRemotion, selectAudioBedForSpec } from "./audio-bed-lib.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const remotionDir = path.join(ROOT, "remotion");

const specPath = process.argv[2];
if (!specPath) { console.error("usage: render-overlay.mjs <spec.json>"); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

const clipAbs = path.resolve(ROOT, spec.clip);
if (!fs.existsSync(clipAbs)) { console.error(`[overlay] missing clip: ${spec.clip}`); process.exit(1); }

fs.mkdirSync(path.join(remotionDir, "public"), { recursive: true });
fs.copyFileSync(clipAbs, path.join(remotionDir, "public", "broll-input.mp4"));
const audioBed = selectAudioBedForSpec(ROOT, spec);
const audioBedFile = copyAudioBedToRemotion(ROOT, remotionDir, audioBed);

const dur = Number(
  execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${clipAbs}"`).toString().trim()
) || 7;

fs.writeFileSync(
  path.join(remotionDir, "public", "broll-props.json"),
  JSON.stringify({
    videoFile: "broll-input.mp4",
    line: spec.line,
    durationSec: dur,
    audioBedFile,
    audioVolume: audioBed.status === "selected" ? audioBed.volume : 0,
  }, null, 2)
);

const persistedSpec = {
  ...spec,
  audioBed: audioBed.status === "selected"
    ? {
        status: "selected",
        id: audioBed.id,
        name: audioBed.name,
        file: audioBed.file,
        volume: audioBed.volume,
        reason: audioBed.reason,
        license: audioBed.license,
      }
    : audioBed,
};
fs.writeFileSync(specPath, JSON.stringify(persistedSpec, null, 2));

const outDir = path.join(ROOT, "output", "broll-overlays");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${spec.id}.mp4`);

console.log(`[overlay] rendering ${spec.id}: "${spec.line}" over ${spec.clip}`);
console.log(`[overlay] audio: ${audioBed.status === "selected" ? `${audioBed.name} at ${audioBed.volume}` : `silent (${audioBed.reason})`}`);
execSync(`npx remotion render src/index.ts TextOnBroll "${out}" --props=public/broll-props.json`, {
  cwd: remotionDir, stdio: "inherit",
});
console.log(`[overlay] done -> ${path.relative(ROOT, out)}`);
