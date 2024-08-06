/* eslint-disable no-unused-vars */
import { CssObject, TGenericObject } from "../library/utils/object.ts";
import { JQueryMultiReturn, JQueryStaticMultiReturn } from "../library/utils/jquery.ts";
import { GMCompatAPI } from "./gm_compat.d.ts";

declare global {
  declare interface JQueryStatic {
    createElement<JElement extends Element = HTMLElement>(resource: string, replaceObj?: TGenericObject<string>): JQueryStaticMultiReturn<undefined | JElement>;
    getUserNameAlts(site: string, id: string): JQueryStaticMultiReturn<Promise<string>>;
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
    getObjectAttr(...args: any[]): JQueryMultiReturn<TGenericObject<string | undefined> | undefined>;
    onlyText(): JQueryMultiReturn<string>;
    detectOriginalText(selector: string): JQueryMultiReturn<boolean>;
    appendCssBlock(css: CssObject, id?: string): JQuery;
    getIndex(index: number): JQuery;
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

  declare const GMCompat: GMCompatAPI;
}
