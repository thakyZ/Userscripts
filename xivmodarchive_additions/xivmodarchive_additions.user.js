// ==UserScript==
// @name         XIV Mod Archive Additions
// @namespace    NekoBoiNick.Web.XIVModArchive.Additions
// @version      1.1.2
// @description  Adds custom things to XIV Mod Archive
// @author       Neko Boi Nick
// @match        https://xivmodarchive.com/*
// @match        https://www.xivmodarchive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xivmodarchive.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @connect      api.nekogaming.xyz
// @connect      cdn.discordapp.com
// @connect      static.xivmodarchive.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js
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
// ==/UserScript==
/* global $, jQuery, showSpinner, hideSpinner, showError, errorProgressBar, clearProgressBar, updateProgressBar, createProgressbar */
this.$ = this.jQuery = jQuery.noConflict(true);

/* eslint-disable no-extend-native */
String.prototype.width = function (font, size) {
  const f = font || "arial";
  const s = size || "12px";
  const o = $("<div></div>")
    .text(this)
    .css({ position: "absolute", float: "left", whiteSpace: "nowrap", visibility: "hidden", font: `${s} ${f}` })
    .appendTo($("body"));
  const w = o.width();

  o.remove();
  return w;
};
/* eslint-enable no-extend-native */

$(document).ready(() => {
  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  function createElements(resource, replaceObj = {}) {
    const templateHtml = GM_getResourceText(resource);
    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "")
      .replaceAll(/\r?\n<\/template>$/gi, "");
    const template = $(templateTruncated);
    for (const [key, value] of Object.entries(replaceObj)) {
      $(template).html($(template).html().replaceAll(key, value));
    }

    return template;
  }

  function createFirstLastNavElements(number, minimum, maximum) {
    /* Unknown unused variable
     * const endElements = [];
     */
    const pagination = $(".pagination");

    for (let i = 0; i < $(pagination).length; i++) {
      const firstElement = createElements("pageNumberElements", { "^": "1" });
      // <a class="bg-dark text-light page-link activated" style="border-color: #333333;" href="javascript: goToPage(81)">81</a>
      const lastElement = createElements("pageNumberElements", { "^": number });
      if (minimum) {
        $(firstElement).insertAfter($("li", pagination[i])[0]);
      }

      if (maximum) {
        $(lastElement).insertBefore($("li", pagination[i])[$("li", pagination[i]).length - 1]);
      }
    }
  }

  async function getUserNameAlts(userId) {
    try {
      const request = await GM.xmlHttpRequest({
        method: "GET",
        url: "https://api.nekogaming.xyz/ffxiv/xma/names/get.php",
        data: `id=${userId}`,
        responseType: "json",
        timeout: 2000
      });

      if (request.status === 404 || request.status === 500) {
        console.error(request);
      }

      if (request.DONE === 4 && request.status === 200) {
        return request.response;
      }
    } catch (error) {
      console.error("Failed to get the user's avatar.");
      console.error(error);
    }

    return [];
  }

  async function getUserNameAlts() {
    try {
      const request = await GM.xmlHttpRequest({
        method: "GET",
        url: "https://api.nekogaming.xyz/ffxiv/xma/names/get.php",
        responseType: "json",
        timeout: 2000
      });
      if (request.status === 404 || request.status === 500) {
        console.error(request);
      }

      if (request.DONE === 4 && request.status === 200) {
        return request.response;
      }
    } catch (error) {
      console.error("Failed to get the user's avatar.");
      console.error(error);
    }

    return [];
  }

  /* Don't fetch this every time anymore.
   * let userNameAlt = {};
   * getUserNameAlts();
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

  function translateName(name, userId = undefined, userNameAlt = {}) {
    const parsedUserId = userId && !isNaN(userId) ? parseInt(userId, 10) : 0;
    if (parsedUserId !== 0 && userNameAlt[parsedUserId] !== undefined) {
      return normalizeNames(userNameAlt[parsedUserId]);
    }

    return normalizeNames(name);
  }

  function getDoMin() {
    const paginationChildren = $("li", $($(".pagination")[0]));
    if ($($(paginationChildren)[0]).text() !== "1") {
      return !($($(paginationChildren)[1]).text() === "1" && $($(paginationChildren)[0]).text() === "Previous");
    }

    return false;
  }

  function getDoMax(number) {
    const paginationChildren = $("li", $($(".pagination")[0]));
    const paginationChildLength = $(paginationChildren).length;
    if ($($(paginationChildren)[paginationChildLength - 1]).text() === "Next") {
      return !($($(paginationChildren)[paginationChildLength - 1]).text() === "Next" && $($(paginationChildren)[paginationChildLength - 2]).text() === `${number}`);
    }

    return false;
  }

  function getNumberOfPages() {
    let pages = 0;
    let data;
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
      data = $("#search-form div:last-child code").text().split(" ")[$("#search-form div:last-child code").text().split(" ").length - 1].split("\n");
      pages = parseInt(data[0], 10);
      if (pages <= 1) {
        pages = 0;
      }
    }

    if (/https?:\/\/(www\.)?xivmodarchive\.com\/dashboard.*/i.test(window.location.href) === false) {
      createFirstLastNavElements(pages, getDoMin(), getDoMax(pages));
    }
  }

  getNumberOfPages();

  function createCustomStyles() {
    GM_addStyle(GM_getResourceText("style"));
  }

  createCustomStyles();

  function createCopyName() {
    (async function () {
      const authorColumn = $(".container-xl.my-3.mod-page .jumbotron.py-3.px-3.my-0 .row.no-gutters.border.rounded");
      if (authorColumn.length === 0) {
        return;
      }

      const authorName = $("div.col-8", $(authorColumn));
      const userNameAlt = await getUserNameAlts($($(".user-card-link")[1]).attr("href").replace(/\/user\//gi, ""));
      $(authorName).attr("class", "col-7");
      $(authorName).addClass("col-7-extra");
      $(createElements("copyAuthorName")).insertAfter(authorName);
      $("#copyNameButton").on("click", (e) => {
        if (e.shiftKey) {
          GM_setClipboard($($(".user-card-link")[1]).attr("href").replace(/\/user\//gi, ""));
        } else {
          GM_setClipboard(translateName($($(".user-card-link")[1]).text().toString(), $($(".user-card-link")[1]).attr("href").replace(/\/user\//gi, ""), userNameAlt));
        }
      });
    })();
  }

  createCopyName();
  // Trying to do document-on-ready in document-on-ready is a bit redundent.
  // $(document).on("ready", () => {
  // Trying to do window-on-load in document-on-ready seems to have an issue that when the tab isn't foused right away,
  // the image does not get replaced at all.
  // $(window).on("load", () => {

  const encodeRawImageError = "Failed to encode raw image data. Falling back...";

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

  // });
  if (/https:\/\/(www\.)?xivmodarchive\.com\/(modid|user)\//gi.test(window.location.href)) {
    (async function () {
      await changeAvatarImage();
    })();
  }

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

  changeIconDesigns();

  function editPages() {
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
    if (/^https:\/\/(www\.)?xivmodarchive\.com\/inbox\/\d+/gi.test(window.location.href)) {
      const mailHeader = $("body > .container-xl > .jumbotron");
      if ($(mailHeader).length > 0) {
        $(mailHeader).addClass("nbnMailHeader");
        if ($(mailHeader).find("h4.display-5").length > 0) {
          $(mailHeader).find("h4.display-5").attr("data-toggle", "tooltip");
          $(mailHeader).find("h4.display-5").attr("data-placement", "bottom");
          $(mailHeader).find("h4.display-5").attr("title", $(mailHeader).find("h4.display-5").text().replace("Followed Mod Updated: ", ""));

          $("body > .container-xl > .jumbotron.nbnMailHeader h4.display-5[data-toggle=\"tooltip\"]").tooltip(
            {
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
            }
          );
        }
      }
    }
  }

  editPages();

  const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

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

  async function deleteMessages(elements, index) {
    if (index >= elements.length) {
      hideSpinner();
      clearProgressBar("nbnDeleteAllMessages");
      window.location.reload();
      return;
    }

    const inboxId = $(elements[index]).attr("data-inbox_id");

    /* eslint-disable-next-line camelcase */
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
     **/

    let request;

    try {
      request = await GM.xmlHttpRequest({
        method: "POST",
        url: "/api/inbox/delete",
        /* eslint-disable-next-line camelcase */
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
    $(deleteAllMessageBtn).insertAfter($("body .container-xl .jumbotron .display-5"));

    const inboxMessages = $("body .container-xl .jumbotron .container-xl .inbox-message");

    if (inboxMessages.length === 0) {
      $("#delete-button").attr("disabled", "");
    }

    $("#delete-button").click(() => {
      showSpinner();
      createProgressbar("nbnDeleteAllMessages", 0, "deleting all messages");
      (async function () {
        await deleteMessages($(inboxMessages), 0);
      })();
    });
  }

  async function getInboxMessageModId(inboxMessageId) {
    let request;

    try {
      request = await GM.xmlHttpRequest({
        method: "GET",
        url: `/inbox/${inboxMessageId}`,
        timeout: 2000
      });

      if (typeof request.statusText === "undefined" || request.statusText.toLowerCase() !== "ok") {
        return undefined;
      }

      const getHref = $(request.responseText).find(".jumbotron .container-xl em a").attr("href");

      if (typeof getHref === "undefined") {
        console.error(new Error("getHref is of type undefined"));
        console.debug(request);
        return undefined;
      }

      return getHref;
    } catch (error) {
      console.error(error);
      console.debug(request);

      return undefined;
    }
  }

  $.fn.outerHTML = function () {
    return $("<div />").append(this.eq(0).clone()).html();
  };

  async function addAnchorsToInboxMessages() {
    const inboxMessages = $("body .container-xl .jumbotron .container-xl .inbox-message");

    for await (const [inboxIndex, inboxElement] of Object.entries(inboxMessages)) {
      if (isNaN(inboxIndex)) {
        return;
      }

      const previousStrong = $(inboxElement).children().find("strong");
      const newHref = await getInboxMessageModId($(inboxElement).attr("data-inbox_id"));

      if (typeof newHref === "undefined" || newHref.name === "Error") {
        continue;
      }

      if (typeof newHref !== "string") {
        console.debug({ type: (typeof newHref), value: newHref });
      }

      for await (const [strongIndex, strongElement] of Object.entries(previousStrong)) {
        if (isNaN(strongIndex)) {
          return;
        }

        const oldStrongElement = $(strongElement).clone();

        const newLink = $(`<a class="text-light" href="${newHref}">${$(oldStrongElement).outerHTML()}</a>`);

        $(strongElement).replaceWith($(newLink));
      }

      await sleep(1000);
    }
  }

  function modifyInboxScreen() {
    if (!/https:\/\/(www\.)?xivmodarchive\.com\/inbox\/?$/gi.test(window.location.href)) {
      return;
    }

    addDeleteAllInbox();
    (async function () {
      // Disabled because spam-ey
      // addAnchorsToInboxMessages();
    })();
  }

  modifyInboxScreen();
});
