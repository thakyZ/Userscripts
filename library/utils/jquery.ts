import { CssObject, TGenericObject } from "./object.js";
import { INetworkRequest, INetworkResponse, NetworkRequest, makeRequest } from "./network.js";
import { assertIsString, assertIsType } from "./asserts.js";
import jQuery from "jquery";
import { measureStringWidth } from "./string.js";

/* eslint-disable no-unused-vars */

export type JQuery<TElement extends Element = HTMLElement> = globalThis.JQuery<TElement>;
export type JQueryStatic = globalThis.JQueryStatic;
export type { JQueryStatic as $ };
export { jQuery };
export type DataElementRecord = Record<string, string | number | boolean | symbol | object | null>;

export class JQueryMultiReturn<R, TElement extends Element = any> {
  value?: R;
  obj: JQuery<TElement>;
  constructor(obj: JQuery<TElement>, value?: R) {
    this.value = value;
    this.obj = obj;
  }
}

export class JQueryStaticMultiReturn<R> {
  value?: R;
  obj: JQueryStatic;
  constructor(obj: JQueryStatic, value?: R) {
    this.value = value;
    this.obj = obj;
  }
}

// #region Static Method
jQuery.extend($, {
  createElement<TElement extends Element = HTMLElement>(this: JQueryStatic, resource: string, replaceObj: TGenericObject<string> = {}): JQueryStaticMultiReturn<TElement | undefined> {
    const templateHtml = GM_getResourceText(resource);

    if (templateHtml === "") {
      return new JQueryStaticMultiReturn<TElement | undefined>(this, undefined);
    }

    const templateTruncated: string = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "").replaceAll(/\r?\n<\/template>$/gi, "");
    const divTemplate: JQuery<HTMLDivElement> = $<HTMLDivElement>("<div></div>").append($(templateTruncated).clone());
    let divTemplateHTML: string = $(divTemplate).html();

    for (const [key, value] of Object.entries(replaceObj)) {
      divTemplateHTML = divTemplateHTML.replaceAll(key, value);
    }

    return new JQueryStaticMultiReturn(this, $<TElement>(divTemplateHTML)[0]);
  },
  async getUserNameAlts(this: JQueryStatic, site: string, id?: string): Promise<JQueryStaticMultiReturn<Record<number, string>>> {
    let userNameAlt: Record<number, string> = {};
    const request: INetworkRequest<Record<number, string>> = {
      method: "GET",
      url: "https://api.nekogaming.xyz/ffxiv/modding/names/get.php",
      data: ({ type: "uri", q: site } as Record<string, any>),
      responseType: "json",
      timeout: 2000
    };

    if (id && request.data) {
      assertIsType<Record<string, any>>(request.data);
      request.data["id"] = id;
    }

    const response: INetworkResponse<Record<number, string>> = await makeRequest<Record<number, string>>(new NetworkRequest(request));

    userNameAlt = (JSON.parse(response.responseText) as Record<number, string>);

    return new JQueryStaticMultiReturn(this, userNameAlt);
  },
  async makeRequest(this: JQueryStatic, request: INetworkRequest): Promise<JQueryStaticMultiReturn<INetworkResponse>> {
    const req = await makeRequest(new NetworkRequest(request));

    return new JQueryStaticMultiReturn(this, req);
  },
  detectOriginalText<TElement extends Element = HTMLElement>(this: JQueryStatic, query: string): JQueryStaticMultiReturn<TElement> {
    if (window.NbnUserScripts.Debug) {
      console.log(`detectedStrings : ${$<TElement>(query).length}`);
    }

    return new JQueryStaticMultiReturn(this, $<TElement>(query)[0]);
  },
  toggleDebug(this: JQueryStatic): JQueryStaticMultiReturn<boolean> {
    window.NbnUserScripts.Debug ||= false;

    window.NbnUserScripts.Debug = !window.NbnUserScripts.Debug;

    return new JQueryStaticMultiReturn(this, window.NbnUserScripts.Debug);
  },
  /**
   * Sleep until number of milliseconds are over.
   * @param ms Milliseconds to wait to continue.
   * @returns The completed sleep task.
   */
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
});
// #endregion

