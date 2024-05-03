/**
 * Neko Gaming UserScript Library.
 *
 * A library for use in UserScripts, made by Neko Boi Nick.
 *
 * @link      https://github.com/thakyZ/Userscripts/blob/master/library
 * @file      This files defines the MyClass class.
 * @author    Neko Boi Nick.
 * @since     <%= pkg.version %>
 * @copyright Neko Boi Nick 2023
 * @depends
 *   - jQuery 1.8+                     (http://api.jquery.com/)
 * @license   MIT https://nntoan.mit-license.org
 */

import { InvalidFileNameChars, FfxivModdingNameQuery, hasBooleanProperty, hasStringProperty } from "./data";
import { URL } from "node:url";
import jQuery, { default as $ } from "jquery";
const {  } = require("@userscripters/global-types");

if (typeof window !== "undefined") {
  window.onload = function () {
    if (typeof jQuery === "undefined") {
      console.warn("JQuery not loaded do not process.");
    }
  };
}

const monkey = () => {
  TamperMonkey.
};

type GenericData = { [key: string]: unknown };
type StringData = { [key: string]: string };
type GetHttpMethod = "GET" | "Get" | "get";
type PostHttpMethod = "POST" | "Post" | "post";
type PatchHttpMethod = "PATCH" | "Patch" | "patch";
type PutHttpMethod = "PUT" | "Put" | "put";
type DeleteHttpMethod = "DELETE" | "Delete" | "delete";
type HeadHttpMethod = "HEAD" | "Head" | "head";
type OptionsHttpMethod = "OPTIONS" | "Options" | "options";
type HttpMethod = GetHttpMethod | PostHttpMethod | PatchHttpMethod | PutHttpMethod | DeleteHttpMethod | HeadHttpMethod | OptionsHttpMethod;
type ObjectAttribute = { attributes: { specified: boolean, name: string, value: string }[] };

export type { GenericData, StringData, HttpMethod, ObjectAttribute }

/**
 *
 */
export class NekoGamingLib {
  private static debug = false;

  /* (Old) Pulled from stack overflow: https://stackoverflow.com/a/2771544/1112800
  *
  * $.textWidth = () => {
  *   const htmlOrg = $(this).html();
  *   const htmlCalc = `<span>${htmlOrg}</span>`;
  *   $(this).html(htmlCalc);
  *   const width = $(this).find("span:first").width();
  *   $(this).html(htmlOrg);
  *   return width;
  * };
  */

  public static init(jquery: JQuery) {
    Object.keys(NekoGamingLib).forEach((element: string) => {
      jquery.fn[element] = Object.keys(NekoGamingLib)[element];
    });
  }

  /**
   * Function to get the width of the text provided.
   * @param {string} font A valid font name. Fallbacks are handled by the browser. Undefined uses "arial"
   * @param {number} size The size of the font (if typeof number is provided pixels will be used, and if nothing is provided 12px size will be used)
   * @returns {number} The width of the font.
   */
  private static textWidth(this: string, font: string = "arial", size: number = 12): number {
    const s: string = `${size}px`;
    const o: JQuery<HTMLElement> = $("<div></div>")
      .text(this)
      .css({ position: "absolute", float: "left", whiteSpace: "nowrap", visibility: "hidden", font: `${s} ${font}` })
      .appendTo($("body"));
    const w: number | undefined = o.width();

    o.remove();
    if (typeof w === "undefined") {
      return -1;
    }
    return w;
  }

  public static checkInvalidChars(this: string, replaceWith = ""): string {
    let output = this;

    for (const char of InvalidFileNameChars) {
      output = output.replaceAll(char, replaceWith);
    }

    return output;
  }

  public static isASCII(this: string, extended: boolean = false): boolean {
    // eslint-disable-next-line no-control-regex
    return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(this);
  }

  public static checkInvalidAscii(this: string, replaceWith: string = "", extended: boolean = false): string {
    let output = this;

    for (const i in output.split("")) {
      if (isNaN(Number(i)) || !Object.hasOwn(output.split(""), i)) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(output, i) && !NekoGamingLib.isASCII(output[i], extended)) {
        output = output.replaceAll(output[i], replaceWith);
      }
    }

