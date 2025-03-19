// ==UserScript==
// @name         Neko Gaming Library Test
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Test script for the Neko Gaming Library
// @author       Neko Boi Nick
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nekogaming.xyz
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.js
// @resource     example https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/test/elements.template.html
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const run = () => {
    const element = $.fn.createElement("example", { "#{icon}": "M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" });
    $("body > div[data-hveid=\"1\"] > div:nth-child(4) > div").append(element);
  };

  run();
});
