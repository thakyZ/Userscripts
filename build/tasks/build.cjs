/**
 * Special build task to handle various jQuery build requirements.
 * Compiles JS modules into one bundle, sets the custom AMD name,
 * and includes/excludes specified modules
 */

"use strict";

function build(grunt) {
  const fs = require("node:fs");
  const path = require("node:path");
  const process = require("node:process");
  // Disabled: const rollup = require("rollup");
  const rollupFileOverrides = require("./lib/rollup-plugin-file-overrides");
  const srcFolder = path.resolve(`${__dirname}/../../library/src`);
  const read = function (fileName) {
    return grunt.file.read(`${srcFolder}/${fileName}`);
  };

  // Catch `// @CODE` and subsequent comment lines event if they don't start
  // in the first column.
  const wrapper = read("wrapper.js").split(/[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/);

  const inputFileName = "nekogaming.userscript.lib.js";
  const inputRollupOptions = {
    input: `${srcFolder}/${inputFileName}`
  };
  const outputRollupOptions = {

    // The ESM format is not actually used as we strip it during
    // the build; it's just that it doesn't generate any extra
    // wrappers so there's nothing for us to remove.
    format: "esm",

    intro: wrapper[0].replace(/\n*$/, ""),
    outro: wrapper[1].replace(/^\n*/, "")
  };
  const fileOverrides = new Map();

  function getOverride(filePath) {
    return fileOverrides.get(path.resolve(filePath));
  }

  function setOverride(filePath, source) {
    // We want normalized paths in overrides as they will be matched
    // against normalized paths in the file overrides Rollup plugin.
    fileOverrides.set(path.resolve(filePath), source);
  }

  grunt.registerMultiTask(
    "build",
    "Build jQuery ECMAScript modules, " +
    "(include/exclude modules with +/- flags), embed date/version",
    async () => {
      const done = this.async();

      try {
        const { flags } = this;
        const optIn = flags["*"];
        let name = grunt.option("filename");
        const { minimum, removeWith } = this.data;
        const excluded = [];
        const included = [];
        let version = grunt.config("pkg.version");

        // We'll skip printing the whole big exclusions for a bare `build:*:*:slim` which
        // usually comes from `custom:slim`.
        // const isPureSlim = Boolean(flags.slim && flags["*"] && Object.keys(flags).length === 2);

        const slimBuildFlags = [];

        delete flags["*"];

        if (flags.slim) {
          delete flags.slim;

          for (const flag of slimBuildFlags) {
            flags[flag] = true;
          }
        }

        /**
         * Recursively calls the excluder to remove on all modules in the list
         * @param {Array} list
         * @param {String} [prepend] Prepend this to the module name.
         *  Indicates we're walking a directory
         */
        const excludeList = (list, prepend, excluder) => {
          if (list) {
            prepend = prepend ? `${prepend}/` : "";
            list.forEach((module) => {

              // Exclude var modules as well
              if (module === "var") {
                excludeList(
                  fs.readdirSync(`${srcFolder}/${prepend}${module}`),
                  prepend + module
                );

                return;
              }

              if (prepend) {
                // Skip if this is not a js file and we're walking files in a dir
                if (!(module = /([\w/-]+)\.js$/.exec(module))) {
                  return;
                }

                // Prepend folder name if passed
                // Remove .js extension
                module = prepend + module[1];
              }

              // Avoid infinite recursion
              if (excluded.indexOf(module) === -1) {
                excluder(`-${module}`);
              }
            });
          }
        };

        /**
         * Adds the specified module to the excluded or included list, depending on the flag
         * @param {String} flag A module path relative to
         *  the src directory starting with + or - to indicate
         *  whether it should be included or excluded
         */
        const excluder = flag => {
          let additional;
          const m = /^(\+|-)([\w/-]+)$/.exec(flag);
          const exclude = m[1] === "-";
          const module = m[2];

          if (exclude) {

            // Can't exclude certain modules
            if (minimum.indexOf(module) === -1) {

              // Add to excluded
              if (excluded.indexOf(module) === -1) {
                grunt.log.writeln(flag);
                excluded.push(module);

                // Exclude all files in the folder of the same name
                // These are the removable dependencies
                // It's fine if the directory is not there
                try {

                  // `selector` is a special case as we don't just remove
                  // the module, but we replace it with `selector-native`
                  // which re-uses parts of the `src/selector` folder.
                  if (module !== "selector") {
                    excludeList(
                      fs.readdirSync(`${srcFolder}/${module}`),
                      module
                    );
                  }
                } catch (e) {
                  grunt.verbose.writeln(e);
                }
              }

              additional = removeWith[module];

              // Check removeWith list
              if (additional) {
                excludeList(additional.remove || additional, excluder);

                if (additional.include) {
                  included.push(...additional.include);
                  grunt.log.writeln(`+${additional.include}`);
                }
              }
            } else {
              grunt.log.error(`Module "${module}" is a minimum requirement.`);
            }
          } else {
            grunt.log.writeln(flag);
            included.push(module);
          }
        };

        // Filename can be passed to the command line using
        // command line options
        // e.g. grunt build --filename=jquery-custom.js
        name = name ? `library/${name}` : this.data.dest;

        // Append commit id to version
        if (process.env.COMMIT) {
          version += ` ${process.env.COMMIT}`;
        }

        // Figure out which files to exclude based on these rules in this order:
        //  dependency explicit exclude
        //  > explicit exclude
        //  > explicit include
        //  > dependency implicit exclude
        //  > implicit exclude
        // examples:
        //  *                  none (implicit exclude)
        //  *:*                all (implicit include)
        //  *:*:-css           all except css and dependents (explicit > implicit)
        //  *:*:-css:+effects  same (excludes effects because explicit include is
        //                     trumped by explicit exclude of dependency)
        //  *:+effects         none except effects and its dependencies
        //                     (explicit include trumps implicit exclude of dependency)
        for (const flag of flags) {
          excluder(flag);
        }

        // Remove the jQuery export from the entry file, we'll use our own
        // custom wrapper.
        setOverride(inputRollupOptions.input,
          read(inputFileName).replace(/\n*export default jQuery;\n*/, "\n"));

        // Replace exports/global with a noop noConflict
        if (excluded.includes("exports/global")) {
          const index = excluded.indexOf("exports/global");

          setOverride(`${srcFolder}/exports/global.js`,
            "import jQuery from \"../core.js\";\n\n" +
            "jQuery.noConflict = function() {};");
          excluded.splice(index, 1);
        }

        grunt.verbose.writeflags(excluded, "Excluded");
        grunt.verbose.writeflags(included, "Included");

        if (excluded.length) {
          version += ` -${excluded.join(",-")}`;

          // Set pkg.version to version with excludes or with the "slim" marker,
          // so minified file picks it up but skip the commit hash the same way
          // it's done for the full build.
          const commitlessVersion = version.replace(` ${process.env.COMMIT}`, "");

          grunt.config.set("pkg.version", commitlessVersion);
          grunt.verbose.writeln(`Version changed to ${commitlessVersion}`);

          // Replace excluded modules with empty sources.
          for (const module of excluded) {
            setOverride(
              `${srcFolder}/${module}.js`,

              // The `selector` module is not removed, but replaced
              // with `selector-native`.
              module === "selector" ? read("selector-native.js") : ""
            );
          }
        }

        // Turn off opt-in if necessary
        if (!optIn) {

          // Remove the default inclusions, they will be overwritten with the explicitly
          // included ones.
          setOverride(inputRollupOptions.input, "");

        }

        // Import the explicitly included modules.
        if (included.length) {
          setOverride(inputRollupOptions.input,
            getOverride(inputRollupOptions.input) + included
              .map(module => `import "./${module}.js";`)
              .join("\n"));
        }

        const bundle = [{plugins: [rollupFileOverrides(fileOverrides)]}];
        // Disable:
        // const bundle = await rollup.rollup({
        //   ...inputRollupOptions,
        //   plugins: [rollupFileOverrides(fileOverrides)]
        // });

        const { output: [{ code }] } = await bundle.generate(outputRollupOptions);

        const compiledContents = code
          // Embed Version
          .replace(/<%= pkg.version %>/g, version)
          // Embed Date
          // yyyy-mm-ddThh:mmZ
          .replace(/@DATE/g, (new Date()).toISOString().replace(/:\d+\.\d+Z$/, "Z"));

        grunt.file.write(name, compiledContents);
        grunt.log.ok(`File '${name}' created.`);
        done();
      } catch (err) {
        done(err);
      }
    });

  // Special "alias" task to make custom build creation less grunt-y
  // Translation example
  //
  //   grunt custom:+ajax,-dimensions,-effects,-offset
  //
  // Becomes:
  //
  //   grunt build:*:*:+ajax:-dimensions:-effects:-offset
  //
  // There's also a special "slim" alias that resolves to the jQuery Slim build
  // configuration:
  //
  //   grunt custom:slim
  grunt.registerTask("custom", () => {
    const { args } = this;
    const modules = args.length ? args[0].split(",").join(":") : "";

    grunt.log.writeln("Creating custom build...\n");
    grunt.task.run([`build:*:*${(modules ? `:${modules}` : "")}`, "uglify", "dist"]);
  });
}

module.exports = build;
