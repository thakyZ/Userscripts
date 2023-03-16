// ==UserScript==
// @name         Piccrew Translate
// @namespace    NekoBoiNick.Web.Piccrew.Translate
// @version      1.0.0
// @description  Translates Piccrew's site to english
// @author       Neko Boi Nick (thakyZ)
// @match        https://picrew.me/*
// @icon         https://www.google.com/s2/favicons?domain=picrew.me
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, jQuery, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  const debug = true;
  $(document).ready(function(){
    (function($) {
      $.fn.detectOriginalText = function($class) {
        if (debug) {
          console.log("detectedStrings : " + $($class).length);
        }
        return $($class);
      }
    })(jQuery);
    $(document).detectOriginalText(".search-Form_UseRangeLabel").each(function(index) {
      if ($(this).text() === "個人") {
        $(this).text("Personal");
      }
      if ($(this).text() === "非商用") {
        $(this).text("Non-commercial");
      }
      if ($(this).text() === "商用") {
        $(this).text("Commercial");
      }
      if ($(this).text() === "加工") {
        $(this).text("Processing");
      }
    });
  });
});