// ==UserScript==
// @name         Outlook Mail Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Additions to Outlook Web Mail
// @author       Neko Boi Nick
// @match        https://outlook.live.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=live.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/outlookmail_additions/outlookmail_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/outlookmail_additions/outlookmail_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if ($(mutation.target).is("section[aria-label=\"Section details\"] > div:last-child > div") || $(mutation.target).is("section[aria-label=\"Section details\"]")) {
          // Do nothing.
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
