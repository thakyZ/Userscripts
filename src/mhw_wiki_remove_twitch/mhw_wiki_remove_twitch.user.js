// ==UserScript==
// @name         Monster Hunter World Wiki Remove Twitch Stream
// @namespace    NekoBoiNick.MonsterHunterWorld.Wiki.RemoveTwitch
// @version      1.0.1
// @description  Removes twitch steam and ads from the Monster Hunter World Wiki
// @author       NekoBoiNick
// @match        https://monsterhunterworld.wiki.fextralife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fextralife.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
// - The @grant directives are needed to restore the proper sandbox.
/* global $, jQuery, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const setupMyClass = jNode => {
    const flexWrapper = $(jNode).width();
    const margin = 15;
    const pageContentWrapperWidth = $("#page-content-wrapper").width();
    const setToWidthPageContentWrapper = flexWrapper - (margin * 2);
    const setToMarginPageContentWrapper = (flexWrapper - pageContentWrapperWidth) - margin;
    $("#page-content-wrapper").css("margin-left", (setToMarginPageContentWrapper * -1) + "px");
    $("#page-content-wrapper").css("width", setToWidthPageContentWrapper + "px");
  };

  waitForKeyElements(".Page404", setupMyClass, true);
});
