// ==UserScript==
// @name         Open URL in Steam Button
// @namespace    NekoBoiNick.Web.Steam.OpenInClient
// @version      1.0.2
// @description  Adds a button to open pages in the Steam client.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @license      MIT
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  if (!window.location.href.match(/^https:\/\/(store\.)?steam(powered|community)\.com\//)) {
    return;
  }

  const createOpenButton = () => "<div class=\"open-in-steam\"><a rel=\"noopener\" style=\"\" class=\"btnv6_blue_hoverfade btn_medium\" id=\"open-in-steam_button\"><span><img class=\"ico16\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM2NkMwRjQiIHZpZXdCb3g9IjMgMyAxOCAxOCI+PHBhdGggZD0iTTEyLDEwTDgsMTRIMTFWMjBIMTNWMTRIMTZNMTksNEg1QzMuODksNCAzLDQuOSAzLDZWMThBMiwyIDAgMCwwIDUsMjBIOVYxOEg1VjhIMTlWMThIMTVWMjBIMTlBMiwyIDAgMCwwIDIxLDE4VjZBMiwyIDAgMCwwIDE5LDRaIiAvPjwvc3ZnPg==\"></span></a></div>";
  GM_addStyle(".open-in-steam #open-in-steam_button span .ico16 {background: none;}.open-in-steam {margin-left: 10px;display: inline-block;vertical-align: 12px;}");
  const steamOpenUrl = "steam://openurl/";
  const globalHeader = $("#global_header .content");
  const openButton = createOpenButton();
  if ($("#global_actions .user_avatar.playerAvatar").length > 0) {
    $("#global_actions .user_avatar.playerAvatar").after(openButton);
  } else {
    $(globalHeader).append(openButton);
  }

  $(".open-in-steam #open-in-steam_button").attr("href", `${steamOpenUrl}${window.location.href}`);
});
