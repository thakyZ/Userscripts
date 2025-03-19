// ==UserScript==
// @name         Text Editor for Google Drive Change Default Theme
// @namespace    NekoBoiNick.Web
// @version      1.0.1
// @description  Gives an option to change the default theme of the Text Editor for Google Drive
// @author       Neko Boi Nick
// @match        https://texteditor.co/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=texteditor.co
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, ace */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const themeSaveName = "TextEditor_GD_DefaultTheme";
  const setupMutationObserver = () => {
    $("#settingsMenuButton").on("click", () => {
      let ld = -1;
      ld = setInterval(() => {
        const theme = $("#-theme");
        if ($(theme).length > 0) {
          $(theme).on("change", () => {
            const selectedValue = $("#-theme option:selected").attr("value");
            GM_setValue(themeSaveName, selectedValue);
          });
          clearInterval(ld);
        }
      }, 100);
    });
    let kd = -1;
    kd = setInterval(() => {
      if (ace !== undefined) {
        ace.edit("mainEditor").renderer.on("afterRender", () => {
          const value = GM_getValue(themeSaveName);
          return value === "ace/theme/chrome" || ace.edit("mainEditor").getOption("theme") === value ? false : ace.edit("mainEditor").setOptions({ theme: value });
        });
        clearInterval(kd);
      }
    }, 100);
  };

  let id = -1;
  id = setInterval(() => {
    if ($("#mainEditor").length > 0) {
      setupMutationObserver();
      clearInterval(id);
    }
  }, 100);
});
