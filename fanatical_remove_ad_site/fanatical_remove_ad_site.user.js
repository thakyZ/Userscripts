// ==UserScript==
// @name         Fanatical Remove Malware Ad Site
// @namespace    NekoBoiNick.Web.Fanatical.AntiMalware
// @version      1.0.1
// @description  Removes known malware ad site from various sites
// @author       Neko Boi Nick
// @match        https://isthereanydeal.com/*
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const links = $("a");
  const regex = /^https?:\/\/(www\.)?jdoqocy\.com\/click(-[0-9]+-[0-9]+)\?URL=/g;
  for (let i = 0; i < links.length; i++) {
    if (regex.test($(links[i]).attr("href"))) {
      $(links[i]).attr("href", decodeURIComponent($(links[i]).attr("href").replace(regex, "")));
    }
  }
});
