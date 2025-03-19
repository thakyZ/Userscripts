/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./gm_config.d.ts" />
/// <reference path="../library/nekogaming.userscript.lib.d.ts" />
import { OptionalNumberLike, OptionalString } from "../library/nekogaming.userscript.lib.d.ts";
import { JQueryStatic, JQueryFunction } from "jquery";

interface NekoGamingUserScriptLibrary {
  /**
   *
   * @param _window
   * @param _jquery
   */
  init(_window?: (Window & typeof globalThis), _jquery?: JQueryStatic): void;
}

interface globalThis {
  $: JQueryStatic;
  jQuery: ($: JQueryStatic) => void;
}

interface jQuery {
  fn: JQueryFunction;
}

interface Window {
  /**
   *
   */
  nbn: {
    /**
     *
     */
    lib: NekoGamingUserScriptLibrary,
    /**
     *
     */
    config: GM_config,
    [key: string]: unknown,
  };
}

interface String {
  /**
   * Function to get the width of the text provided.
   *
   * @param font A valid font name. Fallbacks are handled by the browser.
   *   Undefined uses "arial"
   * @param size The size of the font (if typeof number is provided pixels
   *   will be used, and if nothing is provided 12px size will be used)
   * @returns The width of the font.
   */
  width(font: OptionalString, size: OptionalNumberLike): number;
}
