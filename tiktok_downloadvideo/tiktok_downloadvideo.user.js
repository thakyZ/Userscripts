// ==UserScript==
// @name         TikTok Download Video
// @namespace    NekoBoiNick.Web.TikTok.SaveVideo
// @version      1.0.1
// @description  Adds a download button to TikTok Videos
// @author       Neko Boi Nick
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  const downloadIcon = "<svg width=\"20\" height=\"20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M8 17H16V15H8V17M16 10H13.5V6H10.5V10H8L12 14L16 10Z\" /></svg>";
  const fixLinks = () => {
    let id = -1;
    id = setInterval(() => {
      const commentIcon = $("span[data-e2e=\"browse-comment-icon\"]");
      if (commentIcon.length !== undefined && commentIcon.length > 0) {
        for (const [, element] of Object.entries(commentIcon)) {
          const cIParent = $(element).parent();
          const downloadButton = $(cIParent).clone(true);
          $("svg", $(downloadButton)).remove();
          $("strong", $(downloadButton)).remove();
          $("span", $(downloadButton)).attr("data-e2e", "browse-download-icon");
          $(downloadButton).removeAttr("disabled");
          $("span", $(downloadButton)).html(downloadIcon);
          $(downloadButton).attr("id", "tiktak-download-button");
          $(downloadButton).insertAfter(cIParent);
          $(downloadButton).on("click", () => {
            let loc = window.location.href;
            loc = loc.replace(/\?.+$/gi, "");
            loc = document.createTextNode(loc);
            window.open(`https://taksave.com/info?url=${loc.data}`, "_blank");
          });
        }

        clearInterval(id);
      }
    }, 1000);
  };

  fixLinks();
  $(window).on("hashchange", () => fixLinks(), false);
});
