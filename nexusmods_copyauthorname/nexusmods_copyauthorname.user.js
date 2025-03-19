// ==UserScript==
// @name         Nexus Mods Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.4.2
// @description  Adds a copy author name button to Nexus Mods mod page, as well as some other things...
// @author       Neko Boi Nick
// @match        https://www.nexusmods.com/*
// @match        https://next.nexusmods.com/*
// @match        https://nexusmods.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @connect      www.nexusmods.com
// @connect      next.nexusmods.com
// @connect      nexusmods.com
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global checkAB */
this.jQuery = jQuery.noConflict(true);

jQuery(($) => {
  let checkABInterval = -1;

  checkABInterval = setInterval(() => {
    if (unsafeWindow.blockingAds) {
      checkAB(false);
    }
  }, 100);

  $(window).on("beforeunload", () => {
    clearInterval(checkABInterval);
    checkABInterval = -1;
  });

  function createCopyAuthorButton() {
    const creatorInfo = $("#fileinfo .sideitem:not(.timestamp)")[0];
    const uploaderInfo = $("#fileinfo .sideitem:not(.timestamp)")[1];
    const infos = [creatorInfo, uploaderInfo];
    const createObjects = (id, index) => {
      const tempButton = `<style>#action-${id}{position: relative;margin-left: 100px;margin-top: -35px;}#action-${id}::marker{content:none;}#action-${id} .inline-flex .icon{margin: 0 2px 0 2px;}</style>
    <li style="" id="action-${id}">
      <a class="btn inline-flex" tabindex="0">
        <svg title="" class="icon icon-files">
          <use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-files"></use>
        </svg>
        <span class="flex-label"></span>
      </a>
    </li>`;
      const test = $(infos[index]).html();
      $(infos[index]).html(`${test}\n${tempButton}`);
      $(`#action-${id} a`).on("click", (element) => {
        const parent = $(document).find($(element.currentTarget)).parent();
        const text = $(parent).parent().text().split("\n")[2].replace(" ", "");
        GM_setClipboard(text);
      });
    };

    createObjects("copycreatorname", 0);
    createObjects("copyuploadername", 1);
  }

  function createTrackedElement(modId, gameId, active = false) {
    return `
<a title="Track this mod" data-source-page="trackButton" data-positive="1" data-mod-id="${modId}" data-game-id="${gameId}" class="track-mod">
  <svg title="" class="icon icon-endorse-${active ? "active" : "inactive"}">
    <use xlink:href="/assets/images/icons/icons.svg#icon-track"></use>
  </svg>
</a>`;
  }

  function createTrackedModsIndicator(tbody) {
    const tableCells = $(tbody).find("> tr > td.table-endorsement");

    if ($(tableCells).length === 0) {
      return;
    }

    for (const [index, element] of Object.entries(tableCells)) {
      if (isNaN(Number(index))) {
        continue;
      }

      if ($(element).find("> div > a").length < 3) {
        const reference = $(element).find("> div > a")[0];
        const modId = $(reference).attr("data-mod-id");
        const gameId = $(reference).attr("data-game-id");
        const isTracked = false;
        const trackedElement = $(createTrackedElement(modId, gameId, isTracked));
        $(element).find("> div").append(trackedElement);
        $(trackedElement).on("click", (event) => {
          const element = $(event.target).parents().closest("a");
          (async function() {
            try {
              const modId = $(element).attr("data-mod-id");
              const gameId = $(element).attr("data-game-id");
              const isActive = $(element).find("svg").hasClass("icon-track-active") ? 0 : 1;
              const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Mods?ToggleTracking", {
                credentials: "include",
                headers: {
                  "User-Agent": unsafeWindow.navigator.userAgent,
                  Accept: "*/*",
                  "Accept-Language": "en-US,en;q=0.5",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "X-Requested-With": "XMLHttpRequest",
                  "Sec-GPC": "1",
                  "Sec-Fetch-Dest": "empty",
                  "Sec-Fetch-Mode": "cors",
                  "Sec-Fetch-Site": "same-origin"
                },
                referrer: `https://www.nexusmods.com/stardewvalley/mods/${modId}`,
                body: `game_id=${gameId}&mod_id=${modId}&do_track=${isActive}`,
                method: "POST",
                mode: "cors"
              });
              console.debug(response);

              if (response.status === 404 || response.status === 500) {
                throw new Error(`Failed with status code ${response.status}.`);
              }

              if (response.ok && response.status === 200) {
                if (response.status === true) {
                  $(element).find("svg").removeClass("icon-track-inactive");
                  $(element).find("svg").addClass("icon-track-active");
                } else {
                  $(element).find("svg").removeClass("icon-track-active");
                  $(element).find("svg").addClass("icon-track-inactive");
                }
              }
            } catch (error) {
              console.error("Failed to run Xml Http Request");
              console.error(error);
            }
          })();
        });
      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (/https:\/\/(?:www\.)?nexusmods\.com\/.+\/users\/myaccount\?tab=download\+history/gi.test(unsafeWindow.location.href)) {
          //console.debug("0", $(mutation.target).is("tbody"));
          //console.debug("1", $(mutation.target).parent().is("table.datatable"));
          //console.debug("2", ($(mutation.target).is("tbody") && $(mutation.target).parent().is("table.datatable")));
          if ($(mutation.target).is("tbody") && $(mutation.target).parent().is("table.datatable")) {
            createTrackedModsIndicator($(mutation.target));
          }
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function main() {
    if (/https:\/\/(?:www\.)?nexusmods\.com\/.+\/mods\/\d+/gi.test(unsafeWindow.location.href) !== null) {
      createCopyAuthorButton();
    }

    setupMutationObserver();
  }

  main();
});
