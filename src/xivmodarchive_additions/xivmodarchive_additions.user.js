// ==UserScript==
// @name         XIV Mod Archive Additions
// @namespace    NekoBoiNick.Web.XIVModArchive.Additions
// @version      1.1.1
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
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
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
  const createElements = (resource, replaceObj = {}) => {
    const templateHtml = GM_getResourceText(resource);
    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "")
      .replaceAll(/\r?\n<\/template>$/gi, "");
    const template = $(templateTruncated);
    for (const [key, value] of Object.entries(replaceObj)) {
      $(template).html($(template).html().replaceAll(key, value));
    }

    return template;
  };

  const createFirstLastNavElements = (number, minimum, maximum) => {
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
  };

  let userNameAlt = {};

  const getUserNameAlts = () => {
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (req.readyState === req.DONE && req.status === 200) {
        userNameAlt = JSON.parse(req.responseText);
      }
    };

    req.open("GET", "https://api.nekogaming.xyz/ffxiv/xma/names/get.php");
    req.send();
  };

  getUserNameAlts();

  const normalizeNames = name => {
    try {
      return name.normalize();
    } catch (e) {
      console.log("Name could not be normalized.");
      console.log(e);
      return name;
    }
  };

  const translateName = (name, userId = undefined) => {
    const parsedUserId = userId && !isNaN(userId) ? parseInt(userId, 10) : 0;
    if (parsedUserId !== 0 && userNameAlt[parsedUserId] !== undefined) {
      return normalizeNames(userNameAlt[parsedUserId]);
    }

    return normalizeNames(name);
  };

  const getDoMin = () => {
    const paginationChildren = $("li", $($(".pagination")[0]));
    if ($($(paginationChildren)[0]).text() !== "1") {
      return !($($(paginationChildren)[1]).text() === "1" && $($(paginationChildren)[0]).text() === "Previous");
    }

    return false;
  };

  const getDoMax = number => {
    const paginationChildren = $("li", $($(".pagination")[0]));
    const paginationChildLength = $(paginationChildren).length;
    if ($($(paginationChildren)[paginationChildLength - 1]).text() === "Next") {
      return !($($(paginationChildren)[paginationChildLength - 1]).text() === "Next" && $($(paginationChildren)[paginationChildLength - 2]).text() === `${number}`);
    }

    return false;
  };

  const getNumberOfPages = () => {
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
  };

  getNumberOfPages();

  const createCustomStyles = () => {
    GM_addStyle(GM_getResourceText("style"));
  };

  createCustomStyles();

  const createCopyName = () => {
    const authorColumn = $(".container-xl.my-3.mod-page .jumbotron.py-3.px-3.my-0 .row.no-gutters.border.rounded");
    const authorName = $("div.col-8", $(authorColumn));
    $(authorName).attr("class", "col-7");
    $(authorName).addClass("col-7-extra");
    $(createElements("copyAuthorName")).insertAfter(authorName);
    $("#copyNameButton").on("click", e => {
      if (e.shiftKey) {
        GM_setClipboard($($(".user-card-link")[1]).attr("href").replace(/\/user\//gi, ""));
      } else {
        GM_setClipboard(translateName($($(".user-card-link")[1]).text().toString(), $($(".user-card-link")[1]).attr("href").replace(/\/user\//gi, "")));
      }
    });
  };

  createCopyName();
  // Trying to do document-on-ready in document-on-ready is a bit redundent.
  // $(document).on("ready", () => {
  // Trying to do window-on-load in document-on-ready seems to have an issue that when the tab isn't foused right away,
  // the image does not get replaced at all.
  // $(window).on("load", () => {

  const encodeRawImageError = "Failed to encode raw image data. Falling back...";

  const setImage = async element => {
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
  };

  const changeAvatarImage = async () => {
    const image = $("img[alt=\"User Avatar\"]").length > 0 ? $("img[alt=\"User Avatar\"]") : $("img.rounded-circle");
    if ($(image).attr("src") !== "" && (!$(image).prop("complete") || $(image).prop("naturalHeight") === 0)) {
      try {
        const request = await GM.xmlHttpRequest({
          method: "GET",
          url: $(image).attr("src"),
          responseType: "",
          synchronous: true,
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
  };

  // });
  if (/https:\/\/(www\.)?xivmodarchive\.com\/(modid|user)\//gi.test(window.location.href)) {
    (async function () {
      await changeAvatarImage();
    })();
  }

  const changeIconDesigns = () => {
    const container = $(".container-xl.my-3.mod-page .col-4 .jumbotron.py-3.my-2 .emoji-set");
    const views = $(".emoji-block.views div.inner", container);
    const downloads = $(".emoji-block.downloads div.inner", container);
    const following = $(".emoji-block.following div.inner", container);
    views.children("span.emoji").html("<i class=\"fa fa-eye\"></i>");
    downloads.children("span.emoji").html("<i class=\"fa fa-save\"></i>");
    following.children("span.emoji").html("<i class=\"fa fa-thumbtack\"></i>");
    $("head").append("<style>.emoji-block i.fa{vertical-align: middle;}</style>");
  };

  changeIconDesigns();

  const editPages = () => {
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
  };

  editPages();

  const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  const doDeleteMessagesError = data => {
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
  };

  const deleteMessages = (elements, index) => {
    if (index >= elements.length) {
      hideSpinner();
      clearProgressBar("nbnDeleteAllMessages");
      window.location.reload();
      return;
    }

    const inboxId = $(elements[index]).attr("data-inbox_id");

    const data = {};
    data[camelToSnakeCase("inboxId")] = inboxId;
    const errorData = data;
    errorData.info = undefined;
    errorData.name = $(elements[index])
      .find("strong:first-child")
      .text()
      .replace("Followed Mod Updated: ", "");

    $.ajax({
      url: "/api/inbox/delete",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json"
    }).fail(data => {
      errorData.info = data;
      doDeleteMessagesError(errorData);
    }).done(data => {
      if (!data.success) {
        return doDeleteMessagesError(errorData);
      }

      updateProgressBar("nbnDeleteAllMessages", Math.ceil(((index + 1) / $(elements).length) * 100), "Deleting All Messages");

      setTimeout(() => {
        deleteMessages($(elements), index + 1);
      }, 1000);
    });
  };

  const addDeleteAllInbox = () => {
    if (!/https:\/\/(www\.)?xivmodarchive\.com\/inbox\/?$/gi.test(window.location.href)) {
      return;
    }

    const deleteAllMessageBtn = $(createElements("deleteAllMessages"));
    $(deleteAllMessageBtn).insertAfter($("body .container-xl .jumbotron .display-5"));

    const inboxMessages = $("body .container-xl .jumbotron .container-xl .inbox-message");

    if (inboxMessages.length === 0) {
      $("#delete-button").attr("disabled", "");
    }

    $("#delete-button").click(() => {
      showSpinner();
      createProgressbar("nbnDeleteAllMessages", 0, "deleting all messages");
      deleteMessages($(inboxMessages), 0);
    });
  };

  addDeleteAllInbox();
});