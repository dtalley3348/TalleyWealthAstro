// build-review.mjs
// Generates content-pipeline/review.html: a single self-contained visual board of
// everything waiting in the pipeline (videos, carousels, captions, blogs, overlays),
// with per-video approve toggles saved in the browser. Open review.html in any browser.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "output");
const BROLL_LIB = path.join(ROOT, "broll-library.json");

const exists = (p) => fs.existsSync(p);
const read = (p) => (exists(p) ? fs.readFileSync(p, "utf8") : "");

// Parse social-pack.md into { heading: text } sections (split on "## ").
function parseSocial(md) {
  const out = {};
  if (!md) return out;
  const parts = md.split(/^##\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const heading = part.slice(0, nl).trim();
    let body = part.slice(nl + 1).trim();
    body = body.split(/^---/m)[0].trim();
    if (heading && body) out[heading] = body;
  }
  return out;
}

const data = [];
if (exists(OUT)) {
  for (const name of fs.readdirSync(OUT).sort()) {
    const dir = path.join(OUT, name);
    if (!fs.statSync(dir).isDirectory() || name === "broll-overlays") continue;
    if (!isReviewReady(name)) continue;

    const video =
      ["captioned_vertical_9x16.mp4", "vertical_9x16.mp4"]
        .map((f) => path.join("output", name, f))
        .find((rel) => exists(path.join(ROOT, rel))) || null;

    const carouselDir = path.join(dir, "carousel");
    const slides = exists(carouselDir)
      ? fs.readdirSync(carouselDir).filter((f) => /^slide-\d+\.png$/.test(f)).sort()
          .map((f) => `output/${name}/carousel/${f}`)
      : [];

    const social = parseSocial(read(path.join(dir, "social-pack.md")));
    const blog = read(path.join(dir, "blog-draft.md"));

    // triage line from social-pack if present
    const sp = read(path.join(dir, "social-pack.md"));
    const triage = (sp.match(/Suggested triage:\*\*\s*(.+)/) || [])[1]?.trim() || "";
    const pillar = (sp.match(/Pillar:\*\*\s*(.+)/) || [])[1]?.trim() || "";

    const cover = exists(path.join(dir, "cover.jpg")) ? `output/${name}/cover.jpg` : null;
    data.push({ name, video, cover, slides, social, blog, triage, pillar });
  }
}

function isReviewReady(name) {
  const dir = path.join(OUT, name);
  if (!exists(path.join(dir, "content-log.json"))) return false;
  if (!exists(path.join(dir, "social-pack.md"))) return false;
  if (!exists(path.join(ROOT, "approval-queue", `${name}.md`))) return false;
  return isValidMedia(path.join(dir, "captioned_vertical_9x16.mp4"));
}

function isValidMedia(file) {
  if (!exists(file)) return false;
  const r = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ], { encoding: "utf8" });
  return r.status === 0 && Number(String(r.stdout || "").trim()) > 0;
}

// b-roll overlays (not tied to one video)
const overlayDir = path.join(OUT, "broll-overlays");
const overlays = exists(overlayDir)
  ? fs.readdirSync(overlayDir).filter((f) => f.endsWith(".mp4")).sort()
      .map((f) => `output/broll-overlays/${f}`)
  : [];

const brollLibrary = safeJson(BROLL_LIB, []).filter((item) => item && item.file);

