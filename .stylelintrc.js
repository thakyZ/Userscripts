const prettier = require("./prettier.config.cjs");

module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-less",
    "stylelint-config-recommended-less",
    "stylelint-prettier/recommended"
  ],
  plugins: [
    "stylelint-less",
    "stylelint-prettier"
  ],
  rules: {
    "prettier/prettier": [true, prettier],
    "at-rule-no-unknown": null,
    "color-no-invalid-hex": true,
    "less/color-no-invalid-hex": true,
  },
  validate: [
    "scss",
    "sass",
    "css"
  ]
};
