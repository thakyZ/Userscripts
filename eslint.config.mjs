import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import markdown from "eslint-plugin-markdown";
import customRules from "./build/rules-custom.mjs";
import babelParser from "@babel/eslint-parser";
import ESgreasemonkey from "eslint-config-greasemonkey";
import ESimport from "eslint-plugin-import";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const getInstalledVersion = (_path, name) => {
  const folders = fs.readdirSync(_path);
  for (const [, item] of Object.entries(folders)) {
    if (item.startsWith(name + "@")) {
      return item;
    }
  }
  return null;
}

const ESnode = () => {
  const json = path.join(__dirname,"node_modules","@nekogaming","eslint-config-node","index.json");
  return JSON.parse(fs.readFileSync(json));
}

const ESjquery = () => {
  const json = path.join(__dirname,"node_modules","eslint-config-jquery",".eslintrc.json");
  return JSON.parse(fs.readFileSync(json));
}

const getMonkeyCodeNames = (type) => {
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
    "GM_config",
    "unsafeWindow",
  ];
  const customLibraries = [
    "GM_config",
  ]
  if (type === "string") {
    return names.concat(customLibraries);
  } else if (type === "custom") {
    return customLibraries;
  } else if (type === "customGlobal" || type === "custom_global" || type === "custom global") {
    return Object.assign(...customLibraries.map((k) => ({ [k]: "readonly" })));
  }

  return Object.assign(...names.concat(customLibraries).map((k) => ({ [k]: "readonly" })));
};

const removableGlobalVars = [
  "$"
];

function removeGlobalVars(name, global) {
  let temp_global = global;
  if (typeof global === "object") {
    for (const removeThis of removableGlobalVars) {
      temp_global = Object.fromEntries(
        Object.entries(temp_global)
          .map(
            ([key, value]) => {
              if (key === removeThis) {
                if (typeof value === "boolean") {
                  return [key, false]
                }
                return null
              }
              return [key, value]
            }
          ).filter((x) => x !== null)
        )
    }
  } else if (typeof global === "array") {
    for (const removeThis of removableGlobalVars) {
      temp_global = temp_global.filter(x => x !== removeThis);
    }
  } else if (typeof global === "undefined") {
    console.error(new Error(`Argument global of property ${name} is 'undefined'.`));
  } else {
    console.warn(`Argument global of property ${name} is not a type of 'object' or 'array' but is instead a '${typeof global}'.`);
  }
  return temp_global;
}

export default [
  {
    files: ["**/*.user.js"],
    ignores: ["build/*.*", "library/*.*"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
      },
      globals: {
        ...removeGlobalVars("browser", globals.browser),
        ...removeGlobalVars("greasemonkey", globals.greasemonkey),
        ...removeGlobalVars("jquery", globals.jquery),
        ...removeGlobalVars("ESgreasemonkey", ESgreasemonkey.globals),
        ...removeGlobalVars("getMonkeyCodeNames", getMonkeyCodeNames("customGlobal")),
      },
    },
    plugins: {
      prettierPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...prettier.rules,
      ...customRules(getMonkeyCodeNames),
    },
  },
  {
    files: ["eslint.config.mjs", "prettier.config.cjs", "build/rules-*.mjs"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...removeGlobalVars("node", globals.node),
      },
    },
    plugins: {
      prettierPlugin,
    },
    rules: {
      ...prettier.rules,
      camelcase: "off",
      "object-curly-spacing": "off",
    },
  },
  {
    files: ["**/*.js"],
    ignores: ["**/*.user.js", "build/*.*", "library/*.*"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 13,
      },
      globals: {
        ...removeGlobalVars("node", globals.node),
        ...removeGlobalVars("ESgreasemonkey", ESgreasemonkey.globals),
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      prettierPlugin,
    },
    rules: {
      ...prettier.rules,
      ...customRules(getMonkeyCodeNames),
    },
  },
  {
    files: ["build/*.js", "library/*.js"],
    ignores: ["**/*.user.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          modules: true,
          experimentalObjectRestSpread: true
        }
      },
      parser: babelParser,
      globals: {
        ...removeGlobalVars("node", globals.node),
        ...removeGlobalVars("ESgreasemonkey", ESgreasemonkey.globals),
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      prettierPlugin,
    },
    rules: {
      ...ESjquery.rules,
      //...ESnode,
      ...prettier.rules,
      ...customRules(getMonkeyCodeNames),
    },
  },
  {
    files: ["**/*.md"],
    plugins: {
        markdown
    },
    processor: "markdown/markdown",
    settings: {
        sharedData: "Hello"
    }
  }
];
