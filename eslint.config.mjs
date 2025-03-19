import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslint_jest from "eslint-plugin-jest";
import eslint_markdown from "eslint-plugin-markdown";
import globals from "globals";
import typescript_eslint from "typescript-eslint";
import { getMonkeyCodeNames } from "./build/eslint-custom-lib.mjs";
import customRules from "./build/rules-custom.mjs";

/** @type {FlatCompat} */
const flatCompat = new FlatCompat();

/** @type {Array<import('eslint-config-greasemonkey').EslintGreaseMonkeyModule>} */
const greaseMonkey = flatCompat.extends("greasemonkey");

export default [
  eslint.configs.recommended,
  typescript_eslint.configs.recommendedTypeChecked,
  eslint_markdown.configs.recommended,
  {
    files: ["test/**"],
    ...eslint_jest.configs["flat/recommended"],
    rules: {
      ...eslint_jest.configs["flat/recommended"].rules,
    },
  },
  {
    files: ["**/*.user.js", "**/*.userscript.lib.js"],
    ignores: ["build/**", "library/test/**"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
        project: "./tsconfig.userscript.json",
      },
      globals: {
        ...globals.browser,
        ...greaseMonkey[0].languageOptions.globals,
        jQuery: "readonly",
        NekoGamingUserScriptLibrary: "readonly",
        GM_config: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...customRules(getMonkeyCodeNames(greaseMonkey)),
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...greaseMonkey[0].languageOptions.globals,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...customRules(getMonkeyCodeNames(greaseMonkey)),
    },
  },
  {
    files: ["**/*.mjs"],
    ignores: ["**/*.user.js", "**/*.userscript.lib.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          modules: true,
          experimentalObjectRestSpread: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      camelcase: "off",
      // "object-curly-spacing": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    ignores: ["**/*.user.js", "**/*.userscript.lib.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
        ecmaFeatures: {
          modules: true,
          experimentalObjectRestSpread: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      camelcase: "off",
      // "object-curly-spacing": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...customRules(getMonkeyCodeNames(greaseMonkey)),
    },
  },
  {
    ignores: ["**/*.min.*", "./types/*.d.ts"],
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      camelcase: "off",
    },
  },
];
