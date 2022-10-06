// ==UserScript==
// @name         Bypass Ad Links
// @namespace    FireCanCan.Web.Bypass.AdLinks
// @version      1.0.0
// @description  Bypass Ad Links in any website on the web.
// @author       Soup Can Sam
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
/* global $, sqMissionSolver, _, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

const SettingsSaveName = "BypassAdLinks.Settings";

$(document).ready(function () {
  const Settings = {websites:[]};
  const config = new MonkeyConfig({
    title: 'Configure',
    menuCommand: true,
    params: {
      websites: {
        type: "text",
        default: ""
      }
    }
  });
  const loadSettings = function() {
    Settings.websites = [...config.get("websites").replace(/,\s?/,",").split(",")];
  };
  const fixLinks = () => {
    let id = -1;
    id = setInterval(function() {
      Settings.websites.forEach(function(website) {
        let ele = $(`a[href*="https://${website}/"]`);
        if ($(ele).length > 0) {
          $(ele).each(function() {
            $(this).attr("href", $(this).attr("href").replace(new RegExp(`https:\/\/${website}\/quick\?token=[a-zA-Z0-9]+\&url=`,"gi"),""));
          });
        }
      });
    }, 1000);
  }
  $(window.location).on('hashchange', function(e){
    fixLinks();
  });
  fixLinks();
  GM_registerMenuCommand("Load Settings", function() {
    loadSettings();
  });
  loadSettings();
});