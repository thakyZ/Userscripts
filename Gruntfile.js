"use strict";

module.exports = function (grunt) {
  function blacklistNonLibraryConcat(folder, subDirectory) {
    const compiled = [];
    const blacklistLibraryFiles = ["temp"];

    if (typeof subDirectory !== "undefined") {
      for (const [, subFolder] of Object.entries(subDirectory)) {
        const subFolderStat = fs.statSync(`${__dirname}/${folder}/${subFolder}`);
        if (subFolderStat.isDirectory()) {
          compiled.push(`${__dirname}/${folder}/${subFolder}/**/*.*`);
        } else if (subFolderStat.isFile() && blacklistLibraryFiles.includes(subFolder)) {
          compiled.push(`${__dirname}/${folder}/${subFolder}`);
        }
      }
    }

    return compiled;
  }

  function blacklistNonLibrary() {
    const compiled = [];
    const directory = fs.readdirSync(__dirname);

    if (typeof directory !== "undefined") {
      for (const [, folder] of Object.entries(directory)) {
        const folderStat = fs.statSync(`${__dirname}/${folder}`);
        if (folderStat.isDirectory()) {
          if (folder === "library") {
            const subDirectory = fs.readdirSync(`${__dirname}/${folder}`);
            compiled.concat(blacklistNonLibraryConcat(folder, subDirectory));
          } else {
            compiled.push(`${__dirname}/${folder}/**/*.*`);
          }
        } else {
          compiled.push(`${__dirname}/${folder}`);
        }
      }
    }

    return compiled;
  }

  const fs = require("fs");
  const nodeV14OrNewer = !/^v1[0-3]\./.test(process.version);
  /* Disable this thingy.
   * const customBrowsers = process.env.BROWSERS && process.env.BROWSERS.split(",");
   */

  // See comments on lines containing: "Disable this as grunt-eslint doesn't accept flat config..."
  // // Support: Node.js <14
  // // Skip running tasks that dropped support for Node.js 10 or 12
  // // in this Node version.
  // function runIfNewNode(task) {
  //  return nodeV14OrNewer ? task : "print_old_node_message:" + task;
  // }

  if (nodeV14OrNewer) {
    const playwright = require("playwright-webkit");
    process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();
  }

  if (!grunt.option("filename")) {
    grunt.option("filename", "nekogaming.userscript.lib.js");
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dst: { "/library": true, },
    babel: {
      options: {
        sourceMap: "inline",
        retainLines: true,
        plugins: ["@babel/transform-for-of"],
        presets: ["@babel/preset-env"]
      },
      dist: {
        files: {
          "library/nekogaming.userscript.lib.js": "library/src/nekogaming.userscript.lib.js",
        },
      },
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: "library/src/", src: ["*.js"], dest: "library/", filter: "isFile", flatten: true, },
          { expand: true, cwd: "library/src/", src: ["*.json"], dest: "library/temp/", filter: "isFile", flatten: true, },
        ],
      },
    },
    jsonlint: {
      pkg: {
        src: ["package.json",],
      },
    },
    eslint: {
      options: {
        overrideConfigFile: "eslint.config.mjs",
        maxWarnings: 0,
      },

      // We have to explicitly declare "src" property otherwise "newer"
      // task wouldn't work properly :/
      dist: {
        src: ["library/nekogaming.userscript.lib.js", "dist/nekogaming.userscript.lib.min.js",],
      },
      dev: {
        src: [
          "library/src/**/*.js",
          "Gruntfile.js",
          "build/**/*.js",

          /* // Ignore files from .eslintignore
           * // See https://github.com/sindresorhus/grunt-eslint/issues/119
           * ...fs
           *  .readFileSync(`${__dirname}/.eslintignore`, "utf-8")
           *  .split("\n")
           *  .filter(filePath => filePath)
           *  .map(filePath => filePath[0] === "!" ? filePath.slice(1) : `!${filePath}`),
           */

          // Ignore files dynamically.
          ...blacklistNonLibrary(),
        ],
      },
    },
    // eslint-disable-next-line camelcase
    json_wrapper: {
      options: {},
      files: {
        "library/data.js": ["library/temp/invalidFileNameChars.json",],
      },
    },
    uglify: {
      all: {
        files: {
          "library/<%= grunt.option('filename').replace('.js', '.min.js') %>": ["library/<%= grunt.option('filename') %>", "library/data.js",],
          "library/data.min.js": ["library/data.js",],
        },
        options: {
          preserveComments: false,
          sourceMap: true,
          report: "min",
          output: {
            // eslint-disable-next-line camelcase
            ascii_only: true,
          },
          banner: (require("./build/header"))(grunt),
          compress: {
            // eslint-disable-next-line camelcase
            hoist_funs: false,
            loops: false,
          },
          mangle: {
            reserved: ["jQuery", "$", "GM", "GM_getResourceText",],
          },
        },
      },
    },
  });

  // Load grunt tasks from NPM packages
  require("load-grunt-tasks")(grunt, {
    pattern: nodeV14OrNewer ? ["grunt-*"] : ["grunt-*", "!grunt-eslint"],
  });

  // Integrate project specific tasks
  grunt.loadTasks("build/tasks");
  grunt.loadNpmTasks("grunt-json-wrapper");

  grunt.registerTask("print_old_node_message", (...args) => {
    const task = args.join(":");
    grunt.log.writeln(`Old Node.js detected, running the task "${task}" skipped...`);
  });

  grunt.registerTask("print_jsdom_message", () => {
    grunt.log.writeln("Node.js 17 or newer detected, skipping jsdom tests...");
  });

  grunt.registerTask("lint", [
    "jsonlint",

    // Disable this as grunt-eslint doesn't accept flat config see: https://github.com/sindresorhus/grunt-eslint/issues/173
    // // Running the full eslint task without breaking it down to targets
    // // would run the dist target first which would point to errors in the built
    // // file, making it harder to fix them. We want to check the built file only
    // // if we already know the source files pass the linter.
    // runIfNewNode("eslint:dev"),
    // runIfNewNode("eslint:dist"),
  ]);

  grunt.registerTask("lint:newer", [
    "newer:jsonlint",

    // Disable this as grunt-eslint doesn't accept flat config see: https://github.com/sindresorhus/grunt-eslint/issues/173
    // // Don't replace it with just the task; see the above comment.
    // runIfNewNode("newer:eslint:dev"),
    // runIfNewNode("newer:eslint:dist"),
  ]);

  grunt.registerTask("test:prepare", [
    "copy",
  ]);

  grunt.registerTask("test", [
    "test:prepare",
  ]);

  grunt.registerTask("dev", [
    // Disable this as grunt-eslint doesn't accept flat config see: https://github.com/sindresorhus/grunt-eslint/issues/173
    // runIfNewNode("newer:eslint:dev"),
    "test:prepare",
    "dist:*",
    "json_wrapper",
    "newer:uglify",
    "remove_map_comment",
  ]);

  grunt.registerTask("pre:dev", () => {
    const files = grunt.config("json_wrapper.files");
    for (const [key] of Object.entries(files)) {
      if (key !== "library/src/data.js") {
        Object.defineProperty(files, "library/src/data.js", Object.getOwnPropertyDescriptor(files, key));
        delete files[key];
      }
    }

    grunt.task.run("dev");
  });

  grunt.registerTask("default", [
    // Disable this as grunt-eslint doesn't accept flat config see: https://github.com/sindresorhus/grunt-eslint/issues/173
    // runIfNewNode("eslint:dev"),
    "test:prepare",
    "dist:*",
    "json_wrapper",
    "uglify",
    "remove_map_comment",
    "clean",
    // Disable this as grunt-eslint doesn't accept flat config see: https://github.com/sindresorhus/grunt-eslint/issues/173
    // runIfNewNode("eslint:dist"),
  ]);
};
