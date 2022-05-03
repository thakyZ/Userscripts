// ==UserScript==
// @name         Bad Twitter No Intrests
// @namespace    NekoBoiNick.Web.Twitter.NoIntrests
// @version      1.0.0
// @description  Disables all of what Twitter thinks you are intrested in.
// @author       Neko Boi Nick
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointrests/badtwitter_nointrests.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointrests/badtwitter_nointrests.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

(function() {
  'use strict';
  let id = -1;
  const timer = ms => new Promise(res => setTimeout(res, ms))
  var runTest = async function(div) {
    for (var i = 0; i < $(div).length - 1; i++) {
      if ($($(div)[i]).prev().eq(0).children(".css-1dbjc4n").hasClass("r-l5o3uw")) {
        $(div)[i].click();
        await timer(5000);
      }
    }
  }
  var runIntrestBlocker = function() {
    id = setInterval(async function(){
      var div = $(".css-1dbjc4n.r-kemksi.r-ymttw5.r-1yzf0co .css-1dbjc4n.r-lrvibr input");
      if (div.length > 0) {
        runTest(div);
        clearInterval(id);
      }
    }, 1000);
  }
  GM_registerMenuCommand('Run this now', function() {
    runIntrestBlocker();
  }, 'r');
  GM_registerMenuCommand('Stop', function() {
    clearInterval(id);
  }, 'r');
})();
