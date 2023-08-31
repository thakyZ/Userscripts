// ==UserScript==
// @name         Discord Image Embed Zoom No Resize
// @namespace    NekoBoiNick.Web.Discord.ImageNoResize
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

  function removeResize(element, attribute) {
    if (element.length > 0) {
      const matches = $(element).attr(attribute).match(/(\?width=\d+&height=\d+)/i);

      if (matches !== null && matches.length >= 1) {
        $(element).attr(attribute, $(element).attr(attribute).replace(matches[0], ""));
      }
    }
  }

  function main() {
    const hasFocusLockDialog = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]").length === 1;

    if (hasFocusLockDialog) {
      const focusBox = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]");
      if (focusBox.length > 0) {
        const image = focusBox.find("div[class*=\"imageWrapper-\"]").find("img");
        if (image.length > 0) {
          removeResize(image, "src");
        } else {
          const gif = focusBox.find("video[aria-label=\"GIF\"]").parent().parent().find("a");
          const gifVideo = focusBox.find("video[aria-label=\"GIF\"]");
          removeResize(gif, "href");
          removeResize(gifVideo, "poster");
        }
      }
    }
  }

  function setupMutationObserver() {
    const config = { attributes: true, subtree: true, };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      main();
      observer.observe(document, config);
    });

    observer.observe(document, config);
  }

  setupMutationObserver();
});
