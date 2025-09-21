import process from "node:process";
import console from "node:console";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import dataUriRegex from "data-uri-regex";

(async function() {
  /** @type {Record<string, string>} */
  const globalCache = {};
  const _dataUriRegex = new RegExp(`(${dataUriRegex().source.replace("^", "").replace("(.*)", "(.*(\\+|=|\\w))")})`, dataUriRegex().flags);

  /**
   * Tests if the variable has been successfully matched.
   * @param {boolean | object | null} matched
   */
  function testMatched(matched) {
    if (matched !== null) {
      if (typeof matched === "boolean") {
        console.log("matched : Boolean =", matched);
      } else {
        console.debug("matched : Object(?) =", matched);
      }
    }
  }

  async function processBase64Data() {
    for (const entry of Object.entries(globalCache).map((x, i) => [i, x])) {
      const index = typeof entry[0] === "string" ? Number.parseInt(entry[0], 10) : entry[0];
      if (Number.isNaN(index)) {
        continue;
      }

      assert(typeof index === "number");
      const item = entry[1];
      assert(typeof item !== "number");
      const buffer = Buffer.from(item[0], "base64");
      const matched = item[1].match(/\w+\/(\w+)(?:\+.*)?/i);

      if (matched === null || matched.length < 2) {
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(path.join(__dirname, "out", `data${index}.${matched[1]}`), buffer);
    }
  }

  /**
   * Runs a command.
   * @param {string} argument a string of arguments.
   */
  async function run(argument) {
    const file = await fs.promises.open(path.join(__dirname, argument), "r+");
    console.log();

    for await (const line of file.readLines()) {
      const matched = line.match(_dataUriRegex);
      testMatched(matched);
      if (matched !== null) {
        const mime = _dataUriRegex.exec(matched[0]);
        if (mime === null || mime.length < 6) {
          continue;
        }

        globalCache[mime[5]] = mime[3];
      }
    }

    await processBase64Data();
  }

  const argument = process.argv[2];
  await run(argument);
})().catch(
  /** @param {Error | undefined | unknown} error */
  (error) => {
    console.error(error);
  }
);
