// ==UserScript==
// @name         Steam Url Filter Bypasser
// @namespace    NekoBoiNick.Steam.UrlFilteBbypass
// @version      0.1
// @description  Simple script to bypass steam url filter.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/linkfilter/*
// @license      MIT
// @grant        none
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var regex = new RegExp("^https:\\/\\/steamcommunity.com\\/linkfilter\\/\\?url=","g");

  window.location.assign(window.location.href.replace(regex,""));
})();
