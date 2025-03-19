// ==UserScript==
// @name         Steam Url Filter Bypasser
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Simple script to bypass steam url filter.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function () {
  "use strict";

  const regex = /^https:\/\/steamcommunity\.com\/linkfilter\//i;

  if (window.location.href.includes("/linkfilter/")) {
    if (window.location.href.includes("?url=")) {
      window.location.href = window.location.href.replace(/\?url=/g, "");
    }

    console.log(`Transfering to: https://${location.replace(regex, "")}`);
    window.location.assign(`https://${location.replace(regex, "")}`);
  }
})();
