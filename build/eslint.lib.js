import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import patches from "./eslint.patch.js";
import path from "node:path";

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gets the installed version of all the files on a path that start with a name.
 * @param {string} _path Path to the files to search.
 * @param {string} name The beginning name of the file to search for.
 * @returns {string | null} Outputs string if found or null if not found.
 */
export function getInstalledVersion(_path, name) {
  /** @type {string[]} */
  const folders = fs.readdirSync(_path);

  for (const [, item] of Object.entries(folders)) {
    if (item.startsWith(`${name}@`)) {
      return item;
    }
  }

  return null;
}

/**
 * Gets the installed version of all the files on a path that start with a name.
 * Async Method
 * @param {string} _path Path to the files to search.
 * @param {string} name The beginning name of the file to search for.
 * @returns {string | null} Outputs string if found or null if not found.
 */
export async function getInstalledVersionAsync(_path, name) {
  /** @type {string[]} */
  const folders = await fs.promises.readdir(_path);

  for (const [, item] of Object.entries(folders)) {
    if (item.startsWith(`${name}@`)) {
      return item;
    }
  }

  return null;
}

/**
 * Reads personal eslint config node module.
 * @returns {object} A Json object from the eslint config node module.
 */
export function nodeEslint() {
  /** @type {string} */
  const json = path.join(__dirname, "node_modules", "@nekogaming", "eslint-config-node", "index.json");

  return JSON.parse(fs.readFileSync(json, { encoding: "utf-8" }));
}

/**
 * Reads personal eslint config node module.
 * Async Method
 * @returns {object} A Json object from the eslint config node module.
 */
export async function nodeEslintAsync() {
  /** @type {string} */
  const json = path.join(__dirname, "node_modules", "@nekogaming", "eslint-config-node", "index.json");

  return JSON.parse(await fs.promises.readFile(json, { encoding: "utf-8" }));
}

/**
 * Reads the eslint-config-jquery node module.
 * Async Method
 * @returns {object} A Json object from the eslint config node module.
 */
export function jQueryEslint() {
  /** @type {string} */
  const json = path.join(__dirname, "node_modules", "eslint-config-jquery", ".eslintrc.json");

  return JSON.parse(fs.readFileSync(json, { encoding: "utf-8" }));
}

/**
 * Reads the eslint-config-jquery node module.
 * Async Method
 * @returns {object} A Json object from the eslint config node module.
 */
export async function jQueryEslintAsync() {
  /** @type {string} */
  const json = path.join(__dirname, "node_modules", "eslint-config-jquery", ".eslintrc.json");

  return JSON.parse(await fs.promises.readFile(json, { encoding: "utf-8" }));
}

/**
 * @typedef {number} MonkeyCodeType
 */

/**
 * @enum {MonkeyCodeType}
 */
export const MonkeyCodeType = {
  string: 0,
  custom: 1,
  customGlobal: 2,
};

/**
 *
 * @param {MonkeyCodeType | undefined} type
 * @returns {Object}
 */
export function getMonkeyCodeNames(type) {
  /** @type {string[]} */
  const names = [
    "GM",
    "GM_addElement",
    "GM_addStyle",
    "GM_addValueChangeListener",
    "GM_deleteValue",
    "GM_download",
    "GM_getResourceText",
    "GM_getResourceURL",
    "GM_getTab",
    "GM_getTabs",
    "GM_getValue",
    "GM_info",
    "GM_listValues",
    "GM_log",
    "GM_notification",
    "GM_openInTab",
    "GM_registerMenuCommand",
    "GM_removeValueChangeListener",
    "GM_saveTab",
    "GM_setClipboard",
    "GM_setValue",
    "GM_unregisterMenuCommand",
    "GM_xmlhttpRequest",
    "GM_configStruct",
    "unsafeWindow",
  ];

  /** @type {string[]} */
  const customLibraries = [
    "GM_config",
  ];

  let output = null;

  if (type === MonkeyCodeType.string) {
    output = names.concat(customLibraries);
  } else if (type === MonkeyCodeType.custom) {
    output = customLibraries;
  } else if (type === MonkeyCodeType.customGlobal) {
    output = Object.fromEntries(customLibraries.map((k) => [k, "readonly"]));
  } else {
    output = Object.fromEntries(names.concat(customLibraries).map((k) => [k, "readonly"]));
  }

  return output;
}

/** @type {string[]} */
export const REMOVABLE_GLOBAL_VARS = [
  "$"
];

function any(array, cb) {
  return array.filter((x, i, a) => cb(x, i, a)).length > 0;
}

/* eslint-disable-next-line no-unused-vars */
function anyRecurse(array, other, cb) {
  return any(array, (x, i, a) => any(other, (y, j, b) => cb(x, y, i, j, a, b)));
}

function objectsEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (!a || !b) {
    return false;
  }

  const _a = Object.entries(a);
  const _b = Object.entries(b);

  if (_a.length !== _b.length) {
    return false;
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < _a.length; ++i) {
    if (typeof _a[i][0] !== typeof _b[i][0]) {
      return false;
    }

    if (_a[i][0] !== _b[i][0]) {
      return false;
    }

    if (typeof _a[i][1] !== typeof _b[i][1]) {
      return false;
    }

    if (typeof _a[i][1] === "object" && typeof _b[i][1] === "object") {
      if (Array.isArray(_a[i][1]) && Array.isArray(_b[i][1])) {
        if (!arraysEqual(_a[i][1], _b[i][1])) {
          return false;
        }
      } else if (!Array.isArray(_a[i][1]) && !Array.isArray(_b[i][1])) {
        if (!objectsEqual(_a[i][1], _b[i][1])) {
          return false;
        }
      } else {
        return false;
      }
    }

    if (_a[i][1] !== _b[i][1]) {
      return false;
    }
  }

  return true;
}

function arraysEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (!a || !b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  try {
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return true;
    }
  } catch {
    // Do nothing...
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (typeof a[i] !== typeof b[i]) {
      return false;
    }

    if (typeof a[i] === "object" && typeof b[i] === "object") {
      if (Array.isArray(a[i]) && Array.isArray(b[i])) {
        if (!arraysEqual(a[i], b[i])) {
          return false;
        }
      } else if (!Array.isArray(a[i]) && !Array.isArray(b[i])) {
        if (!objectsEqual(a[i], b[i])) {
          return false;
        }
      } else {
        return false;
      }
    }

    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function mergeArray(a, b) {
  const _a = [...a];
  const _b = [...b];

  for (let i = 0; i < _a.length; ++i) {
    const aVal = _a[i];
    const bVal = _b[i];

    if ((typeof aVal === "string" || typeof aVal === "number")
        && typeof aVal === typeof bVal && aVal === bVal) {
      continue;
    }

    if (bVal === false) {
      delete _a[i];
    } else if (typeof bVal === "object") {
      if (Array.isArray(bVal)) {
        _a[i] = mergeArray(aVal, bVal);
      } else {
        _a[i] = mergeObject(aVal, bVal);
      }
    } else if (typeof bVal === "string" || typeof bVal === "number") {
      _a[i] = bVal;
    }
  }

  return _a;
}

export function mergeObjects(objs, original) {
  const backup = { ...original };
  let output = {};

  for (const obj of objs) {
    output = mergeObject(output, obj);
  }

  return mergeObject(output, backup);
}

function mergeObject(a, b) {
  const _a = Object.entries({ ...a });
  const _b = Object.entries({ ...b });

  for (let i = 0; i < _a.length; ++i) {
    const aKey = _a[i][0]; const aVal = _a[i][1];

    if (!aKey || aKey === null) {
      continue;
    }

    if (!any(_b, (x) => x[0] === aKey)) {
      continue;
    }

    const bVal = _b.find((x) => x[0] === aKey)[1];

    if ((typeof aVal === "string" || typeof aVal === "number")
        && typeof aVal === typeof bVal && aVal === bVal) {
      continue;
    }

    if (bVal === false) {
      delete _a[i];
    } else if (typeof bVal === "object") {
      if (Array.isArray(bVal)) {
        _a[i][1] = mergeArray(aVal, bVal);
      } else {
        _a[i][1] = mergeObject(aVal, bVal);
      }
    } else if (typeof bVal === "string" || typeof bVal === "number") {
      _a[i][1] = bVal;
    }
  }

  return Object.fromEntries(_a);
}

function checkForFileMatch(input, patch) {
  if (patch.match && input.files) {
    return any(input.files, ((x) => x.includes(patch.match)));
  }

  return !patch.match;
}

function hasObjectKey(key, input) {
  return input && any(Object.entries(input), (x) => x[0] === key);
}

function getApplicablePatches(input, patch) {
  const output = {};

  if (checkForFileMatch(input, patch)) {
    for (const [key1, value1] of Object.entries(patch).filter((x) => x[0] !== "match")) {
      if (typeof value1 === "object" && Array.isArray(value1)) {
        output[key1] = [...value1];
      } else if (typeof value1 === "object" && !Array.isArray(value1)) {
        output[key1] = {};

        for (const [key2, value2] of Object.entries(value1).filter((x) => hasObjectKey(x, input[key1]))) {
          output[key1][key2] = value2;
        }
      } else {
        output[key1] = value1;
      }
    }
  }

  return output;
}

export function patchRules(array) {
  return array.map((item) => {
    const output = { ...item };
    const outputArray = Object.entries(output);

    for (const patch of patches) {
      const anyFile = !patch.match;
      const filesDefined = patch.files;

      if (anyFile || (filesDefined && checkForFileMatch(output, patch))) {
        const _patches = getApplicablePatches(outputArray, patch);

        for (const [key, value] of Object.entries(_patches).filter((x) => any(Object.entries(output), (y) => x[0] === y[0]))) {
          let temp = output[key];

          if (value === false) {
            temp = Object.fromEntries(Object.entries(temp).filter((x) => x[0] !== key));
          } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
            temp = Object.fromEntries(Object.entries(temp).map((x) => x[0] === key ? [key, value] : [key, x[1]]));
          }

          output[key] = temp;
        }
      }
    }

    return output;
  });
}
