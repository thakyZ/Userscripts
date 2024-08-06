const fs = require("fs").promises;
const path = require("path");

async function handleMatches(matches, variables, doneAlready, lastCount) {
  if (matches !== null) {
    for (const match in matches) {
      if (Object.hasOwn(matches, match)) {
        if (!doneAlready.some((e) => e === matches[match])) {
          const gotMatch = matches[match];
          variables.push(`--temp_color-${lastCount}: ${gotMatch};`);
          doneAlready.push(gotMatch);
          lastCount += 1;
        }
      }
    }
  }

  return {
    variables,
    doneAlready,
    lastCount,
  };
}

async function run() {
  const cssFile = await fs.readFile(path.join(__dirname, "dark_admin.less"), {
    encoding: "utf-8",
    flag: "r+",
  });
  let cssFileChanged = cssFile.toString();
  const hexMatches = cssFileChanged.toString().match(/^\s+[\w-]+:.*\s?#[a-f0-9]{3,6}(;|\s)/gi);
  const hslMatches = cssFileChanged.toString().match(/hsl\(\d+(deg|rad), \d+%, \d+%\)/gi);
  const rgbMatches = cssFileChanged.toString().match(/rgb\(\d+, \d+, \d+\)/gi);
  const rgbaMatches = cssFileChanged.toString().match(/rgba\(\d+, \d+, \d+, \d+\.\d+\)/gi);
  const transMatches = cssFileChanged.toString().match(/transparent/gi);
  const rootStart = ":root {\n";
  const rootEnd = "\n}";
  let variables = [];
  let doneAlready = [];
  let lastCount = 0;

  const hexMatch = await handleMatches(hexMatches, variables, doneAlready, lastCount);
  variables = hexMatch.variables;
  doneAlready = hexMatch.doneAlready;
  lastCount = hexMatch.lastCount;

  const hslMatch = await handleMatches(hslMatches, variables, doneAlready, lastCount);
  variables = hslMatch.variables;
  doneAlready = hslMatch.doneAlready;
  lastCount = hslMatch.lastCount;

  const rgbMatch = await handleMatches(rgbMatches, variables, doneAlready, lastCount);
  variables = rgbMatch.variables;
  doneAlready = rgbMatch.doneAlready;
  lastCount = rgbMatch.lastCount;

  const rgbaMatch = await handleMatches(rgbaMatches, variables, doneAlready, lastCount);
  variables = rgbaMatch.variables;
  doneAlready = rgbaMatch.doneAlready;
  lastCount = rgbaMatch.lastCount;

  const transMatch = await handleMatches(transMatches, variables, doneAlready, lastCount);
  variables = transMatch.variables;
  doneAlready = transMatch.doneAlready;
  lastCount = transMatch.lastCount;

  const output = rootStart + "  " + variables.join("\n  ") + rootEnd;

  const lessVariables = [];

  if (variables.length > 0) {
    for (const variable in variables) {
      if (Object.hasOwn(variables, variable)) {
        const lessVariable = variables[variable].replaceAll(/^--([a-z0-9_-]+): .+$/gim, "$1");
        const color = variables[variable].replaceAll(/^--([a-z0-9_-]+): (.+);$/gim, "$2");
        const lessVariableCamel = lessVariable.replaceAll(/([-_][a-z0-9])/gi, (cases) =>
          cases
            .toUpperCase()
            .replaceAll("-", "")
            .replaceAll("_", "")
            .replaceAll(/^\w/gim, (cases2) => cases2.toUpperCase())
        );
        cssFileChanged = cssFileChanged.replaceAll(`${color}`, `@${lessVariableCamel}`);
        lessVariables.push(`@${lessVariableCamel}: var(--${lessVariable});`);
      }
    }
  }

  const lessOutput = lessVariables.join("\n  ");

  const outputFile = output + "\n" + lessOutput + "\n" + cssFileChanged;

  await fs.writeFile(path.join(__dirname, "dark_admin_new.less"), outputFile, {
    encoding: "utf-8",
    flag: "w+",
  });
}

run();
