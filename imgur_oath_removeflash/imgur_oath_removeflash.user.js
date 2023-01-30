// ==UserScript==
// @name         Imgur OAuth 2.0 Remove Flash Content
// @namespace    NekoBoiNick.Web.Imgur.OAuth.2-0.RemoveFlash
// @version      1.0.0
// @description  Removes old flash from the Imgur OAuth 2.0 Page
// @author       Neko Boi Nick
// @match        https://api.imgur.com/oauth2/pin?pin=*
// @match        file:///D:/Files/System/Programs/single-file-companion/downloads/Imgur_OAuth.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        GM_setClipboard
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_oath_removeflash/imgur_oath_removeflash.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_oath_removeflash/imgur_oath_removeflash.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  let id = -1;
  id = setInterval(() => {
    const flashContent = $("#ZeroClipboardMovie_1").parent();
    if ($(flashContent).length > 0) {
      const parentElement = $("#pin-clipboard");
      $(flashContent).remove();
      $(parentElement).on("click", e => {
        GM_setClipboard($("input[name=\"pin\"").val());
      });
      clearInterval(id);
    }
  });
});
