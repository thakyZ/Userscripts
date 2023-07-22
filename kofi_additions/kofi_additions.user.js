// ==UserScript==
// @name         Ko-Fi Additions
// @namespace    NekoBoiNick.Web.KoFi.Additions
// @version      1.0.1
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
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/styles.min.css
// @resource     copyauthor https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/copyauthor.template.html
// @resource     notifButtons https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/notifButtons.template.html
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  GM_config.init({

  });

  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  const DEBUG = false;

  function consoleDebug(obj) {
    if (DEBUG) {
      console.debug(obj);
    }
  }

  function consoleDebug(...obj) {
    if (DEBUG) {
      console.debug(obj);
    }
  }

  function consoleDebug(msg) {
    if (DEBUG) {
      console.debug(msg);
    }
  }

  function consoleDebug(msg, ...substr) {
    if (DEBUG) {
      console.debug(msg, substr);
    }
  }

  let notificationScrollCache = 0;

  function runNotificationModifyMass(operation) {
    const getOperation = () => {
      const _operation = operation.replace("nbn", "");
      let output = "input[id*=\"%type%\"]:%status%";
      if (_operation.endsWith("NC")) {
        output = output.replace("%type%", "followee_notification_content_email_");
      } else if (_operation.endsWith("NP")) {
        output = output.replace("%type%", "followee_notification_product_services_email_");
      } else if (_operation.endsWith("PN")) {
        output = output.replace("%type%", "followee_notification_content_push_");
      }

      if (_operation.startsWith("D")) {
        output = output.replace("%status%", "checked");
      } else if (_operation.startsWith("E")) {
        output = output.replace("%status%", "not(:checked)");
      }

      return output;
    };

    return new Promise((resolve, reject) => {
      (async function () {
        for (const [key, value] of Object.entries($(getOperation()))) {
          if (!isNaN(key)) {
            consoleDebug("Setup: " + $(value).parents(".faq-wrapper").find("div:first-child div").text());
            notificationScrollCache = $("html, body").prop("scrollTop");
            $(value).click(function () {
              $("html, body").animate({ scrollTop: notificationScrollCache }, 800);
              consoleDebug("Clicked: " + $(this).parents(".faq-wrapper").find("div:first-child div").text());
            });
            // Disable for now:
            // $(value).click();
            await sleep(3000); // eslint-disable-line no-await-in-loop
          }
        }
      })().then((error) => {
        if (error) {
          reject(error, false);
        }

        resolve(undefined, true);
      });
    });
  }

  // Site url regex matches.
  const feedRegex = /https:\/\/(www\.)?ko-fi\.com\/feed/i;
  const shopItemRegex = /https:\/\/(www\.)?ko-fi\.com\/s\/[a-z0-9]+/i;
  const orderDetailsRegex = /https:\/\/(www\.)?ko-fi\.com\/home\/coffeeshop\?txid=/i;

  // Fix shop gradient function regex and strings.
  const badGradientRegex = /background-image: linear-gradient\(180deg, rgb\(229 211 149 \/ 16%\), rgb\(244 240 229 \/ 30%\)\), url\('(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})'\)/i;
  // OLD: const badGradientRegex = /linear-gradient\(rgba\(229, 211, 149, 0\.16\), rgba\(244, 240, 229, 0\.3\)\), url\("(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})"\)/i;
  const _newGradient = "linear-gradient(180deg, rgb(5 5 5 / 16%), rgb(25 25 25 / 30%))";

  function showStatus(error, status) {
    if (status === false) {
      $("#nbnMassStatus").attr("status", "fail");
      $("#nbnMassStatus").text("Error: " + error.nessage);
    } else {
      $("#nbnMassStatus").attr("status", "success");
      $("#nbnMassStatus").text("Sucess!");
    }
  }

  function createNotificationsMass() {
    const notifButtons = $.fn.createElement("notifButtons", {});

    const creatorsIFollowBox = $("#mainView > div > div:nth-child(3) > div:first-child > div:last-child");
    if ($(creatorsIFollowBox).attr("id") === "nbnMass") {
      return;
    }

    $(creatorsIFollowBox).after($(notifButtons));

    $(notifButtons).children().find("button").each((index, element) => {
      $(element).on("click", function () {
        $("#nbnMassStatus").attr("status", "running");
        $("#nbnMassStatus").text("Running...");
        runNotificationModifyMass($(this).attr("id"))
          .then((error, status) => showStatus(error, status));
      });
    });
  }

  function fixShopGradient() {
    const shops = $(".kfds-c-srf-offer-update-cover");

    for (const [, element] of Object.entries(shops)) {
      const matches = $(element).attr("style").match(badGradientRegex);
      // OLD: const matches = $(element).css("background-image").match(badGradientRegex);
      if (matches !== null && matches.length === 2) {
        const newGradient = "url('" + matches[1] + "'), " + _newGradient;
        $(element).css({ backgroundImage: newGradient });
      }
    }
  }

  GM_addStyle(GM_getResourceText("css"));

  function transformModName(element) {
    const text = $(element).parent().prev().text().trim();
    return text;
  }

  function addCopyModNameButton(element, pageType = 0) {
    if ($(element).find("#copy-mod-btn").length > 0) {
      return;
    }

    const copyModNameButton = $.fn.createElement("copyauthor", {});

    $(copyModNameButton).attr("id", "copy-mod-btn");
    $(copyModNameButton).removeClass("btn-x-small-copy-author").addClass("btn-x-small-copy-mod-name");

    let placement;

    if (pageType === 0) {
      placement = element.concat(" > div > div > div:last-child > div:nth-child(2) > ul > li > div:first-child");
      $(element.concat(" > div")).css({ maxWidth: $(".modal-purchased-shop-item-detail[style*=\"display: block;\"] > div").css("max-width").replace(/(\d+px)/i, "calc($1 + 48px)") });
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
      $(copyModNameButton).on("click", function () {
        GM_setClipboard(transformModName(this));
      });
    }
  }

  function addCopyAuthorButton(pageType) {
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
  }

  function callback(mutationList) {
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

      if (/https:\/\/ko-fi\.com\/manage\/notifications.*/gi.test(window.location.href)) {
        createNotificationsMass();
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

  setupMutationObserver();

  GM_config.init({

  });
});
