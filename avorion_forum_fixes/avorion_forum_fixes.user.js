// ==UserScript==
// @name         Avorion Forum Fixes
// @namespace    NekoBoiNick.Web
// @version      1.0.2.1
// @description  Changes some issues with the __old__ Avorion forums.
// @author       Neko Boi Nick
// @match        https://www.avorion.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.avorion.net
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

// Code to add getting all attributes from elements.

this.jQuery(($) => {
  "use strict";
  (
    /**
     * Override method for JQuery's attr method.
     * This should return a Record<string, string>
     * if no parameters are specified.
     * @param {JQueryAttrFunc} old
     */
    function (old) {
      /**
       * New attr function override.
       * @param  {...any} args Arguments from the original method.
       * @returns {Record<String, String>} New element with applied old attributes
       */
      $.fn.attr = function(...args) {
        if (args.length === 0) {
          if (this.length === 0) {
            return null;
          }

          /** @type {Record<String, String>} */
          const obj = {};
          for (const value in this[0].attributes) {
            if (value.specified) {
              obj[value.name] = value.value;
            }
          }

          return obj;
        }

        return old.apply(this, args);
      };
    }
  )($.fn.attr);

  /** @type {JQuery<HTMLDivElement>} */
  const newSpoilerTag = $("<div></div>");

  if (!newSpoilerTag) {
    return;
  }

  /** @type {JQuery<HTMLElement>} */
  const oldSpoilerTag = $("#BBCBox_message_button_1_21");

  if (!oldSpoilerTag) {
    return;
  }

  /** @type {Iterable<Record<string, string>>} */
  const oldSpoilerTagAttrs = oldSpoilerTag.attr();

  if (!oldSpoilerTagAttrs) {
    return;
  }

  /** @type {Record<string, string>} */
  const oldSpoilerTagAttributes = oldSpoilerTag.attr().items;

  if (!oldSpoilerTagAttributes) {
    return;
  }

  for (const [key, value] of Object.entries(oldSpoilerTagAttributes)) {
    newSpoilerTag.attr(key, value);
  }

  newSpoilerTag.text("Spoiler");

  newSpoilerTag.css({
    backgroundSize: "cover",
    backgroundColor: "#E4E4E4 !important",
    color: "#000 !important",
    padding: "1px 2px 1px 2px !important",
    fontSize: "12px !important",
    border: "1px #BBB solid !important",
    marginTop: "0px !important",
    minHeight: "22px !important",
    display: "inline-block !important",
  });

  newSpoilerTag.on("mouseover", (event) => {
    /** @type {JQuery<HTMLDivElement>} */
    const target = $(event.target);

    target.css("background-image");
    target.css({ backgroundColor: "#58BE5E !important" });
    target[0].instanceRef.handleButtonMouseOver(target);
  });

  $(newSpoilerTag).on("mouseover", (event) => {
    /** @type {JQuery<HTMLDivElement>} */
    const target = $(event.target);

    target.css("background-image");
    target.css({ backgroundColor: "#E4E4E4 !important" });
    target[0].instanceRef.handleButtonMouseOver(target);
  });

  oldSpoilerTag.replaceWith(newSpoilerTag);
});
