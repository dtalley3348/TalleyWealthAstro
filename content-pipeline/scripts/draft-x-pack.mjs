// draft-x-pack.mjs <videoName>
// Creates an X-native pack from one processed video. This is intentionally separate
// from the generic social pack because X works better as text-first POV/thread content.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.resolve(ROOT, "..");
const name = process.argv[2];
if (!name) { console.error("usage: node scripts/draft-x-pack.mjs <videoName>"); process.exit(1); }

loadDotenv(path.join(ROOT, ".env"));
loadDotenv(path.join(SITE, ".env.local"));

const OUT = path.join(ROOT, "output", name);
const WORK = path.join(ROOT, "work", name);
const transcript = readTranscript(path.join(WORK, "audio.json"));
const socialPack = read(path.join(OUT, "social-pack.md"));
const contentLog = readJson(path.join(OUT, "content-log.json"), {});
if (!transcript || !socialPack || /Suggested triage:\*\*\s*HELD/i.test(socialPack)) {
  console.log(`[x] ${name}: skipped, no usable transcript/social pack`);
  process.exit(0);
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4.1";
if (!apiKey) {
  console.log(`[x] ${name}: skipped, OPENAI_API_KEY is not set`);
  process.exit(0);
}

let result;
try {
  result = await callOpenAI(buildPrompt(), apiKey, model);
} catch (error) {
  fs.writeFileSync(path.join(OUT, "x-error.md"), `# X drafting blocked for ${name}\n\n\`\`\`\n${String(error?.message || error)}\n\`\`\`\n`);
  console.log(`[x] ${name}: blocked; see output/${name}/x-error.md`);
  process.exit(0);
}

const parsed = parseJson(result);
const xPack = normalizePack(parsed);
fs.writeFileSync(path.join(OUT, "x-pack.json"), JSON.stringify(xPack, null, 2));
fs.writeFileSync(path.join(OUT, "x-pack.md"), toMarkdown(xPack));
console.log(`[x] ${name}: wrote x-pack.json and x-pack.md`);

function buildPrompt() {
  return `You are creating X/Twitter-native content for David Talley at Talley Wealth.

X is not a dumping ground for the Instagram caption. It should feel like a sharp financial-planning observation from David.

Rules:
- No em dashes and no exclamation points.
- No hashtags unless truly necessary. Default to no hashtags.
- Do not use banned claims: fee-only, no commissions, no product sales, guaranteed outcomes, best advisor, beats the market, eliminates risk.
- Hedge tax/planning claims with may, might, could, can help evaluate, can model, can coordinate.
- Keep each post under 260 characters.
- Write one 2-4 post thread and four standalone posts.
- Thread should have one idea, not a summary of everything.
- Standalone posts should sound like useful observations, not promotional copy.
- The standalone posts should be distinct X-native derivatives: one blunt take, one quote-style David line, one misconception correction, and one short framework or planning question.
- CTA, if any, should be soft: "Worth modeling before you decide" or "That is a planning question, not just a math question."
- Return only JSON.

Schema:
{
  "status": "ready | hold",
  "reason": "",
  "mode": "thread | observation",
  "title": "",
  "thread": ["", ""],
  "standalone": ["", "", "", ""],
  "approvalNote": "",
  "complianceNotes": []
}

Content log:
${JSON.stringify(contentLog, null, 2)}

Social pack:
${socialPack.slice(0, 10000)}

Transcript:
${transcript.slice(0, 12000)}`;
}

async function callOpenAI(prompt, apiKey, model) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, input: prompt, text: { format: { type: "json_object" } } }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}: ${body}`);
  const json = JSON.parse(body);
  return json.output_text || collectOutputText(json) || body;
}

function normalizePack(pack) {
  const thread = cleanPosts(pack.thread || []).slice(0, 4);
  const standalone = cleanPosts(pack.standalone || []).slice(0, 4);
  const status = pack.status === "hold" || thread.length < 2 ? "hold" : "ready";
  return {
    sourceVideo: name,
    status,
    reason: pack.reason || (status === "hold" ? "Needs manual X review." : ""),
    mode: pack.mode === "observation" ? "observation" : "thread",
    title: pack.title || contentLog.title || name,
    thread,
    standalone,
    approvalNote: pack.approvalNote || "",
    complianceNotes: Array.isArray(pack.complianceNotes) ? pack.complianceNotes : [],
    createdAt: new Date().toISOString(),
  };
}

function cleanPosts(posts) {
  return (Array.isArray(posts) ? posts : [])
    .map((post) => String(post || "").replace(/[\u2014\u2013]/g, ", ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((post) => post.length > 260 ? post.slice(0, 257).replace(/\s+\S*$/, "") + "..." : post);
}

function toMarkdown(pack) {
  const lines = [`# X Pack: ${name}`, "", `Status: ${pack.status}`, `Mode: ${pack.mode}`, `Title: ${pack.title}`];
  if (pack.reason) lines.push("", "## Reason", pack.reason);
  if (pack.approvalNote) lines.push("", "## Recommendation", pack.approvalNote);
  lines.push("", "## Thread", ...pack.thread.map((post, i) => `${i + 1}. ${post}`));
  lines.push("", "## Standalone X extras", ...pack.standalone.map((post) => `- ${post}`));
  if (pack.complianceNotes.length) lines.push("", "## Compliance notes", ...pack.complianceNotes.map((note) => `- ${note}`));
  return lines.join("\n") + "\n";
}

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }
function readJson(p, fallback) { try { return JSON.parse(read(p)); } catch { return fallback; } }
function readTranscript(p) {
  const json = readJson(p, null);
  if (!json) return "";
  return String(json.text || (json.segments || []).map((s) => s.text).join(" ")).replace(/\s+/g, " ").trim();
}
function parseJson(text) {
  try { return JSON.parse(text); } catch {
    const m = String(text).match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Model did not return JSON");
  }
}
function collectOutputText(value) {
  const found = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.text === "string" && (node.type === "output_text" || node.type === "text")) found.push(node.text);
    if (typeof node.output_text === "string") found.push(node.output_text);
    if (Array.isArray(node)) node.forEach(visit);
    else Object.values(node).forEach(visit);
  };
  visit(value);
  return found.join("\n").trim();
}
function loadDotenv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[m[1]] = value;
  }
}
