// ==UserScript==
// @name         fExtra Life Wiki Fixes
// @namespace    NekoBoiNick.Web.FExtraLife.Wiki.Fixes
// @version      1.0.4
// @description  Tries to fix some issues about fExtra Life's wiki pages.
// @author       NekoBoiNick
// @match        https://*.wiki.fextralife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fextralife.com
// @grant        GM_log
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const otherSearchClass = "#sidebar-wrapper";
  let checkedForAds = false;
  let adsHidden = 0;
  const debug = false;

  function getAds() {
    return $(otherSearchClass);
  }

  function hideAd(ad) {
    ad.remove();
    adsHidden += 1;
    if (debug) {
      console.log("Ads hidden: " + adsHidden.toString());
    }
  }

  setInterval(() => {
    if (checkedForAds) {
      return;
    }

    const ads = getAds();

    if (ads.length) {
      Array.from(ads).forEach(hideAd);
      checkedForAds = true;
    }
  }, 500);

  // Window.onhashchange = function() {
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
  // }

  $(document).on("scroll", () => Array.from(getAds()).forEach(hideAd));
});
