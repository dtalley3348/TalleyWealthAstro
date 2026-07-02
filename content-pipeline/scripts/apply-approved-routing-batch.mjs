#!/usr/bin/env node
// Applies work/approved-routing-batch.json through the existing Metricool writer.
//
// Safety model:
// 1. Temporarily write the approved batch to schedule.json.
// 2. Upload/schedule the replacement and repurpose rows.
// 3. Restore the previous local schedule files.
// 4. Only then delete old Talley Wealth posts whose replacement row exists.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORK = path.join(ROOT, "work");
const BATCH_PATH = path.join(WORK, "approved-routing-batch.json");
const APPLY_OUT = path.join(WORK, "approved-routing-batch-apply.json");
const args = new Set(process.argv.slice(2));

const confirmLive = args.has("--confirm-live");
const deleteMoved = args.has("--delete-moved");
const batch = readJson(BATCH_PATH, null);
if (!batch?.rows?.length) {
  console.error("[approved-routing-apply] missing or empty work/approved-routing-batch.json");
  process.exit(1);
}

const moveRows = batch.rows.filter((row) => row.batchKind === "move");
const repurposeRows = batch.rows.filter((row) => row.batchKind === "repurpose_seed");
const evidence = {
  generatedAt: new Date().toISOString(),
  mode: confirmLive ? "live" : "dry_run",
  deleteMoved,
  batchGeneratedAt: batch.generatedAt || "",
  requested: {
    totalRows: batch.rows.length,
    moveRows: moveRows.length,
    repurposeRows: repurposeRows.length,
  },
  steps: [],
  created: [],
  skipped: [],
  deletedOldMetricoolIds: [],
  deleteFailures: [],
  restoredLocalFiles: false,
};

if (!confirmLive) {
  evidence.note = "Dry-run only. Re-run with --confirm-live to create Metricool posts. Add --delete-moved to remove old Talley Wealth posts after replacement creation.";
  writeEvidence(evidence);
  console.log(`[approved-routing-apply] dry-run: ${batch.rows.length} row(s) ready; ${moveRows.length} move, ${repurposeRows.length} repurpose`);
  console.log("[approved-routing-apply] no Metricool writes were made");
  process.exit(0);
}

const backupDir = path.join(WORK, "batch-backups", timestamp());
const managedFiles = [
  path.join(ROOT, "schedule.json"),
  path.join(ROOT, "metricool-dry-run.json"),
  path.join(WORK, "metricool-media-manifest.json"),
];

fs.mkdirSync(backupDir, { recursive: true });
const backups = backupFiles(managedFiles, backupDir);

try {
  fs.writeFileSync(path.join(ROOT, "schedule.json"), JSON.stringify(batch.rows, null, 2));
  evidence.steps.push({ id: "write-temp-schedule", status: "complete", rows: batch.rows.length });

  runStep("prepare-media", "node", ["scripts/prepare-scheduled-media.mjs"]);
  runStep("metricool-dry-run", "node", ["scripts/metricool-dry-run.mjs"]);
  runStep("upload-media", "node", ["scripts/upload-metricool-media-r2.mjs"]);
  runStep("metricool-live-write", "node", ["scripts/metricool-live.mjs", "--from-schedule", "--include-media", "--publishable", "--confirm-live", "--max=all"], {
    env: { ...process.env, METRICOOL_LIVE_WRITE: "true" },
  });

  const live = readJson(path.join(WORK, "metricool-live-results.json"), { results: [] });
  const successfulMoves = [];
  for (const item of live.results || []) {
    if (item.skipped) evidence.skipped.push({ row: slimRow(item.row), reason: item.reason || "skipped", validation: item.validation || [] });
    else evidence.created.push({ row: slimRow(item.row), metricoolId: item.result?.response?.data?.id || item.ledger?.metricoolId || null });
    if (item?.row?.batchKind === "move" && replacementExists(item)) successfulMoves.push(item.row);
  }

  restoreFiles(backups);
  evidence.restoredLocalFiles = true;

  if (deleteMoved) {
    for (const row of successfulMoves) await deleteOldMove(row);
    pruneRestoredScheduleRows(successfulMoves);
    runOptionalStep("refresh-restored-dry-run", "node", ["scripts/metricool-dry-run.mjs"]);
  }

  runOptionalStep("refresh-talley-wealth-list", "node", ["scripts/metricool-live.mjs", "--list"]);
  runOptionalStep("refresh-engine", "node", ["scripts/sync-metricool-engine.mjs"]);
  runOptionalStep("refresh-shadow-reroute", "node", ["scripts/build-metricool-shadow-reroute.mjs"]);

  evidence.completedAt = new Date().toISOString();
  writeEvidence(evidence);
  console.log(`[approved-routing-apply] created ${evidence.created.length} row(s), skipped ${evidence.skipped.length}, deleted old ${evidence.deletedOldMetricoolIds.length}; evidence work/approved-routing-batch-apply.json`);
} catch (error) {
  if (!evidence.restoredLocalFiles) {
    try {
      restoreFiles(backups);
      evidence.restoredLocalFiles = true;
    } catch (restoreError) {
      evidence.restoreError = String(restoreError?.message || restoreError);
    }
  }
  evidence.failedAt = new Date().toISOString();
  evidence.error = String(error?.message || error);
  writeEvidence(evidence);
  console.error(`[approved-routing-apply] failed: ${evidence.error}`);
  process.exit(1);
}

