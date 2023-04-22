// ==UserScript==
// @name         Quizlet Unlock
// @namespace    NekoBoiNick.Web.Quizlet.Unlock
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
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  window.onhashchange = () => {
    $(".SetPageTerm").each((_, element) => {
      if (!$(element).attr("class").contains("is-showing")) {
        $(element).attr("class", `${$(element).attr("class")} is-showing`);
        GM_log("Found broken page");
      }
    });
  };

  let checkedForAds = false;
  let adsHidden = 0;
  const debug = false;

  function getAds() {
    return document.getElementsByClassName("SetPageTerm");
  }

  function hideAd(ad) {
    if (!ad.classList.contains("is-showing")) {
      ad.classList.add("is-showing");
      adsHidden += 1;
      if (debug) {
        console.log("Ads hidden: ", adsHidden.toString());
      }
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

  document.addEventListener("scroll", () => Array.from(getAds()).forEach(hideAd));
})();
