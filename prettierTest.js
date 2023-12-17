const fs = require("fs");
const path = require("path");

const blacklistedDir = [".git", ".vscode", "node_modules"];

function walk(directory) {
  let results = [];
  const directoryItems = fs.readdirSync(directory);
  for (const [, file] of Object.entries(directoryItems)) {
    if (blacklistedDir.includes(file) === false) {
      const filePath = path.resolve(directory, file);
      const stats = fs.statSync(filePath);

      if (stats && stats.isDirectory()) {
        results = results.concat(walk(filePath));
      } else {
        results.push(filePath);
      }
    }
  }

  return results;
}

function getFiles() {
  const results = {};
  const files = walk(__dirname);

  for (const [, file] of Object.entries(files)) {
    const extension = path.extname(file);
    const fileData = fs.readFileSync(file, { encoding: "utf-8", flag: "r+" });
    if (extension === ".js") {
      const userScriptJQueryDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==\n\/\* global .*? \*\/\nthis\.\$ = this\.jQuery = jQuery\.noConflict\(true\);/;
      const userScriptDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==/;
      if (userScriptJQueryDetect.test(fileData)) {
        const matched = fileData.match(userScriptJQueryDetect);
        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      } else if (userScriptDetect.test(fileData)) {
        const matched = fileData.match(userScriptDetect);
        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      }
    } else if (extension === ".css") {
      const userStyleDetect = /\/\* ==UserStyle==\n(?:@\w+ +?.+\n)+==\/UserStyle== \*\//;
      if (userStyleDetect.test(fileData)) {
        const matched = fileData.match(userStyleDetect);
        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      }
    }
  }

  return results;
}

function parseFileKeys() {
  const files = getFiles();
  const items = {};
  for (const [key, value] of Object.entries(files)) {
    if (Object.hasOwn(items, value) === false) {
      items[value] = {
        files: [],
        options: {
          rangeStart: value
        }
      };
    }

    items[value].files.push(key);
  }

  return items;
}

function getFileLength() {
  const keys = parseFileKeys();
  const items = [];
  for (const [, value] of Object.entries(keys)) {
    items.push(value);
  }

  return items;
}

module.exports = {
  fileLengths: getFileLength(),
};
