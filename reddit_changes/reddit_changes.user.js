// ==UserScript==
// @name         Reddit Changes
// @namespace    NekoBoiNick.Web.Reddit.CHanges
// @version      1.0.0
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
    const ShopAvatarsElement = $("button:last-child:contains(\"Shop Avatars\")");
    if ($(ShopAvatarsElement).length > 0) {
      $($(ShopAvatarsElement).parent()).css("display", "none");
      return true;
    }

    return false;
  }

  const downloadButton = MenuBarCopy => {
    const Button = $(MenuBarCopy).clone();
    $($($(Button).children()[0]).children()[1]).html("<span></span>Download");
    const IconClasses = $($($($(Button).children()[0]).children()[0]).children()[0]).attr("class");
    $($($($(Button).children()[0]).children()[0]).children()[0]).attr("id", "");
    $($($($(Button).children()[0]).children()[0]).children()[0]).attr("class", IconClasses.replace(/icon-award/g, "icon-download"));
    $($($(Button).children()[0]).children().find("span")[2]).attr("id", "download_button");
    $(Button).on("click", () => {
      let Address = window.location.href;
      const Regex = /https:\/\/(old\.|www\.)?reddit.com\/(r\/[a-zA-Z0-9_-]+\/comments\/[a-zA-Z0-9]+\/)/g;
      Address = Address.replace(Regex, "https://redditsave.com/$2");
      window.open(Address, "_blank");
    });
    return Button;
  };

  function addDownloadButton() {
    const MediaContainer = $("div[data-testid=\"post-container\"] div[data-click-id=\"media\"]");
    if ($(MediaContainer).length > 0) {
      const VideoSource = $(MediaContainer).children().find("video > source[src][type]");
      if ($(VideoSource).length > 0) {
        const PostContent = $("div[data-testid=\"post-container\"] > div[data-test-id=\"post-content\"]").children();
        const PostMenuBar = $($($(PostContent)[PostContent.length - 1]).children()[0]);
        const MenuBarLast = $($(PostMenuBar).children()[3]);
        const MenuBarCopy = $($(PostMenuBar).children()[1]);
        $(downloadButton(MenuBarCopy)).insertAfter(MenuBarLast);
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