    return output;
  }

  public static setData(this: JQuery<HTMLElement[]>, name: string, data: GenericData): JQuery<HTMLElement>[] {
    $(this).each((_, _element) => {
      const prevData = $(_element).data(name) === undefined ? {} : $(this).data(name);
      if (prevData === undefined) {
        $(_element).data(name, {});
      }

      for (const [key, value] of Object.entries(data)) {
        if (Object.prototype.hasOwnProperty.call(data, key) || !Object.prototype.hasOwnProperty.call(data, key)) {
          prevData[key] = value;
        }
      }

      $(_element).data(name, prevData);
    });

    return this;
  }

  public static addData(this: JQuery<HTMLElement[]>, name: string, data: GenericData): JQuery<HTMLElement>[] {
    $(this).each((_, _element) => {
      const prevData = $(_element).data(name) === undefined ? {} : $(this).data(name);
      if (prevData === undefined) {
        $(_element).data(name, {});
      }

      for (const [key, value] of Object.entries(data)) {
        if (!Object.prototype.hasOwnProperty.call(prevData, key)) {
          prevData[key] = value;
        }
      }

      $(_element).data(name, prevData);
    });
    return this;
  }

  public static removeData(element: JQuery<HTMLElement>[], name: string, keys: string[]): JQuery<HTMLElement>[] {
    $(element).each((_, _element) => {
      const prevData = $(_element).data(name) === undefined ? {} : $(_element).data(name);

      for (const key of keys) {
        if (Object.hasOwn(prevData, key)) {
          prevData.delete(key);
        }
      }

      $(_element).data(name, prevData);
    });
    return element;
  }

  public static modifyStyle(element: JQuery<HTMLElement>[], name: string): JQuery<HTMLElement>[] {
    $(element).each((_, _element) => {
      const data = $(_element).data(name);
      let stringBuilder = "";
      for (const [key, value] of Object.entries(data)) {
        stringBuilder += `--${key}: ${value}; `;
      }

      $(_element).text(`:root { ${stringBuilder}}`);
    });
    return element;
  }

  public static makeRequest(method: HttpMethod, url: URL, headers: StringData | undefined = undefined, body: Document | XMLHttpRequestBodyInit | null | undefined = undefined): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onload = function (_ev: ProgressEvent<EventTarget>): void {
        if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
          resolve(this);
        } else {
          reject(new Error(`XMLHttpRequest responded with status code, ${this.status}, and message ${this.statusText}`));
        }
      };

      xhr.onerror = function(_ev: ProgressEvent<EventTarget>): any {
        reject(new Error(`XMLHttpRequest responded with status code, ${this.status}, and message ${this.statusText}`));
      };

      xhr.ontimeout = function(_ev: ProgressEvent<EventTarget>): any {
        reject(new Error("XMLHttpRequest timed out after some time."));
      };

      if (typeof headers !== "undefined") {
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value.toString());
        }
      }

      xhr.open(method, url.toString());
      xhr.send(body);
    });
  }

  public static createElement(resource: string, replaceObj: StringData = {}): JQuery<HTMLElement> | undefined {
    const templateHtml = GM_getResourceText(resource);

    if (templateHtml === "" || typeof templateHtml === "undefined") {
      return undefined;
    }

    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "").replaceAll(/\r?\n<\/template>$/gi, "");
    let template = $("<div />").append($(templateTruncated).clone()).html();
    for (const [key, value] of Object.entries(replaceObj)) {
      template = template.replaceAll(key, value);
    }

    return $(template);
  }

  public static async getUserNameAlts (site: URL, id: number, responseType: "arraybuffer" | "blob" | "json" | "stream" = "stream", fallback: string) {
    let userNameAlt: FfxivModdingNameQuery = { error: true };
    const hostname: string | null = site.hostname;
    if (hostname === null) {
      throw new Error("Failed to get host name from site url.")
    }
    const safeSiteString: string = encodeURIComponent(hostname)
    const apiUrl = new URL(`https://api.nekogaming.xyz/ffxiv/modding/names/get.php?q=${safeSiteString}&id=${id}`);
    if (typeof GM === "undefined" || typeof GM.xmlHttpRequest === "undefined") {
      try {
        const req: XMLHttpRequest = await NekoGamingLib.makeRequest("GET", apiUrl);
        userNameAlt = (JSON.parse(req.responseText) as FfxivModdingNameQuery);
      } catch (error) {
        console.error("Failed to get the user's avatar. (Non-GreaseMonkey)", error);
      }
    } else {
      try {
        const details: Request<any> = {
          method: "GET",
          url: apiUrl.toString(),
          responseType: responseType,
          timeout: 2000
        }
        const request: Response<any> = await GM.xmlHttpRequest(details);
        if (request.readyState === ReadyState.Done && request.status >= 200 && request.status < 300) {
          if (responseType === "json") {
            userNameAlt = request.response;
          } else {
            userNameAlt = JSON.parse(request.responseText);
          }
        }
      } catch (error) {
        console.error("Failed to get the user's avatar. (GreaseMonkey)", error);
      }
    }

    if (Object.hasOwn(userNameAlt, id)) {
      return userNameAlt[id];
    }

    return NekoGamingLib.checkInvalidAscii(NekoGamingLib.checkInvalidChars(fallback));
  }

  public static getObjectAttr(objectsToCheck: ObjectAttribute[], ...args: string[]): GenericData | null {
    const obj: GenericData = {};
    if (args.length === 0) {
      if (objectsToCheck.length === 0) {
        return null;
      }

      for (const valueOuter of objectsToCheck) {
        for (const valueInner of valueOuter.attributes) {
          if (valueInner.specified) {
            obj[valueInner.name] = valueInner.value;
          }
        }
      }
    }
    return obj;
  }

  public static onlyText($element: JQuery<HTMLElement>) {
    return jQuery($element)
      .clone() // Clone the element
      .children() // Select all the children
      .remove() // Remove all the children
      .end() // Again go back to selected element
      .text() // Get the text;
      .trim() // Trim any whitespace
  }
}

// eslint-disable-next-line no-shadow-restricted-names
jQuery(($: JQueryStatic): void => {
  "use strict";

  $.fn.;

  $.fn.detectOriginalText = function ($class) {
    if (debug) {
      console.log(`detectedStrings : ${$($class).length}`);
    }

    return $($class);
  };

  $.fn.toggleDebug = function () {
    debug = !debug;
  };
});
