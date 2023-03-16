// ==UserScript==
// @name         Open URL in Steam Button
// @namespace    NekoBoiNick.Web.Steam.OpenInClient
// @version      1.0.1
// @description  Adds a button to open pages in the Steam client.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  if (!window.location.href.match(/^https:\/\/(store\.)?steam(powered|community)\.com\//)) {
    return;
  }

  const createOpenButton = () => "<div class=\"open-in-steam\"><a rel=\"noopener\" style=\"\" class=\"btnv6_blue_hoverfade btn_medium\" id=\"open-in-steam_button\"><span><img class=\"ico16\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM2NkMwRjQiIHZpZXdCb3g9IjMgMyAxOCAxOCI+PHBhdGggZD0iTTEyLDEwTDgsMTRIMTFWMjBIMTNWMTRIMTZNMTksNEg1QzMuODksNCAzLDQuOSAzLDZWMThBMiwyIDAgMCwwIDUsMjBIOVYxOEg1VjhIMTlWMThIMTVWMjBIMTlBMiwyIDAgMCwwIDIxLDE4VjZBMiwyIDAgMCwwIDE5LDRaIiAvPjwvc3ZnPg==\"></span></a></div>";
  const newStyles = () => ".open-in-steam #open-in-steam_button span .ico16 {background: none;}.open-in-steam {margin-left: 10px;display: inline-block;vertical-align: 12px;}";
  const steamOpenUrl = "steam://openurl/";
  const globalHeader = $("#global_header .content");
  const openButton = createOpenButton();
  const styles = document.createElement("style");
  $(styles).text(newStyles());
  $("head").append(newStyles);
  if ($("#global_actions .user_avatar.playerAvatar").length > 0) {
    $("#global_actions .user_avatar.playerAvatar").after(openButton);
  } else {
    $(globalHeader).append(openButton);
  }

  $(".open-in-steam #open-in-steam_button").attr("href", `${steamOpenUrl}${window.location.href}`);
});
