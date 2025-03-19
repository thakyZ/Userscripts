// ==UserScript==
// @name         Adfocus Link Remover
// @namespace    NekoBoiNick.Web
// @version      1.0.3.1
// @description  Removes AdFocus redirects if possible.
// @author       Neko Boi Nick
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfoc.us
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /** @type {JQuery<HTMLElement>} */
  const links = $("a");
  const regex = /^https?:\/\/adfoc.us\/serve\/sitelinks\/\?id=\d*&url=/g;
  for (let i = 0; i < $(links).length; i++) {
    if (regex.test($(links[i]).attr("href"))) {
      $(links[i]).attr("href", `${$(links[i]).attr("href").replace(regex, "")}`);
    }
  }
});
