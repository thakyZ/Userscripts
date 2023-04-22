// ==UserScript==
// @name         Steam Workshop Unsubscribe Systematically
// @namespace    NekoBoiNick.Web.Steam.Workshop.UnSubSystematically.
// @version      1.0.0
// @description  Adds a new button to unsubscribe from a collection systematically instead of all at once.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_unsubsystem/steamworkshop_unsubsystem.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_unsubsystem/steamworkshop_unsubsystem.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  function unSubSystematically() {
    const subbedMods = $("[class^='general_btn subscribe toggled']").children();
    $(subbedMods).each((index, element) => {
      $(element).trigger("click");
      if (index >= $(subbedMods).length - 1) {
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    });
  }

  function addButton() {
    const buttonHtml = "<span class=\"general_btn subscribe\"><div class=\"unsubscribeIcon\"></div><span>Unsubscribe Individually</span></span>";
    const button = $(buttonHtml);
    $(".subscribeCollection > div[style^=\"clear: right\"]").before($(button));
    $(button).on("click", unSubSystematically);
  }

  function run() {
    const collectionTest = $(".collectionChildren");
    if ($(collectionTest).length > 0) {
      addButton();
    }
  }

  run();
});
