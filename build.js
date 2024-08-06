import * as esbuild from "esbuild";
import * as glob from "glob";
import * as path from "node:path";
import { userscript } from "esbuild-plugin-userscript";

/**
 * Transforms the input directory to output a js named userscript file.
 * @param {string} input
 * @returns {string}
 */
function getOutputFileName(input) {
  /** @type {string | undefined} */
  const userscriptFile = getFiles(input).filter((x) => {
    /** @type {string} */
    const basename = path.basename(x);

    return basename.endsWith(".user.ts") && basename !== "metadata.user.ts";
  });

  return userscriptFile.replace(/\.ts$/, ".js");
}

/**
 * Gets the files of a directory via glob.
 * @param {string} input
 * @returns {string[]}
 */
function getFiles(input) {
  return [...glob.streamSync(`${input}/*`)].filter((x) => path.basename(x) !== "metadata.user.ts");
}

/**
 * Gets the meta data file path
 * @param {string} input
 * @returns {string}
 */
function getMetaData(input) {
  /** @type {string[]} */
  const files = [...glob.streamSync(`${input}/*`)].filter((x) => path.basename(x) === "metadata.user.ts");

  if (files.length !== 1) {
    throw new Error("Metadata file not found in directory.");
  }

  return files[0];
}

/**
 * @returns {Promise<void>}
 */
async function build() {
  const GLOB_PATTERN = "./src/*/";

  for await (const directory of glob.iterate(GLOB_PATTERN)) {
    console.log(`directory: ${directory} | ${typeof directory}`);

    await esbuild.build({
      entryPoints: [...getFiles(directory)],
      bundle: true,
      outfile: getOutputFileName(directory),
      plugins: [
        userscript({
          metadata: getMetaData(directory),
        })
      ]
    });
  }
}

build();
