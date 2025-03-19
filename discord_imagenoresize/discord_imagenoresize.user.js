// ==UserScript==
// @name         Discord Image Embed Zoom No Resize
// @namespace    NekoBoiNick.Web
// @version      1.0.0.1
// @description  Disables the resizing of images when clicking the embedded image in discord.
// @author       Neko Boi Nick
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/discord_imagenoresize/discord_imagenoresize.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/discord_imagenoresize/discord_imagenoresize.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  let downloadLinkHeight = 0;

  function removeResize(element, attribute) {
    const originalSource = element.attr(attribute);
    if (/(\?|&)width=\d+/ig.test(originalSource) || /(\?|&)height=\d+/ig.test(originalSource) || /(\?|&)format=(?!\?|&|$)\w+/ig.test(originalSource)) {
      const newSource = originalSource.replaceAll(/(\?|&)width=\d+/ig, "").replaceAll(/(\?|&)height=\d+/ig, "").replaceAll(/(\?|&)format=(?!\?|&|$)\w+/ig, "");
      element.attr(attribute, newSource);
    }

    if (typeof element.attr("width") !== "undefined") {
      element.removeAttr("width");
    }

    if (typeof element.attr("height") !== "undefined") {
      element.removeAttr("height");
    }

    if (typeof element.attr("style") !== "undefined") {
      const originalStyle = element.attr("style");
      const newStyle = originalStyle.replaceAll(/width: [^;]+;/ig, "").replaceAll(/height: [^;]+;/ig, "");
      if (/^\s*$/.test(newStyle)) {
        element.removeAttr("style");
      } else {
        element.attr("style", newStyle);
      }
    }

    const parentWrapper = element.closest("div[class*=\"imageWrapper\"]");
    if (parentWrapper.length === 1) {
      // Old code.
      // const originalStyle = parentWrapper.attr("style");
      // if (typeof originalStyle !== "undefined" && (/width: [^;]+;/ig.test(originalStyle) || /height: [^;]+;/ig.test(originalStyle))) {
      //   const newStyle = originalStyle.replaceAll(/width: [^;]+;/ig, "").replaceAll(/height: [^;]+;/ig, "");
      //   if (/^\s*$/.test(newStyle)) {
      //     parentWrapper.removeAttr("style");
      //   } else {
      //     parentWrapper.attr("style", newStyle);
      //   }
      // }

      /** @type {Number} */
      const oldWidth = parentWrapper.css("width");
      /** @type {Number} */
      const oldHeight = parentWrapper.css("height");
      /** @type {Number} */
      const appWidth = $("#app-mount").prop("clientWidth");
      /** @type {Number} */
      const appHeight = $("#app-mount").prop("clientHeight");
      /** @type {Number} */
      const newWidth = appWidth;
      /** @type {Number} */
      const newHeight = appHeight;

      parentWrapper.css({
        width: newWidth,
        height: newHeight,
      });

      if (downloadLinkHeight === 0 && downloadLinkHeight !== -1) {
        const downloadLink = parentWrapper.next();
        if (downloadLink.length === 1 && downloadLink.is("a[class*=\"downloadLink\"]")) {
          downloadLinkHeight = downloadLink.clientHeight;
        } else if (downloadLink.length >= 1) {
          console.warn("More than 1 next element after parentWrapper");
          downloadLinkHeight = -1;
        }
      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const target = $(mutation.target);
        if (target.is("img:not([nbn_patched])") && target.parent().is("div[class*=\"focusLock\"] > div > div[class*=\"wrapper\"] > div[class*=\"imageWrapper\"] > div[class*=\"loadingOverlay\"]")) {
          removeResize(target, "src");
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = document.querySelectorAll("body > div#app-mount");

    if (targetNode.length === 0) {
      console.error("Could not find discord #app-mount element");
      return;
    }

    const config = { attributes: true, subtree: true };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode[0], config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
