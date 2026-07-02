// sync-metricool-status.mjs
// Read-only Metricool profile check. Writes work/metricool-status.json without secrets.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv(path.join(ROOT, ".env"));

const apiKey = process.env.METRICOOL_API_KEY || "";
const userId = process.env.METRICOOL_USER_ID || "";
const blogId = process.env.METRICOOL_BRAND_ID || "";
if (!apiKey || !userId || !blogId) {
  console.log("[metricool] status skipped, missing Metricool credentials/ids");
  process.exit(0);
}

const qs = new URLSearchParams({ userId, blogId });
const response = await fetch(`https://app.metricool.com/api/admin/profile?${qs}`, {
  headers: { "X-Mc-Auth": apiKey },
});
const body = await response.text();
if (!response.ok) {
  console.error(`[metricool] profile check failed ${response.status}: ${body.slice(0, 500)}`);
  process.exit(1);
}
const profile = JSON.parse(body);
const status = {
  brandId: Number(blogId),
  brandLabel: profile.label || "",
  facebook: !!profile.facebook,
  instagram: !!profile.instagram,
  linkedin: !!profile.linkedinCompany,
  googleBusinessProfile: !!profile.gmb,
  youtube: !!profile.youtube,
  x: !!profile.twitter,
  xHandle: profile.twitter || "",
  checkedAt: new Date().toISOString(),
};
fs.mkdirSync(path.join(ROOT, "work"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "work", "metricool-status.json"), JSON.stringify(status, null, 2));
console.log(`[metricool] ${status.brandLabel}: x=${status.x ? status.xHandle : "not connected"}`);

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
