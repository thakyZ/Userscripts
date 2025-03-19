// ==UserScript==
// @name         Trello Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0.1
// @description  Adds features to trello specifically for FFXIV mods.
// @author       Neko Boi Nick
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/trello_additions/trello_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/trello_additions/trello_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  let gmConfigCSS = "";

  function setupCSS() {
  }

  function checkCurrentPage() {
  }

  function setupFrame() {
    const tempFrame = $("<div id=\"trello_additions\" class=\"nbn gmConfigFrame\"></div>");
    $("body").append(tempFrame);
    return $(tempFrame);
  }

  function loadConfigCSS() {
    gmConfigCSS = ":root { }";
  }

  GM_registerMenuCommand("Config", () => {
    GM_config.open();
  });

  loadConfigCSS();

  const gmConfigFrame = setupFrame();

  // Your code here...
  GM_config.init({
    id: "Trello_Additions_Config",
    title: "The Trello Additions Config",
    fields: {
      modpages: {
        label: "List of mod pages",
        type: "hidden",
        value: "",
      }
    },
    events: {
      init() {
        GM_config.frame.setAttribute("style", "display:none;");
        setupCSS();
      },
      open() {
        GM_config.frame.setAttribute("style", "display:block;");
      },
      save(val) {
        checkCurrentPage(val);
      },
      close() {
        GM_config.frame.setAttribute("style", "display:none;");
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });
});
