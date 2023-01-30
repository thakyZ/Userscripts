// ==UserScript==
// @name         Gamer Escape Additions
// @namespace    NekoBoiNick.Web.FFXIV.GamerEscape.Additions
// @version      1.0.0
// @description  Adds new features to Gamer Escape
// @author       Neko Boi Nick
// @match        https://ffxiv.gamerescape.com/wiki/*
// @match        https://ffxiv.gamerescape.com/w/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamerescape.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://github.com/dawidsadowski/MonkeyConfig/raw/master/monkeyconfig.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, MonkeyConfig */

$(document).ready(() => {
  const SettingsSaveName = "GamerEscapeAdditions.Settings";

  const config = new MonkeyConfig({
    title: "Configure",
    storageKey: SettingsSaveName,
    menuCommand: true,
    openWin: true,
    params: {
      darkByDefault: {
        type: "checkbox",
        default: false
      },
      hideComments: {
        type: "checkbox",
        default: false
      }
    }
  });

  const disqus = $("#disqus_thread");
  const hideButton = () => "<div id=\"hide-disqus_thead\"><button id=\"hide-disqus_thread-button\"><div id=\"hide-disqus_thread-button-icon\" class=\"fold-icon\"></div></button></div>";

  const marked = ["#d7d8db", "#000", "#ebecf0", "#f9f9f9", "#fffae1"];
  const catlinks = $("#catlinks");
  $("head").append("<style id=\"additions-style\"></style>");
  const createFoldButton = () => {
    if ($(catlinks).length > 0) {
      $(catlinks).after(hideButton());
      let id = -1;
      // Const height = -1;
      id = setInterval(() => {
        const iframe = $("iframe[src*=\"https://disqus.com/embed/comments/\"]");
        if (iframe.length > 0 && $(disqus).height() > 109 && $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css("height") !== "") {
          const hideButtonStyleVar = $("iframe[src*=\"https://disqus.com/embed/comments/\"]").height();
          const disqusHeight = $(disqus).height();
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
  #disqus_thread[data-hide="false"] iframe[src*="https://disqus.com/embed/comments/"] {
    height: ${hideButtonStyleVar}px !important;
  }
  #disqus_thread[data-hide="true"] iframe[src*="https://disqus.com/embed/comments/"] {
    height: 0px !important;
  }
  #disqus_thread[data-hide] iframe[src*="https://disqus.com/embed/comments/"] {
    transition: height 0.2s ease-out;
  }
  #disqus_thread[data-hide] {
    height: ${disqusHeight}px !important;
  }
`);
          $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css({ height: "" });
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
  const isDark = () => {
    if ($("body").hasClass("dark")) {
      return true;
    }

    return false;
  };

  const darkChanges0 = (_, element) => {
    let convert = null;
    if ($(element).parents(".arrquestbox").length > 0) {
      return;
    }

    if ($(element).css("background-color") === "rgb(235, 236, 240)") {
      $(element).css({ "background-color": darkerWhite });
    }

    if ($(element).css("background-color") === "rgb(255, 255, 255)") {
      $(element).css({ "background-color": darkerWhite });
    }

    if ($(element).hasClass("navbox-list") && $(element).css("border-left-color") === "rgb(253, 253, 253)") {
      if ($(element).attr("style").toString().match(/border-left:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("border-left").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
        $(element).css({ "border-left": convert });
      }
    }

    if ($(element).hasClass("wikitable") && $(element).css("border-color") === "rgb(170, 170, 170)") {
      if ($(element).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
        $(element).css({ border: convert });
      }
    }

    if ($(element).is("table") && !$(element).hasClass("wikitable") && $(element).css("background-color") === "rgb(212, 214, 203)") {
      if ($(element).attr("style").toString().match(/Background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, darkerWhite);
        $(element).css({ background: convert });
      }
    }

    if ($(element).is("th")) {
      if ($(element).css("background-color") === "rgb(212, 214, 203)") {
        if ($(element).attr("style").toString().match(/background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, lighterWhite);
          $(element).css({ background: convert });
        }
      } else if ($(element).css("background-color") === "rgb(229, 231, 217)") {
        if ($(element).attr("style").toString().match(/background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, darkerWhite);
          $(element).css({ background: convert });
        }
      }
    }

    if ($(element).css("color") === "rgb(0, 0, 0)") {
      $(element).css({ color: "white" });
    }
  };

  const darkerWhite = "#252526";
  const lighterWhite = "#2F2F30";
  const lighterWhiteHover = "#39393A";
  const darkChanges = () => {
    marked[0] = lighterWhite;
    marked[1] = "white";
    marked[2] = lighterWhiteHover;
    marked[3] = darkerWhite;
    const tableHeader = $(".wiki.main *[style]");
    $(tableHeader).each((index, element) => {
      darkChanges0(index, element);
      if ($(element).css("border-color") === "rgb(199, 199, 199)") {
        if ($(element).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          const convert = $(element).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
          $(element).css({ border: convert });
        }
      }

      if ($(element).is("tr")) {
        if ($(element).css("background-color") === "rgb(192, 192, 192)") {
          $(element).css({ background: "#3E3E40" });
        }

        if ($(element).css("background-color") === "rgb(150, 150, 150)") {
          $(element).css({ background: "#252526" });
        }
      }
    });
    /* eslint-disable-next-line no-unused-vars */
    const RGBtoHSL = rgb => {
      // Choose correct separator
      const sep = rgb.indexOf(",") > -1 ? "," : " ";
      // Turn "rgb(r,g,b)" into [r,g,b]
      rgb = rgb.substr(4).split(")")[0].split(sep);
      let r = rgb[0];
      let g = rgb[1];
      let b = rgb[2];
      // Make r, g, and b fractions of 1
      r /= 255;
      g /= 255;
      b /= 255;
      // Find greatest and smallest channel values
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;
      // Calculate hue
      // No difference
      if (delta === 0) {
        h = 0;
      // eslint-disable-next-line brace-style
      }
      // Red is max
      else if (cmax === r) {
        h = ((g - b) / delta) % 6;
      } else if (cmax === g) {
        h = ((b - r) / delta) + 2;
      } else {
        h = ((r - g) / delta) + 4;
      }

      h = Math.round(h * 60);
      // Make negative hues positive behind 360°
      if (h < 0) {
        h += 360;
      }

      // Calculate lightness
      l = (cmax + cmin) / 2;
      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));
      // Multiply l and s by 100
      s = Number((s * 100).toFixed(1));
      l = Number((l * 100).toFixed(1));
      return "hsl(" + h + "," + s + "%," + l + "%)";
    };

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
  table[style="background: none 0% 0% / auto repeat scroll padding-box border-box rgb(37, 37, 38); color: white;"]:not(.wikitable) tbody tbody tr:first-child,
  table[style="background: none 0% 0% / auto repeat scroll padding-box border-box rgb(37, 37, 38); color: white;"]:not(.wikitable) tbody tbody tr:first-child a {
    color: #101010;
  }
  .dark .content div.thumbinner, .dark .nav-page-actions a div.thumbinner, html .dark .content .thumbimage  {
    background-color: ${darkerWhite};
    border-color: #000;
  }
  html .dark font[color="black"] {
    color: #fff !important;
  }
  .wikitable {
    color: #fff;
  }
  table.datatable-GEtable3 th, table.GEtable th {
    background-color: transparent;
  }
  .copyItemBoxHeaderButton {
    width: 32px;
    overflow: visible;
    height: 0px;
    float: right;
    position: relative;
    right: -32px;
    bottom: 60px;
  }
  .copyItemBoxHeaderButton button {
    width: 32px;
    height: 32px;
  }
  .copyItemBoxHeaderButton button:hover {
    cursor: pointer;
  }
  .copyItemBoxHeaderButton button i {
    font-size: 16px;
  }
`);
  };

  if (isDark()) {
    darkChanges();
  }

  const filterCatListByNumberOfMembers = count => {
    if (/https:\/\/ffxiv\.gamerescape\.com\/(wiki\/Special:Categories|w\/index\.php\?title=Special:Categories).*/gi.test(window.location.href)) {
      $(".mw-spcontent ul").find("li").each((i, e) => {
        const text = $(e).clone().children().remove().end().text().replaceAll(/.*\(([\d,]+)\smembers?\).*/gi, "$1").replaceAll(/,/gi, "");
        if (parseInt(text, 10) < count) {
          $(e).remove();
        }
      });
    }
  };

  filterCatListByNumberOfMembers(1000);

  const getPageCat = () => {
    const categories = $("#catlinks");
    if ($(categories).length === 0) {
      return null;
    }

    const cats = $(categories).find("#mw-normal-catlinks > ul > li");
    if ($(cats).length > 0) {
      for (let i = 0; i < $(cats).length; i++) {
        const cat = $($(cats)[i]);
        const catText = $(cat).find("a").text().toLowerCase();
        if (catText === "item") {
          return "item";
        }

        if (catText === "merchant") {
          return "merchant";
        }

        if (catText === "achievement") {
          return "achievement";
        }

        if (catText === "action") {
          return "action";
        }

        if (catText === "armor") {
          return "armor";
        }

        if (catText === "bestiary") {
          return "bestiary";
        }
      }
    }
  };

  const createCopyItemButton = () => {
    if (getPageCat() === "item") {
      const itemBox = $("div.wiki.main table.itembox:first-child > tbody:first-child > tr:first-child > td:first-child");
      const itemBoxHeader = $(itemBox).find("table > tbody > tr:first-child > td:last-child");
      if ($(itemBox).length > 0 && $(itemBoxHeader).length > 0) {
        $("<div class=\"copyItemBoxHeaderButton\"><button id=\"copyItemNameButton\" class=\"btn btn-primary\" type=\"button\"><i class=\"fa fa-clipboard\"></i></button></div>").appendTo($(itemBoxHeader));
        $(".copyItemBoxHeaderButton #copyItemNameButton").on("click", () => {
          const itemName = $("div.wiki.main table.itembox:first-child > tbody:first-child > tr:first-child > td:first-child > table > tbody > tr:first-child > td:last-child").clone().children().remove().end().text().replace(/\s+$/gi, "");
          if (itemName !== undefined && itemName !== null && itemName !== "") {
            GM_setClipboard(itemName);
          }
        });
      }
    }
  };

  createCopyItemButton();
});
