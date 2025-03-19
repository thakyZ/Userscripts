// ==UserScript==
// @name         Speed Test Redirect
// @namespace    NekoBoiNick.Web
// @copyright    2023, Neko Boi Nick
// @version      1.0.2.1
// @license      MIT
// @description  Redirects the search engine to a proper speed test site.
// @author       Neko Boi Nick
// @match        *://*.google.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.bing.com/*
// @match        *://*.yahoo.com/*
// @match        *://*.yandex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speedtest.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @noframes
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery, MonkeyConfig */
this.jQuery = jQuery.noConflict(true);

jQuery((_) => {
  "use strict";

  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      redirectSite: {
        type: "select",
        choices: ["Measurement Lab", "Ookla", "Fast"],
        default: "Measurement Lab",
      },
      forGoogle: {
        type: "checkbox",
        default: true,
      },
      forDuckduckgo: {
        type: "checkbox",
        default: true,
      },
      forBing: {
        type: "checkbox",
        default: true,
      },
      forYahoo: {
        type: "checkbox",
        default: true,
      },
      forYandex: {
        type: "checkbox",
        default: true,
      },
    },
  });

  const redirectSites = ["https://speed.measurementlab.net/", "https://speedtest.net", "https://fast.com"];
  const services = {
    google: /^(https?:\/\/)((www\.)?)google.com\/search\?(.+)?q=speed(\+)?test(.+)?$/i,
    duckduckgo: /^(https?:\/\/)((www\.)?)duckduckgo.com\/\?(.+)?q=speed(\+)?test(.+)?$/i,
    bing: /^(https?:\/\/)((www\.)?)bing.com\/search\?q=speed(%20)?test(.+)?$/i,
    yahoo: /^(https?:\/\/)search\.yahoo.com\/search(;_ylt=(.+);_ylc=(.+))?\?p=speed(\+)?test(.+)?$/i,
    yandex: /^(https?:\/\/)(www\.)?yandex.(ru|com)\/search\/\?(.+)?(&)?text=speed(\+)?test(.+)?$/i
  };

  const loc = window.location.href;

  const fromSiteChoice = () => {
    switch (config.get("redirectSite")) {
      case "Measurement Lab":
        return redirectSites[0];
      case "Ookla":
        return redirectSites[1];
      case "Fast":
      default:
        return redirectSites[2];
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  for (const [service, regex] of Object.entries(services)) {
    if (config.get(`for${capitalizeFirstLetter(service)}`) && regex.test(loc)) {
      window.location.href = fromSiteChoice();
      break;
    }
  }
});
