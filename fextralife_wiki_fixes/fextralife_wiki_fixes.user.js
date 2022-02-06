// ==UserScript==
// @name         fExtra Life Wiki Fixes
// @namespace    NekoBoiNick.FExtraLife.Wiki.Fixes
// @version      1.0.1
// @description  Trys to fix some issues about fExtra Life's wiki pages.
// @author       NekoBoiNick
// @match        https://*.wiki.fextralife.com/*
// @grant        GM_log
// @run-at       document-start
// @noframes
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
//  'use strict';

  var otherSearchClass = "#sidebar-wrapper";
  var checked_for_ads = false;
  var adsHidden = 0;
  var debug = false;

  function getAds() {
    return document.querySelector(otherSearchClass);
  }

  function hideAd(ad) {
        ad.remove();
      adsHidden += 1;
      if (debug) {
        console.log('Ads hidden: '+ adsHidden.toString());
      }
  }

  setInterval(() => {
    if (checked_for_ads) {
      return;
    }

    const ads = getAds();

    if (ads.length) {
      Array.from(ads).forEach(hideAd);
      checked_for_ads = true;
    }
  }, 500);

  //window.onhashchange = function() {
  //  [...document.getElementsByTagName(otherSearchClass)].forEach((element, index, array) => {
  //    if (checked_for_ads) {
  //      return;
  //    }
  //
  //    const ads = getAds();
  //
  //    if (ads.length) {
  //      Array.from(ads).forEach(hideAd);
  //      checked_for_ads = true;
  //    }
  //  });
  //}

  document.addEventListener('scroll', () => Array.from(getAds()).forEach(hideAd));
})();
