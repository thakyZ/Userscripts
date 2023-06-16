// ==UserScript==
// @name         Poipiku Enable Context Menu
// @namespace    NekoBoiNick.Web.Poipiku.ContextMenuEnable
// @version      1.0.2
// @description  Enables the context menu on Poipiku
// @author       Neko Boi Nick
// @match        https://poipiku.com/*
// @match        https://poipiku.com/166698/5711723.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poipiku.com
// @grant        GM_addStyle
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
// - The @grant directives are needed to restore the proper sandbox.
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const setupMutationObserver = () => {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          $("body, .Wrapper").each((_, element) => {
            element.addEventListener("contextmenu", event => {
              event.stopImmediatePropagation();
            }, { capture: true });
            element.addEventListener("drag", event => {
              event.stopImmediatePropagation();
            }, { capture: true });
            element.addEventListener("dragstart", event => {
              event.stopImmediatePropagation();
            }, { capture: true });
            element.addEventListener("copy", event => {
              event.stopImmediatePropagation();
            }, { capture: true });
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  setupMutationObserver();
  GM_addStyle("*{user-select:text !important;-webkit-user-select:text !important;-moz-user-select:text !important !important;-ms-user-select:text !important;-webkit-touch-callout:text !important}");
});
