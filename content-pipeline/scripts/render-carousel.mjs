// render-carousel.mjs <slides.json> <out_dir>
// Renders each carousel slide to a PNG using Remotion's `still` command.
// Runs on the Mac (needs the remotion deps installed).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const remotionDir = path.resolve(here, "../remotion");

const [, , slidesPath, outArg] = process.argv;
if (!slidesPath || !outArg) {
  console.error("usage: node render-carousel.mjs <slides.json> <out_dir>");
  process.exit(1);
}
const outDir = path.resolve(outArg);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(remotionDir, "public"), { recursive: true });

const slides = JSON.parse(fs.readFileSync(path.resolve(slidesPath), "utf8"));
const total = slides.length;

slides.forEach((s, i) => {
  const props = { ...s, index: i + 1, total };
  const propPath = path.join(remotionDir, "public", "carousel-slide.json");
  fs.writeFileSync(propPath, JSON.stringify(props));
  const num = String(i + 1).padStart(2, "0");
  const out = path.join(outDir, `slide-${num}.png`);
  console.log(`[carousel] rendering slide ${i + 1}/${total} -> ${out}`);
  execSync(
    `npx remotion still src/index.ts CarouselSlide "${out}" --props=public/carousel-slide.json`,
    { cwd: remotionDir, stdio: "inherit" }
  );
});

console.log(`[carousel] done: ${total} slides in ${outDir}`);
