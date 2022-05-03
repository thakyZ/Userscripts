// ==UserScript==
// @name         Steam Workshop Downloader Ad Blocker
// @namespace    NekoBoiNick.SteamWorkshopDownloader.AdBlocker
// @version      0.3
// @description  Block ads from appearing on Steam Workshop Downloader
// @author       Neko Boi Nick
// @match        https://*steamworkshopdownloader.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamworkshopdownloader.io
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, waitForKeyElements */

(function() {
  $(document).ready(function(){
    'use strict';
    var mainContainer = $("main.container");

    var adBoard = mainContainer.find(".row.p-1");

    if (adBoard.length)
    {
      adBoard.hide();
    }
  });
})();
