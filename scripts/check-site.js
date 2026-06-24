#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data.json");
const HTML_FILES = ["index.html", "fans-guide.html"];

const REQUIRED_FILES = ["index.html", "styles.css", "app.js", "data.json", "robots.txt"];
const EVENT_REQUIRED_FIELDS = ["date", "star", "event", "type", "image"];
const MERCH_REQUIRED_FIELDS = ["name", "star", "category", "price", "status", "image"];
const GROUP_REQUIRED_FIELDS = ["name", "image"];

const errors = [];
const warnings = [];
let checkedImages = 0;

function rel(file) {
  return path.relative(ROOT, file) || ".";
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function isSafeRemoteImage(value) {
  return /^https?:\/\//i.test(value) || /drive\.google\.com\/file\/d\/[^/]+/i.test(value);
}

function getLocalAssetPath(value, label) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (isSafeRemoteImage(raw)) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    addError(`${label}: 不允许的资源协议：${raw}`);
    return null;
  }
  if (raw.includes("..")) {
    addError(`${label}: 资源路径不能包含 ..：${raw}`);
    return null;
  }
  const cleaned = raw.replace(/^\.\//, "").split(/[?#]/)[0];
  return path.join(ROOT, cleaned);
}

function checkLocalAsset(value, label) {
  const localPath = getLocalAssetPath(value, label);
  if (!localPath) return;
  checkedImages += 1;
  if (!fs.existsSync(localPath)) {
    addError(`${label}: 找不到文件 ${value}`);
  }
}

function checkRequiredStringFields(item, fields, label) {
  fields.forEach((field) => {
    if (isBlank(item[field])) {
      addError(`${label}: 缺少必填字段 ${field}`);
    }
  });
}

function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

function checkDataJson() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    addError(`data.json 不是合法 JSON：${err.message}`);
    return { events: 0, merchandise: 0, groups: 0 };
  }

  if (!Array.isArray(data.events)) addError("data.json: events 必须是数组");
  if (!Array.isArray(data.merchandise)) addError("data.json: merchandise 必须是数组");
  if (!Array.isArray(data.groups)) addError("data.json: groups 必须是数组");

  const events = Array.isArray(data.events) ? data.events : [];
  const merchandise = Array.isArray(data.merchandise) ? data.merchandise : [];
  const groups = Array.isArray(data.groups) ? data.groups : [];

  events.forEach((event, index) => {
    const label = `events[${index}]`;
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      addError(`${label}: 必须是对象`);
      return;
    }
    checkRequiredStringFields(event, EVENT_REQUIRED_FIELDS, label);
    if (!isBlank(event.date) && !isValidDateKey(String(event.date).trim())) {
      addError(`${label}: 日期格式必须是 YYYY-MM-DD，当前是 ${event.date}`);
    }
    if (!isBlank(event.type) && !["线上", "线下"].includes(String(event.type).trim())) {
      addWarning(`${label}: type 建议使用 “线上” 或 “线下”，当前是 ${event.type}`);
    }
    checkLocalAsset(event.image, `${label}.image`);
    if (event.images !== undefined) {
      if (!Array.isArray(event.images)) {
        addError(`${label}.images: 必须是图片路径数组`);
      } else {
        event.images.forEach((image, imageIndex) => {
          checkLocalAsset(image, `${label}.images[${imageIndex}]`);
        });
      }
    }
  });

  merchandise.forEach((item, index) => {
    const label = `merchandise[${index}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      addError(`${label}: 必须是对象`);
      return;
    }
    checkRequiredStringFields(item, MERCH_REQUIRED_FIELDS, label);
    checkLocalAsset(item.image, `${label}.image`);
  });

  groups.forEach((group, index) => {
    const label = `groups[${index}]`;
    if (!group || typeof group !== "object" || Array.isArray(group)) {
      addError(`${label}: 必须是对象`);
      return;
    }
    checkRequiredStringFields(group, GROUP_REQUIRED_FIELDS, label);
    checkLocalAsset(group.image, `${label}.image`);
  });

  return {
    events: events.length,
    merchandise: merchandise.length,
    groups: groups.length,
  };
}

function checkHtmlAssets(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) {
    addError(`${fileName}: 文件不存在`);
    return;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const attrPattern = /\b(src|href)=["']([^"']+)["']/gi;
  let match;

  while ((match = attrPattern.exec(html))) {
    const value = match[2].trim();
    checkHtmlAssetValue(fileName, value);
  }

  const imageMetaPattern =
    /<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi;
  while ((match = imageMetaPattern.exec(html))) {
    checkHtmlAssetValue(fileName, match[1].trim());
  }
}

function checkHtmlAssetValue(fileName, value) {
    if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return;
    }
  if (/^https?:\/\//i.test(value)) return;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return;
    if (value.includes("..")) {
      addError(`${fileName}: 资源路径不能包含 ..：${value}`);
    return;
    }

  const cleanValue = value.split(/[?#]/)[0];
  const assetPath = path.join(ROOT, cleanValue);
  if (!fs.existsSync(assetPath)) {
    addError(`${fileName}: 找不到引用资源 ${value}`);
  }
}

function main() {
  REQUIRED_FILES.forEach((file) => {
    if (!fs.existsSync(path.join(ROOT, file))) {
      addError(`缺少网站必要文件：${file}`);
    }
  });

  const counts = checkDataJson();
  HTML_FILES.forEach(checkHtmlAssets);

  warnings.forEach((message) => console.warn(`WARN  ${message}`));

  if (errors.length > 0) {
    errors.forEach((message) => console.error(`ERROR ${message}`));
    console.error("");
    console.error(`检查失败：${errors.length} 个错误，${warnings.length} 个提醒。`);
    process.exit(1);
  }

  console.log("检查通过。");
  console.log(`数据：${counts.events} 个行程，${counts.merchandise} 个周边，${counts.groups} 个群组。`);
  console.log(`本地图片/资源：已检查 ${checkedImages} 个 data.json 图片路径。`);
  if (warnings.length > 0) {
    console.log(`提醒：${warnings.length} 个非阻断提醒。`);
  }
}

main();
