// ==UserScript==
// @name         TModLoader Workshop Page Formatter
// @namespace    NekoBoiNick.Web.Steam.Workshop.TModLoader
// @version      1.0.0
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
$(document).ready(function(){
GM_deleteValue("teamworkshop_tmodloader_formatter_data");
var config = new MonkeyConfig({
    title: 'Configure',
    menuCommand: true,
    params: {
      key: {
        type: "text",
        default: ""
      }
    }
  });
  var itemIcons;
  var checkItemsSet = function(e0, cb) {
    var test = () => { var value = config.get("key"); if (value !== undefined && value !== "") { return value } else { return false } };
    var test2 = test();
    if (test2 === false) {
      return null;
    } else {
      return sendItems(test2, cb);
    }
  }
  var sendItems = function(e0, cb) {
    $.ajax({
      url: `https://api.nekogaming.xyz/json/get_json.php?key=${e0}&file=steamworkshop_tmodloader_formatter_data`,
      beforeSend: function(xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      },
      success:function(data){
        cb(null, data);
      },
      error:function(x, s, e){
        console.log(x);
        console.log(s);
        console.log(e);
      }
    });
  };
  var styleElement = document.createElement("style");
  var ParseCSS = function() {
    $(styleElement).html(".tmodloadericon{width:16px;height:16px;display:inline-block;}");
  }
  var ParseCSSIcon = function(id) {
    if ($(styleElement).html().indexOf(`.tmodloadericon.item-${id}`) !== -1) {
      return;
    }
    $(styleElement).html($(styleElement).html() + `.tmodloadericon.item-${id}{background-image:url("${itemIcons[id]}");}`);
  }
  var ParseText = function() {
    var getDescription = $($(".workshopItemDescription")[0]);
    var regexFont = /\[c\/([a-z0-9]{6})\:((?:[^\]\[]+))\]/g;
    var regexIcon = /\[i:([0-9]{1,4})\]/g;
    var test = $(getDescription).html().replaceAll(regexFont, `<span style="color:#$1;">$2</span>`);
    var test2 = [...test.matchAll(regexIcon)];
    ParseCSS();
    test2.forEach(function(e, i) {
      ParseCSSIcon(e[1]);
    });
    var test4 = test.replaceAll(regexIcon, `<i class="tmodloadericon item-$1"></i>`);
    var soup2 = $(getDescription).html();
    $("head").append(styleElement);
    $(getDescription).html(test4);
  }
  checkItemsSet(null, function(e, b){itemIcons = b;ParseText();});
});
