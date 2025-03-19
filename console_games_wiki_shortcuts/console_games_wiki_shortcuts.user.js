// ==UserScript==
// @name         Console Games Wiki Shortcuts
// @namespace    NekoBoiNick.Web
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
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

jQuery(($) => {
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

  const styleBase = "#shortcuts{background-color:var(--shortcuts-background);border:1px solid var(--shortcuts-border);width:fit-content;left:194px;position:absolute;padding-left:10px;padding-right:10px}#shortcuts .shortcut:not(:last-child){margin-right:10px;}.shortcut{height:fit-content;float:left;padding:2px;text-align:left;}#shortcuts a:visited{color:var(--shortcuts-anchor-visited-color);}#shortcuts a{font-weight:700;font-size:13px;font-family:sans-serif;color:var(--shortcuts-anchor-color)}";
  const nbnStyleWrapper = $("<style id=\"nbn-overrides\"></style>");
  const stylemap = {
    light: {
      shortcuts_background: "rgba(215 239 242/50%)",
      shortcuts_border: "rgb(167 215 249)",
      shortcuts_anchor_visited: "rgb(0 0 0)",
      shortcuts_anchor_visited_color: "rgb(0 0 0)",
    },
    dark: {
      shortcuts_background: "rgba(24 24 24/50%)",
      shortcuts_border: "rgb(8 8 8)",
      shortcuts_anchor_visited: "rgb(238 238 238)",
      shortcuts_anchor_visited_color: "rgb(238 238 238)",
    },
  };

  function createRootCSS(obj) {
    let sb = ":root{";

    for (const [index, key, value, length] of Object.entries(obj).map((kvp, index, array) => [index, kvp[0], kvp[1], array.length])) {
      sb += "--";
      sb += key.replace(/_/, "-");
      sb += ":";
      sb += value;

      if (index < length - 1) {
        sb += ";";
      }
    }

    sb += "}";

    return sb.toString();
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const switchButton = $("body #mw-navigation #mw-head nav:first-child .vector-menu-content ul li:nth-child(3)");
        console.log(mutation.target, switchButton, switchButton.attr("id"), switchButton.attr("id") === "pt-dm-disable");
        if (switchButton.attr("id") === "pt-dm-disable") {
          nbnStyleWrapper.text(createRootCSS(stylemap.dark));
        } else {
          nbnStyleWrapper.text(createRootCSS(stylemap.light));
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function setupCSS() {
    // TODO: Add style resource
    // GM_addStyle(GM_getResourceText("fix"));
    const styleElement = $("<style></style>");
    styleElement.text(styleBase);
    $("head").append(styleElement);
    $("head").append(nbnStyleWrapper);
  }

  function main() {
    setupCSS();
    setupMutationObserver();

    const items = [];

    for (const value of jsonconfig.items) {
      const tempElement = $(`<div class="shortcut" id="${value.id}"></div>`);
      const tempLink = $(`<a href="${value.url}">${value.name}</a>`);
      $(tempElement).append(tempLink);
      items.push(tempElement);
    }

    const tray = $("<div class=\"shortcuts\" id=\"shortcuts\"></div>");
    $("#mw-head").append(tray);

    for (const value of items) {
      $("#shortcuts").append(value);
    }
  }

  main();
});
