// ==UserScript==
// @name         Twitter Additions
// @namespace    NekoBoiNick.Web.Twitter.Additions
// @version      1.0.0
// @description  Changes things on Twitter.
// @author       Neko Boi Nick
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/twitter_additions/twitter_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/twitter_additions/twitter_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     style https://cdn.jsdelivr.net/gh/thakyz/Userscripts/twitter_additions/style.min.css
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  /* Twitter Additions (Original) */
  function twitterAdditions() {
    const firstArticle = $("article[role=\"article\"][tabindex=\"-1\"] div[role=\"group\"]");
    if ($(firstArticle).length !== 0 && $(firstArticle).children().find("div").children().find("div.twMediaDownloader_media_button").length === 0) {
      const firstArticleChildDiv = $(firstArticle).children().find("div:first-child").children().find("div:nth-child(3)");
      const secondArticleChildDiv = $(firstArticle).children().find("div:nth-child(2)");
      if ($(secondArticleChildDiv).length > 0) {
        const secondArticleChildDivClasses = $(secondArticleChildDiv).attr("class");
        if (typeof secondArticleChildDivClasses !== "undefined" && typeof secondArticleChildDivClasses.split !== "undefined") {
          if (secondArticleChildDivClasses.split(" ").includes("twMediaDownloader_media_button")) {
            $(firstArticleChildDiv).insertAfter(firstArticleChildDiv);
          } else {
            console.verbose("Did not find Twitter Media Downloader");
          }
        }
      }
    }
  }

  /* Add login button to page */
  function addLoginButtonToPage() {
    const signUpSection = $("section[aria-label=\"Sign up\"]");
    if ($(signUpSection).length > 0) {
      const signUpSectionButtonTray = $(signUpSection).children("div:nth-child(3)");
      if ($(signUpSectionButtonTray).length > 0) {
        const signUpSectionButtonAnchor = $(signUpSectionButtonTray).children("a");
        if ($(signUpSectionButtonAnchor).length > 0 && $("[href=\"/i/flow/signup\"]", signUpSectionButtonAnchor.parent()).length > 0 && $("[href=\"/login\"]", signUpSectionButtonAnchor.parent()).length === 0) {
          const signUpButton = $("[href=\"/i/flow/signup\"]", signUpSectionButtonAnchor.parent());
          const signInButton = $(signUpButton).clone(true, true);
          $(signInButton).appendTo(signUpSectionButtonAnchor.parent());
          $(signInButton).attr("href", "/login");
          $(signInButton).attr("nbn-style", "hover:toggle(background-color:rgb(255,255,255);background-color:rgb(230,230,230))");
          $(signInButton).attr("style", $(signInButton).attr("style").replaceAll(/ *background-color: *rgb\(255, *255, *255\);/gi));

          if ($(signInButton).find("div span span").length > 0) {
            $(signInButton).find("div span span").text("Log In");
          } else {
            const error = new Error("Failed to get \"div span span\" in this element");
            console.error(error);
            $(signInButton).text("ERROR");
            $(signInButton).attr("error", error);
          }

          const previousButton = $("[href=\"/login\"]", signUpSectionButtonAnchor.parent()).prev();
          if ($(previousButton).css("margin-bottom") !== "12px") {
            console.debug(`previousButton[css="margin-bottom"]: ${$(previousButton).css("margin-bottom")}`);
            $(previousButton).attr("nbn-style", "margin-bottom:12px");
          }
        }
      }
    }
  }

  /* Twitter Follows You Fix */
  function twitterFollowsYouFix() {
    const div = $("div[dir=\"auto\"]>span:contains(\"Follows you\")").parent();

    if (div.length > 0) {
      for (const [index, element] of Object.entries(div)) {
        if (isNaN(index)) {
          continue;
        }

        if ($(element).css("max-height") !== "20px") {
          console.debug(`[twitterFollowsYouFix] Element css "max-height": "${$(element).css("max-height")}"`);
          $(element).attr("nbn-style", "max-height:20px");
          console.debug(`[twitterFollowsYouFix] Element attr "nbn-style": "${$(element).attr("nbn-style")}"`);
        }
      }
    }
  }

  /* Bot Sentinal Move Elements */
  function botSentinalMoveElements() {
    const div = $("div.bot-sentinel-account-status");

    if ($(div).length > 0) {
      /* Unknown code.
       * $(div).each((i, e) => {
       *   const divPrev = $(e).prev();
       *   if ($(divPrev).text().match("^@[a-zA-Z0-9]+") && $(divPrev).find("a[tabindex=\"-1\"") !== undefined) {
       *
       *   }
       * });
       */
      for (const [index, element] of Object.entries(div)) {
        if (isNaN(index)) {
          continue;
        }

        if ($(element).css("max-height") !== "20px") {
          console.debug(`[botSentinalMoveElements] Element css "max-height": "${$(element).css("max-height")}"`);
          $(element).attr("nbn-style", "max-height:20px");
          console.debug(`[botSentinalMoveElements] Element attr "nbn-style": "${$(element).attr("nbn-style")}"`);
        }
      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if ($(mutation.target).is("article[data-testid=\"tweet\"]") || $(mutation.target).is("article[role=\"article\"]")) {
          twitterAdditions();
          botSentinalMoveElements();
        }

        twitterFollowsYouFix();

        if (mutation.addedNodes.length > 0 && $(mutation.addedNodes[0]).is("section[aria-label=\"Sign up\"]")) {
          addLoginButtonToPage();
        }
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

    GM_addStyle(GM_getResourceText("style"));
  }

  setupMutationObserver();
});
