export default [
  {
    match: undefined,
    rules: {
      "no-console": false,
      "n/no-unsupported-features/es-syntax": [
        "error",
        {
          version: ">=16.9.0",
          ignores: []
        }
      ],
      "@typescript-eslint/no-namespace": false,
    },
  },
  {
    match: "ts",
    rules: {
      "no-undef": "off",
    },
  },
  {
    match: "js",
    settings: {
      node: {
        version: ">=16.9.0",
      },
    },
  },
];
