// ==UserScript==
// @name         Paissa Price Copy
// @namespace    NekoBoiNick.Web.FFXIV.Paissa.Copy
// @version      1.0.0
// @description  Adds link to copy price to clipboard.
// @author       Neko Boi Nick
// @match        https://zhu.codes/?/paissa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhu.codes
// @license      MIT
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/paissa_pricecopy/paissa_pricecopy.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/paissa_pricecopy/paissa_pricecopy.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const insertCSS = () => {
    $("head").append(`
<style>
  .priceCopy .priceCopy-btn {
    font-size: 16px;
    color: #363636;
    background: transparent;
    border: none;
    padding: 0;
    border-bottom: 2px dotted #363636;
    cursor: pointer;
  }
  .priceCopy .priceCopy-btn:hover {
    color: blue;
    border-bottom: 2px dotted blue;
  }
</style>`);
  };

  const alterTable = table => {
    let tbody = "";
    if ($(table).prop("tagName") === "TABLE") {
      tbody = "tbody ";
    }

    $(`${tbody}tr`, $(table)).each(function () {
      if ($("td:nth-child(3)", $(this)).children("button").length > 0) {
        return;
      }

      const tdPrice = $("td:nth-child(3)", $(this));
      const price = $(tdPrice).text();
      const priceFormatted = price.replaceAll(",", "");
      if ($(tdPrice).attr("class") === undefined || $(tdPrice).attr("class") === null) {
        $(tdPrice).attr("class", "priceCopy");
      }

      $(tdPrice).html(`<button class="priceCopy-btn">${price}</button>`);
      $("button", $(tdPrice)).on("click", () => {
        GM_setClipboard(priceFormatted);
      });
    });
  };

  const setupMutationObserver = () => {
    const targetNode = $(".section")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, _) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if ($(mutation.target).attr("class") === "container") {
            if ($(mutation.target).children("div.table-container.mt-4").length > 0 && $(mutation.target).children("div.table-container.mt-4").children().length >= 1) {
              const table = $(mutation.target).children("div.table-container.mt-4").children()[0];
              alterTable($(table));
            }
          } else if ($(mutation.target).prop("tagName") === "TBODY") {
            alterTable($(mutation.target));
          } else if ($(mutation.target).attr("class") === "table-container mt-4") {
            if ($(mutation.target).children().length >= 1) {
              const table = $(mutation.target).children()[0];
              alterTable($(table));
            }
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  let id = -1;
  id = setInterval(() => {
    if ($(".section").length > 0) {
      setupMutationObserver();
      clearInterval(id);
    }
  }, 100);
  insertCSS();
});
