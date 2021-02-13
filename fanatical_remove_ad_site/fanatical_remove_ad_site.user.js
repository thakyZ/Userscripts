// ==UserScript==
// @name         Fanatical Remove Malware Ad Site
// @namespace    NekoBoiNick.Fanatical.AntiMalware
// @version      1.0
// @description  Removes known malware ad site from varios sites
// @author       NekoBoiNick
// @match        https://isthereanydeal.com/*
// @license      MIT
// @grant        none
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var x = document.getElementsByTagName("a");
  var regex = new RegExp("^https?:\\/\\/(www\\.)?jdoqocy.com\\/click(-[0-9]+-[0-9]+)\\?URL=","g")
  var i;
  for (i = 0; i < x.length; i++) {
    if (regex.test(x[i].href))
    {
      x[i].href = decodeURIComponent(x[i].href.replace(regex,""));
    }
  }
})();
