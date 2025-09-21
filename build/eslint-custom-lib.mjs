// Unused:
// import * as fs from "node:fs";
// import * as path from "node:path";
// import * as url from "url";
//
// /** @type {String} */
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
//
// /**
//  * Gets the installed version of a module from the path and name.
//  *
//  * @param {String} name The name of the module to query.
//  * @returns {String | null}
//  */
// function getInstalledVersion(name) {
//   const folders = fs.readdirSync(path.join(__dirname, "..", "node_modules"));
//   for (const [, item] of Object.entries(folders)) {
//     if (item.startsWith(name + "@")) {
//       return item;
//     }
//   }
//
//   return null;
// }

/**
 * @typedef MonkeyCodeNamesTypeDef
 * @type {"string" | "custom" | "custom_global"}
 */

/**
 * @function
 * @typedef GetMonkeyCodeNamesFunc
 * @type {(type: MonkeyCodeNamesTypeDef) => String[] | { [key: String]: String }}
 */

/**
 * @typedef {Object} EslintGreaseMonkeyModule_LanguageOptions
 * @property {{ [key: String]: String }} globals
 */

/**
 * Gets a list of monkey code names. And parses them into types.
 *
 * @param {Partial<import('eslint').Linter.Config>[]} config
 * @returns {GetMonkeyCodeNamesFunc} }
 */
function getMonkeyCodeNames(config) {
  /** @type {GetMonkeyCodeNamesFunc} */
  const output = (type) => {
    /** @type {import('eslint').Linter.Globals | undefined} */
    const entries = config[0]?.languageOptions?.globals;
    if (!entries) {
      return [];
    }

    /** @type {String[]} */
    const names = [
      ...Object.keys(entries),
      "GM_configStruct",
      "GM_configField",
      "GM_config",
    ];

    /** @type {String[]} */
    const customLibraries = ["GM_config"];

    switch (type) {
      case "string":
        return names.concat(customLibraries);
      case "custom":
        return customLibraries;
      case "custom_global":
        return Object.assign({}, ...customLibraries.map((key) => ({ [key]: "readonly" })));
      default:
        return Object.assign({}, ...names.concat(customLibraries).map((key) => ({ [key]: "readonly" })));
    }
  };

  return output;
}

/** @type {String[]} */
const removableGlobalVars = ["$"];

/**
 * @param {String} name Name of the global property to remove.
 * @param {([String, Boolean | String] | String)[] | Record<String, Boolean | String>} global
 *   Object containing the global variables.
 * @returns
 */
function removeGlobalVars(name, global) {
  /** @type {typeof global} */
  let temp = global;

  if (typeof global === "object" && !Array.isArray(global)) {
    for (const removeThis of removableGlobalVars) {
      temp = Object.assign({},
        ...Object.entries(temp)
          .map(
            /**
             * @param {[String, String | Boolean]} param0
             * @returns {[String, Boolean | String] | null}
             */
            ([key, value]) => {
              if (key === removeThis) {
                if (typeof value === "boolean") {
                  return [key, false];
                }

                return null;
              }

              return [key, value];
            },
          )
          .filter((entry) => entry !== null),
      );
    }
  } else if (typeof global === "object" && Array.isArray(global)) {
    for (const removeThis of removableGlobalVars) {
      temp = global.filter(
        /** @param {[String, Boolean | String] | String} entry */
        (entry) => {
          if (typeof entry === "object" && Array.isArray(entry)) {
            return entry[0] !== removeThis;
          }

          if (typeof entry === "string") {
            return entry !== removeThis;
          }

          return false;
        },
      );
    }
  } else if (typeof global === "undefined") {
    console.error(
      new Error(`Argument global of property ${name} is 'undefined'.`),
    );

    return global;
  } else {
    console.warn(
      `Argument global of property ${name} is not a type of 'object' or 'array' but is instead a '${typeof global}'.`,
    );

    return global;
  }

  return temp;
}

export { removeGlobalVars, getMonkeyCodeNames };
