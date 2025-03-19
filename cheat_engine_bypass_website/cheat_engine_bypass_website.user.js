// ==UserScript==
// @name         Cheat Engine Bypass Website
// @namespace    NekoBoiNick.Web
// @version      1.0.2
// @description  Bypasses the ad website when downloading cheat engine.
// @author       NekoBoiNick
// @match        http://ffsrchmgr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cheatengine.org
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /** @type {String} */
  const skipButtonClass = ".skip_button";
  /** @type {RegExp} */
  const urlCheck = /^http:\/\/ffsrchmgr\.com\/\d+\/[a-z0-9+_=]+(\?install_id=.+)?$/i;

  /** @type {String} */
  const loc = window.location.href;

  if (urlCheck.test(loc)) {
    /** @type {JQuery<HTMLElement>} */
    const test = $(skipButtonClass);

    if (test.html().includes("Skip")) {
      setTimeout(() => {
        $(skipButtonClass).click();
      }, 1000);
    }
  }
});
