// ==UserScript==
// @name         Console Games Wiki Shortcuts
// @namespace    NekoBoiNick.Web.ConsoleGamesWiki.Shortcuts
// @version      1.0.1
// @license      MIT
// @description  Adds a small box for shortcuts on the Wiki.
// @author       Neko Boi Nick
// @match        https://ffxiv.consolegameswiki.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=consolegameswiki.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/console_games_wiki_shortcuts/console_games_wiki_shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/console_games_wiki_shortcuts/console_games_wiki_shortcuts.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  const jsonconfig = {
    items: [
      {
        name: "Highland Exp.",
        url: "/wiki/Highland_Exploration",
        id: "highlandexp"
      },
      {
        name: "Woodland Exp.",
        url: "/wiki/Woodland_Exploration",
        id: "woodlandexp"
      },
      {
        name: "Waterside Exp.",
        url: "/wiki/Waterside_Exploration",
        id: "watersideexp"
      },
      {
        name: "Field Exp.",
        url: "/wiki/Field_Exploration",
        id: "fieldexp"
      }
    ]
  };
  $(document).ready(() => {
    const item = [];
    $.each(jsonconfig.items, (_, value) => {
      const tempElement = document.createElement("div");
      $(tempElement).addClass("shortcut");
      $(tempElement).attr("id", `${value.id}`);
      const tempLink = document.createElement("a");
      $(tempLink).attr("href", `${value.url}`);
      $(tempLink).append(`${value.name}`);
      $(tempElement).append(tempLink);
      item.push(tempElement);
    });
    const tray = document.createElement("div");
    $(tray).addClass("shortcuts");
    $(tray).attr("id", "shortcuts");
    $("#mw-head").append(tray);
    $.each(item, (_, value) => {
      $("#shortcuts").append(value);
    });
  });
  $("head").append($("<style>#shortcuts{background-color:rgba(215,239,242,0.5);border:1px solid #a7d7f9;width:fit-content;left:194px;position:absolute;}.shortcut{margin-right:10px;height:fit-content;float:left;padding:2px;text-align:left;}#shortcuts a:visited{color:#000;}#shortcuts a{font-weight:700;font-size:13px;font-family:sans-serif;color:rgb(0,0,0);}</style>"));
});
