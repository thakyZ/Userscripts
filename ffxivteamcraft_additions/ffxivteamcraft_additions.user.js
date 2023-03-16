// ==UserScript==
// @name         FFXIV Team Craft Additions
// @namespace    MekoBoiNick.Web.FFXIV.TeamCraft.Additions
// @version      1.0.1
// @description  Adds new things to FFXIV Team Craft
// @author       Neko Boi Nick
// @match        https://guides.ffxivteamcraft.com/*
// @match        https://ffxivteamcraft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxivteamcraft.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivteamcraft_additions/ffxivteamcraft_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivteamcraft_additions/ffxivteamcraft_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  let id = -1;
  id = setInterval(() => {
    let headerBars = $("body guides-root nz-layout nz-header ul[nz-menu]");
    let headerMenus = $("body guides-root nz-layout nz-header ul[nz-menu] li");

    if (headerBars.length > 0 && headerMenus.length > 0) {
      headerBars = $("body guides-root nz-layout nz-header ul[nz-menu]");
      headerMenus = $("body guides-root nz-layout nz-header ul[nz-menu] li")[2];
      const cloned = $(headerMenus).clone();
      $(headerMenus).after(cloned);
      const title = $(cloned).find("span[title]");
      $(title).find("i").css("vertical-align", "0px");
      $(title).find("i").html("<img width=\"24\" height=\"24\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNGRkYiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDEwTDgsMTRIMTFWMjBIMTNWMTRIMTZNMTksNEg1QzMuODksNCAzLDQuOSAzLDZWMThBMiwyIDAgMCwwIDUsMjBIOVYxOEg1VjhIMTlWMThIMTVWMjBIMTlBMiwyIDAgMCwwIDIxLDE4VjZBMiwyIDAgMCwwIDE5LDRaIiAvPjwvc3ZnPg==\"/>");
      $(title).find("span").text("APP");
      $(title).on("click", () => {
        window.location.href = "https://ffxivteamcraft.com";
      });
      clearInterval(id);
    }
  }, 100);
});
