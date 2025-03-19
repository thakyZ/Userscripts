// ==UserScript==
// @name         Bot Sentinel Move Elements
// @namespace    NekoBoiNick.Web
// @version      1.0.1
// @description  Tries to move all the elements regarding the Bot Sentinel extension on Twitter
// @author       Neko Boi Nick
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/botsentinel_moveelements/botsentinel_moveelements.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/botsentinel_moveelements/botsentinel_moveelements.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /** @type {number} */
  let id = -1;

  id = setInterval(() => {
    /** @type {JQuery<HTMLDivElement>} */
    const div = $("div.bot-sentinel-account-status");

    if (div.length > 0) {
      /* Unknown code.
       * $(div).each((i, e) => {
       *   const divPrev = $(e).prev();
       *   if ($(divPrev).text().match("^@[a-zA-Z0-9]+") && $(divPrev).find("a[tabindex=\"-1\"") !== undefined) {
       *
       *   }
       * });
       */
      $(div).css({ "max-height": "20px" });
      clearInterval(id);
    }
  }, 100);
});
