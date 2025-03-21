// ==UserScript==
// @name         FFXIV Squadron App
// @namespace    NekoBoiNick.Web
// @version      1.0.5
// @description  Syncs the FFXIV Sqadron App Data
// @author       Neko Boi Nick
// @match        https://www.ffxivsquadron.com/*
// @match        https://ffxivsquadron.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxivsquadron.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global sqMissionSolver, jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const SettingsSaveName = "FFXIVSquadronApp.Settings";
  const DateSaveName = "FFXIVSquadronApp.Date";
  const IconUrlSaveName = "FFXIVSquadronApp.IronUrl";

  function getSettings () {
    return btoa(localStorage.getItem("squadron"));
  }

  function setSettings (settings) {
    try {
      // Apply the imported settings now.
      localStorage.setItem("squadron", atob(settings));
      // Update the display to update the squadron table as well.
      sqMissionSolver.load();
    } catch (e) {
      console.log("The import of settings failed.");
      console.log(e);
      return false;
    }

    return true;
  }

  function getDate () {
    return Date.now();
  }

  function compareDate (cur, prev) {
    return cur > prev;
  }

  function saveSettings (force) {
    const date = GM_getValue(DateSaveName);
    const settings = getSettings();
    const settingsPrev = GM_getValue(SettingsSaveName);
    const dateNow = getDate();
    if (force) {
      GM_setValue(SettingsSaveName, settings);
      GM_setValue(DateSaveName, dateNow);
      return false;
    }

    if (compareDate(dateNow, date) && settings !== settingsPrev) {
      GM_setValue(SettingsSaveName, settings);
      GM_setValue(DateSaveName, dateNow);
      return true;
    }

    return false;
  }

  function loadSettings (force) {
    const date = GM_getValue(DateSaveName);
    const settings = GM_getValue(SettingsSaveName);
    if (force) {
      setSettings(settings);
      return true;
    }

    if (!compareDate(getDate(), date) && settings !== getSettings()) {
      setSettings(settings);
      return true;
    }

    return false;
  }

  setInterval(() => {
    saveSettings();
  }, 15000);

  GM_registerMenuCommand("Load Settings", () => {
    loadSettings(true);
  });

  GM_registerMenuCommand("Save Settings", () => {
    saveSettings(true);
  });

  let currentSealsImage = [];

  function getBase64Image (url, callback) {
    GM_xmlhttpRequest({
      method: "GET", url, responseType: "arraybuffer", onload (data) {
        if (data.response.length < 1) {
          callback(null, { event: false });
          return;
        }

        // Create an array of 8-bit unsigned integers
        const arr = new Uint8Array(data.response);

        // String.fromCharCode returns a 'string' from the specified sequence of Unicode values
        const raw = String.fromCharCode.apply(null, arr);

        // Btoa() creates a base-64 encoded ASCII string from a String object
        const b64 = btoa(raw);

        const dataType = "png";
        // Ta-da your image data url!
        const dataURL = "data:image/" + dataType + ";base64," + b64;
        callback(dataURL);
      }, onerror (data) {
        callback(null, { event: data });
      }, headers: { referer: "https://www.ffxivsquadron.com/", origin: "https://www.ffxivsquadron.com/" }
    });
  }

  const setupCurrentCrafters = () => {
    let pages = 0;
    let currencyId = 0;
    let itemIconUrl = "";
    let exit = false;
    const storedImage = GM_getValue(IconUrlSaveName);
    if (storedImage !== undefined && storedImage.length > 0) {
      currentSealsImage = storedImage;
      return { ExitState: true, ExitCode: 1 };
    }

    const images = [];
    $.ajax({
      type: "GET", url: "https://xivapi.com/CollectablesShopRewardScrip", dataType: "json", success(data) {
        pages = ((parseInt(data.Pagination.PageTotal, 10) - 1) * 100) + 1;
        $.ajax({
          type: "GET", url: `https://xivapi.com/CollectablesShopRewardScrip/${pages}`, dataType: "json", success(data) {
            currencyId = parseInt(data.Currency, 10);
            $.ajax({
              type: "GET", url: `https://xivapi.com/Currency/${currencyId}`, dataType: "json", success(data) {
                itemIconUrl = `https://xivapi.com${data.Item.IconHD}`;
                getBase64Image(itemIconUrl, (data, error) => {
                  if (error) {
                    console.error({ message: `Failed to parse image: \`${itemIconUrl}\``, data, error });
                    exit = true;
                    return;
                  }

                  images.push(data);
                  $.ajax({
                    type: "GET", url: `https://xivapi.com/Currency/${currencyId + 1}`, dataType: "json", success(data) {
                      itemIconUrl = `https://xivapi.com${data.Item.IconHD}`;
                      getBase64Image(itemIconUrl, (data, error) => {
                        if (error) {
                          console.error({ message: `Failed to parse image: \`${itemIconUrl}\``, data, error });
                          exit = true;
                          return;
                        }

                        images.push(data);
                        currentSealsImage = images;
                        GM_setValue(IconUrlSaveName, images);
                      });
                    }, error(jqXHR, textStatus, errorThrown) {
                      console.error({ message: `Failed to get Currency with ID: ${currencyId}`, data: jqXHR, error: errorThrown, response: textStatus });
                      exit = true;
                    }
                  });
                  if (exit) {
                    return { ExitState: false, ExitCode: 2 };
                  }
                });
              }, error(jqXHR, textStatus, errorThrown) {
                console.error({ message: `Failed to get Currency with ID: ${currencyId}`, data: jqXHR, error: errorThrown, response: textStatus });
                exit = true;
              }
            });
          }, error(jqXHR, textStatus, errorThrown) {
            console.error({ message: `Failed to get Collectables Reward Scrip with ID: ${pages}`, data: jqXHR, error: errorThrown, response: textStatus });
            exit = true;
          }
        });
      }, error(jqXHR, textStatus, errorThrown) {
        console.error({ message: "Failed to get Collectables Reward Scrips", data: jqXHR, error: errorThrown, response: textStatus });
        exit = true;
      }
    });
    if (exit) {
      return { ExitState: false, ExitCode: 1 };
    }

    return { ExitState: true, ExitCode: 0 };
  };

  function handleActiveChemistries (activeChemistries) {
    for (const [, chemistry] of Object.entries(activeChemistries)) {
      const chemImage = $(".img-chem img", $(chemistry));
      if ($(chemImage).attr("src") === "images/cra_scrips.png") {
        $(chemImage).attr("src", `${currentSealsImage[1]}`);
        $(chemImage).attr("width", "32");
        $(chemImage).attr("height", "32");
      }

      if ($(chemImage).attr("src") === "images/gat_scrips.png") {
        $(chemImage).attr("src", `${currentSealsImage[1]}`);
        $(chemImage).attr("width", "32");
        $(chemImage).attr("height", "32");
      }
    }
  }

  /**
   * @param {Mutation[]} mutationList
   */
  function callback (mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0 && $(mutation.addedNodes[0]).attr("class").split(" ")[0] === "result-line") {
        for (const node of mutation.addedNodes) {
          const chemistries = $(node).children(".stats-and-training").children(".chemistries");
          if (chemistries.length > 0) {
            const activeChemistries = $(chemistries).children("div:not(.title-stat)");
            handleActiveChemistries(activeChemistries);
          }
        }
      }
    }
  }

  function setupMutationObserver () {
    const targetNode = $("#content-right")[0];
    const config = { attributes: false, childList: true, subtree: true };
    const updateIcon = setupCurrentCrafters();

    if (updateIcon.ExitState === false) {
      return;
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
