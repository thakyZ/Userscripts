// ==UserScript==
// @name         Chocolatey Default to Packages
// @namespace    NekoBoiNick.Web.Chocolatey.Default2Packages
// @version      1.0.0.1
// @description  When going to chocolatey's main page from another website will redirect instead to packages.
// @author       Neko Boi Nick
// @match        https://chocolatey.org/*
// @match        https://community.chocolatey.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chocolatey.org
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/chocolatey_default2packages/chocolatey_default2packages.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/chocolatey_default2packages/chocolatey_default2packages.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery((_) => {
  "use strict";

  async function redirect() {
    if (/^https:\/\/(community\.)?chocolatey.org\/?\??/i.test(window.location.href)) {
      if (document.referrer !== "" && !/chocolatey.org/.test(document.referrer)) {
        window.location.href = "https://community.chocolatey.org/packages";
      }
    }
  }

  (async function () {
    await redirect();
  })();
});