async function deleteOldMove(row) {
  const id = String(row.oldMetricoolId || "");
  if (!/^\d+$/.test(id)) {
    evidence.deleteFailures.push({ id, row: slimRow(row), error: "Invalid or missing oldMetricoolId" });
    return;
  }
  const result = spawnSync("node", ["scripts/metricool-live.mjs", `--delete-id=${id}`, "--confirm-live"], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, METRICOOL_LIVE_WRITE: "true" },
    maxBuffer: 1024 * 1024 * 5,
  });
  evidence.steps.push({
    id: `delete-old-${id}`,
    status: result.status === 0 ? "complete" : "failed",
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
    exitStatus: result.status,
  });
  if (result.status === 0) {
    markOldLedgerEntryDeleted(id, row);
    evidence.deletedOldMetricoolIds.push({ id, replacement: slimRow(row) });
  } else {
    evidence.deleteFailures.push({ id, row: slimRow(row), error: trim(result.stderr || result.stdout) });
  }
}

function replacementExists(item) {
  if (item?.result?.status >= 200 && item.result.status < 300 && item.result?.response?.data?.id) return true;
  if (item?.skipped && /^already-created/.test(item.reason || "") && item.ledger?.metricoolId) return true;
  return false;
}

function markOldLedgerEntryDeleted(id, row) {
  const ledgerPath = path.join(WORK, "metricool-live-ledger.json");
  const ledger = readJson(ledgerPath, { entries: {} });
  let changed = false;
  for (const entry of Object.values(ledger.entries || {})) {
    if (String(entry.metricoolId || "") !== id) continue;
    entry.deletedAt = new Date().toISOString();
    entry.deletedBy = "apply-approved-routing-batch";
    entry.replacedByProperty = row.property || row.metricoolBrand || "";
    entry.metricoolId = null;
    entry.descendantIds = [];
    changed = true;
  }
  if (changed) {
    ledger.updatedAt = new Date().toISOString();
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  }
}

function pruneRestoredScheduleRows(movedRows) {
  const schedulePath = path.join(ROOT, "schedule.json");
  const schedule = readJson(schedulePath, []);
  if (!Array.isArray(schedule) || !movedRows.length) return;
  const movedKeys = new Set(movedRows.map(scheduleKey));
  const next = schedule.filter((row) => !movedKeys.has(scheduleKey(row)));
  const removed = schedule.length - next.length;
  if (removed > 0) fs.writeFileSync(schedulePath, JSON.stringify(next, null, 2));
  evidence.steps.push({
    id: "prune-restored-schedule",
    status: "complete",
    removedRows: removed,
    remainingRows: next.length,
  });
}

function scheduleKey(row = {}) {
  return [
    row.date || "",
    row.time || "",
    row.platform || "",
    row.video || row.sourceVideo || "",
    row.asset || "",
  ].join("|");
}

function runStep(id, command, stepArgs, options = {}) {
  const result = spawnSync(command, stepArgs, {
    cwd: ROOT,
    encoding: "utf8",
    env: options.env || process.env,
    maxBuffer: 1024 * 1024 * 20,
  });
  const record = {
    id,
    command: [command, ...stepArgs].join(" "),
    status: result.status === 0 ? "complete" : "failed",
    exitStatus: result.status,
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
  };
  evidence.steps.push(record);
  if (result.status !== 0) throw new Error(`${id} failed: ${record.stderr || record.stdout}`);
}

function runOptionalStep(id, command, stepArgs) {
  const result = spawnSync(command, stepArgs, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
  });
  evidence.steps.push({
    id,
    command: [command, ...stepArgs].join(" "),
    status: result.status === 0 ? "complete" : "failed",
    exitStatus: result.status,
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
  });
}

function backupFiles(files, dir) {
  return files.map((file) => {
    const record = { file, backup: path.join(dir, path.basename(file)), existed: fs.existsSync(file) };
    if (record.existed) fs.copyFileSync(file, record.backup);
    return record;
  });
}

function restoreFiles(backups) {
  for (const item of backups) {
    if (item.existed) fs.copyFileSync(item.backup, item.file);
    else if (fs.existsSync(item.file)) fs.rmSync(item.file);
  }
}

function slimRow(row = {}) {
  return {
    batchKind: row.batchKind || "",
    property: row.property || row.metricoolBrand || "",
    date: row.date || "",
    time: row.time || "",
    platform: row.platform || "",
    platformLabel: row.platformLabel || "",
    video: row.video || row.sourceVideo || "",
    asset: row.asset || "",
    oldMetricoolId: row.oldMetricoolId || "",
  };
}

function trim(value) {
  const text = String(value || "").trim();
  return text.length > 4000 ? `${text.slice(0, 4000)}...` : text;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeEvidence(data) {
  fs.mkdirSync(WORK, { recursive: true });
  fs.writeFileSync(APPLY_OUT, JSON.stringify(data, null, 2));
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
