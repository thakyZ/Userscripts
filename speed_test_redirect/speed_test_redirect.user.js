// ==UserScript==
// @name         Speed Test Redirect
// @namespace    NekoBoiNick.Web.Search.SpeedTest
// @copyright    2021, Neko Boi Nick
// @version      0.1
// @license      MIT
// @description  Redirects the search engine to a proper speed test site.
// @author       Neko Boi Nick
// @match        *://*.google.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.bing.com/*
// @match        *://*.yahoo.com/*
// @match        *://*.yandex.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* globals MonkeyConfig */

(function() {
  'use strict';

  var config = new MonkeyConfig({
    title: 'Configure',
    menuCommand: true,
    params: {
      redirect_site: {
        type: "select",
        choices: ["Measurement Lab", "Ookla", "Fast"],
        default: "Measurement Lab"
      },
      for_google: {
        type: 'checkbox',
        default: true
      },
      for_duckduckgo: {
        type: 'checkbox',
        default: true
      },
      for_bing: {
        type: 'checkbox',
        default: true
      },
      for_yahoo: {
        type: 'checkbox',
        default: true
      },
      for_yandex: {
        type: 'checkbox',
        default: true
      }
    }
  })

  var redirectSites = ["https://speed.measurementlab.net/", "https://speedtest.net", "https://fast.com"];

  var regexGoogle = /^(https?:\/\/)((www\.)?)google.com\/search\?(.+)?q=speed(\+)?test(.+)?$/i;
  var regexDuckDuckGo = /^(https?:\/\/)((www\.)?)duckduckgo.com\/\?(.+)?q=speed(\+)?test(.+)?$/i;
  var regexBing = /^(https?:\/\/)((www\.)?)bing.com\/search\?q=speed(\%20)?test(.+)?$/i;
  var regexYahoo = /^(https?:\/\/)search\.yahoo.com\/search(\;_ylt=(.+);_ylc=(.+))?\?p=speed(\+)?test(.+)?$/i;
  var regexYandex = /^(https?:\/\/)(www\.)?yandex.(ru|com)\/search\/\?(.+)?(&)?text=speed(\+)?test(.+)?$/i;

  var loc = window.location.href;

  function from_site_choice() {
    switch (config.get("redirect_site")) {
      case "Measurement Lab":
        return redirectSites[0];
      case "Ookla":
        return redirectSites[1];
      case "Fast":
        return redirectSites[2];
    }
  }

  if (config.get("for_google") && regexGoogle.test(loc)) {
    window.location.href = from_site_choice();
  }
  if (config.get("for_duckduckgo") && regexDuckDuckGo.test(loc)) {
    window.location.href = from_site_choice();
  }
  if (config.get("for_bing") && regexBing.test(loc)) {
    window.location.href = from_site_choice();
  }
  if (config.get("for_yahoo") && regexYahoo.test(loc)) {
    window.location.href = from_site_choice();
  }
  if (config.get("for_yandex") && regexYandex.test(loc)) {
    window.location.href = from_site_choice();
  }
})();
