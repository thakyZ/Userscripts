// ==UserScript==
// @name         Bad Twitter No Interests
// @namespace    NekoBoiNick.Web.Twitter.NoInterests
// @version      1.0.3
// @description  Disables all of what Twitter thinks you are interested in.
// @author       Neko Boi Nick
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://twitter.com/settings/your_twitter_data/twitter_interests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  let id = -1;
  const runTest = (div, index) => {
    if (index >= div.length || id === -1) {
      return;
    }

    if ($($(div[index]).prev()[0]).children("svg").length > 0) {
      $(div[index]).click();
      setTimeout(() => runTest(div, index + 1), 5000);
    }
  };

  const runIntrestBlocker = function () {
    id = setInterval(() => {
      const div = $("input[type=\"checkbox\"]");
      if (div.length > 0) {
        runTest(div);
        clearInterval(id);
      }
    }, 1000);
  };

  GM_registerMenuCommand("Run this now", () => {
    runIntrestBlocker();
  }, "r");
  GM_registerMenuCommand("Stop", () => {
    clearInterval(id);
    id = -1;
  }, "r");
});
