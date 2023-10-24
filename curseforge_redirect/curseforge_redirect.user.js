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
// @match           *://legacy.curseforge.com/*
// @exclude         *://minecraft.curseforge.com/projects/
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @icon            https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curse-icon.png
// @license         MIT
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM.xmlHttpRequest
// @connect         https://legacy.curseforge.com*
// @connect         https://www.curseforge.com*
// @downloadURL     https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js
// @updateURL       https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js
// @supportURL      https://github.com/thakyZ/Userscripts/issues
// @homepageURL     https://github.com/thakyZ/Userscripts
// @noframes
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

// Disable any banner with giveaways, as I personally do not want to sign up for them. But only if they contain "Win Awesome Prizes" otherwise others are fine.
// eslint-disable-next-line prefer-const
let disableBanner = true;

jQuery(($) => {
  const defaultWhiteListedLegacyPages = ["my-notifications", "private-messages", "members", "account", ".*/relations", "project"];
  let whiteListedLegacyPages = [];
  const bannerTitles = ["The Official Mod Hub for", "win awesome prizes"];
  const regExpLegacyBase = "https://legacy.curseforge.com/";
  const regExpNewWebsiteBase = "https://www.curseforge.com/";
  const loc = window.location.href;

  function testGreaseMonkeyCompat() {
    const toTest = [GM, GM.xmlHttpRequest, GM_getValue, GM_setValue, GM_deleteValue];
    for (const object of toTest) {
      console.debug(object);
      if (!isNaN(Number(object))) {
        throw new Error(`object in toTest array returned a number, "${object}"`);
      }

      const expectedType = object === GM ? "object" : "function";

      if (typeof object === "undefined") {
        throw new Error(`The global ${expectedType} ${object} is not defined.`);
      }
    }
  }

  function propagateDefaultWhitelist() {
    const config = GM_getValue("whitelisted");
    if (typeof config === "undefined" || config === null) {
      GM_setValue("whitelisted", JSON.stringify(defaultWhiteListedLegacyPages));
    }
  }

  /* eslint-disable-next-line no-unused-vars */
  function resetWhitelist() {
    GM_deleteValue("whitelisted");
    propagateDefaultWhitelist();
  }

  /* eslint-disable-next-line no-unused-vars */
  function loadWhitelist() {
    try {
      const rawConfig = GM_getValue("whitelisted");
      const json = JSON.parse(rawConfig);
      whiteListedLegacyPages = json;
    } catch (error) {
      console.error(error);
      throw error;
      // TODO: prompt to reset whitelist if it broke.
      // console.error(error);
      // prompt("Would you like to reset the config as it has broken?", resetWhitelist(), "close");
    }
  }

  async function runDomainRedirectCheck(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url,
        onload(response) {
          console.log(response.status);
          resolve(true);
        },
        onerror(response) {
          console.log(response.status);
          resolve(true);
          reject(response);
        }
      });
    });
  }

  /* eslint-disable-next-line no-unused-vars */
  function testWebpage() {
    if (loc.startsWith(regExpLegacyBase)) {
      if ((new RegExp(regExpLegacyBase + "(" + whiteListedLegacyPages.join("|") + ").*", "i")).test(loc)) {
        const test = runDomainRedirectCheck(loc.replace(regExpLegacyBase, regExpNewWebsiteBase));
      } else {
        const test = runDomainRedirectCheck(loc.replace(regExpLegacyBase, regExpNewWebsiteBase));
      }
    }
  }

  testGreaseMonkeyCompat();

  // TODO: Dynamically Create RegExp classes.
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
