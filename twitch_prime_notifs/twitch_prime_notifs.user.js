// ==UserScript==
// @name         Twitch Remove Prime Notifications
// @namespace    NekoBoiNick.Web.TwitchPrime.NotifRM
// @version      1.0.2
// @description  Remove Twitch's notifications for Prime.
// @author       Neko Boi Nick
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const otherSearchClasses = [".prime-offers > div:last-child", ".prime-offers__pill"];
  const twitchFrontPageSystem = ".featured-content-carousel__item-container--center video";
  let checkedForClasses = false;
  let classesHidden = 0;
  const debug = false;

  const getClasses = () => {
    const test = [];
    for (const [, searchClass] of Object.entries(otherSearchClasses)) {
      if (searchClass !== null) {
        test.push($(searchClass));
      }
    }

    return test;
  };

  const hideClass = (_class) => {
    _class.style.cssText += "display:none";
    classesHidden += 1;
    if (debug) {
      console.log("Ads hidden: ", classesHidden.toString());
    }
  };

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

  const pauseMainVideo = function () {
    if (window.location.href.match(/^https?:\/\/(www.)?twitch.tv(\/)?$/)) {
      const video = document.querySelector(twitchFrontPageSystem);
      video.onplay = function () {
        video.pause();
      };
    }
  };

  let id = -1;
  id = setInterval(() => {
    if ($(twitchFrontPageSystem).length > 0) {
      pauseMainVideo();
      clearInterval(id);
    }
  }, 2500);

  const runCommands = () => {
    $(getClasses()).each((_, element) => {
      $(element).each(() => hideClass());
    });
    pauseMainVideo();
  };

  $(window).on("hashchange", () => {
    runCommands();
  });

  $(document).on("scroll", () => {
    runCommands();
  });
});
