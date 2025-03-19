import * as fs from "fs";
import * as path from "path";
import * as eslintConfig from "../../eslint.config.mjs";
import rulesCustom from "../rules-custom.mjs";

const outDirectory = path
  .join(import.meta.url, "..", "..", "..", "out", "eslint.json")
  .toString()
  .replace("file:\\", "");

/* To remove:
 * no-constant-binary-expression
 * no-empty-static-block
 * no-new-native-nonconstructor
 */

/**
 * @param {Record<String, unknown>} rules
 * @returns {Record<String, unknown>}
 */
function removeTamperMonkeyUndefRules(rules) {
  const newRules = rules;
  delete newRules["no-constant-binary-expression"];
  delete newRules["no-empty-static-block"];
  delete newRules["no-new-native-nonconstructor"];
  return newRules;
}

/**
 * @param {Record<String, String | Boolean>} globals
 * @returns {Record<String, Boolean>}
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function enableAllGlobals(globals) {
  /** @type {Record<String, Boolean>} */
  const output = {};

  for (const globalVar of Object.keys(globals)) {
    if (globals[globalVar] === false) {
      output[globalVar] = true;
    } else if (typeof globals[globalVar] === "string") {
      output[globalVar] = true;
    } else {
      output[globalVar] = globals[globalVar];
    }
  }

  return output;
}

function loadEslintConfig() {
  const newJsonTree = {};

  newJsonTree.env = {
    es6: true,
    greasemonkey: true,
    browser: true,
    jquery: true,
  };

  newJsonTree.globals = {
    ...(eslintConfig.default[0].languageOptions?.globals ?? []),
  };

  // DISABLED:
  // newJsonTree.globals = await enableAllGlobals(newJsonTree.globals);

  newJsonTree.extends = ["eslint:recommended"];
  newJsonTree.parserOptions = {
    ...(eslintConfig.default[0].languageOptions?.parserOptions ?? []),
  };
  /** @typedef {typeof FlatConfig} */
  newJsonTree.rules = { ...eslintConfig.default[0].rules };
  newJsonTree.rules = removeTamperMonkeyUndefRules(newJsonTree.rules);
  return newJsonTree;
}

async function run() {
  const newEslintConfig = loadEslintConfig();
  const json = JSON.stringify(newEslintConfig, null, 2);
  await fs.promises.writeFile(outDirectory, json, { flag: "w+" });
}

run().catch((reason) => console.error(reason));
