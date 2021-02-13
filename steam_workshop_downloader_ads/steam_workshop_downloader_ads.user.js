// ==UserScript==
// @name         Steam Workshop Downloader Ad Blocker
// @namespace    NekoBoiNick.SteamWorkshopDownloader.AdBlocker
// @version      0.2
// @description  Block ads from appearing on Steam Workshop Downloader
// @author       Neko Boi Nick
// @match        https://*steamworkshopdownloader.io/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @license      MIT
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/steam_workshop_downloader_ads/steam_workshop_downloader_ads.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, waitForKeyElements */

(function() {
  $(document).ready(function(){
    'use strict';
    var mainContainer = $("main.container");

    var adBoard = mainContainer.children(".row[style='opacity: 0.93;']");

    if (adBoard.length)
    {
      adBoard.hide();
    }
  });
})();
