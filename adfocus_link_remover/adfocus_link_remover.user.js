// ==UserScript==
// @name         Adfocus Link Remover
// @namespace    NekoBoiNick.Global.AdFocusLinkRemover
// @version      0.1
// @description  Removes AdFocus redirects if possible.
// @author       Neko Boi Nick
// @match        *
// @grant        none
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var x = document.getElementsByTagName("a");
  var regex = new RegExp("^https?:\\/\\/adfoc.us\\/serve\\/sitelinks\\/\\?id=\\d*&url=","g")
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].href = x[i].href.replace(regex,"");
  }
})();
