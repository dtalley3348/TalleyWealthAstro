// bridge.mjs
// Copies new videos from the iCloud inbox into the local inbox-local folder.
// This is the ONLY component that reads iCloud Drive, so it is the only thing that
// needs Full Disk Access. Everything else works from the unrestricted local folder.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "inbox");          // symlink -> iCloud Drive folder
const DST = path.join(ROOT, "inbox-local");    // plain local folder the watcher reads
const DONE = path.join(ROOT, "work", ".done");

fs.mkdirSync(DST, { recursive: true });
for (const dir of ["Broll", "TalkingHead"]) {
  try { fs.mkdirSync(path.join(SRC, dir), { recursive: true }); } catch (_) {}
  fs.mkdirSync(path.join(DST, dir), { recursive: true });
}

function localDiskBytes(file) {
  try {
    return fs.statSync(file).blocks * 512;
  } catch {
    return 0;
  }
}

function requestICloudDownload(file) {
  try {
    execFileSync("/usr/bin/brctl", ["download", file], { stdio: "ignore" });
    console.log(`[bridge] requested iCloud download for ${path.basename(file)}`);
  } catch (e) {
    console.error(`[bridge] could not request iCloud download for ${path.basename(file)}: ${e.message}`);
  }
}

function walkVideos(dir, relBase = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const rel = path.join(relBase, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkVideos(abs, rel));
    } else if (/\.(mov|mp4|m4v)$/i.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

let vids;
try {
  vids = walkVideos(SRC);
} catch (e) {
  console.error(`[bridge] cannot read iCloud inbox (needs Full Disk Access?): ${e.message}`);
  process.exit(1);
}

let copied = 0;
for (const rel of vids) {
  const f = path.basename(rel);
  const name = f.replace(/\.[^.]+$/, "");
  const routeDir = routeFor(rel);
  const dstDir = routeDir ? path.join(DST, routeDir) : DST;
  fs.mkdirSync(dstDir, { recursive: true });
  const dst = path.join(dstDir, f);
  if (fs.existsSync(dst)) continue;                      // already bridged
  if (fs.existsSync(path.join(DONE, name))) continue;    // already processed
  try {
    const src = path.join(SRC, rel);
    if (localDiskBytes(src) < 100000) {
      requestICloudDownload(src);
      continue;
    }
    fs.copyFileSync(src, dst);
    copied++;
    console.log(`[bridge] copied ${rel} -> ${path.relative(DST, dst)}`);
  } catch (e) {
    console.error(`[bridge] FAILED ${rel}: ${e.message}`);
  }
}
console.log(`[bridge] ${new Date().toISOString()} ${copied} new file(s) -> inbox-local`);

function routeFor(rel) {
  const first = rel.split(path.sep)[0]?.toLowerCase() || "";
  if (first === "broll" || first === "b-roll" || first === "b_roll") return "Broll";
  if (first === "talkinghead" || first === "talking-head" || first === "talking_head") return "TalkingHead";
  return "";
}
