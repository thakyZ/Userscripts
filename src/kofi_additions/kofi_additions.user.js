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
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
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

  GM_config.init({

  });

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

  GM_addStyle(GM_getResourceText("css"));

  const transfromModName = function (element) {
    const text = $(element).parent().prev().text().trim();
    return text;
  };

  const addCopyModNameButton = function (element, pageType = 0) {
    if ($(element).find("#copy-mod-btn").length > 0) {
      return;
    }

    const copyModNameButton = $.fn.createElement("copyauthor", {});

    $(copyModNameButton).attr("id", "copy-mod-btn");
    $(copyModNameButton).removeClass("btn-x-small-copy-author").addClass("btn-x-small-copy-mod-name");

    let placement;

    if (pageType === 0) {
      placement = element.concat(" > div > div > div:last-child > div:nth-child(2) > ul > li > div:first-child");
    }

    if (pageType === 0) {
      $(placement).after("<div class></div>");
      $(copyModNameButton).removeClass("kfds-right-mrgn-8").addClass("kfds-left-mrgn-8");
      $(copyModNameButton).removeClass("btn-xs").addClass("btn-sm");
      $(copyModNameButton).removeClass("btn-x-small-copy-mod-name").addClass("btn-small-copy-mod-name");
      $(copyModNameButton).addClass("kfds-btn-tertiary-light-s");
    }

    if (pageType === 0) {
      $(placement.concat(" + div")).append($(copyModNameButton));
      $(placement.concat(" + div")).css({ right: "calc(50% - 85px)", position: "absolute" });
      $(copyModNameButton).on("click", function () {
        GM_setClipboard(transfromModName(this));
      });
    }
  };

  const addCopyAuthorButton = pageType => {
    if ($("#copy-author-btn").length > 0) {
      return;
    }

    const copyAuthorButton = $.fn.createElement("copyauthor", {});

    let placement;
    let newSpacer;

    if (pageType === 0) {
      placement = $(".shop-item-title + div > div > a:first-child");
    } else if (pageType === 1) {
      placement = $("span:contains(\"Creator\") + a");
    } else if (pageType === 2) {
      placement = $("div#profile-header-v2 > div > div:first-child > div:first-child > div:last-child > div:nth-child(2)");
    }

    // Pre add spacer that already exists.
    if (pageType === 0) {
      const spacer = $($(placement).find("span")[1]);
      newSpacer = $(spacer).clone();
      $(spacer).html("&nbsp;");
    } else if (pageType === 1) {
      const flex = $(placement).attr("class").split(" ")[0];
      const container = $("<div class=\"" + flex + "\"></div>");
      $(container).insertBefore($(placement));
      $(container).append($(placement));
    } else if (pageType === 2) {
      $(placement).css({ display: "flex", justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start" });
    }

    $(placement).after($(copyAuthorButton));

    if (pageType <= 1) {
      $(copyAuthorButton).after($(newSpacer));
      $(copyAuthorButton).on("click", function () {
        GM_setClipboard($($(this).parent().find("a").find("span")[0]).text());
      });
    } else if (pageType === 2) {
      $(placement).children("span").after($(copyAuthorButton));
      $(copyAuthorButton).css({ margin: "2px 4px" });
      $(copyAuthorButton).on("click", function () {
        GM_setClipboard($(this).prev().text());
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
          } else if ($("head meta[property=\"og:type\"]").attr("content") === "profile") {
            addCopyAuthorButton(2);
          } else {
            /* eslint-disable no-lonely-if */
            if (shopItemRegex.test(window.location.href)) {
            /* eslint-enable no-lonely-if */
              addCopyAuthorButton(0);
            } else if (orderDetailsRegex.test(window.location.href)) {
              addCopyAuthorButton(1);
            }
          }
        } else if (mutation.type === "attributes") {
          if (orderDetailsRegex.test(window.location.href) && $(".modal-purchased-shop-item-detail[style*=\"display: block;\"]").length > 0) {
            addCopyModNameButton(".modal-purchased-shop-item-detail[style*=\"display: block;\"]");
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
