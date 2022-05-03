// ==UserScript==
// @name         Ariyala's FFXIV Toolkit Bookmarks
// @namespace    NekoBoiNick.Web.AriyalaFFXIV.Shortcuts
// @version      1.0.0
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

(function() {
  'use strict';
  var jsonconfig = {
    "items": [
      {
        "icon": "BLU",
        "name": "Lvl 60",
        "url": "1DEGU",
        "id": "blu_level_60_melds"
      }
    ]
  }
  $(document).ready(function() {
    var item = [];
    $.each(jsonconfig.items, function(key, value) {
      var tempElement = document.createElement("div");
      $(tempElement).addClass("tray_item");
      $(tempElement).attr("id", `${value.id}`);
      var tempLink = document.createElement("a");
      $(tempLink).attr("href", `${value.url}`);
      $(tempLink).attr("id", `${value.id}_link`);
      $(tempLink).append(`${value.name}`);
      var tempIcon = document.createElement("div");
      $(tempIcon).addClass("menuIcon");
      $(tempIcon).attr("style", `background-image: url("https://cdn.ariyala.com/ffxiv/images/classes/${value.icon}.png");`);
      $(tempLink).append(tempIcon);
      $(tempElement).append(tempLink);
      item.push(tempElement);
    });
    var tray = document.createElement("div");
    $(tray).addClass("tray");
    $(tray).attr("id", "bookmarks");
    $("#body").append(tray);
    $.each(item, function(key, value) {
      $("#bookmarks").append(value);
    });
  });
  var css = document.createElement("style");
  var appendedCSS = `
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
`
 css.append(appendedCSS);
 $("head").append(css);
})();
