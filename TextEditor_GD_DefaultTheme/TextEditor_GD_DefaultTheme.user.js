// ==UserScript==
// @name         Text Editor for Google Drive Change Default Theme
// @namespace    NekoBoiNick.Web.GoogledDrive.TextEditor.Theme.Default
// @version      1.0.0
// @description  Gives an option to change the default theme of the Text Editor for Google Drive
// @author       Neko Boi Nick
// @match        https://texteditor.co/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=texteditor.co
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, ace, te */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
  const ThemeSaveName = "TextEditor_GD_DefaultTheme";
  const SetupMutationObserver = () => {
    const targetNode = $("body")[0];
    $("#settingsMenuButton").on("click", (e) => {
      let ld = -1;
      ld = setInterval(function() {
        if ($("#-theme").length > 0) {
          $("#-theme").on("change", (e) => {
            const selectedValue = $("#-theme option:selected").attr("value");
            GM_setValue(ThemeSaveName, selectedValue);
          });
          clearInterval(ld);
        }
      }, 100);
    });
    let i = 1;
    let kd = -1;
    kd = setInterval(function() {
      if (ace !== undefined) {
        ace.edit("mainEditor").renderer.on('afterRender', function(e) {
          const value = GM_getValue(ThemeSaveName);
          if (value === "ace/theme/chrome" || ace.edit("mainEditor").getOption("theme") === value) {
            return;
          }
          ace.edit("mainEditor").setOptions({theme: value});
        });
        clearInterval(kd);
      }
    }, 100);
  };

  let id = -1;
  id = setInterval(function() {
    if ($("#mainEditor").length > 0) {
      SetupMutationObserver();
      clearInterval(id);
    }
  }, 100);
});
