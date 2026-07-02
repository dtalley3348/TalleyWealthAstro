// build-captions.mjs <whisper_audio.json> <out_captions.json> [maxWordsPerLine]
// Converts Whisper word-timestamp output into caption "pages" for Remotion.
import fs from "node:fs";

const [, , inPath, outPath, maxArg] = process.argv;
const maxWords = Number(maxArg || 4);

const data = JSON.parse(fs.readFileSync(inPath, "utf8"));
const words = [];
for (const seg of data.segments || []) {
  for (const w of seg.words || []) {
    const text = (w.word || "").trim();
    if (!text) continue;
    words.push({ text, start: w.start, end: w.end });
  }
}

// Group into short lines, breaking on sentence punctuation or word count.
const pages = [];
let cur = [];
const flush = () => {
  if (!cur.length) return;
  pages.push({ start: cur[0].start, end: cur[cur.length - 1].end, tokens: cur });
  cur = [];
};
for (const w of words) {
  cur.push(w);
  const endsSentence = /[.?!,]$/.test(w.text);
  if (cur.length >= maxWords || endsSentence) flush();
}
flush();

fs.writeFileSync(outPath, JSON.stringify(pages, null, 2));
console.log(`[captions] ${words.length} words -> ${pages.length} caption pages -> ${outPath}`);
