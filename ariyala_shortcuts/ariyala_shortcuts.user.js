// ==UserScript==
// @name         Ariyala's FFXIV Toolkit Bookmarks
// @namespace    NekoBoiNick.Web.AriyalaFFXIV.Shortcuts
// @version      1.0.2
// @license      MIT
// @description  Adds a small box for shortcuts on the Wiki.
// @author       Neko Boi Nick
// @match        https://ffxiv.ariyala.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxiv.ariyala.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

const jsonConfig = {
  items: [
    {
      icon: "BLU",
      name: "Lvl 60",
      url: "1DEGU",
      id: "blu_level_60_melds",
    },
  ],
};

$(document).ready(() => {
  const styleElement = `<style>
  .tray {
    position: fixed;
    min-height: 20px;
    min-width: 75px;
    left: 0px;
    top: calc(50% - 35px);
    border-style: solid;
    border-left-width: 0;
    border-right-width: 2px;
    border: ;
    border-top-width: 2px;
    border-bottom-width: 2px;
    border-color: #3c3c3c;
    box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.7);
  }

  tray_item {
    position: relative;
  }

  .tray_item {
    position: relative;
    display: block;
  }

  .tray_item a {
    padding: 0 10px 0 25px;
    display: block;
    text-align: left;
    position: relative;
    line-height: 20px;
    height: 20px;
    white-space: nowrap;
  }

  .tray_item a:hover {
    background: url("/images/style/menuEntry.png");
  }
</style>`;

  const item = [];
  const templateItem = i => `<div class="tray_item" id="${i.id}"><div class="menuIcon" style="background-image: url("https://cdn.ariyala.com/ffxiv/images/classes/${i.icon}.png");"></div><a href="${i.url}" id="${i.id}">${i.name}</a></div>`;

  $.each(jsonConfig.items, (_, value) => {
    item.push(templateItem(value));
  });
  const templateTray = () => "<div class=\"tray\" id=\"bookmarks\"></div>";

  $("#body").append(templateTray());
  $.each(item, (_, value) => {
    $("#bookmarks").append(value);
  });
  $("head").append(styleElement);
});
