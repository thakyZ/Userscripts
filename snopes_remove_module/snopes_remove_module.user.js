// ==UserScript==
// @name         Snopes Remove TP Module
// @namespace    NekoBoiNick.Snopes.TPModule
// @version      1.0.2
// @description  Removes Snopes' Stupid TP Module
// @author       Neko Boi Nick
// @match        https://www.snopes.com/*
// @icon         https://www.google.com/s2/favicons?domain=snopes.com
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const otherSearchClasses = [".tp-modal", ".tp-modal-open", ".tp-banner", ".tp-active"];
  let checkedForClasses = false;
  let classesHidden = 0;
  const debug = false;

  const getClasses = function () {
    const outClasses = [];
    for (const searchClass of otherSearchClasses) {
      if ($(searchClass).length > 0) {
        outClasses.push($(searchClass)[0]);
      }
    }

    return outClasses;
  };

  const hideClass = function (_class) {
    if (_class.tagName === "BODY") {
      otherSearchClasses.forEach(obj => {
        _class.classList.remove(obj.substring(1));
      });
    } else {
      _class.remove();
      classesHidden += 1;
      if (debug) {
        console.log("Ads hidden: ", classesHidden.toString());
      }
    }
  };

  setInterval(() => {
    if (checkedForClasses) {
      return;
    }

    const classes = getClasses();
    if (classes.length > 0) {
      classes.forEach((obj, inx, arr) => {
        if (arr.length > 0) {
          hideClass(obj);
        }
      });
      checkedForClasses = true;
    }
  }, 1000);

  setInterval(() => {
    if (checkedForClasses) {
      checkedForClasses = false;
    }
  }, 5000);

  window.onhashchange = function () {
    [...Array.from(getClasses())].forEach(element => {
      if (element.length) {
        Array.from(element).forEach(hideClass);
      }
    });
  };

  document.addEventListener("scroll", () => Array.from(getClasses()).forEach((obj, _, arr) => {
    if (arr.length > 0) {
      Array.from(obj).forEach(hideClass);
    }
  }));
})();
