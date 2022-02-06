// ==UserScript==
// @name         Twitch Remove Prime Notifications
// @namespace    NekoBoiNick.Web.TwitchPrime.NotifRM
// @version      1.0.0
// @description  Remove Twitch's notifications for Prime.
// @author       Neko Boi Nick
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var otherSearchClasses = [".prime-offers > div:last-child",".prime-offers__pill"];
  var twitchFrontPageSystem = ".featured-content-carousel__item-container--center > div > video";
  var checked_for_classes = false;
  var classesHidden = 0;
  var debug = false;

  var getClasses = function() {
    var test = [];
    for (var i = 0; i < otherSearchClasses.length; i++)
    {
      var test2 = document.querySelector(otherSearchClasses[i]);
      if (test2 !== null) {
        test.push(test2);
      }
    }
    return test;
  }

  var hideClass = function(_class) {
    _class.style.cssText += "display:none";
    classesHidden += 1;
    if (debug) {
      console.log('Ads hidden: ', classesHidden.toString());
    }
  }

  setInterval(() => {
    if (checked_for_classes) return;
    var classes = getClasses();
    if (classes.length > 0) {
      classes.forEach((obj, inx, arr) => {
        if (arr.length > 0) {
          hideClass(obj);
        }
      });
      checked_for_classes = true;
    }}, 1000);

  setInterval(() => { if (checked_for_classes) checked_for_classes = false; }, 5000);

  var pauseMainVideo = function() {
    if (window.location.href.mathc(/^https?:\/\/(www.)?twitch.tv(\/)?$/)) {
      var video = document.quereySelector(twitchFrontPageSystem);
      video.on("play", function() {
        video.pause();
      });
    }
  }

  var waited = false;

  pauseMainVideo();

  var runCommands = function() {
    [...Array.from(getClasses()).forEach((element, index, array) => {
      if (element.length) {
        Array.from(element).forEach(hideClass);
      }})]
    pauseMainVideo();
  }

  window.onhashchange = function() {runCommands();}

  document.addEventListener('scroll', () => {runCommands();});
})();
