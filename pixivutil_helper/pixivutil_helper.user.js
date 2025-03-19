// ==UserScript==
// @name         PixivUtil Helper
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Helper to get those pesky Session IDs for PixivUtil2.
// @author       Neko Boi Nick
// @match        https://*.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/pixivutil_helper/pixivutil_helper.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/pixivutil_helper/pixivutil_helper.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     style https://cdn.jsdelivr.net/gh/thakyz/Userscripts/pixivutil_helper/styles.min.css
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

jQuery(($) => {
  "use strict";

  function applyCss() {
    let style = GM_getResourceText("style");

    if (typeof style === "undefined") {
      style = `
  body > #pu-helper {
    position: fixed;
    top: 0;
    left: 48px;
  }
  body > #pu-helper > tray {
    position: fixed;
    top: 0;
    left: 48px;
  }`;
    }

    GM_addStyle(style);
  }

  function drawHelper() {
    const wrapper = $("<div id=\"pu-helper\"><div>");
    const tray = $("<div class=\"tray\"></div>");
    const button = $("<button id=\"pu-helper-button\" class=\"tray\">Help</button>");
    wrapper.append(tray);
    tray.append(button);
    $("body").append(wrapper);
    $(button).on("click", function() {
    });
  }
  applyCss();
  drawHelper();
});