// #region Instanced Methods
jQuery.fn.extend({
  outerHtml<TElement extends Element = HTMLElement>(this: JQuery<TElement>): JQueryMultiReturn<string> {
    return new JQueryMultiReturn<string>(this, $<HTMLDivElement>("<div></div>").append(this.eq(0).clone()).html());
  },
  hasAttr<TElement extends Element = HTMLElement>(this: JQuery<TElement>, name: string): JQueryMultiReturn<boolean> {
    if (typeof this.attr(name) === "undefined") {
      return new JQueryMultiReturn(this, false);
    }

    assertIsString(this.attr(name));

    return new JQueryMultiReturn(this, true);
  },
  hasAttrs<TElement extends Element = HTMLElement>(this: JQuery<TElement>, ...names: string[]): JQueryMultiReturn<boolean> {
    for (const name of names) {
      if (!this.hasAttr(name)) {
        return new JQueryMultiReturn(this, false);
      }

      assertIsString(this.attr(name));
    }

    return new JQueryMultiReturn(this, true);
  },
  setData<TElement extends Element = HTMLElement>(this: JQuery<TElement>, name: string, data: DataElementRecord): JQuery<TElement> {
    this.each((_: number, element: TElement) => {
      let prevData: DataElementRecord = $(element).data(name) ? ($(element).data(name) as DataElementRecord) : {};

      if (!prevData) {
        $(element).data(name, {});
        prevData = {};
      }

      for (const [key, value] of Object.entries(data)) {
        prevData[key] = value;
      }

      $(element).data(name, prevData);
    });

    return this;
  },
  textWidth<TElement extends Element = HTMLElement>(this: JQuery<TElement>): JQueryMultiReturn<number | undefined> {
    return new JQueryMultiReturn(this, measureStringWidth(this.html()));
  },
  addData<TElement extends Element = HTMLElement>(this: JQuery<TElement>, name: string, data: DataElementRecord): JQuery<TElement> {
    this.each((_, element) => {
      const prevData: DataElementRecord = $(element).data(name) ? ($(element).data(name) as DataElementRecord) : {};

      if (!prevData) {
        $(element).data(name, {});
      }

      for (const [key, value] of Object.entries(data)) {
        if (!Object.hasOwn(prevData, key)) {
          prevData[key] = value;
        }
      }

      $(element).data(name, prevData);
    });

    return this;
  },
  removeAnyData<TElement extends Element = HTMLElement>(this: JQuery<TElement>, name: string, ...keys: string[]): JQuery<TElement> {
    this.each((_, element) => {
      const prevData: DataElementRecord = $(element).data(name) ? ($(element).data(name) as DataElementRecord) : {};

      for (const key of keys) {
        if (Object.hasOwn(prevData, key)) {
          delete prevData[key];
        }
      }

      $(element).data(name, prevData);
    });

    return this;
  },
  modifyStyle<TElement extends Element = HTMLElement>(this: JQuery<TElement>, name: string): JQuery<TElement> {
    this.each((_, element) => {
      const data = ($(element).data(name) as DataElementRecord);
      let stringBuilder = "";

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
          stringBuilder += `--${key}: ${value}; `;
        } else if (typeof value === "symbol") {
          stringBuilder += `--${key}: ${value.description}; `;
        } else if (typeof value === "object") {
          stringBuilder += `--${key}: ${JSON.stringify(value)}; `;
        }
      }

      $(element).text(`:root { ${stringBuilder}}`);
    });

    return this;
  },
  getObjectAttr<TElement extends Element = HTMLElement>(this: JQuery<TElement>, ...args: any[]): JQueryMultiReturn<TGenericObject<string | undefined> | undefined> {
    if (args.length === 0) {
      if (this.length === 0) {
        return new JQueryMultiReturn(this, undefined);
      }

      const obj: TGenericObject<string | undefined> = {};

      this.each((_, element) => {
        if ($(element).hasAttrs("specified", "name", "value")) {
          const attr: string | undefined = $(element).attr("name");

          assertIsString(attr);
          obj[attr] = $(element).attr("value");
        }
      });

      return new JQueryMultiReturn(this, obj);
    }

    return new JQueryMultiReturn(this, undefined);
  },
  onlyText<TElement extends Element = HTMLElement>(this: JQuery<TElement>): JQueryMultiReturn<string> {
    return new JQueryMultiReturn(this, this
      .clone() // Clone the element
      .children() // Select all the children
      .remove() // Remove all the children
      .end() // Again go back to selected element
      .text());
  },
  appendCssBlock<TElement extends Element = HTMLElement>(this: JQuery<TElement>, css: CssObject, id?: string): JQuery<TElement> {
    return this.append(`<style${id ? ` id="${id}"` : ""}>${css.toString()}</style>`);
  },
  getFirstIndex<TElement extends Element = HTMLElement>(this: JQuery<TElement>, index: number): JQuery<TElement> {
    const gottenIndex = this.get(index);

    if (!gottenIndex) {
      throw new Error(`Failed to get element at index ${index}.`);
    }

    return $<TElement>(gottenIndex);
  },
  getLastIndex<TElement extends Element = HTMLElement>(this: JQuery<TElement>, index: number): JQuery<TElement> {
    const gottenIndex = this.get(this.toArray().length - (index + 1));

    if (!gottenIndex) {
      throw new Error(`Failed to get element at index ${index}.`);
    }

    return $<TElement>(gottenIndex);
  },
});

// #endregion
