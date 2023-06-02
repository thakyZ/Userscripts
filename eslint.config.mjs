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

export default [
  {
    files: ["**/*.user.js"],
    ignores: ["build/*.*", "library/*.*"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 8,
        sourceType: "script",
      },
      globals: {
        ...globals.browser,
        ...globals.greasemonkey,
        ...globals.jquery,
        ...globals.es6,
        ...ESgreasemonkey.globals,
        ...getMonkeyCodeNames("customGlobal"),
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
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.node,
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
        ecmaVersion: 8,
      },
      globals: {
        ...globals.node,
        ...globals.es6,
        ...ESgreasemonkey.globals
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
        ...globals.node,
        ...ESgreasemonkey.globals
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
