// ==UserScript==
// @name         Ariyala's FFXIV Toolkit Bookmarks
// @namespace    NekoBoiNick.Web
// @version      1.0.3
// @license      MIT
// @description  Adds a small box for shortcuts on the Wiki.
// @author       Neko Boi Nick
// @match        https://ffxiv.ariyala.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxiv.ariyala.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ariyala_shortcuts/styles.min.css
// @resource     items https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ariyala_shortcuts/item.template.html
// ==/UserScript==
this.jQuery = jQuery.noConflict(true);

const jsonConfig = {
  items: [
    {
      icon: "BLU",
      name: "Lvl 60",
      url: "1DEGU",
      id: "blu_level_60_melds",
    },
  ],
};

this.jQuery(($) => {
  GM_addStyle(GM_getResourceText("css"));

  const item = [];

  for (const value of jsonConfig.items) {
    item.push($.fn.createElement("items", { "#{{id}}": value.id, "#{{icon}}": value.icon, "#{{url}}": value.url, "#{{name}}": value.name }));
  }

  const templateTray = () => "<div class=\"tray\" id=\"bookmarks\"></div>";

  $("#body").append(templateTray());

  for (const value of item) {
    $("#bookmarks").append(value);
  }
});
