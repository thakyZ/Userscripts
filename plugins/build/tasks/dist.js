"use strict";

module.exports = function (grunt) {
  const fs = require("fs");
  const fsUtils = require("nodejs-fs-utils");
  const stripJSONComments = require("strip-json-comments");
  const filename = grunt.option("filename");
  const distpaths = [
    "library/" + filename,
    "library/invalidFileNameChars.json",
    "library/" + filename.replace(".js", ".min.map"),
    "library/" + filename.replace(".js", ".min.js")
  ];
  const cleanPaths = [
    "library/temp"
  ];

  // Process files for distribution
  grunt.registerTask("dist", function () {
    // Check for stored destination paths
    // (set in dist/.destination.json)
    const stored = Object.keys(grunt.config("dst"));

    // Allow command line input as well
    const flags = Object.keys(this.flags);

    // Combine all output target paths
    const paths = [].concat(stored, flags).filter(path => path !== "*");

    // Ensure the dist files are pure ASCII
    let nonascii = false;

    distpaths.forEach(filename => {
      let i;
      let c;
      let text = fs.readFileSync(filename, "utf8");

      // Ensure files use only \n for line endings, not \r\n
      // eslint-disable-next-line no-control-regex
      if (/\x0d\x0a/.test(text)) {
        grunt.log.writeln(filename + ": Incorrect line endings (\\r\\n)");
        nonascii = true;
      }

      // Strip json comments
      if (filename.split(".").at(-1) === "json") {
        const newText = stripJSONComments(text, { trailingCommas: true, whitespace: false }).replace(/\n+/i, "\n");

        if (text !== newText) {
          grunt.log.writeln(filename + ": Json comments removed.");

          fs.writeFileSync(filename, newText, "utf8");
          text = newText;
        }
      }

      // Ensure only ASCII chars so script tags don't need a charset attribute
      if (text.length !== Buffer.byteLength(text, "utf8")) {
        grunt.log.writeln(filename + ": Non-ASCII characters detected:");
        for (i = 0; i < text.length; i++) {
          c = text.charCodeAt(i);
          if (c > 127) {
            grunt.log.writeln("- position " + i + ": " + c);
            grunt.log.writeln("-- " + text.substring(i - 20, i + 20));
            break;
          }
        }

        nonascii = true;
      }

      // Optionally copy dist files to other locations
      paths.forEach(path => {
        if (!/\/$/.test(path)) {
          path += "/";
        }

        const created = path + filename.replace("library/", "");
        grunt.file.write(created, text);
        grunt.log.writeln("File '" + created + "' created.");
      });
    });

    return !nonascii;
  });

  // Clean-up
  grunt.registerTask("clean", function () {
    const paths = () => {
      try {
        // Check for stored destination paths
        // (set in dist/.destination.json)
        const stored = Object.keys(grunt.config("dst"));

        // Allow command line input as well
        const flags = Object.keys(this.flags);

        // Combine all output target paths
        return [].concat(stored, flags).filter(path => path !== "*");
      } catch (error) {
        grunt.log.error(error.stack);
      }
    };

    cleanPaths.forEach(filename => {
      try {
        fsUtils.rmdirsSync(filename);

        paths().forEach(path => {
          try {
            if (path.startsWith("library/")) {
              return;
            }

            if (/\/$/.test(path)) {
              path.replace(/\/$/, "");
            }

            const created = path + filename.replace("library/", "");

            if (created.split(".").at(-1) === "json") {
              fsUtils.rmdirsSync(filename);
              grunt.log.writeln("File '" + filename + "' removed.");
            }
          } catch (error) {
            grunt.log.error(error.stack);
          }
        });
      } catch (error) {
        grunt.log.error(error.stack);
      }
    });
  });
};
