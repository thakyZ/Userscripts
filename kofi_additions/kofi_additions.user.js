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
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/styles.min.css
// @resource     copyAuthor https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/copyauthor.template.html
// @resource     notificationButtons https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/notifButtons.template.html
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

// cSpell:ignore followee, useruploads, coffeeshop
// cSpell:ignoreRegExp /(?<="\.?)kfds(?=\-)/
// cSpell:ignoreRegExp /(?<=\-(?:right|left)\-)mrgn(?=-\d+\")/
// cSpell:ignoreRegExp /(?<=\?)txid(?=\=)/
// cSpell:ignoreRegExp /\b\.?swal2\-\w+\b/

this.jQuery(($) => {
  "use strict";

  const waitTime = 10000;

  /**
   * Sleep function, sleeps asynchronously
   * @param {int} ms Milliseconds to sleep for
   * @returns Promise<void>
   */
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * {boolean} Debug variable.
   */
  const DEBUG = false;

  /**
   * Debugs to console if {DEBUG} is true.
   * @param {any} obj The message to send to the debugger
   */
  function consoleDebug(obj) {
    if (DEBUG) {
      console.debug(obj);
    }
  }

  /**
   * Debugs to console if {DEBUG} is true.
   * @param  {...any} obj The message to send to the debugger
   */
  function consoleDebug(...obj) {
    if (DEBUG) {
      console.debug(obj);
    }
  }

  /**
   * Debugs to console if {DEBUG} is true.
   * @param {string} msg The message to send to the debugger
   */
  function consoleDebug(msg) {
    if (DEBUG) {
      console.debug(msg);
    }
  }

  /**
   * Debugs to console if {DEBUG} is true.
   * @param {any} msg The message to send to the debugger
   * @param  {...any} substr Optional parameters for the debugger's message.
   */
  function consoleDebug(msg, ...substr) {
    if (DEBUG) {
      console.debug(msg, substr);
    }
  }

  /**
   * {number} Static private cached number for the document scrolled position in manage notifications.
   */
  let notificationScrollCache = 0;

  /**
   * Constant definitions for operations.
   * @typedef {NCD|NCE|NPD|NPE|PND|PNE} Operation
   */

  /**
   * Detects which operation we want to run.
   * @param {Operation} operation The operation for the task.
   * @returns {string} The selector string of the items we want to modify.
   */
  function getOperation(operation) {
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
  }

  /**
   * Test if the error box exists in the set.
   * @returns {[string | Error, bool]}
   */
  function testIfErrorBoxExists() {
    const foundShownContainers = $("body > .swal2-container.swal2-shown");
    if (foundShownContainers.length > 0) {
      for (const [index, element] of Object.entries(foundShownContainers)) {
        if (isNaN(Number(index))) {
          continue;
        }

        const warningIcon = $(element).children().find(".swal2-icon.swal2-warning");
        if (warningIcon.length > 0 && $(warningIcon[0]).css("display") !== "none") {
          const message = $(element).children().find(".swal2-contentwrapper > .swal2-content").text();
          return [new Error(message), false];
        }
      }
    }

    return ["None", true];
  }

  /**
   *
   * @param {Element} element
   * @param {Operation} operation
   * @param {number} waitTime
   * @returns {Promise<string | boolean>}
   */
  function clickFeedReducer(element, operation, waitTime) {
    return new Promise((resolve, reject) => {
      /*
      $(element).click(async function () {
        consoleDebug("Clicked: " + $(this).parents(".faq-wrapper").find("div:first-child div").text());
        await sleep(1000);
        const [message, returned] = testIfErrorBoxExists();
        $("html, body").animate({ scrollTop: notificationScrollCache }, 800);
        await sleep(waitTime);
        if (returned) {
          resolve(true);
        } else {
          reject(message);
        }
      });
      $(element).click();
      */
      (async function() {
        try {
          let id = "";
          if ($(element).is("input")) {
            id = $(element).attr("id").split("_").at(-1);
          }

          if (operation.endsWith("D") && !$(element).is(":checked")) {
            console.warn(`Attempted operation ${operation} on element when not checked.`, element);
            return;
          }

          if (operation.endsWith("E") && !$(element).is(":checked")) {
            console.warn(`Attempted operation ${operation} on element when is checked.`, element);
            return;
          }

          switch (operation) {
            case "NCD":
            case "NCE":
              unsafeWindow.toggleIsSubscribedToGalleryBlogEmail(id, $(element)[0].checked);
              break;
            case "NPD":
            case "NPE":
              unsafeWindow.toggleIsSubscribedToProductServicesEmail(id, $(element)[0].checked);
              break;
            case "PND":
            case "PNE":
              unsafeWindow.toggleIsSubscribedToPush(id, $(element)[0].checked);
              break;
            default:
              throw new Error(`Invalid operation ${operation}.`);
          }
        } catch (error) {
          console.error(`Failed to run operation ${operation} on element.`, element, error);
          reject(error);
          await sleep(waitTime);
          return;
        }

        resolve(true);
        await sleep(waitTime);
      })();
    });
  }

  /**
   * Run the notification setting mass apply loop.
   * @param {"ENC"|"DNC"|"ENP"|"DNP"|"ENP"|"DNP"|"EPN"|"DPN"} operation The operation for the task.
   * @returns {Promise<Error | undefined, boolean>}
   */
  async function runNotificationModifyMass(operation) {
    try {
      for (const [index, element] of Object.entries($(getOperation(operation)))) {
        const start = new Date();
        if (isNaN(Number(index)) || Number(index) === 0) {
          continue;
        }

        consoleDebug("Setup: " + $(element).parents(".faq-wrapper").find("div:first-child div").text());
        notificationScrollCache = $("html, body").prop("scrollTop");
        /* eslint-disable-next-line no-await-in-loop */
        const returned = await clickFeedReducer(element, waitTime);

        if (typeof returned === "string") {
          throw new Error(returned);
        }

        const end = new Date();
        const difference = Math.ceil((end.getTime() - start.getTime()) / 1000);
        if (difference < 3) {
          throw new Error("Awaited too short " + difference);
        }
      }
    } catch (error) {
      if (error) {
        return Promise.reject(error);
      }
    }

    return Promise.resolve(undefined);
  }

  // Site url regex matches.
  const feedRegex = /https:\/\/(www\.)?ko-fi\.com\/feed/i;
  const shopItemRegex = /https:\/\/(www\.)?ko-fi\.com\/s\/[a-z0-9]+/i;
  const orderDetailsRegex = /https:\/\/(www\.)?ko-fi\.com\/home\/coffeeshop\?txid=/i;

  // Fix shop gradient function regex and strings.
  const badGradientRegex = /background-image: linear-gradient\(180deg, rgb\(229 211 149 \/ 16%\), rgb\(244 240 229 \/ 30%\)\), url\('(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})'\)/i;
  /**
   * OLD:
   * const badGradientRegex = /linear-gradient\(rgba\(229, 211, 149, 0\.16\), rgba\(244, 240, 229, 0\.3\)\), url\("(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})"\)/i;
   */
  const _newGradient = "linear-gradient(180deg, rgb(5 5 5 / 16%), rgb(25 25 25 / 30%))";

  /**
   * Shows the status on the progress bar in the notifications area.
   * @param {Error | undefined} error The error returned from the notification setting mass apply loop.
   * @param {boolean} status The return stats of the notification setting mass apply loop.
   */
  function showStatus(error, status) {
    if (status === false || typeof error !== "undefined") {
      $("#nbnMassStatus").attr("status", "fail");
      $("#nbnMassStatus").text("Error: " + error.message);
    } else {
      $("#nbnMassStatus").attr("status", "success");
      $("#nbnMassStatus").text("Success!");
    }
  }

  /**
   * The then function for when the mass loop option buttons return successfully (or not(?))
   * @param {any} resolved The resolved promise output from the mass loop option buttons' task.
   */
  function forEachButtonThen(resolved) {
    showStatus(resolved, typeof resolved === "undefined");
  }

  /**
   * The catch (or error) function for when the mass loop option buttons get rejected.
   * @param {any} rejected The rejected promise output from the mass loop option buttons' task.
   */
  function forEachButtonCatch(rejected) {
    try {
      showStatus(rejected, typeof rejected === "undefined");
    } catch (error) {
      showStatus(error, false);
      console.error(rejected);
    }
  }

  /**
   * Function to run when looping through each of the buttons in the notification setting mass apply area.
   * @param {index} index The index of the element. (probably not needed.)
   * @param {Element} element The element to apply the onClick event handler to.
   */
  function foreachButton(index, element) {
    $(element).on("click", function () {
      $("#nbnMassStatus").attr("status", "running");
      $("#nbnMassStatus").text("Running...");
      runNotificationModifyMass($(this).attr("id"))
        .then(forEachButtonThen)
        .catch(forEachButtonCatch);
    });
  }

  /**
   * Function to create buttons to alter the notification settings on mass.
   */
  function createNotificationsMass() {
    const notificationButtons = $.fn.createElement("notificationButtons", {});

    const creatorsIFollowBox = $("#mainView > div > div:nth-child(3) > div:first-child > div:last-child:not([id=\"nbnMass\"])");

    const buttons = $(notificationButtons).children().find("button");

    for (const [index, element] of Object.entries(buttons)) {
      if (isNaN(Number(index))) {
        continue;
      }

      foreachButton(index, element);
    }

    $(creatorsIFollowBox).after($(notificationButtons));
  }

  function fixShopGradient() {
    const shops = $(".kfds-c-srf-offer-update-cover");

    for (const [, element] of Object.entries(shops)) {
      const matches = $(element).attr("style").match(badGradientRegex);
      /**
       * OLD:
       * const matches = $(element).css("background-image").match(badGradientRegex);
       */
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

    const copyModNameButton = $.fn.createElement("copyAuthor", {});

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
      /**
       * OLD:
       * $(placement.concat(" + div")).css({ right: "calc(50% - 85px)", position: "absolute" });
       */
      $(copyModNameButton).on("click", function () {
        GM_setClipboard(transformModName(this));
      });
    }
  }

  function addCopyAuthorButton(pageType) {
    if ($("#copy-author-btn").length > 0) {
      return;
    }

    const copyAuthorButton = $.fn.createElement("copyAuthor", {});

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
    id: "Ko-Fi_Additions_Config"
  });
});
