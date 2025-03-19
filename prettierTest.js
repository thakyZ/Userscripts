const fs = require("fs");
const path = require("path");

(function (module) {
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

  /** @returns {{[key: String]: Number}} */
  function getFiles() {
    /** @type {{[key: String]: Number}} */
    const results = {};
    /** @type {String[]} */
    const files = walk(__dirname);

    for (const [, file] of Object.entries(files)) {
      /** @type {String} */
      const extension = path.extname(file);
      /** @type {String} */
      const fileData = fs.readFileSync(file, { encoding: "utf-8", flag: "r+" });
      if (extension === ".js") {
        /** @type {RegExp} */
        const userScriptJQueryDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==\n\/\* global .*? \*\/\nthis\.\$ = this\.jQuery = jQuery\.noConflict\(true\);/;
        /** @type {RegExp} */
        const userScriptDetect = /\/\/ ==UserScript==\n(?:\/\/ @.+\n)+\/\/ ==\/UserScript==/;
        if (userScriptJQueryDetect.test(fileData)) {
          /** @type {RegExpMatchArray | null} */
          const matched = fileData.match(userScriptJQueryDetect);
          results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
        } else if (userScriptDetect.test(fileData)) {
          /** @type {RegExpMatchArray | null} */
          const matched = fileData.match(userScriptDetect);
          results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
        }
      } else if (extension === ".css") {
        /** @type {RegExp} */
        const userStyleDetect = /\/\* ==UserStyle==\n(?:@\w+ +?.+\n)+==\/UserStyle== \*\//;
        if (userStyleDetect.test(fileData)) {
          /** @type {RegExpMatchArray | null} */
          const matched = fileData.match(userStyleDetect);
          results[`**/${path.basename(file)}`] = matched[0].split("\n").length;
        }
      }
    }

    return results;
  }

  /** @returns {{[key: Number]: {files: String[]; options: {rangeStart: Number;};};}} */
  function parseFileKeys() {
    /** @type {{[key: String]: Number}} */
    const files = getFiles();
    /** @type {{[key: Number]: {files: String[]; options: {rangeStart: Number;};};}} */
    const items = {};
    for (const [key, value] of Object.entries(files)) {
      if (Object.hasOwn(items, value) === false) {
        items[value] = {
          files: [],
          options: {
            rangeStart: value,
          },
        };
      }

      items[value].files.push(key);
    }

    return items;
  }

  /** @returns {{files: String[]; options: {rangeStart: Number;};}[]} */
  function getFileLength() {
    /** @type {{[key: Number]: {files: String[]; options: {rangeStart: Number;};};}} */
    const keys = parseFileKeys();
    /** @type {{files: String[]; options: {rangeStart: Number;};}[]} */
    const items = [];
    for (const [, value] of Object.entries(keys)) {
      items.push(value);
    }

    return items;
  }

  module.exports = {
    fileLengths: getFileLength(),
  };
})(module);
