// ==UserScript==
// @name         Pastebin Additions
// @namespace    NekoBoiNick.Web.Pastebin.Additions
// @version      1.0.1
// @description  Adds things to Pastebin
// @author       Neko Boi Nick
// @match        https://pastebin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pastebin.com
// @license      MIT
// @grant        GM_setClipboard
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/pastebin_additions/pastebin_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/pastebin_additions/pastebin_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  function checkForProgress(ele) {
    if (/%\[\d+\/\d+\]/gi.test($(ele).html())) {
      $(ele).html($(ele).html().replaceAll(/%\[(\d+)\/(\d+)\]/gi, '<progress value="$1" max="$2"/>'));
    }
  }

  function init() {
    const variableHeader = $(".source.markdown");
    $(variableHeader).each(function () {
      checkForProgress($(this));
    });
  }

  init();
});
