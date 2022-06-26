// ==UserScript==
// @name         Game Resources Search Fix
// @namespace    NekoBoiNick.Web.GameResources.SearchFix
// @version      1.0.0
// @description  Fixes search when blocking ads.
// @author       Neko Boi Nick
// @match        https://www.sounds-resource.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sounds-resource.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/gameresources_searchfix/gameresources_searchfix.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/gameresources_searchfix/gameresources_searchfix.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  var headerAd = document.querySelectorAll("#headerad");
  //window.getComputedStyle(x).visibility === "hidden"
  if (headerAd.length === 1 && window.getComputedStyle(headerAd[0]).display === "none") {
    var newHeaderAd = document.createElement("div");
    newHeaderAd.style.padding = "0.1px";
    headerAd[0].after(newHeaderAd);
  }
})();
