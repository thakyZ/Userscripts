import * as fs from "node:fs";
import * as glob from "glob";
import * as path from "node:path";
import * as process from "node:process";

type Metadata = {
  UserScript: object;
  OpenUserJS?: object;
};

type MetadataItem = {
  key?: string;
  value: string;
  keyword?: string;
  locale?: string;
};

function createUserScriptHeader(metaData: object): string {
  let header = "// ==UserScript==\n";

  for (const [item, data] of Object.entries(metaData)) {
    for (const subItem of data as MetadataItem[]) {
      if (subItem.key) {
        header += `// @${subItem.key} ${subItem.value}\n`;
      } else {
        header += `// @${item} ${subItem.value}\n`;
      }
    }
  }

  header += "// ==/UserScript==\n";

  return header;
}

async function generateUserScriptHeaders(globPattern: string, outputDir: string): Promise<void> {
  for await (const filePath of glob.iterate(globPattern)) {
    const parentDir = path.normalize(`${filePath}/../../`);

    try {
      const metaData = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Metadata;

      if (!metaData.UserScript) {
        continue;
      }

      const userScriptHeader = createUserScriptHeader(metaData.UserScript);

      const relativeFilePath = path.normalize(filePath).replace(parentDir, "");
      const outputFilePath = path.join(
        outputDir,
        path.dirname(relativeFilePath),
        `${path.basename(relativeFilePath, ".meta.json")}.user.js`,
      );

      if (fs.existsSync(outputFilePath)) {
        const existingContent = fs.readFileSync(outputFilePath, "utf-8");

        fs.writeFileSync(outputFilePath, `${userScriptHeader}\n${existingContent}`);
      }
    } catch (err) {
      console.error(err);
      continue;
    }
  }
}

const [, , sourcePattern, outputDir] = process.argv;

if (!sourcePattern || !outputDir) {
  throw new Error("Usage: npx ts-node create-headers.ts <source_pattern> <output_dir>");
}

generateUserScriptHeaders(sourcePattern, outputDir).then(() => {
  console.log("success");
}, () => {
  console.log("failed");
});
