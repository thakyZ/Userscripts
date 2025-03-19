// ==UserScript==
// @name         Game Resources Search Fix
// @namespace    NekoBoiNick.Web
// @version      1.0.1
// @description  Fixes search when blocking ads.
// @author       Neko Boi Nick
// @match        https://www.sounds-resource.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sounds-resource.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/gameresources_searchfix/gameresources_searchfix.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/gameresources_searchfix/gameresources_searchfix.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const headerAd = $("#headerad");
  // Window.getComputedStyle(x).visibility === "hidden"
  if ($(headerAd).length === 1 && window.getComputedStyle(headerAd[0]).display === "none") {
    $("<div style=\"padding: 0.1px;\"></div>").insertAfter(headerAd[0]);
  }
});
