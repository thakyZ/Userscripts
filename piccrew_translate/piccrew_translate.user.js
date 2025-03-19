// ==UserScript==
// @name         Piccrew Translate
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Translates Piccrew's site to english
// @author       Neko Boi Nick (thakyZ)
// @match        https://picrew.me/*
// @icon         https://www.google.com/s2/favicons?domain=picrew.me
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
// The @grant directives are needed to restore the proper sandbox.
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  const debug = true;
  $(document).ready(() => {
    (($) => {
      $.fn.detectOriginalText = ($class) => {
        if (debug) {
          console.log("detectedStrings : " + $($class).length);
        }

        return $($class);
      };
    })(jQuery);

    $(document).detectOriginalText(".search-Form_UseRangeLabel").each(function () {
      switch ($(this).text()) {
        case "個人":
          $(this).text("Personal");
          break;
        case "非商用":
          $(this).text("Non-commercial");
          break;
        case "商用":
          $(this).text("Commercial");
          break;
        case "加工":
          $(this).text("Processing");
          break;
        default:
          break;
      }
    });
  });
});
