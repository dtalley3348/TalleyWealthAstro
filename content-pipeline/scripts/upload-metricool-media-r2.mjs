#!/usr/bin/env node
// upload-metricool-media-r2.mjs
// Uploads scheduled media assets to a Cloudflare R2 bucket and writes public URLs
// into work/metricool-media-manifest.json for Metricool scheduling.
//
// This script does not schedule posts. It only uploads files to object storage.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv(path.join(ROOT, ".env"));

const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_BASE_URL"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[r2] missing ${missing.join(", ")} in content-pipeline/.env`);
  console.error("[r2] create the Cloudflare R2 bucket/token first, then rerun this script.");
  process.exit(2);
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicBaseUrl = String(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, "");
const prefix = cleanPrefix(process.env.R2_KEY_PREFIX || "talley-pipeline");
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
const dryRun = process.argv.includes("--dry-run");

const schedulePath = path.join(ROOT, "schedule.json");
if (!fs.existsSync(schedulePath)) {
  console.error("[r2] schedule.json missing. Run node scripts/schedule.mjs first.");
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(schedulePath, "utf8")).filter((row) => row.date !== "OVERFLOW");
const manifest = {
  generatedAt: new Date().toISOString(),
  storage: "cloudflare-r2",
  bucket,
  publicBaseUrl,
  prefix,
  dryRun,
  assets: {}
};

let uploadCount = 0;
for (const row of rows) {
  const files = localFilesFor(row);
  if (!files.length) continue;
  const key = keyFor(row);
  const item = {
    video: row.video,
    asset: row.asset,
    platform: row.platform,
    localFiles: [],
    publicUrls: [],
    ready: false
  };
  for (const rel of files) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) {
      item.localFiles.push({ path: rel, missing: true });
      continue;
    }
    const objectKey = objectKeyFor(row, rel);
    const publicUrl = `${publicBaseUrl}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
    if (!dryRun) await putObject({ file: src, objectKey, contentType: contentTypeFor(rel) });
    item.localFiles.push({ path: rel, objectKey });
    item.publicUrls.push(publicUrl);
    uploadCount++;
  }
  item.ready = item.publicUrls.length > 0 && item.localFiles.every((file) => !file.missing);
  manifest.assets[key] = item;
}

fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "work", "metricool-media-manifest.json"), JSON.stringify(manifest, null, 2));
const assetCount = Object.keys(manifest.assets).length;
const readyCount = Object.values(manifest.assets).filter((item) => item.ready).length;
console.log(`[r2] ${dryRun ? "dry-run prepared" : "uploaded"} ${uploadCount} file(s) for ${readyCount}/${assetCount} media asset(s)`);
console.log("[r2] wrote work/metricool-media-manifest.json");

async function putObject({ file, objectKey, contentType }) {
  const body = fs.readFileSync(file);
  const url = `${endpoint}/${bucket}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
  const headers = signRequest({
    method: "PUT",
    url,
    body,
    headers: {
      "content-type": contentType,
      "x-amz-content-sha256": sha256Hex(body),
      "x-amz-date": amzDate(new Date())
    }
  });
  const response = await fetch(url, { method: "PUT", headers, body });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`[r2] upload failed ${response.status} ${objectKey}: ${text.slice(0, 1000)}`);
  }
}

function signRequest({ method, url, body, headers }) {
  const parsed = new URL(url);
  const now = parseAmzDate(headers["x-amz-date"]);
  const dateStamp = headers["x-amz-date"].slice(0, 8);
  const region = "auto";
  const service = "s3";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const host = parsed.host;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `content-type:${headers["content-type"]}`,
    `host:${host}`,
    `x-amz-content-sha256:${headers["x-amz-content-sha256"]}`,
    `x-amz-date:${headers["x-amz-date"]}`
  ].join("\n") + "\n";
  const canonicalRequest = [
    method,
    parsed.pathname,
    parsed.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    headers["x-amz-content-sha256"]
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    headers["x-amz-date"],
    credentialScope,
    sha256Hex(canonicalRequest)
  ].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), service), "aws4_request");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  return {
    ...headers,
    host,
    authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  };
}

function localFilesFor(row) {
  const dir = path.join("output", row.video);
  if (row.asset === "video") {
    const candidates = ["scheduled/captioned_with_cover_9x16.mp4", "captioned_vertical_9x16.mp4", "vertical_9x16.mp4"];
    return candidates.map((file) => path.join(dir, file)).filter((rel) => fs.existsSync(path.join(ROOT, rel))).slice(0, 1);
  }
  if (row.asset === "carousel") {
    const carouselDir = path.join(ROOT, dir, "carousel");
    if (!fs.existsSync(carouselDir)) return [];
    return fs.readdirSync(carouselDir)
      .filter((file) => /^slide-\d+\.png$/.test(file))
      .sort()
      .map((file) => path.join(dir, "carousel", file));
  }
  if (row.asset === "overlay") {
    const overlayDir = path.join(ROOT, "output", "broll-overlays");
    if (!fs.existsSync(overlayDir)) return [];
    return fs.readdirSync(overlayDir)
      .filter((file) => file.startsWith(`${row.video}_`) && file.endsWith(".mp4"))
      .sort()
      .slice(0, 1)
      .map((file) => path.join("output", "broll-overlays", file));
  }
  return [];
}

function objectKeyFor(row, rel) {
  const ext = path.extname(rel).toLowerCase();
  const base = path.basename(rel, ext).replace(/[^A-Za-z0-9._-]+/g, "-");
  return [prefix, row.video, row.asset, row.platform, `${base}${ext}`].filter(Boolean).join("/");
}

function keyFor(row) {
  return `${row.video}|${row.asset}|${row.platform}`;
}

function cleanPrefix(value) {
  return String(value || "").replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hmac(key, value) {
  return crypto.createHmac("sha256", key).update(value).digest();
}

function amzDate(date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function parseAmzDate(_) {
  return null;
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
