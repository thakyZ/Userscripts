// ==UserScript==
// @name         Steam Workshop Downloader Ad Blocker
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Block ads from appearing on Steam Workshop Downloader
// @author       Neko Boi Nick
// @match        https://*steamworkshopdownloader.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamworkshopdownloader.io
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  const adBoard = $("main.container .row.p-1");
  if (adBoard.length > 0) {
    adBoard.hide();
  }
});
