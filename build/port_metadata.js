import * as fs from "node:fs";
import * as path from "node:path";
import { Glob } from "glob";
import { fileURLToPath } from "node:url";

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {object} Metadata
 */

async function run() {
  console.log(`cwd set to ${path.join(__dirname, "..")}`);

  /** @type {string} */
  const GLOB_PATTERN = "./src/*/";
  /** @type {Glob} */
  const glob = new Glob(GLOB_PATTERN, { cwd: path.join(__dirname, ".."), sort: true });
  /** @type {RegExp} */
  const userscriptHeaderStart = /^\/\/ ==UserScript==$/m;
  /** @type {RegExp} */
  const userscriptHeaderEnd = /^\/\/ ==\/UserScript==$/m;
  /** @type {RegExp} */
  const userscriptHeaderProperty = /^\/\/ @([^ ]+)(?: +([^ ].*))?$/m;
  /** @type {string} */
  const metadataTemplate = "import { Metadata } from \"esbuild-plugin-userscript\";\n\nexport const metadata: Metadata = {\n%a\n};\n";

  /**
   * Handles the resource GM property and transforms it into an object entry.
   * @param {string} text The resource GM property value
   * @returns {object}
   */
  function handleResource(text) {
    return Object.fromEntries([text.split(/ +/, 2)]);
  }

  /**
   * Inner handling of the metadata from a file.
   * @param {object} metadata The current iteration of the metadata output to patch.
   * @param {string} line The current line in the metadata block.
   * @param {number} index The current line number in the userscript file.
   * @param {string} file The path to the metadata file.
   * @returns {Metadata}
   */
  function handleMetadata(metadata, line, index, file) {
    const output = { ...metadata };

    /** @type {RegExpMatchArray | null} */
    const matches = line.match(userscriptHeaderProperty);

    if (matches === null) {
      throw new Error(`Unexpected exception, unable to find userscript header property in file ${file} at line ${index + 1}`);
    }

    if (Object.hasOwn(output, matches[1]) && typeof matches[2] !== "undefined") {
      if (matches[1] === "resource") {
        output[matches[1]] = { ...output[matches[1]], ...handleResource(matches[2]) };
      } else if (Array.isArray(output[matches[1]])) {
        output[matches[1]].push(matches[2]);
      } else {
        /** @type {unknown} */
        const _temp = output[matches[1]];

        output[matches[1]] = [];

        output[matches[1]].push(_temp);
        output[matches[1]].push(matches[2]);
      }
    } else if (matches[1] === "resource") {
      output[matches[1]] = { ...handleResource(matches[2]) };
    } else if (typeof matches[2] === "undefined") {
      output[matches[1]] = true;
    } else {
      output[matches[1]] = matches[2];
    }

    return output;
  }

  /**
   * Returns a properly formatted metadata block.
   * @param {Metadata} metadata The metadata object
   * @returns {string} The properly formatted metadata block.
   */
  function formatJavascriptObject(metadata) {
    /** @type {string} */
    const jsonText = JSON.stringify(metadata, null, 2);

    return jsonText.split(/\r?\n/)
      .map((l) => l.replace(/^(\s+)"([^ ]+)":/, "$1$2:"))
      .filter((l) => !l.startsWith("{") && !l.startsWith("}"))
      .join("\n");
  }

  for await (const directory of glob.iterate()) {
    console.log(`INF: Processing directory .\\${directory}`);

    /** @type {string[]} */
    const contents = await fs.promises.readdir(directory);

    if (contents.includes("metadata.user.ts")) {
      continue;
    }

    /** @type {Glob} */
    const _glob = new Glob("./*.user.ts", { cwd: path.join(__dirname, "..", directory), sort: true });
    const globStream = await _glob.walk();
    /** @type {string[]} */
    const files = [...globStream].filter((x) => {
      /** @type {string} */
      const basename = path.basename(x);

      return basename.endsWith(".user.ts") && basename !== "metadata.user.ts";
    }).map((x) => path.join(".", directory, x));

    if (files.length === 0) {
      console.warn(`\tWRN: Directory ${path.join(".", directory)} does not contain a userscript.`);
      continue;
    }

    if (files.length > 1) {
      console.warn(`\tWRN: Directory ${path.join(".", directory)} contains more than one userscript.`);
      continue;
    }

    console.log(`\tINF: Processing file .\\${files[0]}`);

    /** @type {string} */
    const fileData = await fs.promises.readFile(files[0], { encoding: "utf-8" });
    /** @type {object} */
    let outputMetadata = {};
    /** @type {boolean} */
    let started = false;

    for (const [index, line] of fileData.split(/\r?\n/).map((l, i) => [i, l])) {
      if (!started && userscriptHeaderStart.test(line)) {
        started = true;
      } else if (started && userscriptHeaderStart.test(line)) {
        throw new Error(`Unexpected start header block in file ${files[0]} at line ${index + 1}`);
      } else if (started && userscriptHeaderEnd.test(line)) {
        started = false;
      } else if (!started && userscriptHeaderEnd.test(line)) {
        throw new Error(`Unexpected end header block in file ${files[0]} at line ${index + 1}`);
      } else if (started) {
        outputMetadata = handleMetadata(outputMetadata, line, index, files[0]);
      }
    }

    if (started) {
      throw new Error(`Unexpected late end for file ${files[0]}`);
    }

    if (Object.entries(outputMetadata).length === 0) {
      console.warn(`\t\tWRN: Failed to import any metadata from file ${files[0]}\n`);
      continue;
    }

    const metadataText = metadataTemplate.replace("%a", formatJavascriptObject(outputMetadata));

    await fs.promises.writeFile(path.join(__dirname, "..", directory, "metadata.user.ts"), metadataText, { encoding: "utf-8" });
  }
}

run();
