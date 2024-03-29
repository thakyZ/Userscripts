// ==UserScript==
// @name         Cheat Engine Bypass Website
// @namespace    NekoBoiNick.CheatEngine.Fixes
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
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const skipButtonClass = ".skip_button";
  const urlCheck = /^http:\/\/ffsrchmgr.com\/\d+\/[a-z0-9+_=]+(\?install_id=.+)?$/i;

  const loc = window.location.href;

  if (urlCheck.test(loc)) {
    const test = $(skipButtonClass);

    if (test.innerHTML.includes("Skip")) {
      setTimeout(() => {
        $(skipButtonClass).click();
      }, 1000);
    }
  }
});
