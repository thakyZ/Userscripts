// ==UserScript==
// @name         XIV Mod Archive Additions
// @namespace    NekoBoiNick.Web.XIVModArchive.Additions
// @version      1.0.2
// @description  Adds custom things to XIV Mod Archive
// @author       Neko Boi Nick
// @match        https://xivmodarchive.com/*
// @match        https://www.xivmodarchive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xivmodarchive.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

$(function() {
  'use strict';

  var CreateFirstLastNavElements = function(num, domin, domax) {
    var endElements = [];

    $(".pagination").each(function(e) {
    var firstElement = document.createElement("li");
    $(firstElement).addClass("page-item").addClass("page-number");
    // <a class="bg-dark text-light page-link activated" style="border-color: #333333;" href="javascript: goToPage(81)">81</a>
    var firstElementLink = document.createElement("a");
    $(firstElementLink).addClass("bg-dark").addClass("text-light").addClass("page-link").addClass("activated")
    $(firstElementLink).css("border-color", "#333")
    $(firstElementLink).attr("href", "javascript: goToPage(1)");
    $(firstElementLink).text("1");
    $(firstElement).append(firstElementLink);
    var lastElement = document.createElement("li");
    $(firstElement).addClass("page-item").addClass("page-number");
    var lastElementLink = document.createElement("a");
    $(lastElementLink).addClass("bg-dark").addClass("text-light").addClass("page-link").addClass("activated")
    $(lastElementLink).css("border-color", "#333")
    $(lastElementLink).attr("href", `javascript: goToPage(${num})`);
    $(lastElementLink).text(`${num}`);
    $(lastElement).append(lastElementLink);
      if (domin) {
      $(this).children("li")[0].after(firstElement);
      } if (domax) {
      $(this).children("li")[$(this).children("li").length - 1].before(lastElement);
      }
    });
  }
  var getDoMin = function() {
    var pagination = $(".pagination")[0];
    var paginationChildren = $(pagination).children("li");
    if ($($(paginationChildren)[0]).text() !== "1") {
      if ($($(paginationChildren)[1]).text() === "1" && $($(paginationChildren)[0]).text() === "Previous") {
        return false;
      }
      return true;
    }
    return false;
  }
  var getDoMax = function(num) {
    var pagination = $(".pagination")[0];
    var paginationChildren = $(pagination).children("li");
    var paginationChildLength = $(paginationChildren).length;
    if ($($(paginationChildren)[paginationChildLength - 1]).text() === "Next") {
      if ($($(paginationChildren)[paginationChildLength - 1]).text() === "Next" && $($(paginationChildren)[paginationChildLength - 2]).text() === `${num}`) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  var getNumberOfPages = function() {
    var pages = 0;
    var data = undefined;
    if (location.href.match(/https?:\/\/www\.xivmodarchive\.com\/user\/[/d]+/i)) {
      data = $("body div.container.my-3 div.mod-meta-block").next().find("pre").text();
      data = data.split("\n");
      data = data[0].split(":");
      data = data[1].replace(/\s/i, "");
      pages = parseInt(data) / 9
      if (pages < 1) {
        pages = 0;
      } else {
        pages = Math.ceil(pages);
      }
    } else {
      data = $($("#search-form").children("div")[$("#search-form").children("div").length - 1]).find("code").text();
      data = data.split(" ");
      data = data[data.length - 1].split("\n");
      pages = parseInt(data[0]);
      if (pages <= 1) {
        pages = 0;
      } else {
        pages = pages;
      }
    }
    CreateFirstLastNavElements(pages, getDoMin(), getDoMax(pages));
  }
  getNumberOfPages();
  var CreateCustomStyles = function() {
    var styles = `
    .page-number {
      width: auto !important;
      min-width: 2.5rem;
    }`;
    var styleElement = document.createElement("style");
    $(styleElement).html(styles);
    $("head").append(styleElement);
  }
  CreateCustomStyles();

  var CreateCopyName = function() {
    var downloadsColumn = $($("div.container.my-3.mod-page div.row:first-child div.col-4")[1]).parent();
    var copyNameButton = document.createElement("div");
    $(copyNameButton).css("position", "absolute");
    $(copyNameButton).css("left", "calc(50% + 565px)");
    $(copyNameButton).css("top", "72px");
    var copyNameButtonAnchor = document.createElement("a");
    $(copyNameButtonAnchor).attr("href", "#");
    var copyNameButtonButton = document.createElement("button");
    $(copyNameButtonButton).attr("id", "copyNameButton");
    $(copyNameButtonButton).addClass("btn");
    $(copyNameButtonButton).addClass("btn-primary");
    $(copyNameButtonButton).attr("type", "button");
    var copyNameButtonIcon = document.createElement("i");
    $(copyNameButtonIcon).addClass("fa");
    $(copyNameButtonIcon).addClass("fa-clipboard");
    $(copyNameButtonButton).append(copyNameButtonIcon);
    $(copyNameButtonButton).append(" Copy Username");
    $(copyNameButtonAnchor).append(copyNameButtonButton);
    $(copyNameButton).append(copyNameButtonAnchor);
    $(downloadsColumn).append(copyNameButton);
    $(copyNameButtonAnchor).on("click", (e) => {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($($(".user-card-link")[1]).text()).select();
      document.execCommand("copy");
      $temp.remove();
    });
  }
  CreateCopyName();
});
