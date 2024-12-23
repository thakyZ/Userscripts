/* eslint-disable no-unused-vars, no-use-before-define */
import { } from "./gm_compat.d.ts";

declare global {
  export class CssObject implements CssObjectInterface {
    private prototype: CssObjectType;
    private flagsRegExp: string | undefined;
    constructor(cssObject: CssObjectType, flags?: string);
    toString(): string;
    toRegExp(flags?: RegExpFlags): RegExp;
  }

  declare class JQueryMultiReturn<R> {
    value: R;
    obj: JQuery;
    constructor(obj: JQuery, value?: R);
  }

  declare class JQueryStaticMultiReturn<R> {
    value: R;
    obj: JQueryStatic;
    constructor(obj: JQueryStatic, value?: R);
  }

  declare interface JQueryStatic {
    createElement<JElement extends Element = HTMLElement>(resource: string, replaceObj?: Record<string, string | number>): JQueryStaticMultiReturn<undefined | JElement>;
    getUserNameAlts(site: string, id: string): Promise<JQueryStaticMultiReturn<Record<number, string>>>;
    makeRequest(request: INetworkRequest): Promise<JQueryStaticMultiReturn<INetworkResponse<any>>>
    toggleDebug(): JQueryStaticMultiReturn<boolean>;
    sleep(ms: number): JQueryStaticMultiReturn<Promise<void>>;
  }

  declare interface JQuery {
    outerHtml(): JQueryMultiReturn<string>;
    hasAttr(name: string): JQueryMultiReturn<boolean>;
    hasAttrs(...names: string[]): JQueryMultiReturn<boolean>;
    setData(name: string, data: object): JQuery;
    textWidth(): JQueryMultiReturn<number | undefined>;
    addData(name: string, data: object): JQuery;
    removeAnyData(name: string, ...keys: string[]): JQuery;
    modifyStyle(name: string): JQuery;
    getObjectAttr(...args: any[]): JQueryMultiReturn<Record<string, string | undefined> | undefined>;
    onlyText(): JQueryMultiReturn<string>;
    detectOriginalText(selector: string): JQueryMultiReturn<boolean>;
    appendCssBlock(css: CssObject, id?: string): JQuery;
    getFirstIndex(index: number): JQuery;
    getLastIndex(index: number): JQuery;
  }

  declare interface Window {
    jQuery: any;
    $: any;
    fancybox: any;
    currentAthlete: any;
    pageView: any; // Allow access of window.pageView where page wiew
    googleMapsApiLoaded: () => void;
    __elevate_bridge__: any; // Used to pass data through the window object with a king of "bridge"
    unescape(str: string): string; // Allow access of window.pageView where page wiew
    NbnUserScripts: {
      [key: string | number | symbol]: any;
      Debug: boolean;
    };
  }
}
