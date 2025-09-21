/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../library/nekogaming.userscript.lib.d.ts" />
import { OptionalNumberLike, OptionalString } from "../library/nekogaming.userscript.lib.d.ts";
import type { JQueryStatic, JQueryFunction } from "jquery";
// eslint-disable-next-line camelcase
import type { GM_config } from "./gm_config";

interface NekoGamingUserScriptLibrary {
  /**
   *
   * @param window
   * @param jquery
   */
  // eslint-disable-next-line no-unused-vars
  init(window?: (Window & typeof globalThis), jquery?: JQueryStatic): void;
}

interface globalThis {
  $: JQueryStatic;
  // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line camelcase
    config: typeof GM_config,
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
  // eslint-disable-next-line no-unused-vars
  width(font: OptionalString, size: OptionalNumberLike): number;
}
