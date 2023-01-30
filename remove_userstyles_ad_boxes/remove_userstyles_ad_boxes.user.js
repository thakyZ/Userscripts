// ==UserScript==
// @name         Remove UserStyles Ad Boxes
// @namespace    NekoBoiNick.UserStyles.Ads
// @version      0.2
// @description  Removes divs for ads on UserStyles
// @author       NekoBoiNick
// @match        https://userstyles.org/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/remove_userstyles_ad_boxes/remove_userstyles_ad_boxes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/remove_userstyles_ad_boxes/remove_userstyles_ad_boxes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
// - The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const removeFallback = () => {
    const elements = $(".us-stylecard--short .fallbackDiv");
    $(elements).each((_, element) => {
      element.parent().css({ display: "none" });
    });
  };

  waitForKeyElements(".fallbackDiv", removeFallback, true);
});
