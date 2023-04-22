// ==UserScript==
// @name         Garland Tools Additions
// @namespace    NekoBoiNick.Web.GarlandTools.Additions
// @version      1.0.1
// @description  Adds various features to Garland Tools
// @author       Neko Boi Nick
// @match        https://garlandtools.org/db/*
// @match        https://www.garlandtools.org/db/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garlandtools.org
// @license      MIT
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/garlandtools_additions/garlandtools_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/garlandtools_additions/garlandtools_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $, gt */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const setClipboard = name => {
    GM_setClipboard(name);
  };

  setInterval(() => {
    if (gt.list.current.length > 0) {
      gt.list.current.forEach(item => {
        if (item.type === "item") {
          const itemBlock = $(`div[data-id="${item.id}"].item`);
          const nameHandle = $("h1.name span.name-handle", $(itemBlock));
          if ($(nameHandle).next().length < 1 || $(nameHandle).next().attr("class").split(" ")[0] !== "copy-button") {
            const copyItemNameButton = $("<img src=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSAyMy42MzU5LDM3LjI3MjggSCAxNC41NDUgdiA2My42MzYyIGMgMCw1IDQuMDkwOSw5LjA5MSA5LjA5MDksOS4wOTEgaCA2My42MzYzIHYgLTkuMDkxIEggMjMuNjM1OSBNIDk2LjM2NDIsMTkuMDkwOSBIIDgxLjgxNzcgQyA3OS45OTk2LDEzLjYzNjMgNzQuOTk5NiwxMCA2OS4wOTA0LDEwIDYzLjE4MTMsMTAgNTguMTgxMywxMy42MzYzIDU2LjM2MzIsMTkuMDkwOSBIIDQxLjgxNzcgYyAtNSwwIC05LjA5MDksNC4wOTA5IC05LjA5MDksOS4wOTA5IHYgNTQuNTQ1NyBjIDAsNSA0LjA5MDksOS4wOTA4IDkuMDkwOSw5LjA5MDggaCA1NC41NDY1IGMgNC45OTk4LDAgOS4wOTA4LC00LjA5MDggOS4wOTA4LC05LjA5MDggViAyOC4xODE4IGMgMCwtNSAtNC4wOTEsLTkuMDkwOSAtOS4wOTA4LC05LjA5MDkgbSAtMjcuMjczOCwwIGMgMi43MjczLDAgNC41NDU1LDIuMjcyOCA0LjU0NTUsNC41NDU0IDAsMi4yNzI4IC0yLjI3MjcsNC41NDU1IC00LjU0NTUsNC41NDU1IC0yLjI3MjcsMCAtNC41NDU0LC0yLjI3MjcgLTQuNTQ1NCwtNC41NDU1IDAsLTIuMjcyNiAxLjgxODIsLTQuNTQ1NCA0LjU0NTQsLTQuNTQ1NCB6IiBmaWxsPSJ3aGl0ZSIvPgoKPC9zdmc+Cg==\" class=\"copy-button button\">");
            $(copyItemNameButton).insertAfter($(nameHandle));
            $(copyItemNameButton).on("click", () => {
              GM_setClipboard(gt.item.index[item.id].name);
            });
          }
        } else if (item.type === "group") {
          const groupBlock = $(`div[data-id="${item.id}"]`);
          item.blocks.forEach(block => {
            const itemGrab = $(`div[data-id="${block.id}"]`, $(groupBlock));
            const blockHandle = $(".block-name", $(itemGrab));
            if ($(".copy-button", $(blockHandle)).length < 1) {
              const copyItemNameButton = $("<img src=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSAyMy42MzU5LDM3LjI3MjggSCAxNC41NDUgdiA2My42MzYyIGMgMCw1IDQuMDkwOSw5LjA5MSA5LjA5MDksOS4wOTEgaCA2My42MzYzIHYgLTkuMDkxIEggMjMuNjM1OSBNIDk2LjM2NDIsMTkuMDkwOSBIIDgxLjgxNzcgQyA3OS45OTk2LDEzLjYzNjMgNzQuOTk5NiwxMCA2OS4wOTA0LDEwIDYzLjE4MTMsMTAgNTguMTgxMywxMy42MzYzIDU2LjM2MzIsMTkuMDkwOSBIIDQxLjgxNzcgYyAtNSwwIC05LjA5MDksNC4wOTA5IC05LjA5MDksOS4wOTA5IHYgNTQuNTQ1NyBjIDAsNSA0LjA5MDksOS4wOTA4IDkuMDkwOSw5LjA5MDggaCA1NC41NDY1IGMgNC45OTk4LDAgOS4wOTA4LC00LjA5MDggOS4wOTA4LC05LjA5MDggViAyOC4xODE4IGMgMCwtNSAtNC4wOTEsLTkuMDkwOSAtOS4wOTA4LC05LjA5MDkgbSAtMjcuMjczOCwwIGMgMi43MjczLDAgNC41NDU1LDIuMjcyOCA0LjU0NTUsNC41NDU0IDAsMi4yNzI4IC0yLjI3MjcsNC41NDU1IC00LjU0NTUsNC41NDU1IC0yLjI3MjcsMCAtNC41NDU0LC0yLjI3MjcgLTQuNTQ1NCwtNC41NDU1IDAsLTIuMjcyNiAxLjgxODIsLTQuNTQ1NCA0LjU0NTQsLTQuNTQ1NCB6IiBmaWxsPSJ3aGl0ZSIvPgoKPC9zdmc+Cg==\" class=\"copy-button button\">");
              $(copyItemNameButton).insertAfter($("img.close-button.remove-group-block", $(blockHandle)));
              $(copyItemNameButton).on("click", () => setClipboard(gt.item.index[block.id].name));
            }
          });
        }
      });
    }
  }, 1000);
  $("head").append(
    $(`<style>
  .item.block .copy-button {
    width: 22px;
    height: 22px;
    padding: 3px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid transparent;
    cursor: pointer;
    position: absolute;
    right: 46px;
    top: 2px;
  }
  .item.block .copy-button:hover {
    border: 1px solid #1c1c1c;
    background-color: #437487;
  }
  .group.block .copy-button {
    width: 22px;
    height: 22px;
    padding: 3px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid transparent;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 4px;
  }
  .group.block .copy-button:hover {
    border: 1px solid #1c1c1c;
    background-color: #437487;
  }
</style>`));
});
