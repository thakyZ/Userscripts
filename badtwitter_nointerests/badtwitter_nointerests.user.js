// ==UserScript==
// @name         Bad Twitter No Interests
// @namespace    NekoBoiNick.Web.Twitter.NoInterests
// @version      1.0.5.3
// @description  Disables all of what Twitter thinks you are interested in.
// @author       Neko Boi Nick
// @match        https://twitter.com/*
// @match        https://twitter.com/settings/*
// @match        https://twitter.com/settings/your_twitter_data/*
// @match        https://twitter.com/settings/your_twitter_data/twitter_interests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     style https://cdn.jsdelivr.net/gh/thakyz/Userscripts/badtwitter_nointerests/style.min.css
// @resource     buttons https://cdn.jsdelivr.net/gh/thakyz/Userscripts/badtwitter_nointerests/button.template.html
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(function ($) {
  const twitterIcon = {
    STOP: "<path d=\"M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M9.12,7.71L7.71,9.12L10.59,12L7.71,14.88L9.12,16.29L12,13.41L14.88,16.29L16.29,14.88L"
    + "13.41,12L16.29,9.12L14.88,7.71L12,10.59\"></path>",
    RUN: "<path d=\"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z\"></path>"
  };
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

  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  const buttonElements = { buttons: undefined, stopButton: undefined, runButton: undefined,
    progress: {
      element: undefined, radius: 0, circumference: 0,
      setProgress(percent) {
        const offset = this.circumference - (percent / 100 * this.circumference);
        $(this.element).find("circle").css({ strokeDashoffset: offset });
      },
      set(value) {
        this.element = value;
        this.radius = $(this.element).find("circle")[0].r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        $(this.element).find("circle").css({ strokeDasharray: `${this.circumference} ${this.circumference}`, strokeDashoffset: `${this.circumference}` });
        $(this.element).find("circle").attr("stroke", $("a[href=\"/compose/tweet\"].css-4rbku5").css("backgroundColor"));
        this.setProgress(0);
      },
      get: () => this.element,
      flashing: false,
      reset() {
        this.element = undefined;
        this.radius = 0;
        this.circumference = 0;
        this.flashing = false;
      },
      async stop() {
        this.flashing = true;
        $(this.element).find("circle").css({ strokeDasharray: `${this.circumference} ${this.circumference}`, strokeDashoffset: `${this.circumference}` });
        $(this.element).find("circle").attr("stroke", "rgb(244, 33, 46)");
        $(this.element).find("circle").addClass("stopping");
        this.setProgress(100);
        await sleep(2500);
        $(this.element).find("circle").removeClass("stopping");
        $(this.element).find("circle").addClass("stopped");
        this.setProgress(0);
        await sleep(350);
        $(this.element).find("circle").removeClass("stopped");
        $(this.element).find("circle").attr("stroke", $("a[href=\"/compose/tweet\"].css-4rbku5").css("backgroundColor"));
        this.flashing = false;
      },
      async end() {
        this.flashing = true;
        $(this.element).find("circle").css({ strokeDasharray: `${this.circumference} ${this.circumference}`, strokeDashoffset: `${this.circumference}` });
        $(this.element).find("circle").attr("stroke", "rgb(21, 153, 23)");
        $(this.element).find("circle").addClass("stopping");
        this.setProgress(100);
        await sleep(2500);
        $(this.element).find("circle").removeClass("stopping");
        $(this.element).find("circle").addClass("stopped");
        this.setProgress(0);
        await sleep(350);
        $(this.element).find("circle").removeClass("stopped");
        $(this.element).find("circle").attr("stroke", $("a[href=\"/compose/tweet\"].css-4rbku5").css("backgroundColor"));
        this.flashing = false;
        $("html, body").css({
          overflow: "auto",
          height: "auto"
        });
      },
      async locked() {
        while (this.flashing) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(500);
        }

        return false;
      }
    },
    reset() {
      this.buttons = undefined;
      this.stopButton = undefined;
      this.runButton = undefined;
      this.progress.reset();
    }
  };

  let id = -1;
  let nextCooldown = 1000;
  async function runTest(div, index) {
    if (index >= div.length || id === -1) {
      await buttonElements.progress.end();
      return;
    }

    buttonElements.progress.setProgress(Math.ceil((index / $(div).length) * 100));

    if ($($(div[index]).prev()[0]).children().find("svg").length > 0) {
      $($(div[index]).prev()[0]).children().click(() => {
        $("html, body").animate({ scrollTop: 0 }, 800);
      });
      $($(div[index]).prev()[0]).children().click();
      nextCooldown = 1000;
    } else {
      nextCooldown = 0;
    }

    await sleep(nextCooldown);
    await runTest(div, index + 1);
  }

  async function runInterestBlocker() {
    if (id !== -1 || (await buttonElements.progress.locked()) !== false) {
      return;
    }

    const clearId = () => {
      id = -1;
    };

    const div = $("input[type=\"checkbox\"]");
    if (div.length > 0) {
      id = 2;
      await runTest(div, 0);
      clearInterval(id);
      clearId();
    }
  }

  function createButtons(target) {
    const titleBar = $(target).find("span:contains(\"Interests\")");
    const descBox = $(target).find("span:contains(\"These are some of the interests matched to you based on your profile\")");
    if (typeof buttonElements.buttons === "undefined" && descBox.length > 0 && titleBar.length > 0) {
      buttonElements.buttons = createElements("buttons", { TwitterIconRun: twitterIcon.RUN, TwitterIconStop: twitterIcon.STOP });
      $("section[aria-label=\"Section details\"]>div:first-child>div>div>div>div").append($(buttonElements.buttons));
      buttonElements.stopButton = $(buttonElements.buttons).find("div[aria-label=\"Stop this now\"][role=\"button\"]");
      buttonElements.runButton = $(buttonElements.buttons).find("div[aria-label=\"Run this now\"][role=\"button\"]");
      buttonElements.progress.set($(buttonElements.buttons).find("div[aria-label=\"Run this now\"][role=\"button\"] > svg"));
      $(buttonElements.stopButton).on("click", () => {
        clearInterval(id);
        id = -1;
        buttonElements.progress.stop();
      });
      $(buttonElements.runButton).on("click", () => {
        (async function () {
          await runInterestBlocker();
        })();
      });
    }
  }

  GM_addStyle(GM_getResourceText("style"));

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if ($(mutation.target).is("section[aria-label=\"Section details\"] > div:last-child > div") || $(mutation.target).is("section[aria-label=\"Section details\"]")) {
            if (/https:\/\/twitter\.com\/settings\/your_twitter_data\/twitter_interests/i.test(window.location.href)) {
              createButtons($(mutation.target).parent().parent());
            }
          }
        }

        if (typeof buttonElements.buttons !== "undefined" && /https:\/\/twitter\.com\/settings\/your_twitter_data\/twitter_interests/i.test(window.location.href) === false) {
          buttonElements.reset();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
