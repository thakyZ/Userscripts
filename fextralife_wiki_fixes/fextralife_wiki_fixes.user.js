// ==UserScript==
// @name         fExtra Life Wiki Fixes
// @namespace    NekoBoiNick.FExtraLife.Wiki.Fixes
// @version      1.0
// @description  Trys to fix some issues about fExtra Life's wiki pages.
// @author       NekoBoiNick
// @match        https://*.wiki.fextralife.com/*
// @grant        GM_log
// @run-at       document-start
// @noframes
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var searchClass = "gsc-results-wrapper-visible";
  var otherSearchClass = "gsc-results-wrapper-nooverlay";

  window.onhashchange = function() {
    [...document.getElementsByClassName(otherSearchClass)].forEach((element, index, array) => {
      if (!element.classList.contains(searchClass))
      {
        GM_log("Found broken page");
        location.reload();
      }
    });
  }
})();
