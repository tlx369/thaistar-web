#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BACKUP_ROOT = path.join(ROOT, ".site-backups");
const EXCLUDED_NAMES = new Set([".git", ".site-backups", ".DS_Store"]);

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

function getBackupDirs() {
  if (!fs.existsSync(BACKUP_ROOT)) return [];
  return fs
    .readdirSync(BACKUP_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("site-"))
    .map((entry) => path.join(BACKUP_ROOT, entry.name))
    .sort();
}

function copyCurrentSite(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const name of fs.readdirSync(ROOT)) {
    if (EXCLUDED_NAMES.has(name)) continue;
    fs.cpSync(path.join(ROOT, name), path.join(targetDir, name), {
      recursive: true,
      errorOnExist: false,
      force: true,
    });
  }
}

function clearCurrentSite() {
  for (const name of fs.readdirSync(ROOT)) {
    if (EXCLUDED_NAMES.has(name)) continue;
    fs.rmSync(path.join(ROOT, name), { recursive: true, force: true });
  }
}

function restoreBackup(sourceDir) {
  for (const name of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, name), path.join(ROOT, name), {
      recursive: true,
      errorOnExist: false,
      force: true,
    });
  }
}

function main() {
  const backupDirs = getBackupDirs();
  if (backupDirs.length === 0) {
    console.error("没有找到可回滚的备份。请先运行：npm run backup");
    process.exit(1);
  }

  const requested = process.argv[2];
  const sourceDir = requested
    ? path.resolve(ROOT, requested)
    : backupDirs[backupDirs.length - 1];

  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error(`备份目录不存在：${sourceDir}`);
    process.exit(1);
  }

  const safetyBackup = path.join(BACKUP_ROOT, `pre-rollback-${timestamp()}`);
  copyCurrentSite(safetyBackup);
  clearCurrentSite();
  restoreBackup(sourceDir);

  console.log(`已从备份恢复：${sourceDir}`);
  console.log(`回滚前现场已自动保存：${safetyBackup}`);
}

main();
