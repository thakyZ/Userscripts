// ==UserScript==
// @name         Bypass Ad Links
// @namespace    NekoBoiNick.Web.Bypass.AdLinks
// @version      1.0.2
// @description  Bypass Ad Links in any website on the web.
// @author       Neko Boi Nick
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

/* Old save code.
 * const settingsSaveName = "BypassAdLinks.Settings";
 */

$(document).ready(() => {
  const Settings = { websites: [] };
  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      websites: {
        type: "text",
        default: ""
      }
    }
  });
  const loadSettings = function () {
    Settings.websites = [...config.get("websites").replace(/,\s?/, ",").split(",")];
  };

  const fixLinks = () => {
    let id = -1;
    id = setInterval(() => {
      Settings.websites.forEach(website => {
        const ele = $(`a[href*="https://${website}/"]`);
        for (let i = 0; i < $(ele).length; i++) {
          $(ele[i]).attr("href", $(this).attr("href").replace(new RegExp(`https://${website}/quick?token=[a-zA-Z0-9]+&url=`, "gi"), ""));
        }

        clearInterval(id);
      });
    }, 1000);
  };

  $(window.location).on("hashchange", () => {
    fixLinks();
  });
  fixLinks();
  GM_registerMenuCommand("Load Settings", () => {
    loadSettings();
  });
  loadSettings();
});
