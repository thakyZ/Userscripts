// ==UserScript==
// @name         Gamer Escape Additions
// @namespace    NekoBoiNick.Web.FFXIV.GamerEscape.Additions
// @version      1.0.0
// @description  Adds new features to Gamer Escape
// @author       Neko Boi Nick
// @match        https://ffxiv.gamerescape.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamerescape.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://github.com/dawidsadowski/MonkeyConfig/raw/master/monkeyconfig.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, MonkeyConfig */

var SettingsSaveName = "GamerEscapeAdditions.Settings";

$(document).ready(() => {
  const config = new MonkeyConfig({
    title: "Configure",
    storageKey: SettingsSaveName,
    menuCommand: true,
    openWin: true,
    params: {
      dark_by_default: {
        type: "checkbox",
        default: false
      },
      hide_comments: {
        type: "checkbox",
        default: false
      }
    }
  });
  var disqus = $("#disqus_thread");
  var hideButton = () => {
    return `<div id="hide-disqus_thead"><button id="hide-disqus_thread-button"><div id="hide-disqus_thread-button-icon" class="fold-icon"></div></button></div>`;
  };
  var marked = ["#d7d8db","#000","#ebecf0","#f9f9f9","#fffae1"];
  var catlinks = $("#catlinks");
  $("head").append(`<style id="additions-style"></style>`);
  var createFoldButton = () => {
    if (catlinks.length > 0) {
      $(catlinks).after(hideButton());
      let id = -1;
      let height = -1;
      id = setInterval(() => {
        var iframe = $("iframe[src*=\"https://disqus.com/embed/comments/\"]");
        if (iframe.length > 0 && $(disqus).height() > 109 && $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css("height") !== "") {
          var hideButtonStyleVar = $("iframe[src*=\"https://disqus.com/embed/comments/\"]").height();
          var disqusHeight = $(disqus).height();
          $("#additions-style")
.text(`${$("#additions-style").text()}
  #hide-disqus_thead {
    position: relative;
    left: calc(100% + 32px);
    height: 0px;
  }
  #hide-disqus_thread-button {
    width: 34px;
    height: 34px;
  }
  div#hide-disqus_thread-button-icon.fold-icon {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI0ZGRiIgdmlld0JveD0iNCA0IDE2IDE2Ij48cGF0aCBkPSJNNy40MSwxNS40MUwxMiwxMC44M0wxNi41OSwxNS40MUwxOCwxNEwxMiw4TDYsMTRMNy40MSwxNS40MVoiIC8+PC9zdmc+");
    height: 24px;
    transition: transform 0.2s ease-out;
  }
  div#hide-disqus_thread-button-icon.fold-icon.unhidden {
    transform: rotate(0deg);
  }
  div#hide-disqus_thread-button-icon.fold-icon.hidden {
    transform: rotate(180deg);
  }
  #disqus_thread[data-hide="false"] iframe[src*=\"https://disqus.com/embed/comments/\"] {
    height: ${hideButtonStyleVar}px !important;
  }
  #disqus_thread[data-hide="true"] iframe[src*=\"https://disqus.com/embed/comments/\"] {
    height: 0px !important;
  }
  #disqus_thread[data-hide] iframe[src*=\"https://disqus.com/embed/comments/\"] {
    transition: height 0.2s ease-out;
  }
  #disqus_thread[data-hide] {
    height: ${disqusHeight}px !important;
  }
`);
          $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css("height","");
          $(disqus).attr("data-hide", "false");
          if (config.get("hide_comments")) {
            if ($(disqus).attr("data-hide") !== "true") {
              $(disqus).attr("data-hide", "true");
              $("#hide-disqus_thread-button-icon").addClass("hidden");
            }
          }
          clearInterval(id);
        }
      });
      $("#hide-disqus_thread-button").on("click", () => {
        if (!$(disqus).attr("data-hide")) {
          $(disqus).attr("data-hide", "false");
          $("#hide-disqus_thread-button-icon").addClass("unhidden");
        }
        if ($(disqus).attr("data-hide") === "false") {
          $(disqus).attr("data-hide", "true");
          $("#hide-disqus_thread-button-icon").addClass("hidden");
          $("#hide-disqus_thread-button-icon").removeClass("unhidden");
        } else if ($(disqus).attr("data-hide") === "true") {
          $(disqus).attr("data-hide", "false");
          $("#hide-disqus_thread-button-icon").addClass("unhidden");
          $("#hide-disqus_thread-button-icon").removeClass("hidden");
        }
      });
    }
  };
  createFoldButton();
  var isDark = () => {
    if ($("body").hasClass("dark")) {
      return true;
    }
    return false;
  }
  var darkerWhite = "#252526";
  var lighterWhite = "#2F2F30";
  var lighterWhiteHover = "#39393A";
  let darkChanges = () => {
    marked[0] = lighterWhite;
    marked[1] = "white";
    marked[2] = lighterWhiteHover;
    marked[3] = darkerWhite;
    var tableHeader = $(".wiki.main *[style]");
    $(tableHeader).each(function(i) {
      var convert = null;
      if ($(this).parents(".arrquestbox").length > 0) {
        return;
      }
      if ($(this).css("background-color") === "rgb(235, 236, 240)") {
        $(this).css({"background-color":darkerWhite});
      }
      if ($(this).css("background-color") === "rgb(255, 255, 255)") {
        $(this).css({"background-color":darkerWhite});
      }
      if ($(this).hasClass("navbox-list") && $(this).css("border-left-color") === "rgb(253, 253, 253)") {
        if ($(this).attr("style").toString().match(/border-left:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(this).css("border-left").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
        $(this).css({"border-left":convert});
        }
      }
      if ($(this).hasClass("wikitable") && $(this).css("border-color") === "rgb(170, 170, 170)") {
        if ($(this).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(this).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
          $(this).css({"border":convert});
        }
      }
      if ($(this).css("color") === "rgb(0, 0, 0)") {
        $(this).css({"color":"white"});
      }
      if ($(this).css("border-color") === "rgb(199, 199, 199)") {
        if ($(this).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(this).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
          $(this).css({"border":convert});
        }
      }
    });
    $("#additions-style")
.text(`${$("#additions-style").text()}
  table.datatable-GEtable3 tr, table.GEtable tr {
    background-color: ${lighterWhite};
    color: white;
  }
  table.datatable-GEtable3 tr:hover, table.GEtable tr:hover {
    background-color: ${lighterWhiteHover};
    color: white;
  }
  table.wikitable, table.prettytable {
    background-color: ${darkerWhite};
  }
  table.datatable-yellow tr, .navbox-title, table.navbox th, .navbox-abovebelow, .navbox-group, .navbox-subgroup .navbox-title, .navbox-even {
    background-color: #0D0D0D;
  }
  table.datatable-yellow .hover, .navbox, .navbox-subgroup {
    background-color: #1A1A1A;
  }
  table.wikitable th, table.wikitable td, table.prettytable th, table.prettytable td, table.wikitable th, table.wikitable td, table.prettytable th, table.prettytable td, table.wikitable, table.prettytable,  table.navbox {
    border-color: #000 !important;
  }
  .rightbox {
    background-color: ${darkerWhite};
  }
  .ad {
    display: none;
  }
  .body>div>.content {
    overflow: hidden;
  }
  table.datatable-GEtable tr, table.GEtable tr {
    background-color: ${darkerWhite};
  }
`);
  }
  if (isDark()) {
    darkChanges();
  }
});
