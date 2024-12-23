import { isType } from "./asserts.js";

export type GenericObject = { [key: string]: any };
export type TGenericObject<T> = { [key: string]: T };
export type Nullable<T> = T | null | undefined;

export type CssObjectType = { [key: string | number | symbol]: { [key: string]: (string | number | { [key: string]: string | number }) } };

export interface CssObjectInterface {
  toString(): string;
  /* eslint-disable-next-line no-unused-vars */
  toRegExp(flags?: string): RegExp;
}
// /@media\sall\sand\s\(min-width:\s1024px\)\s\{\n\s*html\s\{\n\s*background:\s#212121;\n\s*\}\n\s*\}/gim,
// /@media\sall\sand\s\(min-width:\s1024px\)\s\{\n\s*html\s\{\n\s*background:\s#fff;\n\s*\}\n\s*\}\n\s*#content\s\{\n\s*color:\s#000;\n\s*}/gim,

export type RegExpFlags = "g" | "i" | "m" | "gi" | "im" | "gm" | "gim";

export class CssObject implements CssObjectInterface {
  private prototype: CssObjectType;
  private flagsRegExp: string | undefined;
  constructor(cssObject: CssObjectType, flags?: string) {
    this.prototype = cssObject;
    this.flagsRegExp = flags;
  }

  toString(): string {
    let output: string = "";

    for (const [key1, value1] of Object.entries(this.prototype)) {
      output += `${key1}{`;

      for (const [key2, value2] of Object.entries(value1)) {
        output += key2;

        if (typeof value2 === "string" || typeof value2 === "number") {
          output += `:${value2};`;
        } else if (isType<TGenericObject<string | number>>(value2)) {
          output += "{";

          for (const [key3, value3] of Object.entries(value2)) {
            output += `${key3}:${value3};`;
          }

          output += "}";
        }
      }

      output += "}";
    }

    return output;
  }

  toRegExp(flags?: RegExpFlags): RegExp {
    /* eslint-disable-next-line prefer-const */
    let output: string = "";

    // TODO: Finish building the RegExp class.

    return new RegExp(output, (flags ?? this.flagsRegExp) ?? "");
  }
}

export function transcribeObject<InObject, OutObject>(input: Record<keyof InObject, any>): OutObject {
  const output: Record<keyof InObject, any> = ({} as InObject);

  for (const key in input) {
    if (Object.hasOwn(input, key)) {
      output[key as keyof typeof input] = input[key as keyof typeof input];
    }
  }

  return (output as OutObject);
}
