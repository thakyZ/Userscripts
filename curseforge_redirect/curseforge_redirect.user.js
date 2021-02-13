// ==UserScript==
// @name            Curse Forge Redirect
// @namespace       NekoBoiNick.Curseforge.Redirect
// @version         0.1
// @description     Redirect Method to redirect to the better curse forge page dedicated to the game you are looking at.
// @author          Neko Boi Nick
// @match           *://www.curseforge.com/minecraft/*
// @match           *://minecraft.curseforge.com/mc-mods/*
// @exclude         *://minecraft.curseforge.com/projects/
// @icon            https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curse-icon.png
// @compatible      firefox
// @compatible      chrome
// @downloadURL     https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curseforge_redirect.user.js
// @updateURL       https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curseforge_redirect.user.js
// @supportURL      https://github.com/thakyZ/Userscripts/issues
// @homepageURL     https://github.com/thakyZ/Userscripts
// @contributionURL https://paypal.me/thakyZ
// @grant           none
// @noframes
// ==/UserScript==

(function() {
  'use strict';
  var regexp1 = /^(https?:\/\/)(www)(\.curseforge\.com\/)(minecraft\/)(.+)\/(.+)$/i;
  var regexp2 = /^(https?:\/\/)(minecraft)(\.curseforge\.com\/)(mc-mods\/)([0-9]+)\-(.+)$/i;

  var loc = window.location.href;

  var urlrep = "";

  if (regexp2.test(loc)) {
    urlrep = loc.replace(regexp2, "$1www$3minecraft/mc-mods/$6");
    window.location.href = urlrep;
  }
  else if (regexp2.test(loc)) {
    urlrep = loc.replace(regexp2, "$1$2$3$4$5$6");
    window.location.href = urlrep;
  }
})();
