import * as fsSync from "fs";
import { promises as fs } from "fs";
import * as path from "path";
import * as eslintConfig from "../eslint.config.mjs";

const outDirectory = path.join(import.meta.url, "..", "..", "out", "eslint.json").toString().replace("file:\\", "");

async function loadEslintConfig() {
  const newJsonTree = {};
  newJsonTree.env = {...eslintConfig.default[0].languageOptions.globals};
  newJsonTree.extends = [ "eslint:recommended" ];
  newJsonTree.parserOptions = {...eslintConfig.default[0].languageOptions.parserOptions};
  newJsonTree.rules = {...eslintConfig.default[0].rules};
  return newJsonTree;
}

async function run() {
  const newEslintConfig = await loadEslintConfig();
  const json = JSON.stringify(newEslintConfig, null, 2);
  await fs.writeFile(outDirectory, json, { flag: "w+" });
}

(async function() {
  await run();
})();

