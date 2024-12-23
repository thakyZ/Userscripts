import { FlatCompat } from "@eslint/eslintrc";
import { MonkeyCodeType } from "./build/eslint.lib.js";
import custom from "./build/rules-custom.js";
import { fileURLToPath } from "node:url";
import { getMonkeyCodeNames } from "./build/eslint.lib.js";
import globals from "globals";
import greasemonkey from "eslint-config-greasemonkey";
import js from "@eslint/js";
import nodePlugin from "eslint-plugin-n";
import path from "node:path";
import react from "eslint-plugin-react";
import typescript from "typescript-eslint";

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

function mapConfig(config) {
  if (config.rules && Object.entries(config.rules).filter((x) => x[0] === "@typescript-eslint/await-thenable").length > 0) {
    config.files = ["**/*.ts"];
    config.languageOptions = { parserOptions: { project: "./tsconfig.eslint.json" } };
  }

  return config;
}

const settingsCompat = compat.config({
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      fragment: "Fragment",
      version: "detect",
      flowVersion: "0.53",
    },
    node: {
      allowExperimental: true,
      version: ">=16.9.0",
      ignores: [
        "localStorage",
      ],
    },
    tsconfigPath: "./tsconfig.eslint.json",
    resolvePaths: [
      "./",
      "../",
      "../../",
      "./node_modules/@types/",
      "../node_modules/@types/",
      "../../node_modules/@types/",
    ],
  },
});

const config = [
  react.configs.flat.recommended,
  ...typescript.configs.recommendedTypeChecked.map(mapConfig),
  ...compat.extends("stylelint", "stylelint/jest", "prettier"),
  nodePlugin.configs["flat/recommended-script"],
  ...compat.plugins("prettier", "markdown"),
  {
    ignores: [
      "./node_modules",
      "./.temp",
      "./userscripts",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: [
      "{src,types,library}/**/*.{js,mjs,ts,jsx,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.greasemonkey,
        ...globals.jquery,
        ...globals.es6,
        ...greasemonkey.globals,
        ...getMonkeyCodeNames(MonkeyCodeType.customGlobal),
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
    ignores: [
      "build/**",
    ],
    rules: {
      ...custom.rules,
    },
  },
  {
    files: [
      "{src,types,library}/**/*.{ts,tsx}",
    ],
    rules: {
      ...react.configs.flat.recommended.rules,
      ...custom.rules,
      "no-undef": "off",
      "dot-notation": "off",
      "@typescript-eslint/no-namespace": "off",
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          allowExperimental: true,
          version: ">=16.9.0",
          ignores: [
            "localStorage",
          ],
        },
      ],
      "n/no-missing-import": [
        "error",
        {
          tsconfigPath: "./tsconfig.eslint.json",
        }
      ]
    },
  },
  {
    files: [
      "**/*.{js,mjs,ts,jsx,tsx}",
    ],
    ignores: [
      "{src,types,library}/**",
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
    },
    rules: {
      ...custom.rules,
      "no-console": "off",
    },
  },
  {
    files: [
      "**/*.cjs",
    ],
    ignores: [
      "{src,types,library}/**",
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "script",
    },
    rules: {
      ...custom.rules,
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: [
      "**/*.{cjs,js,jsx,mjs}",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [
      "**/*.md",
    ],
    processor: "markdown/markdown",
    settings: {
      sharedData: "Hello",
    },
  },
  ...settingsCompat,
];

// Disabled:
// config = patchRules(config);

export default config;
