const fs = require("fs").promises;
// A const fsSync = require("fs");
const path = require("path");
const dataUriRegex = require('data-uri-regex');

const globalCache = {};
const _dataUriRegex = new RegExp(`(${dataUriRegex().source.replace("^", "").replace("(.*)", "(.*(\\+|=|\\w))")})`, dataUriRegex().flags)

function testMatched(matched) {
  if (matched !== null) {
    if (typeof matched === Boolean) {
      console.log(`matched : Boolean = ${matched}`)
    } else {
      console.log(`matched : Object(?) = `)
      console.log(matched)
    }
  }
}

async function processBase64Data() {
  for (const index in Object.entries(globalCache)) {
    const buffer = Buffer.from(Object.entries(globalCache)[index][0], "base64");
    await fs.writeFile(path.join(__dirname, "out", `data${index}.${Object.entries(globalCache)[index][1].match(/\w+\/(\w+)(?:\+.*)?/i)[1]}`), buffer);
  }
}

async function run(argument) {
  const file = await fs.open(path.join(__dirname, argument), "r+");
  console.log()

  for await (const line of file.readLines()) {
    const matched = line.match(_dataUriRegex);
    //testMatched(matched);
    if (matched !== null) {
      const mime = _dataUriRegex.exec(matched[0]);
      globalCache[mime[5]] = mime[3];
    }
  }

  await processBase64Data();
}

(async function () {
  const argument = process.argv[2];
  //console.log(path.join(__dirname, argument));
  await run(argument);
})();
