// ==UserScript==
// @name         Snopes Remove TP Module
// @namespace    NekoBoiNick.Snopes.TPModule
// @version      1.0.1
// @description  Removes Snopes' Stupid TP Module
// @author       Neko Boi Nick
// @match        https://www.snopes.com/*
// @icon         https://www.google.com/s2/favicons?domain=snopes.com
// @grant        none
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var otherSearchClasses = [".tp-modal",".tp-modal-open",".tp-banner",".tp-active"];
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
    if (_class.tagName == "BODY") {
      otherSearchClasses
        .forEach((obj, ind, arr) => {
                                 _class.classList.remove(obj.substring(1))});
    }
    else
    {
      _class.remove();
      classesHidden += 1;
      if (debug) {
        console.log('Ads hidden: ', classesHidden.toString());
      }
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

  window.onhashchange = function() {
    [...Array.from(getClasses()).forEach((element, index, array) => {
      if (element.length) {
        Array.from(element).forEach(hideClass);
      }
    })]
  }

  document.addEventListener('scroll', () => Array.from(getClasses()).forEach((obj, inx, arr) => { if (arr.length > 0) { Array.from(obj).forEach(hideClass)}}));
})();
