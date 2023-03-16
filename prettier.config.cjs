const fs = require("fs");
const path = require("path");

async function getFiles() {
  const files = await fs.readdirSync(__dirname);
  for (const file of Object.entries(files)) {
    const fileStat = await fsSync.statSync(file);
    if (fileStat.isFile) {
      const extension = path.extname(file);
      const fileData = fs.readFileSync(file, { encoding: "utf-8", flag: "r+" });
      if (extension === ".js") {
        const userScriptDetect = /\/\/ ==UserScript==\n(?:\/\/ @\w+ +?.+\n)+\/\/ ==\/UserScript==\n\/\* global .+ \*\/\nthis\.\$ = this\.jQuery = jQuery\.noConflict\(true\);/;
        if (userScriptDetect.test(fileData)) {
          const matched = fileData.match(userScriptDetect);
          console.log(matched[0]);
        }
      } else if (extension === ".css") {
        const userStyleDetect = /\/\* ==UserStyle==\n(?:@\w+ +?.+\n)+==\/UserStyle== \*\//;
        if (userStyleDetect.test(fileData)) {
          const matched = fileData.match(userStyleDetect);
          console.log(matched[0]);
        }
      }
    }
  }
};

(async function() {
  await getFiles();
});

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
      files: "**/*.html",
      options: {
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: "css",
      },
    },
    {
      files: "**/*.js",
      options: {
        trailingComma: "es5",
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
      files: [ "**/*.user.css" ],
      options: {
        rangeStart: 12
      }
    },
    {
      files: "**/Bitwarden_Vault_Full_Width.user.css",
      options: {
        rangeStart: 13
      }
    },
    {
      files: "**/aetherlink_additions.user.js",
      options: {
        rangeStart: 20
      }
    },
    {
      files: "**/adfocus_link_remover.user.js",
      options: {
        rangeStart: 19
      }
    }
  ],
};
