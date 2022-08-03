// ==UserScript==
// @name         Adfocus Link Remover
// @namespace    NekoBoiNick.Global.AdFocusLinkRemover
// @version      1.0.2
// @description  Removes AdFocus redirects if possible.
// @author       Neko Boi Nick
// @match        *
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function () {
  "use strict";

  var links = document.getElementsByTagName("a");
  var regex = /^https?:\/\/adfoc.us\/serve\/sitelinks\/\?id=\d*&url=/g;
  for (let i = 0; i < links.length; i++) {
    if (links[i].href.match(regex)) {
      links[i].href = links[i].href.replace(regex, "");
    }
  }
})();
