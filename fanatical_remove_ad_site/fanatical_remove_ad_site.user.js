// ==UserScript==
// @name         Fanatical Remove Malware Ad Site
// @namespace    NekoBoiNick.Web
// @version      1.0.2
// @description  Removes known malware ad site from various sites
// @author       Neko Boi Nick
// @match        https://isthereanydeal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=isthereanydeal.com
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const regex = /^https?:\/\/(www\.)?jdoqocy\.com\/click(-\d+-\d+)\?URL=/g;
  for (const [, link] of Object.entries($("a"))) {
    if (regex.test($(link).attr("href"))) {
      $(link).attr("href", decodeURIComponent($(link).attr("href").replace(regex, "")));
    }
  }
});
