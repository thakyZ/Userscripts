import path from "node:path";
import url, { URL } from "node:url";
import { createRequire } from "node:module";
/** @type {NodeRequire} */
const require = createRequire(import.meta.url);
import { context } from "esbuild";
import { Arguments } from "./build/esbuild-custom-lib.mjs";
// DISABLED: import esbuildRecurseClonePlugin from "./build/esbuild-recurse-clone-plugin.mjs";
import esbuildEslint from "esbuild-plugin-eslint";
import esbuildPostCss from "@deanc/esbuild-plugin-postcss";
import { sassPlugin } from "esbuild-sass-plugin";
import { lessLoader } from "esbuild-plugin-less";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";
// DISABLED: const autoprefixerLess = require("less-plugin-autoprefix");
// DISABLED: const postcssStyl = require("postcss-styl");
// DISABLED: const postcssLessEngine = require("postcss-less-engine");
// @ts-expect-error no types exported.
const stylusLoader = require("esbuild-stylus-loader");

(async function () {
  /** @type {String} */
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

  /**
   * @type {String[]}
   * The `[]` in JavaScript represents an empty array literal. In the provided code snippet, `[]` is used in various places to initialize an empty array:
   */
  const entryPoints = [];

  /** @type {String[]} */
  const javascriptArguments = [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "javascript",
    "ts",
    "tsx",
    "typescript",
  ];

  /** @type {Boolean} */
  const all = Arguments.hasArgument("all");

  if (Arguments.hasArgument("css", "less", "sass", "scss", "styl") || all) {
    entryPoints.push("**/*.css");
    entryPoints.push("**/*.less");
    entryPoints.push("**/*.sass");
    entryPoints.push("**/*.scss");
    entryPoints.push("**/*.styl");
  } else if (Arguments.hasArgument(...javascriptArguments) || all) {
    entryPoints.push("**/*.js");
    entryPoints.push("**/*.mjs");
    entryPoints.push("**/*.cjs");
    entryPoints.push("**/*.jsx");
    entryPoints.push("**/*.ts");
    entryPoints.push("**/*.tsx");
  }

  /** @returns {Promise<import("esbuild").BuildContext<import("esbuild").BuildOptions>>} */
  function createContext() {
    /** @type {import("esbuild").BuildOptions} */
    const contextOptions = {
      entryPoints,
      bundle: true,
      format: "cjs",
      platform: "browser",
      logLevel: "debug",
      plugins: [
        sassPlugin({
          /**
           * Runs when transforming sass into css.
           * @param {String} css The source file.
           * @returns {Promise<string>}
           */
          async transform(css) {
            /** @type {import("postcss").Processor} */
            const processor = postcss([
              autoprefixer,
              postcssPresetEnv({
                /** @type {import('postcss-preset-env').pluginsOptions | undefined} */
                features: {},
                /** @type {number | false | undefined} */
                stage: 0
              }),
            ]);
            /** @type {import("postcss").LazyResult<import("postcss").Root>} */
            const processed = processor.process(css, {
              /** @type {string | undefined} */
              from: undefined
            });
            /** @type {import("postcss").Result<import("postcss").Root>} */
            const result = await processed.async();
            return result.css;
          }
        }),
        esbuildPostCss({
          // TODO: fix typing on https://github.com/thakyz/esbuild-plugin-postcss.git
          // @ts-expect-error Broken typing
          plugins: [
            autoprefixer,
          ],
        }),
        lessLoader({

        }),
        esbuildEslint({
          allowInlineConfig: true,
          overrideConfigFile: path.join(__dirname, "eslint.config.mjs"),
        }),
        // DISABLED: esbuildRecurseClonePlugin({}),
        /** @type {import("esbuild").Plugin} */
        stylusLoader({
          stylusOptions: {
            /**
             * @see https://stylus-lang.com/docs/js.html#includepath
             * @type {String[]}
             */
            include: [
              "./some/path"
            ],
            /**
             * @see https://stylus-lang.com/docs/js.html#importpath
             * @type {String[]}
             */
            import: [
              path.resolve(__dirname, "path"),
              path.resolve(__dirname, "another-path"),
            ],
            /**
             * @see https://stylus-lang.com/docs/js.html#usefn
             * @type {((renderer: import("stylus/lib/renderer.js")) => any)[]}
             */
            use: [
              /** @param {import("stylus/lib/renderer.js")} stylus */
              (stylus) => {
                stylus.define("URL", "domain.com");
              },
            ],
            /**
             * @see https://stylus-lang.com/docs/js.html#definename-node
             * @type {[String, unknown, Boolean | undefined][]}
             */
            define: [
              ["BG_IMAGE", "https://domain.com/image.jpeg", undefined],
              /** The third argument allows to insert raw data */
              ["BG_IMAGE", "https://domain.com/image.jpeg", true],
            ],
            /** @type {Boolean} Stylus will include css file content via `@import "./file.css"` keyword. */
            includeCss: false,
          }
        })
      ],
    };

    return context(contextOptions);
  }

  /** @type {import("esbuild").BuildContext<import("esbuild").BuildOptions>} */
  const ctx = await createContext();
  await ctx.watch();
})().then(
  (value) => {
    console.debug(value);
  },
  (error) => {
    console.error(error);
  }
);
