// ==UserScript==
// @name         F95Zone Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Adds various features to F95Zone's Forums.
// @author       Neko Boi Nick
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @license      MIT
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  function parseForGameLinks() {
    const links = Object.entries($("body").find("a")).filter(x => !isNaN(Number(x[0])) && typeof $(x[1]).attr("href") !== "undefined").map(x => [Number(x[0]), $(x[1]).attr("href"), x[1]]);
    for (const [index, href, element] of links) {
      if (/https:\/\/f95zone.to\/threads\/[\w\d\-]+\.\d+\//i.test(href)) {

      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (/https:\/\/f95zone.to\/threads\/[\w\d\-]+\.\d+\/(?:(?:post|page)-\d+)?/i.test(window.location.href)) {
          parseForGameLinks();
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

  function main() {
    setupMutationObserver();
  }

  main();
});