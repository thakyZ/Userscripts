// ==UserScript==
// @name         No Old Reddit
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Changes links that redirect to old reddit so that they use the new design
// @author       Neko Boi Nick
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  const anchors = $("a");
  const regex = /^https?:\/\/(np|old)\.reddit\.com/i;
  for (const [, anchor] of Object.entries(anchors)) {
    const attr = $(anchor).attr("href");
    if (typeof attr !== "undefined" && attr !== false && regex.test($(anchor).attr("href"))) {
      $(anchor).attr("href", $(anchor).attr("href").replace(regex, "https://reddit.com"));
    }

    if (regex.test($(anchor).text())) {
      $(anchor).text($(anchor).text().replace(regex, "https://reddit.com"));
    }
  }
});
