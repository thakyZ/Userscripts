// ==UserScript==
// @name         Poipiku Enable Context Menu
// @namespace    NekoBoiNick.Web.Poipiku.ContextMenuEnable
// @version      1.0.0
// @description  Enables the context menu on Poipiku
// @author       Neko Boi Nick
// @match        https://poipiku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poipiku.com
// @grant        none
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */

(function() {
  $(document).ready(function(){
    'use strict';
    $('body, .Wrapper').each(function(index, element){
      $(element).off("contextmenu drag dragstart copy");
    });
  });
})();
