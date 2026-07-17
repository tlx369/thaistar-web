const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data.json");
const outputPath = path.join(root, "site-data.js");

const source = fs.readFileSync(sourcePath, "utf8");
const data = JSON.parse(source);
const output = `/* Generated from data.json. Run: npm run site-data */\nwindow.TLX369_DATA = ${JSON.stringify(data)};\n`;

fs.writeFileSync(outputPath, output);
console.log(`Generated ${path.relative(root, outputPath)}`);
