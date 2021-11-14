// ==UserScript==
// @name         Quizlet Unlock
// @namespace    NekoBoiNick.Quizlet.Unlock
// @version      1.0.0
// @description  Unlcoks Quizlet Paywalls
//               Please do not use this to cheat on tests, I used this to just not have to pay for Quizlet when studying.
// @author       Neko Boi Nick
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?domain=quizlet.com
// @grant        GM_log
// @run-at       document-start
// @noframes
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';


  window.onhashchange = function() {
    [...document.getElementsByClassName("SetPageTerm")].forEach((element, index, array) => {
      if (!element.classList.contains("is-showing"))
      {
        element.classList.add("is-showing");
        GM_log("Found broken page");
        console.log("Found broken page");
      }
    });
  }

  let checked_for_ads = false;
  var adsHidden = 0;
  var debug = false;

  function getAds() {
    return document.getElementsByClassName("SetPageTerm");
  }

  function hideAd(ad) {
    if (!ad.classList.contains("is-showing")) {
        ad.classList.add("is-showing");
      adsHidden += 1;
      if (debug) {
        console.log('Ads hidden: ', adsHidden.toString());
      }
    }
  }

  setInterval(() => {
    if (checked_for_ads) {
      return;
    }

    var ads = getAds();

    if (ads.length) {
      Array.from(ads).forEach(hideAd);
      checked_for_ads = true;
    }
  }, 500);

  document.addEventListener('scroll', () => Array.from(getAds()).forEach(hideAd));
  // Your code here...
})();
