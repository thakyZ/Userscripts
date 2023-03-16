// ==UserScript==
// @name         No Old Reddit
// @namespace    NekoBoiNick.Reddit.NoOld
// @version      0.1.1
// @description  Changes links that redirect to old reddit so that they use the new design
// @author       Neko Boi Nick
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
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
  const regex = /^https?:\/\/(np|old)\.reddit\.com/g;
  for (let index = 0; index < anchors.length; index++) {
    const attr = $(anchors[index]).attr("href");
    if (typeof attr !== "undefined" && attr !== false && regex.test($(anchors[index]).attr("href"))) {
      $(anchors[index]).attr("href", $(anchors[index]).attr("href").replace(regex, "https://reddit.com"));
    }

    if (regex.test($(anchors[index]).text())) {
      $(anchors[index]).text($(anchors[index]).text().replace(regex, "https://reddit.com"));
    }
  }
});
