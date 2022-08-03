// ==UserScript==
// @name         Bad Twitter No Interests
// @namespace    NekoBoiNick.Web.Twitter.NoInterests
// @version      1.0.2
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

$(document).ready(function () {
  let id = -1;
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  var runTest = async function (div) {
    for (var i = 0; i < $(div).length - 1; i++) {
      if (id === -1) {
        break;
      }
      if ($($(div)[i]).prev().eq(0).children().find("svg").length > 0) {
        $(div)[i].click();
        await timer(5000);
      }
    }
  };
  var runIntrestBlocker = function () {
    id = setInterval(async function () {
      var div = $('input[type="checkbox"]');
      if (div.length > 0) {
        runTest(div);
        clearInterval(id);
      }
    }, 1000);
  };
  GM_registerMenuCommand(
    "Run this now",
    function () {
      runIntrestBlocker();
    },
    "r"
  );
  GM_registerMenuCommand(
    "Stop",
    function () {
      clearInterval(id);
      id = -1;
    },
    "r"
  );
});
