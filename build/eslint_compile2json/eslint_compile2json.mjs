import * as eslintConfig from "../../eslint.config.js";
import * as fs from "fs";
import * as path from "path";

const outDirectory = path.join(import.meta.url, "..", "..", "..", "out", "eslint.json").toString().replace("file:\\", "");

/* To remove:
 * no-constant-binary-expression
 * no-empty-static-block
 * no-new-native-nonconstructor
 */

async function removeTamperMonkeyUndefRules(rules) {
  const newRules = rules;

  delete newRules["no-constant-binary-expression"];
  delete newRules["no-empty-static-block"];
  delete newRules["no-new-native-nonconstructor"];

  return newRules;
}

async function enableAllGlobals(globals) {
  for (const _var in globals) {
    if (Object.hasOwn(globals, _var) && globals[_var] === false) {
      globals[_var] = true;
    }
  }

  return globals;
}

async function loadEslintConfig(enable) {
  const newJsonTree = {};

  newJsonTree.env = { es6: true, greasemonkey: true, browser: true, jquery: true, };
  newJsonTree.globals = { ...eslintConfig.default[0].languageOptions.globals };

  if (enable) {
    newJsonTree.globals = await enableAllGlobals(newJsonTree.globals);
  }

  newJsonTree.extends = [ "eslint:recommended" ];
  newJsonTree.parserOptions = { ...eslintConfig.default[0].languageOptions.parserOptions };
  newJsonTree.rules = { ...eslintConfig.default[0].rules };
  newJsonTree.rules = await removeTamperMonkeyUndefRules(newJsonTree.rules);

  return newJsonTree;
}

async function run() {
  const newEslintConfig = await loadEslintConfig();
  const json = JSON.stringify(newEslintConfig, null, 2);

  await fs.promises.writeFile(outDirectory, json, { flag: "w+" });
}

run();
