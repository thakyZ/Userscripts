export default {
  overrides: [
    {
      files: ["css/*.css"],
      ignoreFiles: ["**/*.min.css", "!**/*.less", "!**/*.css", "!css/"],
      extends: [
        "stylelint-config-standard",
        "stylelint-config-recommended"
      ],
      plugins: ["stylelint-less"],
      rules: {
        "selector-class-pattern": [
          "^[\\w\\d-]+$",
          {
            /**
             * @param {String} selector
             * @returns {String}
             */
            message(selector) {
              return `Expected class selector "${selector}" to be kebab-case`;
            },
            resolveNestedSelectors: true,
          },
        ],
        "selector-id-pattern": null,
        "at-rule-no-vendor-prefix": null,
      },
      validate: ["scss", "sass", "css", "less"],
    },
    {
      files: ["**/*.less"],
      ignoreFiles: ["**/*.min.css", "**/*.css", "css/"],
      extends: [
        "stylelint-config-standard",
        "stylelint-config-standard",
        "stylelint-config-standard-less",
        "stylelint-config-recommended-less",
      ],
      plugins: ["stylelint-less"],
      rules: {
        // "at-rule-no-unknown": null,
        // "color-no-invalid-hex": true,
        // "less/color-no-invalid-hex": true,
        "selector-class-pattern": [
          "^[\\w\\d-]+$",
          {
            /**
             * @param {String} selector
             * @returns {String}
             */
            message(selector) {
              return `Expected class selector "${selector}" to be kebab-case`;
            },
            resolveNestedSelectors: true,
          },
        ],
        "selector-id-pattern": null,
        "at-rule-no-vendor-prefix": null,
      },
      validate: ["scss", "sass", "css", "less"],
    },
  ],
};
