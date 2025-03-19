// ==UserScript==
// @name         Snopes Remove TP Module
// @namespace    NekoBoiNick.Web
// @version      1.0.2
// @description  Removes Snopes' Stupid TP Module
// @author       Neko Boi Nick
// @match        https://www.snopes.com/*
// @icon         https://www.google.com/s2/favicons?domain=snopes.com
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /** @type {String[]} */
  const otherSearchClasses = [".tp-modal", ".tp-modal-open", ".tp-banner", ".tp-active"];
  /** @type {Boolean} */
  let checkedForClasses = false;
  /** @type {Number} */
  let classesHidden = 0;

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
    classId.each((element) => {
      if (element[0].tagName === "BODY") {
        otherSearchClasses.forEach((obj) => {
          element.classList.remove(obj.substring(1));
        });
      } else {
        element.css({ display: "none" });
        element.remove();
        classesHidden += 1;
        console.debug("Ads hidden:", classesHidden.toString());
      }
    });
  }

  setInterval(() => {
    if (checkedForClasses) {
      return;
    }

    /** @type {JQuery<HTMLElement>} */
    const classes = getClasses();

    if (classes.length > 0) {
      classes.each(
        /**
         * @param {HTMLElement} obj
         * @param {Number} inx
         * @param {JQuery<HTMLElement>} arr
         */
        (obj, inx, arr) => {
          if (arr.length > 0) {
            hideClass(obj);
          }
        }
      );

      checkedForClasses = true;
    }
  }, 1000);

  setInterval(() => {
    if (checkedForClasses) {
      checkedForClasses = false;
    }
  }, 5000);

  $(window).on("hashchange", () => {
    getClasses().each(
      /**
       * @param {HTMLElement} element
       */
      (element) => hideClass(element)
    );
  });

  $(document).on("scroll", () => {
    getClasses().each(
      /**
       * @param {HTMLElement} element
       */
      (element) => hideClass(element)
    );
  });
})();
