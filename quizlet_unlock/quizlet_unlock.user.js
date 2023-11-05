// ==UserScript==
// @name         Quizlet Unlock
// @namespace    NekoBoiNick.Web.Quizlet.Unlock
// @version      1.0.1.1
// @description  "Unlcoks Quizlet Paywalls. Please do not use this to cheat on tests, I used this to just not have to pay for Quizlet when studying."
// @author       Neko Boi Nick
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?domain=quizlet.com
// @grant        GM_log
// @run-at       document-start
// @noframes
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  function hideLoginButton() {
    const element = $(".LoginBottomBar").parent();
    if ($(element).css("display") !== "none") {
      $(element).attr("style", `${$(element).attr("style")};display:none !important;`);
    }
  }

  function unblurTerms() {
    const children = $(".SetPageTerms-term").children().children().children().children().children();
    for (const [index, element] of Object.entries(children)) {
      if (!isNaN(index) && $(element).css("filter") !== "none") {
        $(element).attr("style", `${$(element).attr("style")};filter:none !important;`);
      }
    }
  }

  function showAllTerms() {
    const terms = $(".SetPageTerm");
    for (const [index, element] of Object.entries(terms)) {
      if (!isNaN(index) && !$(element).hasClass("is-showing")) {
        $(element).add("class", "is-showing");
        console.log("Found broken page");
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    function callback(mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes" || mutation.type === "childList" || mutation.type === "subtree") {
          hideLoginButton();
          unblurTerms();
          showAllTerms();
        }
      }
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  let id = -1;
  id = setInterval(() => {
    if ($("body").length > 0) {
      setupMutationObserver();
      clearInterval(id);
    }
  }, 100);

  hideLoginButton();
  unblurTerms();
  showAllTerms();
});
