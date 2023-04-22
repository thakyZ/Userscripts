// ==UserScript==
// @name         DotNet Fiddle Keybinds
// @namespace    NekoBoiNick.Web.DotNetFiddle.Keybinds
// @version      1.0.0
// @description  try to take over the world!
// @author       NekoBoiNick
// @match        https://dotnetfiddle.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dotnetfiddle.net
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_info
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.hotkeys@0.1.0/jquery.hotkeys.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/dotnetfiddle_keybinds/dotnetfiddle_keybinds.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/dotnetfiddle_keybinds/dotnetfiddle_keybinds.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const debug = true;

  const stopBubble = event => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  const visualStudio2022 = {
    "ctrl+p": "#new-button",
    "ctrl+s": "#save-button",
    "ctrl+g": "#fork-button",
    "ctrl+f5": "#run-button",
    "ctrl+1": "button#Share",
    "ctrl+2": "button#togetherjs",
    "Shift+tab": "#tidyup-button",
    "ctrl+h": "a[href=\"/GettingStarted/\"]",
    "ctrl+u": "a[href=\"/Search\"]"
  };

  $(window).bind("keydown", event => {
    if (event.originalEvent.repeat) {
      return;
    }

    if (debug) {
      console.log(`KeyCode: ${event.keyCode}\nCtrl: ${event.ctrlKey}\nShift: ${event.shiftKey}\nAlt: ${event.altKey}\nRepeat: ${event.originalEvent.repeat}`);
      console.log(GM_info);
      console.log(event);
    }
  });

  const addKey = (key, value) => {
    $("*").bind("keydown", key, event => {
      if ($(value).prop("tagName") === "A") {
        console.log($(value));
        $(value)[0].click();
      } else {
        $(value).click();
      }

      return stopBubble(event);
    });
  };

  const addKeys = map => {
    for (const [key, value] of Object.entries(map)) {
      addKey(key, value);
    }
  };

  addKeys(visualStudio2022);
});