const payload = JSON.stringify({ data, overlays, brollLibrary, generated: new Date().toLocaleString() });

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Talley Content Review</title>
<style>
:root{--navy:#243445;--gold:#BF8C4D;--slate:#4F5861;--light:#E9E8E6;}
*{box-sizing:border-box}
body{margin:0;background:#1b2733;color:var(--light);font-family:-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--navy);border-bottom:1px solid rgba(191,140,77,.4);padding:16px 28px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
header h1{font-size:20px;margin:0;color:#fff;font-weight:600}
.meta{color:#90a0ad;font-size:13px}
.spacer{flex:1}
.btn{background:transparent;border:1px solid var(--gold);color:var(--gold);border-radius:8px;padding:8px 14px;font-size:14px;cursor:pointer}
.btn:hover{background:rgba(191,140,77,.12)}
.wrap{max-width:1100px;margin:0 auto;padding:24px 20px 80px}
.card{background:var(--navy);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px;margin-bottom:22px}
.card.approved{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}
.chead{display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap}
.chead h2{font-size:18px;margin:0;color:#fff;font-weight:600}
.tag{font-size:12px;color:var(--gold);border:1px solid rgba(191,140,77,.5);border-radius:20px;padding:3px 10px}
.row{display:flex;gap:20px;flex-wrap:wrap}
video{border-radius:10px;background:#000;max-height:420px}
.slides{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
.slides img{height:300px;border-radius:8px;border:1px solid rgba(255,255,255,.1)}
.broll-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.broll-card{background:#1f2c3a;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px}
.broll-card video{width:100%;max-height:260px}
.broll-card h3{font-size:14px;margin:10px 0 6px;color:#fff}
.broll-card p{font-size:13px;line-height:1.4;color:var(--light);margin:6px 0}
.mini-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.mini-tags span{font-size:11px;color:#d9b178;border:1px solid rgba(191,140,77,.35);border-radius:999px;padding:2px 7px}
details{background:#1f2c3a;border:1px solid rgba(255,255,255,.08);border-radius:8px;margin:8px 0;padding:0 14px}
summary{cursor:pointer;padding:12px 0;color:#fff;font-weight:500;font-size:14px;list-style:none}
summary::-webkit-details-marker{display:none}
summary::before{content:"› ";color:var(--gold)}
details[open] summary::before{content:"⌄ "}
pre{white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.5;color:var(--light);margin:0 0 14px;padding-top:4px}
.approve{display:flex;align-items:center;gap:8px;margin-left:auto}
.approve input{width:20px;height:20px;accent-color:var(--gold)}
.approve label{font-size:14px;color:#fff}
.section-title{color:var(--gold);font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:18px 0 8px}
.empty{color:#90a0ad;font-style:italic}
</style></head><body>
<header>
  <h1>Content Review</h1>
  <span class="meta" id="meta"></span>
  <span class="spacer"></span>
  <span class="meta" id="count"></span>
  <button class="btn" onclick="copyApproved()">Copy approved list</button>
</header>
<div class="wrap" id="wrap"></div>
<script>
const PAYLOAD = ${payload};
const KEY = 'talley-review-approved';
const approved = new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
function save(){localStorage.setItem(KEY, JSON.stringify([...approved]));updateCount();}
function updateCount(){document.getElementById('count').textContent = approved.size + ' approved';}
function toggle(name, el){ if(el.checked){approved.add(name)}else{approved.delete(name)} save(); el.closest('.card').classList.toggle('approved', el.checked); }
function copyApproved(){ navigator.clipboard.writeText([...approved].join('\\n')); alert('Approved list copied:\\n\\n'+[...approved].join('\\n')); }
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

document.getElementById('meta').textContent = 'Generated ' + PAYLOAD.generated + ' · ' + PAYLOAD.data.length + ' videos';
const wrap = document.getElementById('wrap');

for (const v of PAYLOAD.data){
  const card = document.createElement('div');
  card.className = 'card' + (approved.has(v.name)?' approved':'');
  let socialHtml = '';
  for (const [k,txt] of Object.entries(v.social||{})){
    if(/carousel/i.test(k)) continue;
    socialHtml += '<details><summary>'+esc(k)+'</summary><pre>'+esc(txt)+'</pre></details>';
  }
  const slidesHtml = (v.slides||[]).map(s=>'<img loading="lazy" src="'+s+'">').join('');
  card.innerHTML =
    '<div class="chead"><h2>'+esc(v.name)+'</h2>'+
      (v.triage?'<span class="tag">'+esc(v.triage)+'</span>':'')+
      (v.pillar?'<span class="tag">'+esc(v.pillar)+'</span>':'')+
      '<span class="approve"><input type="checkbox" id="ap-'+v.name+'" '+(approved.has(v.name)?'checked':'')+' onchange="toggle(\\''+v.name+'\\',this)"><label for="ap-'+v.name+'">Approve</label></span>'+
    '</div>'+
    '<div class="row">'+
      (v.video?'<video controls preload="metadata" width="236" '+(v.cover?'poster="'+v.cover+'"':'')+' src="'+v.video+'"></video>':'<span class="empty">no video</span>')+
      '<div style="flex:1;min-width:280px">'+
        (slidesHtml?'<div class="section-title">Carousel</div><div class="slides">'+slidesHtml+'</div>':'')+
        '<div class="section-title">Captions</div>'+(socialHtml||'<span class="empty">no captions yet</span>')+
        (v.blog?'<div class="section-title">Blog</div><details><summary>Read blog draft</summary><pre>'+esc(v.blog)+'</pre></details>':'')+
      '</div>'+
    '</div>';
  wrap.appendChild(card);
}

if (PAYLOAD.overlays.length){
  const t=document.createElement('div'); t.className='section-title'; t.style.fontSize='15px'; t.textContent='B-roll overlay shorts'; wrap.appendChild(t);
  const row=document.createElement('div'); row.className='row';
  for(const o of PAYLOAD.overlays){ const vd=document.createElement('video'); vd.controls=true; vd.preload='metadata'; vd.width=200; vd.src=o; row.appendChild(vd); }
  wrap.appendChild(row);
}

if (PAYLOAD.brollLibrary.length){
  const t=document.createElement('div'); t.className='section-title'; t.style.fontSize='15px'; t.textContent='B-roll bank'; wrap.appendChild(t);
  const grid=document.createElement('div'); grid.className='broll-grid';
  for(const b of PAYLOAD.brollLibrary){
    const tags = (b.tags||[]).slice(0,8).map(x=>'<span>'+esc(String(x))+'</span>').join('');
    const uses = (b.useCases||[]).slice(0,3).join(', ');
    const avoid = (b.avoidWhen||[]).slice(0,2).join(', ');
    const card=document.createElement('div'); card.className='broll-card';
    card.innerHTML =
      '<video controls preload="metadata" src="'+esc(b.file)+'"></video>'+
      '<h3>'+esc(b.name||'B-roll clip')+'</h3>'+
      '<p>'+esc(b.description||'Needs description')+'</p>'+
      '<p><strong>Mood:</strong> '+esc(b.mood||'')+'</p>'+
      (uses?'<p><strong>Good for:</strong> '+esc(uses)+'</p>':'')+
      (avoid?'<p><strong>Avoid when:</strong> '+esc(avoid)+'</p>':'')+
      '<div class="mini-tags">'+tags+'</div>';
    grid.appendChild(card);
  }
  wrap.appendChild(grid);
}
updateCount();
</script></body></html>`;

fs.writeFileSync(path.join(ROOT, "review.html"), html);
console.log(`[review] wrote review.html (${data.length} videos, ${overlays.length} overlays)`);

function safeJson(p, fallback) {
  try { return JSON.parse(read(p)); } catch { return fallback; }
}
