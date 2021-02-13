// ==UserScript==
// @name         Cheat Engine Bypass Website
// @namespace    NekoBoiNick.CheatEngine.Fixes
// @version      1.0
// @description  Bypasses the ad website when downloading cheat engine.
// @author       NekoBoiNick
// @match        http://ffsrchmgr.com/*
// @license      MIT
// @grant        none
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
    'use strict';

  var skipButtonClass = ".skip_button";
  var urlCheck = /^http:\/\/ffsrchmgr.com\/[0-9]+\/[a-zA-Z0-9+_=]+(\?install_id\=.+)?$/i;

  var loc = window.location.href;

  if (urlCheck.test(loc))
  {
    var test = document.querySelector(skipButtonClass);

    if (test.innerHTML.includes("Skip"))
    {
      setTimeout(function() {
        document.querySelector(skipButtonClass).click()
      }, 1000)
    }
  }
})();
