// ==UserScript==
// @name         Nexus Mods Copy Author Name
// @namespace    NekoBoiNick.Web.NexusMods.CopyAuthorName
// @version      1.0.2
// @description  Adds a copy author name button to Nexus Mods mod page.
// @author       Neko Boi Nick
// @match        https://www.nexusmods.com/*/mods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

$(document).ready(function() {
  var creatorInfo = $("#fileinfo .sideitem")[2];
  var uploaderInfo = $("#fileinfo .sideitem")[3];
  var infos = [ creatorInfo, uploaderInfo ];
  var createObjects = function(e, i) {
    var tempButton = `<style>#action-${e}{position: relative;margin-left: 100px;margin-top: -35px;}#action-${e}::marker{content:none;}#action-${e} .inline-flex .icon{margin: 0 2px 0 2px;}</style>
    <li style="" id="action-${e}">
      <a class="btn inline-flex" href="#" tabindex="0">
        <svg title="" class="icon icon-files">
          <use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-files"></use>
        </svg>
        <span class="flex-label"></span>
      </a>
    </li>`
    var test = $(infos[i]).html();
    $(infos[i]).html(`${test}\n${tempButton}`);
    $(`#action-${e} a`).on("click", function(e) {
      var parent = $(document).find($(e.currentTarget)).parent();
      var text = $(parent).parent().text().split("\n")[2].replace(" ", "");
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    });
  }
  createObjects("copycreatorname", 0);
  createObjects("copyuploadername", 1);
});
