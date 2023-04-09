// ==UserScript==
// @name         Ko-Fi Additions
// @namespace    NekoBoiNick.Web.KoFi.Additions
// @version      1.0.0
// @description  Adds some additional feature to Ko-Fi
// @author       Neko Boi Nick
// @match        https://ko-fi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ko-fi.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/styles.min.css
// @resource     copyauthor https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/copyauthor.template.html
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  // Site url regex matches.
  const feedRegex = /https:\/\/(www\.)?ko-fi\.com\/feed/i;
  const shopItemRegex = /https:\/\/(www\.)?ko-fi\.com\/s\/[a-z0-9]+/i;
  const orderDetailsRegex = /https:\/\/(www\.)?ko-fi\.com\/home\/coffeeshop\?txid=/i;

  // Fix shop gradient function regex and strings.
  const badGradientRegex = /background-image: linear-gradient\(180deg, rgb\(229 211 149 \/ 16%\), rgb\(244 240 229 \/ 30%\)\), url\('(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})'\)/i;
  // OLD: const badGradientRegex = /linear-gradient\(rgba\(229, 211, 149, 0\.16\), rgba\(244, 240, 229, 0\.3\)\), url\("(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})"\)/i;
  const newGradient = "linear-gradient(180deg, rgb(5 5 5 / 16%), rgb(25 25 25 / 30%))";

  const fixShopGradient = () => {
    const shops = $(".kfds-c-srf-offer-update-cover");

    for (const [, element] of Object.entries(shops)) {
      const matches = $(element).attr("style").match(badGradientRegex);
      // OLD: const matches = $(element).css("background-image").match(badGradientRegex);
      if (matches !== null && matches.length === 2) {
        const newGraident = "url('" + matches[1] + "'), " + newGradient;
        $(element).css({ backgroundImage: newGraident });
      }
    }
  };

  const addCopyAuthorButton = pageType => {
    if ($("#copy-author-btn").length > 0) {
      return;
    }

    GM_addStyle(GM_getResourceText("css"));

    let placement;
    let newSpacer;
    let copyAuthorButton;

    if (pageType === 0) {
      placement = $(".shop-item-title + div > div > a:first-child");
    } else if (pageType === 1) {
      placement = $("body");
    }

    // Pre add spacer that already exists.
    if (pageType === 0) {
      const spacer = $($(placement).find("span")[1]);
      newSpacer = $(spacer).clone();
      $(spacer).html("&nbsp;");
    }

    if (pageType === 0) {
      copyAuthorButton = $.fn.createElement("copyauthor", {});
      $(placement).after($(copyAuthorButton));
      $(copyAuthorButton).after($(newSpacer));
      $(copyAuthorButton).on("click", function () {
        GM_setClipboard($($(this).parent().find("a.kfds-lyt-row").find("span")[0]).text());
      });
    }
  };

  const setupMutationObserver = () => {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if ($(mutation.target).is("div#feedDiv")) {
            if (feedRegex.test(window.location.href)) {
              fixShopGradient();
            }
          } else {
            /* eslint-disable no-lonely-if */
            if (shopItemRegex.test(window.location.href)) {
            /* eslint-enable no-lonely-if */
              addCopyAuthorButton(0);
            } else if (orderDetailsRegex.test(window.location.href)) {
              addCopyAuthorButton(1);
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

  setupMutationObserver();
});
