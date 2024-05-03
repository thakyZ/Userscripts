// ==UserScript==
// @name         TModLoader Workshop Page Formatter
// @namespace    NekoBoiNick.Web.Steam.Workshop.TModLoader
// @version      1.0.1
// @description  Format TModLoader workshop pages.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_tmodloader_formatter/steamworkshop_tmodloader_formatter.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_tmodloader_formatter/steamworkshop_tmodloader_formatter.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  GM_deleteValue("teamworkshop_tmodloader_formatter_data");

  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      key: {
        type: "text",
        default: "",
      },
    },
  });
  let itemIcons;
  const checkItemsSet = cb => {
    const value = config.get("key");
    return value !== undefined && value !== "" ? sendItems(value, cb) : null;
  };

  const sendItems = (e0, cb) => {
    $.ajax({
      url: `https://api.nekogaming.xyz/json/get_json.php?key=${e0}&file=steamworkshop_tmodloader_formatter_data`,
      beforeSend(xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      },
      success(data) {
        cb(null, data);
      },
      error(x, s, e) {
        console.log(x);
        console.log(s);
        console.log(e);
      },
    });
  };

  const styleElement = $("<style>.tmodloadericon{width:16px;height:16px;display:inline-block;}</style>");
  const parseCSSIcon = id => {
    const currentHtml = $(styleElement).html();
    return currentHtml.indexOf(`.tmodloadericon.item-${id}`) > -1 ? null : $(styleElement).html(currentHtml.concat(`.tmodloadericon.item-${id}{background-image:url("${itemIcons[id]}");}`));
  };

  const parseText = () => {
    const getDescription = $($(".workshopItemDescription")[0]);
    const regexFont = /\[c\/(\w{6}):((?:[^\][]+))\]/i;
    const regexIcon = /\[i:(\d{1,4})\]/gi;
    const test = $(getDescription).html().replaceAll(regexFont, "<span style=\"color:#$1;\">$2</span>");
    const test2 = [...test.match(regexIcon)];
    for (const [, match] of Object.entries(test2)) {
      parseCSSIcon(match[1]);
    }

    const test3 = test.replaceAll(regexIcon, "<i class=\"tmodloadericon item-$1\"></i>");
    $("head").append(styleElement);
    $(getDescription).html(test3);
  };

  checkItemsSet((_, b) => {
    itemIcons = b;
    parseText();
  });
});
