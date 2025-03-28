// ==UserScript==
// @name         Pterodactyl Wiki Changes
// @namespace    NekoBoiNick.Web
// @version      1.0.4.1
// @description  Changes things on the Pterodactyl wiki
// @author       Neko Boi Nick
// @match        https://pterodactyl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterodactyl.io
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/pterodactyl_wikichanges/pterodactyl_wikichanges.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/pterodactyl_wikichanges/pterodactyl_wikichanges.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/pterodactyl_wikichanges/style.min.css
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  GM_addStyle(GM_getResourceText("css"));

  const mdiContentCopy = "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z";

  const createSVG = () => `<svg viewbox="0 0 24 24" width="0.875rem" height="0.875rem" fill="#fff"><path d="${mdiContentCopy}"/></svg>`;

  function modifyCodeBox(codeBox, codes) {
    const parent = $(codeBox).parent().parent();
    const container = $("<div class=\"codebox_buttons\"></div>");
    $(container).insertBefore($(parent));
    $(parent).prependTo($(container));
    const buttons = $("<div class=\"buttons\"></div>");
    $(container).prepend($(buttons));
    for (const element of codes) {
      const row = $("<div class=\"row\"></div>");
      if (element !== "") {
        const copyButton = $(`<button id="copyLine2">${createSVG()}</button>`);
        $(row).append($(copyButton));
        $(copyButton).data("code", element);
        $(copyButton).on("click", (event) => {
          GM_setClipboard($(event.currentTarget).data().code);
        });
      }

      $(buttons).append($(row));
    }
  }

  function addCopyButtons(codeBox) {
    const code = $(codeBox).html().split("\n");
    const codes = [];
    for (const line of code) {
      if (typeof line !== "string" || line === "") {
        codes.push("");
        continue;
      }

      const parsed = $(`<div>${line}</div>`);
      parsed.find("span.comment").remove();

      if (typeof parsed.text() !== "string" || parsed.text() === "") {
        codes.push("");
        continue;
      }

      codes.push(parsed.text().trim());
    }

    if (codes.slice(-1)[0] === "") {
      codes.pop();
    }

    modifyCodeBox(codeBox, codes);
  }

  function detectScriptBoxes() {
    const codeBoxes = $(".content > div[class*=\"language-\"] > pre[class*=\"language-\"]:not(.language-text) code");
    if (codeBoxes.length > 0) {
      $(codeBoxes).each((index, element) => {
        addCopyButtons(element);
      });
    }
  }

  function setupMutationObserver() {
    const targetNode = $("#app")[0];
    const config = { attributes: true, childList: true, subtree: true };

    function callback(mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if ($(mutation.target).hasClass("theme-container") || $(mutation.target).hasClass("global-ui") || $(mutation.target).hasClass("page")) {
            detectScriptBoxes();
          }
        }
      }
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    if (typeof unsafeWindow.nbn !== "object") {
      unsafeWindow.nbn = {};
    }

    unsafeWindow.nbn.$ = $;

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
  detectScriptBoxes();
});
