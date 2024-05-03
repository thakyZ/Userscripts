import { WebpackPluginInstance, Compiler } from "webpack";
import { SupportInfo, format, getSupportInfo } from "prettier";
import * as path from "node:path";
import * as fs from "node:fs";

export default class PrettierPlugin implements WebpackPluginInstance {
  DEFAULT_EXTENSIONS: string[] = [".css", ".graphql", ".js", ".json", ".jsx", ".less", ".sass", ".scss", ".ts", ".tsx", ".vue", ".yaml"]

  constructor() {
    (async () => {
      const supportInfo: SupportInfo = await getSupportInfo();
      const langs: string[] | undefined = supportInfo.languages
        .map(l => l.extensions)
        .reduce((a, b) => (a ?? []).concat(b ?? []), []);
      if (typeof langs !== "undefined") {
        this.DEFAULT_EXTENSIONS = langs;
      }
    })();
  }

    encoding: string = "utf-8";

    apply(compiler: Compiler): void {
        compiler.hooks.emit.tap("PrettierPlugin", async (compilation) => {
            const promises: Promise<void>[] = [];
            for (const filepath of compilation.fileDependencies) {
                if (this.DEFAULT_EXTENSIONS.some(ext => filepath.endsWith(ext))) {
                    await this.formatFile(filepath);
                }
            }
            return Promise.all(promises);
        });
    }

    async formatFile(filepath: string): Promise<void> {
        try {
            if (/node_modules/.exec(filepath)) {
                return;
            }
            console.log(filepath);
            const content = await fs.readFile(filepath, { encoding: 'utf-8' });
            const formatted = format(content, {
                filepath,
                // parser: path.extname(filepath) === ".ts" ? "typescript" : undefined,
                // plugins: [
                //     "asyncGenerators",
                //     "bigInt",
                //     "classProperties",
                //     "classPrivateProperties",
                //     "classPrivateMethods",
                //     "decorators",
                //     "doExpressions",
                //     "dynamicImport",
                //     "exportDefaultFrom",
                //     "exportNamespaceFrom",
                //     "functionBind",
                //     "functionSent",
                //     "importMeta",
                //     "logicalAssignment",
                //     "nullishCoalescingOperator",
                //     "numericSeparator",
                //     "objectRestSpread",
                //     "optionalCatchBinding",
                //     "optionalChaining",
                //     "partialApplication",
                //     "pipelineOperator",
                //     "throwExpressions",
                // ],
            });
            try {
                await fs.writeFile(filepath, formatted, { encoding: 'utf-8' });
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }

    }

}
