// ==UserScript==
// @name         Adfocus Link Remover
// @namespace    NekoBoiNick.Global.AdFocusLinkRemover
// @version      1.0.3
// @description  Removes AdFocus redirects if possible.
// @author       Neko Boi Nick
// @match        *
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const links = $("a");
  const regex = /^https?:\/\/adfoc.us\/serve\/sitelinks\/\?id=\d*&url=/g;
  for (let i = 0; i < $(links).length; i++) {
    if (regex.test($(links[i]).attr("href"))) {
      $(links[i]).attr("href", `${$(links[i]).attr("href").replace(regex, "")}`);
    }
  }
});
