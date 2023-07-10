// ==UserScript==
// @name            Curse Forge Redirect
// @namespace       NekoBoiNick.CurseForge.Redirect
// @version         1.0.3
// @description     Redirect Method to redirect to the better curse forge page dedicated to the game you are looking at.
// @author          Neko Boi Nick
// @match           *://www.curseforge.com/minecraft/*
// @match           *://minecraft.curseforge.com/mc-mods/*
// @match           *://minecraft.curseforge.com/*
// @match           *://curseforge.com/*
// @match           *://www.curseforge.com/*
// @exclude         *://minecraft.curseforge.com/projects/
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @icon            https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curse-icon.png
// @license         MIT
// @downloadURL     https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js
// @updateURL       https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js
// @supportURL      https://github.com/thakyZ/Userscripts/issues
// @homepageURL     https://github.com/thakyZ/Userscripts
// @grant           none
// @noframes
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

// Disable any banner with giveaways, as I personally do not want to sign up for them. But only if they contain "Win Awesome Prizes" otherwise others are fine.
// eslint-disable-next-line prefer-const
let disableBanner = true;

$(document).ready(() => {
  const bannerTitles = ["The Official Mod Hub for", "win awesome prizes"];

  const regexp1 = /^(https?:\/\/)(www)(\.curseforge\.com\/)(minecraft\/)(.+)\/(.+)$/i;
  const regexp2 = /^(https?:\/\/)(minecraft)(\.curseforge\.com\/)(mc-mods\/)(\d+)-(.+)$/i;
  const loc = window.location.href;

  if (regexp2.test(loc)) {
    window.location.href = loc.replace(regexp2, "$1www$3minecraft/mc-mods/$6");
  } else if (regexp1.test(loc)) {
    window.location.href = loc.replace(regexp2, "$1$2$3$4$5$6");
  }

  const doDisableBanner = () => {
    bannerTitles.forEach((element) => {
      if ($("html head ~ div a").length > 0 && $("html head ~ div a").text().includes(element)) {
        $("html head ~ div").css({ display: "none" });
      } else if ($("#banner").length > 0 && $("#banner .banner-content p").text().includes(element)) {
        $("#banner").css({ display: "none" });
      }
    });
  };

  if (disableBanner) {
    doDisableBanner();
  }
});
