const fs = require("node:fs");
const path = require("node:path");

/**
 *
 * @typedef {FileKeyOptions}
 * @property {number} rangeStart
 */

/**
 *
 * @typedef {FileKey}
 * @property {string[]} files
 * @property {FileKeyOptions} options
 */

/** @type {string[]} */
const blacklistedDir = [".git", ".vscode", "node_modules"];

/**
 * Get list of files.
 * @param {string[]} directory
 */
function walk(directory) {
  /** @type {string[]} */
  let results = [];
  /** @type {string[]} */
  const directoryItems = fs.readdirSync(directory);

  for (const file of directoryItems) {
    if (!blacklistedDir.includes(file)) {
      /** @type {string} */
      const filePath = path.resolve(directory, file);
      /** @type {fs.Stats} */
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

/**
 * Get list of files.
 */
function getFiles() {
  const results = [];
  const files = walk(__dirname);

  for (const file of files) {
    /** @type {string} */
    const extension = path.extname(file);
    /** @type {string} */
    const fileData = fs.readFileSync(file, { encoding: "utf-8", flag: "r+" });

    if (extension === ".js") {
      const userScriptJQueryDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==\n\/\* global .*? \*\/\nthis\.\$ = this\.jQuery = jQuery\.noConflict\(true\);/;
      const userScriptDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==/;

      if (userScriptJQueryDetect.test(fileData)) {
        /** @type {RegExpMatchArray | null} */
        const matched = fileData.match(userScriptJQueryDetect);

        if (matched === null) {
          continue;
        }

        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      } else if (userScriptDetect.test(fileData)) {
        /** @type {RegExpMatchArray | null} */
        const matched = fileData.match(userScriptDetect);

        if (matched === null) {
          continue;
        }

        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      }
    } else if (extension === ".css") {
      const userStyleDetect = /\/\* ==UserStyle==\n(?:@\w+ .+\n)+==\/UserStyle== \*\//;

      if (userStyleDetect.test(fileData)) {
        /** @type {RegExpMatchArray | null} */
        const matched = fileData.match(userStyleDetect);

        if (matched === null) {
          continue;
        }

        results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
      }
    }
  }

  return results;
}

/**
 * Parse files per keys.
 * @returns {FileKey[]}
 */
function parseFileKeys() {
  const files = getFiles();
  const items = [];

  for (const [key, value] of Object.entries(files)) {
    if (!Object.hasOwn(items, value)) {
      items.push({
        files: [],
        options: {
          rangeStart: value,
        },
      });
    }

    items[value].files.push(key);
  }

  return items;
}

/** @type {object[]} */
const FILE_LENGTHS = parseFileKeys();

module.exports = { FILE_LENGTHS };
