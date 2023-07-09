// ==UserScript==
// @name         Bypass Ad Links
// @namespace    NekoBoiNick.Web.Bypass.AdLinks
// @version      1.0.5
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
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     GMConfigCSS https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/GM_config-style.min.css
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const settings = { websites: [] };

  function loadSettings() {
    const _settings = GM_config.get("websites");
    if (typeof _settings === "undefined" || _settings === "") {
      return;
    }

    settings.websites = [..._settings.split("\n")];
  }

  function fixLinks() {
    for (const [, website] of settings.websites) {
      if (website === "") {
        return;
      }

      const elements = $(`a[href^="${website}"]`);
      for (const element of Object.entries(elements)) {
        $(element).attr("href", $(this).attr("href").replace(new RegExp(`https?://${website}/quick?token=[a-zA-Z0-9]+&url=`, "gi"), ""));
      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" || mutation.type === "attributes" || mutation.type === "subtree") {
        fixLinks();
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => observer.disconnect());
  }

  function setupGMConfigFrame() {
    const configWrapper = $("<div class=\"config-wrapper\"></div>");
    const element = $("<div id=\"GlamourDresser_Additions_Config\"></div>");
    $(configWrapper).append($(element));
    $("body").append($(configWrapper));
    return element[0];
  }

  const gmConfigFrame = setupGMConfigFrame();

  GM_registerMenuCommand("Load Settings", () => loadSettings());
  GM_registerMenuCommand("Open Settings", () => GM_config.open());

  const gmConfigCSS = GM_getResourceText("GMConfigCSS");

  GM_config.init({
    id: "bypass_ad_links",
    title: "Bypass Ad Links Config",
    fields: {
      websites: {
        label: "Websites",
        type: "textarea",
        default: ""
      }
    },
    events: {
      init() {
        GM_config.frame.setAttribute("style", "display:none;");
        loadSettings();
        $(window.location).on("hashchange", () => fixLinks());
        fixLinks();
        setupMutationObserver();
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });
});
