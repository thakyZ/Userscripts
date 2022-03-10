// ==UserScript==
// @name         Steam Url Filter Bypasser
// @namespace    NekoBoiNick.Web.Steam.UrlFilterBypass
// @version      0.3.0
// @description  Simple script to bypass steam url filter.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/*
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var regex = new RegExp("^https:\\/\\/steamcommunity.com\\/linkfilter\\/","g");

  if (window.location.href.includes("/linkfilter/")) {
    var location = window.location.href;

    if (window.location.href.includes("\?url=")) {
      location = location.replace(/\?url=/g, "");
    }

    console.log(`Transfering to: https://${location.replace(regex,"")}`);
    window.location.assign(`https://${location.replace(regex,"")}`);
  }
})();
