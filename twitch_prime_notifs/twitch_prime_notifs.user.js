// ==UserScript==
// @name         Twitch Remove Prime Notifications
// @namespace    NekoBoiNick.Web
// @version      1.0.2
// @description  Remove Twitch's notifications for Prime.
// @author       Neko Boi Nick
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /** @type {String[]} */
  const otherSearchClasses = [".prime-offers > div:last-child", ".prime-offers__pill"];
  /** @type {String} */
  const twitchFrontPageSystem = ".featured-content-carousel__item-container--center video";
  /** @type {Boolean} */
  let checkedForClasses = false;
  /** @type {Number} */
  let classesHidden = 0;
  /** @type {Number} */
  let interval = -1;

  /**
   * @returns {JQuery<HTMLElement>}
   */
  function getClasses() {
    return $.each(otherSearchClasses, (selector) => $(selector));
  }

  /**
   * @param {JQuery<HTMLElement>} classId
   */
  function hideClass(classId) {
    classId.css({ display: "none" });
    classesHidden += 1;
    console.debug("Ads hidden:", classesHidden.toString());
  }

  setInterval(() => {
    if (checkedForClasses) {
      return;
    }

    const classes = getClasses();
    if (classes.length > 0) {
      classes.forEach((obj) => {
        hideClass(obj);
      });

      checkedForClasses = true;
    }
  }, 1000);

  setInterval(() => {
    if (checkedForClasses) {
      checkedForClasses = false;
    }
  }, 5000);

  function pauseMainVideo () {
    if (window.location.href.match(/^https?:\/\/(www.)?twitch.tv(\/)?$/)) {
      const video = document.querySelector(twitchFrontPageSystem);
      video.onplay = (event) => {
        event.target.pause();
      };
    }
  }

  interval = setInterval(() => {
    if ($(twitchFrontPageSystem).length > 0) {
      pauseMainVideo();
      clearInterval(interval);
    }
  }, 2500);

  function runCommands() {
    getClasses().each((_, element) => {
      element.each(() => hideClass());
    });
    pauseMainVideo();
  }

  $(window).on("hashchange", () => {
    runCommands();
  });

  $(document).on("scroll", () => {
    runCommands();
  });
});
