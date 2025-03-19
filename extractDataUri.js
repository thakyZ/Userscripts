(async function() {
  const process = require("node:process");
  const console = require("node:console");
  const fs = require("node:fs");
  const path = require("node:path");
  const dataUriRegex = require("data-uri-regex");

  const globalCache = {};
  const _dataUriRegex = new RegExp(`(${dataUriRegex().source.replace("^", "").replace("(.*)", "(.*(\\+|=|\\w))")})`, dataUriRegex().flags);

  function testMatched(matched) {
    if (matched !== null) {
      if (typeof matched === Boolean) {
        console.log("matched : Boolean =", matched);
      } else {
        console.debug("matched : Object(?) =", matched);
      }
    }
  }

  async function processBase64Data() {
    for (const [_index, item] of Object.entries(globalCache).map((x, i) => [i, x])) {
      const index = Number.parseInt(_index, 10);
      if (Number.isNaN(index)) {
        continue;
      }

      const buffer = Buffer.from(item[0], "base64");
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(path.join(__dirname, "out", `data${index}.${item[1].match(/\w+\/(\w+)(?:\+.*)?/i)[1]}`), buffer);
    }
  }

  async function run(argument) {
    const file = await fs.promises.open(path.join(__dirname, argument), "r+");
    console.log();

    for await (const line of file.readLines()) {
      const matched = line.match(_dataUriRegex);
      testMatched(matched);
      if (matched !== null) {
        const mime = _dataUriRegex.exec(matched[0]);
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
