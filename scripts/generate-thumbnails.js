const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const IMAGE_ROOT = path.join(ROOT, "images");
const THUMB_ROOT = path.join(IMAGE_ROOT, "thumbs");
const MAX_SIZE = 520;
const IMAGE_RE = /(["'`])(images\/(?!thumbs\/)[^"'`)]+\.(?:jpe?g|png|webp))\1/gi;

function readJsonImages() {
  const jsonPath = path.join(ROOT, "data.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const images = [];

  for (const event of data.events || []) {
    if (event.image) images.push(event.image);
  }

  for (const item of data.merchandise || []) {
    if (item.image) images.push(item.image);
  }

  for (const group of data.groups || []) {
    if (group.image) images.push(group.image);
  }

  return images;
}

function readInlineImages() {
  const appPath = path.join(ROOT, "app.js");
  const appJs = fs.readFileSync(appPath, "utf8");
  return [...appJs.matchAll(IMAGE_RE)].map((match) => match[2]);
}

function normalizeImagePath(value) {
  if (!value || /^https?:\/\//i.test(value) || value.includes("..")) return null;
  const cleaned = value.replace(/^\.\//, "").split(/[?#]/)[0];
  if (!cleaned.startsWith("images/") || cleaned.startsWith("images/thumbs/")) return null;
  if (!/\.(jpe?g|png|webp)$/i.test(cleaned)) return null;
  return cleaned;
}

function shouldGenerate(srcPath, outPath) {
  if (!fs.existsSync(outPath)) return true;
  return fs.statSync(srcPath).mtimeMs > fs.statSync(outPath).mtimeMs;
}

function generateOne(relativePath) {
  const srcPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(srcPath)) {
    return { status: "missing", relativePath };
  }

  const outPath = path.join(THUMB_ROOT, relativePath.slice("images/".length));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  if (!shouldGenerate(srcPath, outPath)) {
    return { status: "skipped", relativePath };
  }

  const result = spawnSync("sips", ["-Z", String(MAX_SIZE), srcPath, "--out", outPath], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return {
      status: "failed",
      relativePath,
      error: result.stderr || result.stdout || "sips failed",
    };
  }

  return { status: "generated", relativePath };
}

function main() {
  const images = [...readJsonImages(), ...readInlineImages()]
    .map(normalizeImagePath)
    .filter(Boolean);
  const uniqueImages = [...new Set(images)].sort();
  const counts = { generated: 0, skipped: 0, missing: 0, failed: 0 };
  const failures = [];

  for (const image of uniqueImages) {
    const result = generateOne(image);
    counts[result.status] += 1;

    if (result.status === "failed" || result.status === "missing") {
      failures.push(result);
    }
  }

  console.log(
    `缩略图：${counts.generated} 个已生成，${counts.skipped} 个已存在，${counts.missing} 个缺失，${counts.failed} 个失败。`
  );

  if (failures.length > 0) {
    for (const failure of failures) {
      console.warn(`${failure.status}: ${failure.relativePath}${failure.error ? ` - ${failure.error}` : ""}`);
    }
    process.exitCode = 1;
  }
}

main();
