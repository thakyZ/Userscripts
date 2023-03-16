// ==UserScript==
// @name         Reddit Changes
// @namespace    NekoBoiNick.Web.Reddit.CHanges
// @version      1.0.1
// @description  Does changes for reddit.
// @author       Neko Boi Nick
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  let id = -1;
  let kd = -1;
  function removeElement() {
    const shopAvatarsElement = $("button:last-child:contains(\"Shop Avatars\")");
    if ($(shopAvatarsElement).length > 0) {
      $($(shopAvatarsElement).parent()).css("display", "none");
      return true;
    }

    return false;
  }

  const downloadButton = MenuBarCopy => {
    const button = $(MenuBarCopy).clone();
    $($($(button).children()[0]).children()[1]).html("<span></span>Download");
    const iconClasses = $($($($(button).children()[0]).children()[0]).children()[0]).attr("class");
    $($($($(button).children()[0]).children()[0]).children()[0]).attr("id", "");
    $($($($(button).children()[0]).children()[0]).children()[0]).attr("class", iconClasses.replace(/icon-award/g, "icon-download"));
    $($($(button).children()[0]).children().find("span")[2]).attr("id", "download_button");
    $(button).on("click", () => {
      let address = window.location.href;
      const regex = /https:\/\/(old\.|www\.)?reddit.com\/(r\/[a-zA-Z0-9_-]+\/comments\/[a-zA-Z0-9]+\/)/g;
      address = address.replace(regex, "https://redditsave.com/$2");
      window.open(address, "_blank");
    });
    return button;
  };

  function addDownloadButton() {
    const mediaContainer = $("div[data-testid=\"post-container\"] div[data-click-id=\"media\"]");
    if ($(mediaContainer).length > 0) {
      const videoSource = $(mediaContainer).children().find("video > source[src][type]");
      if ($(videoSource).length > 0) {
        const postContent = $("div[data-testid=\"post-container\"] > div[data-test-id=\"post-content\"]").children();
        const postMenuBar = $($($(postContent)[postContent.length - 1]).children()[0]);
        const menuBarLast = $($(postMenuBar).children()[3]);
        const menuBarCopy = $($(postMenuBar).children()[1]);
        $(downloadButton(menuBarCopy)).insertAfter(menuBarLast);
        return true;
      }

      return true;
    }

    return false;
  }

  function setIntervalRemove() {
    id = setInterval(() => {
      if (removeElement() === true) {
        clearInterval(id);
      }
    }, 100);
    kd = setInterval(() => {
      if (addDownloadButton() === true) {
        clearInterval(kd);
      }
    }, 100);
  }

  setIntervalRemove();
});
