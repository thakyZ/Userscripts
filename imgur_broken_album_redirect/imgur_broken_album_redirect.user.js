// ==UserScript==
// @name         Imgur Broken Album Redirect Script
// @namespace    NekoBoiNick.Imgur.BrokenAlbum
// @version      1.0.0
// @description  Redirects the favorited albums to a working link
// @author       Neko Boi Nick
// @match        https://imgur.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_broken_album_redirect/imgur_broken_album_redirect.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_broken_album_redirect/imgur_broken_album_redirect.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const debug = false;

  function setupMyClass(jNode) {
    const regex = /^https:\/\/imgur\.com\/user\/[a-zA-Z0-9]+\/favorites\/folder\/\d+\/[a-zA-Z0-9]+\//g;
    const address = window.location.href;
    const element = $(jNode);

    if (element.length > 0) {
      if (debug) {
        console.log("length > 0");
        console.log(address);
        console.log(regex.test(address));
      }

      if (regex.test(address)) {
        window.location.assign(address.replace(regex, "https://imgur.com/a/"));
      }
    }
  }

  waitForKeyElements(".Page404", setupMyClass, true);
});
