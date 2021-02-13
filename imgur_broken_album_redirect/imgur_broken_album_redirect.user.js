// ==UserScript==
// @name         Imgur Broken Album Redirect Script
// @namespace    NekoBoiNick.Imgur.BrokenAlbum
// @version      0.2
// @description  Redirects the favorited albums to a working link
// @author       NekoBoiNick
// @match        https://imgur.com/user/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_broken_album_redirect/imgur_broken_album_redirect.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_broken_album_redirect/imgur_broken_album_redirect.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */

waitForKeyElements (".Page404", setupMyClass, true);

function setupMyClass (jNode) {
  var regex = new RegExp("^https:\\/\\/imgur\\.com\\/user\\/[a-zA-Z0-9]+\\/favorites\\/folder\\/[0-9]+\\/[a-zA-Z0-9]+\\/","g");
  var address = window.location.href;
  var element = document.getElementsByClassName("Page404");

  if (element.length > 0) {
    console.log("length > 0");
    console.log(address);
    if (address.match(regex)) {
      console.log("true");
      window.location.assign(address.replace(regex,"https://imgur.com/a/"));
    } else {
      console.log("false");
    }
  }
}
