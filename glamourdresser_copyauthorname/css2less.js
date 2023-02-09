const css2less = require("css2less");
const fs = require("fs").promises;
const path = require("path");
const options = {};

const run = async () => {
  const cssFile = await fs.readFile(path.join(__dirname, "scss", "app.min.css"), { encoding: "utf-8", flag: "r+" });
  const cssString = cssFile.toString();
  const result = css2less(cssString, options);
  await fs.writeFile(path.join(__dirname, "dark_admin_new.less"), result, { encoding: "utf-8", flag: "w+" });
};

run();
