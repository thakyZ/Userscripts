// ==UserScript==
// @name         Bypass Ad Links
// @namespace    NekoBoiNick.Web.Bypass.AdLinks
// @version      1.0.4
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
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, GM_config */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const settings = { websites: [] };
  GM_config.init({
    id: "bypass_ad_links",
    title: "Bypass Ad Links Config",
    fields: {
      websites: {
        label: "Websites",
        type: "textarea",
        default: ""
      }
    }
  });
  const loadSettings = () => {
    settings.websites = [...GM_config.get("websites").split("\n")];
  };

  const fixLinks = () => {
    settings.websites.forEach(website => {
      if (website === "") {
        return;
      }

      const elements = $(`a[href^="${website}"]`);
      for (const element of Object.entries(elements)) {
        $(element).attr("href", $(this).attr("href").replace(new RegExp(`https?://${website}/quick?token=[a-zA-Z0-9]+&url=`, "gi"), ""));
      }

      clearInterval(id);
    });
  };

  $(window.location).on("hashchange", () => fixLinks());
  fixLinks();
  GM_registerMenuCommand("Load Settings", () => loadSettings());
  GM_registerMenuCommand("Open Settings", () => GM_config.open());
  loadSettings();

  const setupMutationObserver = () => {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" || mutation.type === "attributes" || mutation.type === "subtree") {
          fixLinks();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  setupMutationObserver();
});
