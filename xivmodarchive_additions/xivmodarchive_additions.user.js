// @ts-check
// ==UserScript==
// @name         XIV Mod Archive Additions
// @namespace    NekoBoiNick.Web
// @version      1.1.4
// @description  Adds custom things to XIV Mod Archive
// @author       Neko Boi Nick
// @match        https://xivmodarchive.com/*
// @match        https://www.xivmodarchive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xivmodarchive.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.nekogaming.xyz
// @connect      cdn.discordapp.com
// @connect      static.xivmodarchive.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     style https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/styles.min.css
// @resource     blankAvatar https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/blankAvatar.base64
// @resource     blankAvatarPng https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/blankAvatar.png
// @resource     pageNumberElements https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/pageNumberElements.template.html
// @resource     copyAuthorName https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/copyAuthorName.template.html
// @resource     deleteAllMessages https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/deleteAllMessages.template.html
// @resource     GMConfigCSS https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/GM_config-style.min.css
// @resource     modalTemplate https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/modal.template.html
// ==/UserScript==
/// <reference path="../node_modules/@types/tampermonkey/index.d.ts" />
/// <reference path="../node_modules/@types/jquery/JQuery.d.ts" />
/// <reference path="../library/nekogaming.userscript.lib.d.ts" />
/// <reference path="../types/gm_config.d.ts" />
/* global showSpinner, hideSpinner, showError, errorProgressBar, clearProgressBar, updateProgressBar, createProgressbar, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(
  /** @param {JQueryStatic} $ */
  ($) => {
    const { createElements, camelToSnakeCase, sleep, getUserNameAlts } = window.nbn.lib;

    // TODO: Cache the mod ids.
    // TODO: Find a way to get the mod id without making the message marked as read.

    // Trying to do document-on-ready in document-on-ready is a bit redundant.
    // $(document).on("ready", () => {
    // Trying to do window-on-load in document-on-ready seems to have an issue that when the tab isn't focused right away,
    // the image does not get replaced at all.
    // $(window).on("load", () => {

    //#region Type definitions

    /**
   * @typedef {Object} CacheEntry
   * @property {String} title
   * @property {String} href
   * @property {Number} dateExpires
   */

    /**
   * @typedef {CacheEntry[]} CacheEntries
   */

    /**
   * @typedef {"error"|"info"|"success"} Level
   */

    /**
   * @typedef {Object} MessageData
   * @property {Object | undefined} info
   * @property {String} name
   */

    //#endregion Type definitions

    //#region Prototype modifications.

    /**
   * Checks if the attribute exists on the element.
   * @param {String} attribute The attribute to check.
   * @returns {Boolean} True if the attribute exists on the element.
   */
    $.fn.hasAttr = function (attribute) {
      return $(this).length > 0 && typeof $(this).attr(attribute) !== "undefined";
    };

    /**
   * Changes the current element with a new element of a different type.
   * @see https://stackoverflow.com/a/8584217/1112800
   * @param {String} newType The new type of element to use.
   * @returns {String | HTMLElement | JQueryElement} The old element transformed into the new element.
   */
    $.fn.changeElementType = function (newType) {
      const attrs = {};

      $.each(this[0].attributes, (idx, attr) => {
        attrs[attr.nodeName] = attr.nodeValue;
      });

      this.replaceWith(function() {
        return $("<" + newType + "/>", attrs).append($(this).contents());
      });
    };

    //#endregion Prototype modifications.

    //#region Utility methods

    //#endregion Utility methods

    /**
     * Creates a button to navigate to the first page and last page of searches.
     * @param {Number} number The current page integer that the user is on.
     * @param {Boolean} minimum The minimum page index to create.
     * @param {Boolean} maximum The maximum page index to create.
     */
    function createFirstLastNavElements(number, minimum, maximum) {
      /** @type {JQuery<HTMLDivElement>} */
      const pagination = $(".pagination");

      for (let i = 0; i < $(pagination).length; i++) {
        const firstElement = window.nbn.lib.createElement("pageNumberElements", { "^": "1" });
        // <a class="bg-dark text-light page-link activated" style="border-color: #333333;" href="javascript: goToPage(81)">81</a>
        const lastElement = window.nbn.lib.createElement("pageNumberElements", { "^": number });
        if (minimum) {
          $(firstElement).insertAfter($("li", pagination[i])[0]);
        }

        if (maximum) {
          $(lastElement).insertBefore($("li", pagination[i])[$("li", pagination[i]).length - 1]);
        }
      }
    }

    /**
     * Attempts to get a normalized name of the user.
     * @param {String} name Name of the user.
     * @returns {String} Normalized name (buggy and incomplete)
     */
    function normalizeNames(name) {
      try {
        return name.normalize();
      } catch (e) {
        console.log("Name could not be normalized.");
        console.log(e);
        return name;
      }
    }

    /**
     * Try to translate the name and try to normalize it.
     * @param {String} name The current display name of the user.
     * @param {OptionalNumber} userId The user id of the user.
     * @param {Object} userNameAlt Object containing information of the alt id.
     * @returns {String} A normalized name.
     */
    function translateName(name, userId = undefined, userNameAlt = {}) {
      const parsedUserId = typeof userId !== "undefined" && !isNaN(userId) ? parseInt(userId, 10) : 0;
      if (parsedUserId !== 0 && userNameAlt[parsedUserId] !== undefined) {
        return normalizeNames(userNameAlt[parsedUserId]);
      }

      return normalizeNames(name);
    }

    /**
     * Attempts to get the minimum page available.
     * @returns {Boolean} Status if successful.
     */
    function getDoMin() {
      const paginationChildren = $("li", $($(".pagination")[0]));
      if ($($(paginationChildren)[0]).text() !== "1") {
        return !($($(paginationChildren)[1]).text() === "1" && $($(paginationChildren)[0]).text() === "Previous");
      }

      return false;
    }

    /**
     * Attempts to get the maximum page available.
     * @param {Number} number The maximum page.
     * @returns {Boolean} Status if successful.
     */
    function getDoMax(number) {
      const paginationChildren = $("li", $($(".pagination")[0]));
      const paginationChildLength = $(paginationChildren).length;
      if ($($(paginationChildren)[paginationChildLength - 1]).text() === "Next") {
        return !($($(paginationChildren)[paginationChildLength - 1]).text() === "Next" && $($(paginationChildren)[paginationChildLength - 2]).text() === `${number}`);
      }

      return false;
    }

    /** Attempts to get the number of pages and then creates the first and last nav elements. */
    function getNumberOfPages() {
      let pages = 0;
      let data;
      /* CSpell:ignoreRegExp \/https\?:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/user\\\/\\d\+\/i */
      if (/https?:\/\/(www\.)?xivmodarchive\.com\/user\/\d+/i.test(window.location.href)) {
        if ($("body div.container-xl.my-3 .jumbotron .row.px-4 pre").length === 0) {
          return;
        }

        data = $("body div.container-xl.my-3 .jumbotron .row.px-4 pre").text();
        data = data.split("\n");
        data = data[0].split(":");
        data = data[1].replace(/\s/i, "");
        pages = parseInt(data, 10) / 9;
        if (pages < 1) {
          pages = 0;
        } else {
          pages = Math.ceil(pages);
        }
      } else {
        const dataArray = $("#search-form div:last-child code").text().split(/\s+/);
        pages = parseInt(dataArray[dataArray.length - 2], 10);
        if (pages <= 1) {
          pages = 0;
        }
      }

      /* CSpell:ignoreRegExp \/https\?:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/dashboard\.\*\/i */
      if (/https?:\/\/(www\.)?xivmodarchive\.com\/dashboard.*/i.test(window.location.href) === false) {
        createFirstLastNavElements(pages, getDoMin(), getDoMax(pages));
      }
    }

    /** Applies script specific custom CSS styles. */
    function createCustomStyles() {
      GM_addStyle(GM_getResourceText("style"));
    }

    /** A task for when the copy mod info button is pressed. */
    function doCopyTask(element, userNameAlt) {
      const translatedName = translateName(element.text().toString(), element.attr("href").replace(/\/user\//gi, ""), userNameAlt).replaceAll(/^\s+/gi, "").replaceAll(/\s+$/gi, "");

      /* CSpell:ignoreRegExp \/https:\\\/\\\/\(www\\\.\)\?xivmodarchive\.com\\\/modid\\\//gi */
      if (window.nbn.config.get("copyAuthorNamePlusModName") && /https:\/\/(www\.)?xivmodarchive.com\/modid\//gi.test(window.location.href)) {
        const modPage = $("#modpage-frame-left .jumbotron .row:first-child h1");

        if (modPage.length === 0 || modPage.length > 1) {
          console.error(`Mod Title was either not found or too many found. Length was ${modPage.length}`);
          return;
        }

        const modName = modPage.text().replace(/\s+$/gi, "").replaceAll(" ", "_").replaceAll(" and ", "+").replaceAll(/(.) ?\((.*)\) ?(.)/gi, "$1-$2-$3");
        const output = window.nbn.config.get("authorNamePlusModNameFormat").replaceAll("%u", translatedName).replaceAll("%m", modName);
        GM_setClipboard(output);
      } else {
        GM_setClipboard(translatedName);
      }
    }

    /** Creates the copy mod info button on mod pages. */
    function createCopyName() {
      (async function () {
        const authorColumn = $(".container-xl.my-3.mod-page .jumbotron.py-3.px-3.my-0 .row.no-gutters.border.rounded");
        if (authorColumn.length === 0) {
          return;
        }

        const authorName = $("div.col-8", $(authorColumn));
        const userNameAlt = await getUserNameAlts($(".user-card-link").eq(1).attr("href").replace(/\/user\//gi, ""));
        $(authorName).attr("class", "col-7");
        $(authorName).addClass("col-7-extra");
        $(createElements("copyAuthorName")).insertAfter(authorName);
        $("#copyNameButton").on("click", (e) => {
          if ($(".user-card-link:nth-child(1)").length === 0) {
            console.warn("User card link was not found");
            return;
          }

          if (e.shiftKey) {
            GM_setClipboard($(".user-card-link:nth-child(1)").attr("href").replace(/\/user\//gi, ""));
          } else {
            doCopyTask($(".user-card-link:nth-child(1)"), userNameAlt);
          }
        });
      }).catch((reason) => {
        console.error("createCopyName method catch:", reason);
      });
    }

    /* @type {string} */
    const encodeRawImageError = "Failed to encode raw image data. Falling back...";

    /**
     * Sets the image of the author on a mod page/author page.
     * @param {HTMLElement} element The element for the author's profile picture.
     */
    async function setImage(element) {
      let imageEncoded = "";
      try {
        const dataUri = await GM.getResourceUrl("blankAvatarPng");
        imageEncoded = dataUri;
      } catch (error) {
        console.group(encodeRawImageError);
        console.error(error);
        console.groupEnd(encodeRawImageError);
        imageEncoded = GM_getResourceText("blankAvatar");
      }

      $(element).attr("src", imageEncoded);
    }

    /**
   * Changes the avatar image of an author if their avatar fails to render.
   */
    async function changeAvatarImage() {
      const image = $("img[alt=\"User Avatar\"]").length > 0 ? $("img[alt=\"User Avatar\"]") : $("img.rounded-circle");
      if ($(image).attr("src") !== "" && (!$(image).prop("complete") || $(image).prop("naturalHeight") === 0)) {
        try {
          const request = await GM.xmlHttpRequest({
            method: "GET",
            url: $(image).attr("src"),
            responseType: "",
            timeout: 2000
          });

          if (request.status === 404 || request.status === 500) {
            await setImage($(image));
          }
        } catch (error) {
          console.error("Failed to get the user's avatar.");
          console.error(error);
        }
      } else if ($(image).attr("src") === "") {
        await setImage($(image));
      }
    }

    /**
   * Changes the icon designs on each mod page.
   */
    function changeIconDesigns() {
      const container = $(".container-xl.my-3.mod-page .col-4 .jumbotron.py-3.my-2 .emoji-set");
      const views = $(".emoji-block.views div.inner", container);
      const downloads = $(".emoji-block.downloads div.inner", container);
      const following = $(".emoji-block.following div.inner", container);
      views.children("span.emoji").html("<i class=\"fa fa-eye\"></i>");
      downloads.children("span.emoji").html("<i class=\"fa fa-save\"></i>");
      following.children("span.emoji").html("<i class=\"fa fa-thumbtack\"></i>");
      $("head").append("<style>.emoji-block i.fa{vertical-align: middle;}</style>");
    }

    /**
   * Edits various pages on XIV Mod Archive.
   * Notably:
   *   - The link on the main page for New and Updated Mods being sponsored only.
   *   - Wraping the header of the mail notification.
   */
    function editPages() {
    /* CSpell:ignoreRegExp \/\^https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/\?\$\/gi */
      if (/^https:\/\/(www\.)?xivmodarchive\.com\/?$/gi.test(window.location.href)) {
        const badLink = $("a[href*=\"/search\"]").filter((b, a) => /sponsored=true/gi.test($(a).attr("href")));
        if ($(badLink).length > 0) {
          const oldURL = $(badLink).attr("href");
          $(badLink).attr("href", oldURL.replaceAll(/&sponsored=true/gi, ""));
          $(badLink).text("New and Updated Mods");
        }
      }

      // Wrap the header of the mail notification.
      // Enable tooltip on the mail header.
      /* CSpell:ignoreRegExp \/\^https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/inbox\\\/\\d\+\/gi */
      if (/^https:\/\/(www\.)?xivmodarchive\.com\/inbox\/\d+/gi.test(window.location.href)) {
        const mailHeader = $("body > .container-xl > .jumbotron");
        if ($(mailHeader).length > 0) {
          $(mailHeader).addClass("nbnMailHeader");
          if ($(mailHeader).find("h4.display-5").length > 0) {
            $(mailHeader).find("h4.display-5").attr("data-toggle", "tooltip");
            $(mailHeader).find("h4.display-5").attr("data-placement", "bottom");
            $(mailHeader).find("h4.display-5").attr("title", $(mailHeader).find("h4.display-5").text().replace("Followed Mod Updated: ", ""));

            $("body > .container-xl > .jumbotron.nbnMailHeader h4.display-5[data-toggle=\"tooltip\"]").tooltip({
              customClass(_, options) {
                const newOptions = options + " nbnMailHeader";
                return newOptions;
              },
              offset(data) {
                const middleForPopper = ($("body").width() - data.popper.width) / 2;
                const middleForReference = ($("body").width() - data.reference.width) / 2;
                data.popper.left = middleForPopper;
                data.reference.left = middleForReference;
                return data;
              }
            });
          }
        }
      }
    }

    /**
   * Shows an error when a message failed to delete.
   * @param {MessageData} data The message data to print.
   */
    function doDeleteMessagesError(data) {
      hideSpinner();
      errorProgressBar("nbnDeleteAllMessages", `failed to delete message with ID: ${data[camelToSnakeCase("inboxId")]}`);
      let message = `failed to delete message:\nTitle: ${data.name}\nID: ${data[camelToSnakeCase("inboxId")]}`;
      if (typeof data.info !== "undefined") {
        message += "\nInfo:";
      }

      showError(message);
      $("#error-modal").on("shown.bs.modal", () => {
        const errorModalText = $("#error-modal").find("#error-modal-text");
        if ($(errorModalText).length > 0) {
          let inlineMessage = `<p>${$(errorModalText).text().replaceAll("\n", "<br>")}</p>`;
          if (typeof data.info !== "undefined") {
            inlineMessage += `<pre>${JSON.stringify(data.info, null, 2).replaceAll("\n", "<br>")}</pre>`;
          }

          $(errorModalText).html(inlineMessage);
        }
      });

      $("#error-modal").on("hidden.bs.modal", () => {
        $("#error-modal").modal("dispose");
      });
    }

    /**
   *
   */
    async function deleteMessages(elements, index) {
      if (index >= elements.length) {
        hideSpinner();
        clearProgressBar("nbnDeleteAllMessages");
        window.location.reload();
        return;
      }

      const inboxId = $(elements[index]).attr("data-inbox_id");

      const errorData = { inbox_id: parseInt(inboxId, 10) };
      errorData.info = undefined;
      /**
     * Unused now...
     * let infoElement = $(elements[index]).find("strong:first-child");
     *
     * if (infoElement.length === 0) {
     *   infoElement = $(elements[index]).find("a:first-child");
     * }
     *
     * if (infoElement.length === 0) {
     *   await deleteMessages($(elements), index + 1);
     * }
     *
     * errorData.name = infoElement.text()
     *   .replace("Followed Mod Updated: ", "");
     */

      let request;

      try {
        request = await GM.xmlHttpRequest({
          method: "POST",
          url: "/api/inbox/delete",
          data: JSON.stringify({ inbox_id: parseInt(inboxId, 10) }),
          responseType: "json",
          timeout: 2000,
          headers: {
            "Content-Type": "application/json",
            Origin: "https://www.xivmodarchive.com",
            Referer: `https://www.xivmodarchive.com/inbox/${inboxId}`
          }
        });

        if (request.statusText.toLowerCase() !== "ok") {
          return doDeleteMessagesError(errorData);
        }

        updateProgressBar("nbnDeleteAllMessages", Math.ceil(((index + 1) / $(elements).length) * 100), "Deleting All Messages");

        await sleep(1000);
        await deleteMessages($(elements), index + 1);
      } catch (error) {
        console.error(error);
        console.log(request);

        errorData.info = request;
        return doDeleteMessagesError(errorData);
      }
    }

    function addDeleteAllInbox() {
      const deleteAllMessageBtn = $(createElements("deleteAllMessages"));

      if ($("body .container-xl .jumbotron .container-xl #delete-button").length > 0) {
        return;
      }

      $(deleteAllMessageBtn).insertAfter($("body .container-xl .jumbotron .display-5"));

      const inboxMessages = $("body .container-xl .jumbotron .container-xl .inbox-message");

      if (inboxMessages.length === 0) {
        $("#delete-button").attr("disabled", "");
      }

      $("#delete-button").click(() => {
        showSpinner();
        createProgressbar("nbnDeleteAllMessages", 0, "deleting all messages");
        deleteMessages($(inboxMessages), 0).then(
          (value) => {
            console.debug(value);
          },
          (reason) => {
            console.error(reason);
          },
        );
      });
    }

    /**
   * @param {string} modName
   * @returns {string | undefined}
   */
    function getFromModCache(modName) {
    /** @type {string} */
      const cachedModIds = window.nbn.config.get("cachedModIds");
      /** @type {CacheEntries} */
      const json = JSON.parse(cachedModIds);
      /** @type {CacheEntries} */
      const filtered = json.filter((entry) => entry.title === modName);
      if (filtered.length === 1 && filtered[0].dateExpires !== Date.now()) {
        return json[modName];
      }

      return undefined;
    }

    /**
   * @param {string} modName
   * @param {string} modUrl
   * @returns {void}
   */
    function addToModCache(modName, modUrl) {
    /** @type {string} */
      const cachedModIds = window.nbn.config.get("cachedModIds");
      /** @type {CacheEntries} */
      const json = JSON.parse(cachedModIds);
      /** @type {CacheEntries} */
      let jsonEntries = Object.entries(json);
      /** @type {[number, CacheEntry][]} */
      const jsonEntriesMapped = jsonEntries.map((entry, index) => [index, entry]);
      /** @type {[number, CacheEntry][]} */
      const names = jsonEntriesMapped.filter((entry) => entry[1].title === modName);
      /** @type {[number, CacheEntry][]} */
      const ids = jsonEntriesMapped.filter((entry) => entry[1].href === modUrl);

      if (names.length === 1 && ids.length === 1 && names[0][0] === ids[0][0]) {
        return;
      }

      if (names.length === 0 && ids.length === 0) {
        const date = Date.now;
        jsonEntries.push({
          title: modName,
          href: modUrl,
          dateExpires: new Date(date.setMonth(date.getMonth() + 8)).getTime()
        });
        window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
        window.nbn.config.save();
        return;
      }

      if (names.length !== 0) {
        if (ids.length === 0) {
        // No ID match
          jsonEntries = jsonEntries.filter((entry) => entry.title !== modName);
          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
          addToModCache(modName, modUrl);
        } else if (ids.length === 1) {
        // One ID match
          jsonEntries[ids[0][0]].title = modName;
          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
        } else {
        // Too many ID match
          for (const id of ids) {
            jsonEntries = jsonEntries.filter((entry) => entry.href !== id.href);
          }

          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
          addToModCache(modName, modUrl);
        }

        return;
      }

      if (ids.length !== 0) {
        if (names.length === 0) {
        // No ID match
          jsonEntries = jsonEntries.filter((entry) => entry.href !== modUrl);
          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
          addToModCache(modName, modUrl);
        } else if (names.length === 1) {
        // One ID match
          jsonEntries[names[0][0]].href = modUrl;
          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
        } else {
        // Too many ID match
          for (const name of names) {
            jsonEntries = jsonEntries.filter((entry) => entry.title !== name.title);
          }

          window.nbn.config.set("cachedModIds", JSON.stringify(Object.fromEntries(jsonEntries)));
          window.nbn.config.save();
          addToModCache(modName, modUrl);
        }
      }
    }

    /**
   * Get the mod if of the inbox message.
   * @param {string} inboxMessageId The message id of a inbox message.
   * @param {"updated"|"released"|undefined} action The message id of a inbox message.
   * @returns {Promise<string | undefined>} Returns the href of the mod, or returns undefined if failed.
   */
    async function getInboxMessageModId(inboxMessageId, action = undefined) {
      let request;

      let stringBuilder = "https://www.xivmodarchive.com/search?sortby=";

      if (action === "updated") {
        stringBuilder += "time_edited";
      } else if (action === "released") {
        stringBuilder += "time_posted";
      } else {
        stringBuilder += "rank";
      }

      /**
     * @returns {string}
     */
      const fetchModName = () => {
        const elements = $(`div#message-${inboxMessageId} div.col-12 strong`);
        if (elements.length === 2) {
          return $(elements[1]).text();
        }

        throw new Error(`Message or mod name could not be found with selector path "div#message-${inboxMessageId} div.col-12 strong" at index of 1.`);
      };

      try {
        const modName = fetchModName();

        const cached = getFromModCache(modName);

        if (typeof cached !== "undefined") {
          return cached;
        }

        stringBuilder += "&sortorder=desc";

        stringBuilder += "&basic_text=" + encodeURIComponent(modName);

        const enabledTypes = [1, 3, 7, 9, 12, 15, 2, 4, 8, 10, 14, 16, 11, 5, 13, 6];

        stringBuilder += `&types=${encodeURIComponent(enabledTypes.join(","))}`;

        request = await GM.xmlHttpRequest({
          method: "GET",
          url: stringBuilder,
          timeout: 2000
        });

        if (typeof request.statusText === "undefined" || request.statusText.toLowerCase() !== "ok") {
          block.remove();
          return undefined;
        }

        const block = $(new DOMParser().parseFromString(request.responseText, "text/html"));

        const getHref = block.find("#search-results > div > div > div > a:first-child").attr("href");

        if (typeof getHref === "undefined") {
          console.error(new Error("getHref is of type undefined"));
          console.debug(request);
          return undefined;
        }

        addToModCache(modName, getHref);

        return getHref;
      } catch (error) {
        console.error(error);
        console.debug(request);
        return undefined;
      }
    }

    /**
   * @returns {Promise<void>}
   */
    async function addAnchorsToInboxMessages() {
      /** @type {JQuery<HTMLStrongElement>} */
      const inboxMessages = $("body .container-xl .jumbotron .container-xl .inbox-message");
      /** @type {number} */
      let index = 0;
      /** @type {number} */
      let progress = 0;
      showSpinner();
      createProgressbar("nbnAddAnchorsToInboxMessages", 0, "Adding anchors to all inbox messages");

      if (index >= inboxMessages.length) {
        hideSpinner();
        clearProgressBar("nbnDeleteAllMessages");
        return;
      }

      /** @type {number} */
      let broken = 0;

      /** @type {[string, HTMLStrongElement][]} */
      const objects = Object.entries(inboxMessages);
      for (const [inboxIndex, inboxElement] of objects) {
        if (isNaN(Number(inboxIndex))) {
          continue;
        }

        /** @type {JQuery<HTMLStrongElement>} */
        const previousStrong = $(inboxElement).children().find("strong");
        /** @type {"updated"|"released"|undefined} */
        const action = (
        /** @returns {"updated"|"released"|undefined} */
          () => {
            const text = $(inboxElement).find("em").first().text().toLowerCase();

            if (text.includes("update")) {
              return "updated";
            }

            if (text.includes("update")) {
              return "released";
            }

            return undefined;
          }
        )();

        /** @type {string | undefined} */
        // eslint-disable-next-line no-await-in-loop
        const newHref = await getInboxMessageModId($(inboxElement).attr("data-inbox_id"), action);

        if (typeof newHref === "undefined" || newHref.name === "Error") {
          if (broken === 0) {
            pushNotification("error", `failed to add anchor to inbox message with id: ${$(inboxElement).attr("data-inbox_id")}`);
          }

          // eslint-disable-next-line no-await-in-loop
          await sleep(1000);
          updateProgressBar("nbnAddAnchorsToInboxMessages", progress, "Adding anchors to all inbox messages");
          progress = Math.ceil(((index + 1) / $(inboxMessages).length) * 100);
          broken++;

          if (broken >= 3) {
            break;
          }

          continue;
        } else {
          broken = 0;
        }

        if (typeof newHref !== "string") {
          console.debug({ type: (typeof newHref), value: newHref });
        }

        for (const [strongIndex, strongElement] of Object.entries(previousStrong)) {
          if (isNaN(Number(strongIndex))) {
            continue;
          }

          /** @type {JQuery<HTMLStrongElement>} */
          const oldStrongElement = $(strongElement).clone();

          /** @type {JQuery<HTMLAnchorElement>} */
          const newLink = $(`<a class="text-light" href="${newHref}">${$(oldStrongElement).outerHTML()}</a>`);

          $(strongElement).replaceWith($(newLink));
        }

        updateProgressBar("nbnAddAnchorsToInboxMessages", progress, "Adding anchors to all inbox messages");
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000);
        index++;
        progress = Math.ceil(((index + 1) / $(inboxMessages).length) * 100);
      }

      if (broken > 0) {
        errorProgressBar("nbnAddAnchorsToInboxMessages", "failed to add anchor to inbox message(s)");
        hideSpinner();
      }
    }

    /**
   * @returns {JQuery<HTMLElement>}
   */
    function setupGMConfigFrame() {
      const configWrapper = createElements("modalTemplate", { "%modal_id%": window.nbn.config.id, "%modal_label%": `${window.nbn.config.id}_label` });
      $("body").append(configWrapper);
      return configWrapper[0];
    }

    /**
   * @returns {void}
   */
    function modifyInboxScreen() {
    /* CSpell:ignoreRegExp \/\https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/inbox\\\/\?\/gi */
      if (!/https:\/\/(www\.)?xivmodarchive\.com\/inbox\/?/gi.test(window.location.href)) {
        return;
      }

      addDeleteAllInbox();
      if (window.nbn.config.get("addAnchorsToInboxMessages")) {
      /**
       * @param {unknown} value
       * @returns {void}
       */
        const onSuccess = (value) => {
          console.log("Success!");
          console.debug("value", value);
        };

        /**
       * @param {unknown} value
       * @returns {void}
       */
        const onFailed = (reason) => {
          console.error("Failed!", reason);
        };

        addAnchorsToInboxMessages().then(onSuccess, onFailed).catch(onFailed);
      }
    }

    /**
   * @param {Level} level
   * @param {String | Error | TypeError} message
   * @returns {void}
   */
    function pushNotification(level, message) {
      const notification = {
        text: typeof message === "string" ? message.toString() : message.message,
      };

      if (level === "error") {
        notification.error = true;
      } else if (level === "success") {
        notification.success = true;
      }

      unsafeWindow.notificationQueue.push(notification);
    }

    /**
   * Modifies the GM_config frame for use on this site.
   * @param {JQuery<HTMLDivElement>} frame
   * @returns {void}
   */
    function modifyGM_configFrame(frame) {
      frame.attr("style", "background-color:unset !important;display:block;");
      frame.find(`#${window.nbn.config.id}_wrapper`).addClass("modal-dialog");
      /** @type {JQuery<HTMLDivElement>} */
      const oldChildren = frame.find(`#${window.nbn.config.id}_wrapper`).find(`div[id*="${window.nbn.config.id}_"]:not(#${window.nbn.config.id}_content)`);
      /** @type {JQuery<HTMLDivElement>} */
      const modalContent = $(`<div class="modal-content" id="${window.nbn.config.id}_content"></div>`);
      frame.find(`#${window.nbn.config.id}_wrapper`).append(modalContent);

      if (oldChildren.length === 0) {
        console.error("Old child elements of gmConfigFrame were not found.");
        return;
      }

      oldChildren.each((element) => {
        element.appendTo($(modalContent));
      });

      /** @type {JQuery<HTMLDivElement>} */
      const header = $(modalContent).find(`#${window.nbn.config.id}_header`);
      /** @type {String} */
      const headerText = header.text();
      header.addClass("modal-header");

      /** @type {JQuery<HTMLHeadingElement>} */
      header.html(`<h5 class="modal-title" id="${window.nbn.config.id}_label">${headerText}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`);

      /** @type {JQuery<HTMLDivElement>} */
      const modalFooter = $(modalContent).find(`#${window.nbn.config.id}_buttons_holder`);
      modalFooter.addClass("modal-footer");
      /** @type {JQuery<HTMLButtonElement>} */
      const closeButton = modalFooter.find(`#${window.nbn.config.id}_closeBtn`);
      closeButton.attr("data-dismiss", "modal");
      closeButton.addClass("btn");
      closeButton.addClass("btn-secondary");
      /** @type {JQuery<HTMLButtonElement>} */
      const saveButton = modalFooter.find(`#${window.nbn.config.id}_saveBtn`);
      saveButton.addClass("btn");
      saveButton.addClass("btn-primary");
      /** @type {JQuery<HTMLButtonElement>} */
      const resetButton = modalFooter.find("div > .reset");
      resetButton.addClass("btn");
      resetButton.addClass("btn-warning");

      /** @type {JQuery<HTMLDivElement>} */
      const sections = $(modalContent).find("div.section_header_holder, div.config_var");
      /** @type {JQuery<HTMLDivElement>} */
      const modalBody = $("<div class=\"modal-body\"></div>");
      $(header).after(modalBody);

      sections.each((element) => {
        if (element.hasClass("config_var") && element.find("input").hasAttr("type") && element.find("input").attr("type") !== "hidden") {
          element.addClass("input-group");
          element.addClass("mb-3");
          /** @type {JQuery<HTMLLabelElement>} */
          let label = element.find("label");
          label.changeElementType("span");
          label = element.find("span");
          label.addClass("input-group-text");
          /** @type {JQuery<HTMLInputElement>} */
          const input = element.find(`input[id*="${window.nbn.config.id}_field_"]`);
          input.addClass("form-control");
          /** @type {JQuery<HTMLDivElement>} */
          const groupPrepend = $("<div class=\"input-group-prepend\"></div>");
          if (input.hasAttr("type") && input.attr("type") === "checkbox") {
            element.append(groupPrepend);
            /** @type {JQuery<HTMLDivElement>} */
            const groupAppend = $("<div class=\"input-group-text input-group-append\"></div>");
            element.append(groupAppend);
            groupAppend.append(input);
          } else {
            element.prepend(groupPrepend);
          }

          groupPrepend.append(label);
        }

        element.appendTo(modalBody);
      });
    }

    /**
   * Closes the GM_config frame using Bootstrap 4 Modals
   */
    function closeConfig() {
      window.nbn.config.close();

      if ($(`#${window.nbn.config.id}`).length > 0 && $(`#${window.nbn.config.id}`).attr("role") !== "dialog" && $(`#${window.nbn.config.id}`).hasAttr("style")) {
        unsafeWindow.$(window.nbn.config.frame).modal("hide");
      }

      window.nbn.configOpen = false;
    }

    /**
   * Opens the GM_config frame using Bootstrap 4 Modals
   */
    function openConfig() {
      if ($(`#${window.nbn.config.id}`).length > 0 && $(`#${window.nbn.config.id}`).attr("role") !== "dialog" && $(`#${window.nbn.config.id}`).hasAttr("style")) {
        unsafeWindow.$(window.nbn.config.frame).modal("show");
      }

      window.nbn.config.open();
      window.nbn.configOpen = true;
    }

    /**
   * Gets a boolean determining whether the config is open.
   * @returns {Boolean}
   */
    function isConfigOpen() {
      if (!Object.hasOwn(window.nbn, "configOpen") || typeof window.nbn.configOpen !== "boolean") {
        window.nbn.configOpen = false;
      }

      return window.nbn.configOpen;
    }

    /**
   * Toggles the state of the GM_config frame using Bootstrap 4 Modals
   */
    function toggleConfig() {
      if (isConfigOpen()) {
        closeConfig();
      } else {
        openConfig();
      }
    }

    /**
   * Adds a gear icon to the header of the site.
   */
    function addGearIcon() {
      const bar = $("#navbarSupportedContent ul:last-child");
      if (bar.children().last().children().first().is("button.btn.nav-link[data=\"open-config\"]")) {
        return;
      }

      const navItem = $("<li class=\"nav-item\"></li>");
      const configButton = $("<button class=\"btn nav-link\" data=\"open-config\"><i class=\"fa fa-gear\" aria-hidden=\"true\"></i></button>");
      navItem.append(configButton);
      bar.append(navItem);

      configButton.on("click", () => {
        toggleConfig();
      });
    }

    /**
   * Removes the default GM_config styles.
   * @param {GM_config} config The instance of GM_config.
   * @returns {void}
   */
    function removeDefaultGM_configStyles(config) {
      const styles = $("head > style[type=\"text/css\"]");
      for (const [index, style] of Object.entries(styles)) {
        if (isNaN(Number(index))) {
          continue;
        }

        if ($(style).text().startsWith(`#${config.id} *`)) {
          $(style).text(".input-group .input-group-prepend+.input-group-text>input.form-control[type=\"checkbox\"]{height:fit-content !important}.input-group>.input-group-text.input-group-append{background-color:#fff;border-top-left-radius:0;border-bottom-left-radius:0}");
        }
      }
    }

    /**
   * The initializer for this script.
   * All roads *should* lead back to here.
   */
    function init() {
      if (!Object.hasOwn(window, "nbn") || typeof window.nbn !== "object") {
        window.nbn = {};
      }

      window.nbn.config = { id: "XMA_Additions_Config" };
      window.nbn.gmConfigFrame = setupGMConfigFrame();
      window.nbn.gmConfigCSS = GM_getResourceText("GMConfigCSS");
      window.nbn.config = new GM_config({
        id: window.nbn.config.id,
        title: "XIV Mod Archive Additions Config",
        fields: {
          addAnchorsToInboxMessages: {
            label: "Add Anchors to Inbox Messages",
            type: "checkbox",
            default: false
          },
          copyAuthorNamePlusModName: {
            label: "Copy Author Name + The Mod Name",
            type: "checkbox",
            default: false
          },
          authorNamePlusModNameFormat: {
            label: "Author Name + Mod Name Format",
            type: "textbox",
            default: "[%u] %m"
          },
          debug: {
            label: "Debug",
            type: "checkbox",
            default: false
          },
          cachedModIds: {
            type: "hidden",
            default: "[]"
          }
        },
        events: {
        /** @returns {void} */
          init() {
          /**
           * Unused.
           * window.nbn.config.frame.setAttribute("style", "display:none;");
           */

            // });
            /* CSpell:ignoreRegExp \/https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/\(modid\|user\)\\\/\/gi */
            if (/https:\/\/(www\.)?xivmodarchive\.com\/(modid|user)\//gi.test(window.location.href)) {
              changeAvatarImage().then(
                (value) => {
                  console.debug(value);
                },
                (reason) => {
                  console.error(reason);
                },
              );
            }

            /* CSpell:ignoreRegExp \/\^https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/\/ */
            if (/^https:\/\/(www\.)?xivmodarchive\.com\//.test(window.location.href)) {
              GM_registerMenuCommand("Config", () => {
                openConfig();
              });
            }

            addGearIcon();
            modifyInboxScreen();
            editPages();
            getNumberOfPages();
            createCustomStyles();
            createCopyName();
            changeIconDesigns();
            removeDefaultGM_configStyles(this);
          },
          /** @returns {void} */
          open() {
          /**
           * Unused.
           * window.nbn.config.frame.setAttribute("style", "display:block;");
           */
            removeDefaultGM_configStyles(window.nbn.config);
            modifyGM_configFrame(window.nbn.config.frame);
            unsafeWindow.$(window.nbn.config.frame).modal("show");
          },
          /**
         * @param {any} val
         * @returns {void}
         */
          save(val) {
            console.debug(val);
          },
          /** @returns {void} */
          close() {
          /**
           * Unused.
           * window.nbn.config.frame.setAttribute("style", "display:none;");
           */
            removeDefaultGM_configStyles(window.nbn.config);
            unsafeWindow.$(window.nbn.config.frame).modal("hide");
          }
        },
        css: window.nbn.gmConfigCSS,
        frame: window.nbn.gmConfigFrame
      });
    }

    init();
  });
