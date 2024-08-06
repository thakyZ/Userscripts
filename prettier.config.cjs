const { FILE_LENGTHS } = require("./build/prettier.lib.cjs");

module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  endOfLine: "lf",
  bracketSpacing: true,
  bracketSameLine: true,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  arrowParens: "avoid",
  embeddedLanguageFormatting: "off",
  proseWrap: "never",
  insertPragma: false,
  overrides: [
    {
      files: ["**/*.html"],
      options: {
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: "css",
      },
    },
    {
      files: ["**/*.js","**/*.cjs"],
      options: {
        trailingComma: "all",
        printWidth: 150,
      },
    },
    {
      files: ["**/eslint.config.mjs", "**/prettier.config.cjs"],
      options: {
        trailingComma: "all",
      },
    },
    {
      files: ["**/*.user.css"],
      options: {
        rangeStart: 12
      }
    },
    ...FILE_LENGTHS,
  ]
};
