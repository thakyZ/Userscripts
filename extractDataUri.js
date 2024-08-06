const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const dataUriRegex = require("data-uri-regex");

const globalCache = {};
const _dataUriRegex = new RegExp(`(${dataUriRegex().source.replace("^", "").replace("(.*)", "(.*(\\+|=|\\w))")})`, dataUriRegex().flags)

function testMatched(matched) {
  if (matched !== null) {
    if (typeof matched === "boolean") {
      console.log(`matched : Boolean = ${matched}`)
    } else {
      console.log("matched : Object(?) = ", matched)
    }
  }
}

async function processBase64Data() {
  for (const index of globalCache) {
    const buffer = Buffer.from(Object.entries(globalCache)[index][0], "base64");

    /* eslint-disable-next-line no-await-in-loop */
    await fs.promises.writeFile(path.join(__dirname, "out", `data${index}.${Object.entries(globalCache)[index][1].match(/\w+\/(\w+)(?:\+.*)?/)[1]}`), buffer);
  }
}

async function run(argument) {
  const file = await fs.promises.open(path.join(__dirname, argument), "r+");

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

console.log(path.join(__dirname, argument));

await run(argument);
