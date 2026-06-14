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

function shouldCopy(name) {
  return !EXCLUDED_NAMES.has(name);
}

function copySite(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const name of fs.readdirSync(ROOT)) {
    if (!shouldCopy(name)) continue;
    fs.cpSync(path.join(ROOT, name), path.join(targetDir, name), {
      recursive: true,
      errorOnExist: false,
      force: true,
    });
  }
}

function main() {
  fs.mkdirSync(BACKUP_ROOT, { recursive: true });
  const backupDir = path.join(BACKUP_ROOT, `site-${timestamp()}`);
  copySite(backupDir);
  console.log(`备份完成：${backupDir}`);
}

main();
