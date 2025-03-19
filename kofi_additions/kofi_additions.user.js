// @ts-check
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
/// <reference path="../node_modules/@types/tampermonkey/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/JQuery.d.ts" />
/// <reference path="../library/nekogaming.userscript.lib.d.ts" />
/// <reference path="../types/gm_config.d.ts" />
this.jQuery = jQuery.noConflict(true);

// cSpell:ignore followee, useruploads, coffeeshop
// cSpell:ignoreRegExp /(?<="\.?)kfds(?=\-)/
// cSpell:ignoreRegExp /(?<=\-(?:right|left)\-)mrgn(?=-\d+\")/
// cSpell:ignoreRegExp /(?<=\?)txid(?=\=)/
// cSpell:ignoreRegExp /\b\.?swal2\-\w+\b/

this.jQuery(
  /** @param {JQueryStatic} $ */
  ($) => {
    "use strict";

    /**
     * @typedef ClickFeedReducerOutput
     * @type {[Error, false] | [String, true]}
     */

    /** @type {Number} */
    const waitTime = 10000;

    /**
     * @type {Boolean} Debug variable.
     */
    const DEBUG = false;

    /** @type {Number} Static private cached number for the document scrolled position in manage notifications. */
    let notificationScrollCache = 0;

    // Site url regex matches.
    /** @type {RegExp} */
    const feedRegex = /https:\/\/(www\.)?ko-fi\.com\/feed/i;
    /** @type {RegExp} */
    const shopItemRegex = /https:\/\/(www\.)?ko-fi\.com\/s\/[a-z0-9]+/i;
    /** @type {RegExp} */
    const orderDetailsRegex = /https:\/\/(www\.)?ko-fi\.com\/home\/coffeeshop\?txid=/i;

    // Fix shop gradient function regex and strings.
    /** @type {RegExp} */
    const badGradientRegex = /background-image: linear-gradient\(180deg, rgb\(229 211 149 \/ 16%\), rgb\(244 240 229 \/ 30%\)\), url\('(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})'\)/i;

    /**
     * OLD:
     * const badGradientRegex = /linear-gradient\(rgba\(229, 211, 149, 0\.16\), rgba\(244, 240, 229, 0\.3\)\), url\("(https:\/\/storage.ko-fi.com\/cdn\/useruploads\/post\/.*\..{3,4})"\)/i;
     */
    /** @type {String} */
    const _newGradient = "linear-gradient(180deg, rgb(5 5 5 / 16%), rgb(25 25 25 / 30%))";

    /**
     * Constant definitions for operations.
     * @readonly
     * @enum {String}
     */
    const Operation = {
      ENC: "ENABLE_NEW_CONTENT",
      DNC: "DISABLE_NEW_CONTENT",
      ENP: "ENABLE_NEW_PRODUCT",
      DNP: "DISABLE_NEW_PRODUCT",
      EPN: "ENABLE_PUSH_NOTIFICATIONS",
      DPM: "DISABLE_PUSH_NOTIFICATIONS",
      EAN: "ENABLE_ALL_NOTIFICATIONS",
      DAN: "DISABLE_ALL_NOTIFICATIONS",
    };

    /**
     * An enum specifying different page types.
     * @readonly
     * @enum {Number}
     */
    const PageType = {
      ShopPage: 0,
      DownloadPage: 1,
      AuthorPage: 2,
    };

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
     * Debugs to console if {DEBUG} is true.
     * @param {unknown} obj The message to send to the debugger
     */
    function consoleDebug(obj) {
      if (DEBUG || unsafeWindow.nbn?.lib?.debug) {
        console.debug(obj);
      }
    }

    /**
     * Debugs to console if {DEBUG} is true.
     * @param  {...unknown} obj The message to send to the debugger
     */
    function consoleDebug(...obj) {
      if (DEBUG || unsafeWindow.nbn?.lib?.debug) {
        console.debug(...obj);
      }
    }

    /**
     * Debugs to console if {DEBUG} is true.
     * @param {string} msg The message to send to the debugger
     */
    function consoleDebug(msg) {
      if (DEBUG || unsafeWindow.nbn?.lib?.debug) {
        console.debug(msg);
      }
    }

    /**
     * Debugs to console if {DEBUG} is true.
     * @param {unknown} msg The message to send to the debugger
     * @param  {...unknown} substr Optional parameters for the debugger's message.
     */
    function consoleDebug(msg, ...substr) {
      if (DEBUG || unsafeWindow.nbn?.lib?.debug) {
        console.debug(msg, ...substr);
      }
    }

    /**
     * Determines if the operation type if All Notifications related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is All Notifications related; otherwise false.
     */
    function operationIsAllNotifications(operation) {
      return operation === Operation.DAN || operation === Operation.EAN;
    }

    /**
     * Determines if the operation type if New Content related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is New Content related; otherwise false.
     */
    function operationIsNewContent(operation) {
      return operation === Operation.DNC || operation === Operation.ENC;
    }

    /**
     * Determines if the operation type if New Product related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is New Product related; otherwise false.
     */
    function operationIsNewProduct(operation) {
      return operation === Operation.DNP || operation === Operation.ENP;
    }

    /**
     * Determines if the operation type if Push Notifications related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is Push Notifications related; otherwise false.
     */
    function operationIsPushNotifications(operation) {
      return operation === Operation.DPN || operation === Operation.EPN;
    }

    /**
     * Determines if the operation type if Disable related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is Disable related; otherwise false.
     */
    function operationIsDisable(operation) {
      return operation === Operation.DNC || operation === Operation.DNP || operation === Operation.DPN || operation === Operation.DAN;
    }

    /**
     * Determines if the operation type if Enable related
     * @param {Operation} operation The operation for the task.
     * @returns {Boolean} Returns true if it is Enable related; otherwise false.
     */
    function operationIsEnable(operation) {
      return operation === Operation.ENC || operation === Operation.ENP || operation === Operation.EPN || operation === Operation.EAN;
    }

    /**
     * Detects which operation we want to run.
     * @param {Operation} operation The operation for the task.
     * @returns {String} The selector string of the items we want to modify.
     */
    function getOperation(operation) {
      let output = "input[id*=\"%type%\"]:%status%";
      if (operationIsNewContent(operation)) {
        output = output.replace("%type%", "followee_notification_content_email_");
      } else if (operationIsNewProduct(operation)) {
        output = output.replace("%type%", "followee_notification_product_services_email_");
      } else if (operationIsPushNotifications(operation)) {
        output = output.replace("%type%", "followee_notification_content_push_");
      }

      if (operationIsDisable(operation)) {
        output = output.replace("%status%", "checked");
      } else if (operationIsEnable(operation)) {
        output = output.replace("%status%", "not(:checked)");
      }

      return output;
    }

    /**
     * Test if the error box exists in the set.
     * @returns {[String | Error, Boolean]}
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
     * @returns {Promise<ClickFeedReducerOutput>}
     */
    function clickFeedReducer(element, id, operation, waitTime) {
      return new Promise((resolve) => {
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
            if (operationIsDisable(operation) && !$(element).is(":checked")) {
              console.warn(`Attempted operation ${operation} on element when not checked.`, element);
              return;
            }

            if (operationIsEnable(operation) && !$(element).is(":checked")) {
              console.warn(`Attempted operation ${operation} on element when is checked.`, element);
              return;
            }

            switch (operation) {
              case Operation.DNC:
                unsafeWindow.toggleIsSubscribedToGalleryBlogEmail(id, $(element)[0].checked);
                $(element).removeAttr("checked");
                break;
              case Operation.ENC:
                unsafeWindow.toggleIsSubscribedToGalleryBlogEmail(id, $(element)[0].checked);
                $(element).attr("checked");
                break;
              case Operation.DNP:
                unsafeWindow.toggleIsSubscribedToProductServicesEmail(id, $(element)[0].checked);
                $(element).removeAttr("checked");
                break;
              case Operation.ENP:
                unsafeWindow.toggleIsSubscribedToProductServicesEmail(id, $(element)[0].checked);
                $(element).attr("checked");
                break;
              case Operation.DPN:
                unsafeWindow.toggleIsSubscribedToPush(id, $(element)[0].checked);
                $(element).removeAttr("checked");
                break;
              case Operation.EPN:
                unsafeWindow.toggleIsSubscribedToPush(id, $(element)[0].checked);
                $(element).attr("checked");
                break;
              case Operation.DAN:
              case Operation.EAN:
                break;
              default:
                throw new TypeError(`Invalid operation ${operation}.`);
            }
          } catch (error) {
            await sleep(waitTime);
            throw error;
          }

          await sleep(waitTime);
          resolve(["", true]);
        })().then(
          /**
           * Ran when the promise is resolved.
           * @param {[String | Error, Boolean]} value The return value of the async method
           */
          (value) => {
            consoleDebug("Successfully ran method \"clickFeedReducer\" with return value of:", value);
            if (typeof value === "string") {
              resolve([value, true]);
            } else if (value instanceof Error) {
              resolve([value, false]);
            } else {
              resolve([value, true]);
            }
          },
          /**
           * Ran when the promise is rejected.
           * @param {Error | undefined | unknown} error The reason for the thrown exception.
           */
          (error) => {
            if (typeof error === "string") {
              resolve([new Error(error), false]);
            } else if (error instanceof Error) {
              resolve([error, false]);
            } else {
              resolve([new Error("Failed to run method \"clickFeedReducer\"."), false]);
            }
          }
        );
      });
    }

    /**
     * Run the notification setting mass apply loop.
     * @param {Operation} operation The operation for the task.
     * @returns {Promise<Error | undefined>}
     */
    function runNotificationModifyMass(operation) {
      return new Promise((resolve, reject) => {
        (async () => {
          /** @type {JQueryElement} */
          const object = $(getOperation(operation));
          if (object.length === 0) {
            throw new Error("Found no element to operate on.");
          }

          for (const [_index, element] of Object.entries(object)) {
            /** @type {Date} */
            const start = new Date();
            /** @type {Number} */
            const index = Number.parseInt(_index, 10);
            if (Number.isNaN(index) || index === 0) {
              continue;
            }

            consoleDebug(`Setup: ${$(element).parents(".faq-wrapper").find("div:first-child div").text()}`);
            notificationScrollCache = $("html, body").prop("scrollTop");
            /** @type {String} */
            let id = "";

            if (Number(index) > 0 && $(element).is("input")) {
              id = $(element).attr("id").split("_").at(-1);
            }

            /** @type {ClickFeedReducerOutput} */ // eslint-disable-next-line no-await-in-loop
            const returned = await clickFeedReducer(element, id, operation, waitTime);

            if (returned[1] === false) {
              throw new Error(returned[0]);
            }

            if (returned[0] && returned[0] !== "") {
              console.log(returned[0]);
            }

            /** @type {Date} */
            const end = new Date();
            /** @type {Number} */
            const difference = Math.ceil((end.getTime() - start.getTime()) / 1000);
            if (difference < 3) {
              throw new Error(`Awaited too short ${difference}`);
            } else {
              $("html, body").prop("scrollTop", notificationScrollCache);
            }
          }

          return undefined;
        })().then(
          /**
           * Ran when the promise is resolved.
           * @param {unknown} value The return value of the async method
           */
          (value) => {
            consoleDebug("Successfully ran method \"runNotificationModifyMass\" with return value of:", value);
          },
          /**
           * Ran when the promise is rejected.
           * @param {Error | undefined | unknown} error The reason for the thrown exception.
           */
          (error) => {
            if (typeof error === "string") {
              reject(new Error(error));
            } else if (error instanceof Error) {
              reject(error);
            } else {
              reject(new Error("Failed to "));
            }
          }
        );
      });
    }

    /**
     * Shows the status on the progress bar in the notifications area.
     * @param {Error | undefined | unknown} error The error returned from the notification setting mass apply loop.
     * @param {Boolean} status The return stats of the notification setting mass apply loop.
     */
    function showStatus(error, status) {
      if (status === false || typeof error !== "undefined") {
        $("#nbnMassStatus").attr("status", "fail");
        $("#nbnMassStatus").text(`Error: ${error.message}`);
      } else {
        $("#nbnMassStatus").attr("status", "success");
        $("#nbnMassStatus").text("Success!");
      }
    }

    /**
     * The then function for when the mass loop option buttons return successfully (or not(?))
     * @param {unknown} resolved The resolved promise output from the mass loop option buttons' task.
     */
    function forEachButtonThen(resolved) {
      showStatus(resolved, typeof resolved === "undefined");
    }

    /**
     * The catch (or error) function for when the mass loop option buttons get rejected.
     * @param {unknown} rejected The rejected promise output from the mass loop option buttons' task.
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
     * @param {Number} index The index of the element. (probably not needed.)
     * @param {JQuery<HTMLDivElement>} element The element to apply the onClick event handler to.
     */
    function foreachButton(index, element) {
      element.on(
        "click",
        /**
         * Ran when the event fires.
         * @param {MouseEvent} event The event fired.
         */
        (event) => {
          $("#nbnMassStatus").attr("status", "running");
          $("#nbnMassStatus").text("Running...");
          /** @type {String} */
          const id = $(event.target).attr("id");
          runNotificationModifyMass(id).then(
            /**
             * Ran when the promise is resolved.
             * @param {unknown} value The return value of the async method
             */
            (value) => {
              forEachButtonThen(value);
            },
            /**
             * Ran when the promise is rejected.
             * @param {unknown} error The reason for the thrown exception.
             */
            (error) => {
              forEachButtonCatch(error);
            }
          );
        }
      );
    }

    /**
     * Function to create buttons to alter the notification settings on mass.
     */
    function createNotificationsMass() {
      /** @type {JQuery<HTMLDivElement>} */
      const notificationButtons = $.fn.createElement("notificationButtons", {});

      /** @type {JQuery<HTMLDivElement>} */
      const creatorsIFollowBox = $("#mainView > div > div:nth-child(3) > div:first-child > div:last-child:not([id=\"nbnMass\"])");

      /** @type {JQuery<HTMLButtonElement>} */
      const buttons = $(notificationButtons).children().find("button");

      for (const [_index, element] of Object.entries(buttons)) {
        /** @type {Number} */
        const index = Number.parseInt(_index, 10);
        if (Number.isNaN(index)) {
          continue;
        }

        foreachButton(index, $(element));
      }

      creatorsIFollowBox.after(notificationButtons);
    }

    /**
     * Fixes the gradient on shop offer elements.
     */
    function fixShopGradient() {
      /** @type {Jquery<HTMLElement>} */
      const shops = $(".kfds-c-srf-offer-update-cover");

      for (const [, _element] of Object.values(shops)) {
        /** @type {Jquery<HTMLElement>} */
        const element = $(_element);
        /** @type {RegExpMatchArray} */
        const matches = element.attr("style").match(badGradientRegex);
        /**
         * OLD:
         * const matches = element.css("background-image").match(badGradientRegex);
         */
        if (matches !== null && matches.length === 2) {
          /** @type {String} */
          const newGradient = `url('${matches[1]}'), ${_newGradient}`;
          element.css({ backgroundImage: newGradient });
        }
      }
    }

    /**
     * Internal method to modify the mod name's
     * @param {JQuery<HTMLElement>} element The element of which follows the element containing the mod's name.
     * @returns {String} The mod's name.
     */
    function transformModName(element) {
      /** @type {String | undefined} */
      const text = element?.parent()?.prev()?.text()?.trim();
      if (!text) {
        throw new Error("Failed to get mod name.");
      }

      return text;
    }

    /**
     * Adds a button to the page to copy the mod name.
     * @param {String} selector The element selector to apply the button to.
     * @param {PageType} pageType The type of page we are modifying.
     * @returns {void}
     */
    function addCopyModNameButton(selector, pageType) {
      if (selector.find("#copy-mod-btn").length > 0) {
        return;
      }

      /** @type {JQuery<HTMLButtonElement>} */
      const copyModNameButton = $.fn.createElement("copyAuthor", {});

      copyModNameButton.attr("id", "copy-mod-btn");
      copyModNameButton.removeClass("btn-x-small-copy-author").addClass("btn-x-small-copy-mod-name");

      /** @type {String} selector */
      let placement;

      if (pageType === PageType.DownloadPage) {
        placement = selector.concat(" > div > div > div:last-child > div:nth-child(2) > ul > li > div:first-child");
        $(selector.concat(" > div")).css({ maxWidth: $(".modal-purchased-shop-item-detail[style*=\"display: block;\"] > div").css("max-width").replace(/(\d+px)/i, "calc($1 + 48px)") });
      }

      if (pageType === PageType.DownloadPage) {
        $(placement).after("<div class></div>");
        copyModNameButton.removeClass("kfds-right-mrgn-8").addClass("kfds-left-mrgn-8");
        copyModNameButton.removeClass("btn-xs").addClass("btn-sm");
        copyModNameButton.removeClass("btn-x-small-copy-mod-name").addClass("btn-small-copy-mod-name");
        copyModNameButton.addClass("kfds-btn-tertiary-light-s");
      }

      if (pageType === PageType.DownloadPage) {
        $(placement.concat(" + div")).append(copyModNameButton);
        /**
         * OLD:
         * $(placement.concat(" + div")).css({ right: "calc(50% - 85px)", position: "absolute" });
         */
        $(copyModNameButton).on(
          "click",
          /**
           * Ran when the event fires.
           * @param {MouseEvent} event The event fired.
           */
          (event) => {
            /** @type {Error} */
            const backupError = new Error("Failed to copy mod name.");
            try {
              /** @type {JQuery<HTMLElement>} */
              const target = $(event.target);
              /** @type {String | undefined} */
              const text = transformModName(target);
              if (!text) {
                throw backupError;
              }

              GM_setClipboard(text);
            } catch (error) {
              console.error(error ?? backupError);
            }
          });
      }
    }

    /**
     * Adds a button to the page to copy the author name.
     * @param {PageType} pageType The type of page we are modifying.
     * @returns {void}
     */
    function addCopyAuthorButton(pageType) {
      if ($("#copy-author-btn").length > 0) {
        return;
      }

      /** @type {JQuery<HTMLButtonElement>} */
      const copyAuthorButton = $.fn.createElement("copyAuthor", {});

      /** @type {JQuery<HTMLElement>} */
      let placement;
      /** @type {JQuery<HTMLSpanElement>} */
      let newSpacer;

      if (pageType === PageType.ShopPage) {
        placement = $(".shop-item-title + div > div > a:first-child");
      } else if (pageType === PageType.AuthorPage) {
        placement = $("span:contains(\"Creator\") + a");
      } else if (pageType === PageType.DownloadPage) {
        placement = $("div#profile-header-v2 > div > div:first-child > div:first-child > div:last-child > div:nth-child(2)");
      }

      // Pre add spacer that already exists.
      if (pageType === PageType.ShopPage) {
        /** @type {JQuery<HTMLSpanElement>} */
        const spacer = $(placement).find("span").eq(1);
        newSpacer = $(spacer).clone();
        $(spacer).html("&nbsp;");
      } else if (pageType === PageType.AuthorPage) {
        /** @type {String | undefined} */
        const flex = $(placement).attr("class")?.split(" ")[0];
        if (!flex) {
          throw new TypeError("Failed to find flex element on Author Page.");
        }

        /** @type {JQuery<HTMLDivElement>} */
        const container = $(`<div class="${flex}"></div>`);
        $(container).insertBefore(placement);
        $(container).append(placement);
      } else if (pageType === PageType.DownloadPage) {
        $(placement).css({ display: "flex", justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start" });
      }

      $(placement).after($(copyAuthorButton));

      if (pageType <= PageType.DownloadPage) {
        $(copyAuthorButton).after($(newSpacer));
        $(copyAuthorButton).on(
          "click",
          /**
           * Ran when the event fires.
           * @param {MouseEvent} event The event fired.
           */
          (event) => {
            /** @type {Error} */
            const backupError = new Error("Failed to copy author name.");
            try {
              /** @type {String | undefined} */
              const text = $(event.target)?.parent()?.find("a")?.find("span")?.eq(0)?.text();
              if (!text) {
                throw backupError;
              }

              GM_setClipboard(text);
            } catch (error) {
              console.error(error ?? new Error("Failed to copy author name."));
            }
          },
        );
      } else if (pageType === 2) {
        $(placement).children("span").after($(copyAuthorButton));
        $(copyAuthorButton).css({ margin: "2px 4px" });
        $(copyAuthorButton).on(
          "click",
          /**
           * Ran when the event fires.
           * @param {MouseEvent} event The event fired.
           */
          (event) => {
            /** @type {Error} */
            const backupError = new Error("Failed to copy author name.");
            try {
              /** @type {String | undefined} */
              const text = $(event.target)?.prev()?.text();
              if (!text) {
                throw backupError;
              }

              GM_setClipboard(text);
            } catch (error) {
              console.error(error ?? backupError);
            }
          }
        );
      }
    }

    /**
     * Callback for MutationObserver object.
     * @param {MutationRecord[]} mutationList List of mutations.
     */
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
      /** @typedef {HTMLBodyElement} */
      const targetNode = document.body;
      /** @typedef {MutationObserverInit} */
      const config = { attributes: true, childList: true, subtree: true };

      /** @typedef {MutationObserver} */
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);

      $(document).on("unload", () => {
        observer.disconnect();
      });
    }

    function main() {
      NekoGamingUserScriptLibrary.init(unsafeWindow, $);
      GM_addStyle(GM_getResourceText("css"));
      setupMutationObserver();

      if (!unsafeWindow.nbn || typeof unsafeWindow.nbn !== "object") {
        unsafeWindow.nbn = {};
      }

      if (!unsafeWindow.nbn.lib || typeof unsafeWindow.nbn.lib !== "object") {
        unsafeWindow.nbn.lib = {};
      }

      if (!unsafeWindow.nbn.lib.debug || typeof unsafeWindow.nbn.lib.debug !== "boolean") {
        unsafeWindow.nbn.lib.debug = DEBUG;
      }

      unsafeWindow.nbn.config = new GM_config({
        id: "Ko-Fi_Additions_Config"
      });
    }

    main();
  }
);
