import lessVarToCssVar from "less-var-to-css-var";
import fs from "node:fs";
import path from "node:path";

async function getAllLessFiles() {
  const output = [];
  const lessDirectory = path.join(__dirname, "..", "..", "css", "less");
  const lessFiles = await fs.promises.readdir(lessDirectory);

  for await (const file of lessFiles) {
    try {
      const fileStat = await fs.promises.stat(file, { throwIfNoEntry: true });
      await fs.promises.access(file, fs.constants.X_OK || fs.constants.W_OK || fs.constants.R_OK);
      if (fileStat.isFile && file.endsWith(".user.less")) {
        output.push(file);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return output;
}

function makeCssVarName(file) {
  return file.replace(".user.less", "-css.user.less");
}

function convert(file) {
  return new Promise((resolve, reject) => {
    try {
      lessVarToCssVar({
        inputPath: file,
        outputPath: makeCssVarName(file),
        scopeTag: ":root",
        header: `@import "${path.relative(path.join(path.dirname(file), "variables.less"), path.dirname(file)).replace(/^\./, "")}";`,
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function compileCSS() {
  const lessFiles = await getAllLessFiles();

  const output = { error: {}, success: true, data: {} };

  for await (const file of lessFiles) {
    const _output = await convert(file);
    if (_output === true) {
      output.data[file] = true;
    } else {
      output.error[file] = _output;
      output.success = false;
      output.data[file] = false;
    }
  }

  return output;
}

export default {
  compile_css: () =>
    new Promise((resolve, reject) => {
      compileCSS()
        .then((output) => {
          if (output.success === false) {
            reject(output.error);
          } else {
            resolve(output.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
