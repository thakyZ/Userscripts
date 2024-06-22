// ==UserScript==
// @name         JSMacros Docs Fix
// @namespace    NekoBoiNick.Web.WagYourTail.JSMacros.Docs.Fix
// @version      1.0.0
// @description  The website for documenation of JSMacros has a bit of a bug this will fix it.
// @author       Neko Boi Nick
// @match        https://jsmacros.wagyourtail.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsmacros.wagyourtail.xyz
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/jsmacros_docs_fix/jsmacros_docs_fix.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/jsmacros_docs_fix/jsmacros_docs_fix.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  "use strict";

  const DEBUG = false;
  const REPATCH = false;

  function parseForDocLinks() {
    const anchors = document.querySelectorAll("a");
    const array = Array.from(anchors);

    if (array.length === 0) {
      throw new Error("Array is empty.");
    }

    const tempContextMenuCloseHandler = function(_) {
      window.removeEventListener("keyup", tempContextMenuCloseHandler, true);
      window.removeEventListener("mousedown", tempContextMenuCloseHandler, true);
      window.removeEventListener("focus", tempContextMenuCloseHandler, true);
    };

    const tempContextMenuHandler = function(e) {
      const $link = e.target;
      const href = $link.getAttribute("href");

      // Check if I have already done this
      if (href.startsWith("?/")) {
        return true; // Return if it doesn't need editing
      }

      const url = "?/" + href;
      $link.setAttribute("href", url);

      window.addEventListener("keyup", tempContextMenuCloseHandler, true);
      window.addEventListener("mousedown", tempContextMenuCloseHandler, true);
      window.addEventListener("focus", tempContextMenuCloseHandler, true);
    };

    const arrayFiltered = array.filter((x, i) => {
      const regex = /(?<!\?\/)\d/;
      const href = x.getAttribute("href");
      const test1 = regex.test(href);
      const { attributes: attrs } = x;

      if (attrs.length === 0 || typeof attrs === "undefined" || attrs === null) {
        if (DEBUG === true) {
          console.debug(`Attributes from element at index ${i} is null.`);
        }

        return false;
      }

      const onclickAttr = attrs.onclick;

      if (typeof onclickAttr === "undefined" || onclickAttr === null) {
        if (DEBUG === true) {
          console.debug(`Attributes from element at index ${i} does not contain key "onclick".`);
        }

        return false;
      }

      const test2 = onclickAttr.value === "openMain(this.href); return false;";
      return test1 && test2;
    });

    if (arrayFiltered.length === 0) {
      throw new Error("Array Filtered is empty.");
    }

    for (const [i, x] of Object.entries(arrayFiltered)) {
      const { attributes: attrs } = x;

      if (attrs.length === 0 || typeof attrs === "undefined" || attrs === null) {
        if (DEBUG === true) {
          console.debug(`Attributes from element at index ${i} is null.`);
        }

        continue;
      }

      const patchedAttr = attrs.nbn_patched;

      if (typeof patchedAttr !== "undefined" && patchedAttr !== null) {
        if (DEBUG === true) {
          console.debug(`Attributes from element at index ${i} does is already patched and contains key "nbn_patched".`);
        }

        if (REPATCH === false) {
          continue;
        } else {
          x.removeEventListener("contextmenu", tempContextMenuHandler, true);
          x.removeAttribute("nbn_patched");
        }
      }

      x.addEventListener("contextmenu", tempContextMenuHandler, true);
      x.setAttribute("nbn_patched", true);
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.target.id === "ClassList" || mutation.target.id === "EventList" || mutation.target.id === "LibraryList") {
          parseForDocLinks();
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = document.querySelector("body");
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    document.addEventListener("unload", (_event) => {
      observer.disconnect();
    });
  }

  function main() {
    setupMutationObserver();
  }

  main();
})();
