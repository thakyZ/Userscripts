// ==UserScript==
// @name         Monster Hunter World Wiki Remove Twitch Stream
// @namespace    NekoBoiNick.MonsterHunterWorld.Wiki.RemoveTwitch
// @version      0.2
// @description  Removes twitch steam and ads from the Monster Hunter World Wiki
// @author       NekoBoiNick
// @match        https://monsterhunterworld.wiki.fextralife.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @license      MIT
// @downloadURL  https://github.com/thakyZ/Userscripts/raw/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js
// @updateURL    https://github.com/thakyZ/Userscripts/raw/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */

(function() {
  $(document).ready(function(){
    'use strict';
    var FlexWrapper = $(".fex-main").width();
    var Margin = 15;
    var PageContentWrapperWidth = $("#page-content-wrapper").width();
    var SetToWidthPageContentWrapper = FlexWrapper - (Margin * 2);
    var SetToMarginPageContentWrapper = (FlexWrapper - PageContentWrapperWidth) - Margin;
    $("#page-content-wrapper").css("margin-left", (SetToMarginPageContentWrapper * -1) + "px");
    $("#page-content-wrapper").css("width", SetToWidthPageContentWrapper + "px");
  });
})();
