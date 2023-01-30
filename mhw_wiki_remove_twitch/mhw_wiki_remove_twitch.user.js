// ==UserScript==
// @name         Monster Hunter World Wiki Remove Twitch Stream
// @namespace    NekoBoiNick.MonsterHunterWorld.Wiki.RemoveTwitch
// @version      0.2
// @description  Removes twitch steam and ads from the Monster Hunter World Wiki
// @author       NekoBoiNick
// @match        https://monsterhunterworld.wiki.fextralife.com/*
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
/* global $, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const setupMyClass = jNode => {
    const FlexWrapper = $(jNode).width();
    const Margin = 15;
    const PageContentWrapperWidth = $("#page-content-wrapper").width();
    const SetToWidthPageContentWrapper = FlexWrapper - (Margin * 2);
    const SetToMarginPageContentWrapper = (FlexWrapper - PageContentWrapperWidth) - Margin;
    $("#page-content-wrapper").css("margin-left", (SetToMarginPageContentWrapper * -1) + "px");
    $("#page-content-wrapper").css("width", SetToWidthPageContentWrapper + "px");
  };

  waitForKeyElements(".Page404", setupMyClass, true);
});
