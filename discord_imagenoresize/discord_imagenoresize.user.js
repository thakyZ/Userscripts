// ==UserScript==
// @name         Discord Image Embed Zoom No Resize
// @namespace    NekoBoiNick.Web.Discord.ImageNoResize
// @version      1.0.0
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
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  function main() {
    const hasFocusLockDialog = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]").length === 1;

    if (hasFocusLockDialog) {
      const image = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]").find("div[class*=\"imageWrapper-\"]").find("img");
      const matches = $(image).attr("src").match(/(\?width=\d+&height=\d+)/i);

      if (matches !== null && matches.length >= 1) {
        $(image).attr("src", $(image).attr("src").replace(matches[0], ""));
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
