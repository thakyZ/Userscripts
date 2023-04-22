"use strict";

const fs = require("fs");

module.exports = function (grunt) {
  const parseErrorObj = obj => obj.error === null || typeof obj.error === "undefined" ? `${obj.message}` : `${obj.message}\n${obj.error.stack}`;

  const filePath = `${__dirname}/../library/nekogaming.userscript.lib.js`;

  function readSourceFile() {
    try {
      return fs.readFileSync(filePath, { encoding: "utf-8", flag: "r+" });
    } catch (error) {
      grunt.log.error(parseErrorObj({ message: "Failed to read file at: " + filePath, error }));
    }
  }

  function getHeader(_string) {
    try {
      const matches = _string.match(/\s+\/\* global/i);
      if (matches !== null && matches.length >= 1) {
        const split = _string.split(matches[0]);
        if (split.length >= 1) {
          return split[0];
        }

        grunt.log.error(parseErrorObj({ message: "Failed to split header:\n" + JSON.stringify(split, null, 2), error: null }));
      }

      grunt.log.error(parseErrorObj({ message: "Failed to match header separator:\n" + JSON.stringify(matches, null, 2), error: null }));
    } catch (error) {
      grunt.log.error(parseErrorObj({ message: "Failed to get header", error }));
    }
  }

  return getHeader(readSourceFile());
};
