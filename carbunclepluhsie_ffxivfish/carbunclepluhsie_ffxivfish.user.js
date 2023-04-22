// ==UserScript==
// @name         Fish Tracking App
// @namespace    NekoBoiNick.Web.CarbunclePluhsie.FFXIVFish
// @version      1.0.2.1
// @description  Syncs Fish Tracking to soupcat
// @author       Neko Boi Nick
// @match        https://ff14fish.carbuncleplushy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ff14fish.carbuncleplushy.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/carbunclepluhsie_ffxivfish/carbunclepluhsie_ffxivfish.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/carbunclepluhsie_ffxivfish/carbunclepluhsie_ffxivfish.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global $, jQuery, ViewModel, _ */
this.$ = this.jQuery = jQuery.noConflict(true);

const SettingsSaveName = "FishTrackingApp.Settings";
const DateSaveName = "FishTrackingApp.Date";

$(document).ready(() => {
  const getSettings = () => JSON.stringify(ViewModel.settings, (_, value) => (value instanceof Set ? [...value] : value));

  const setSettings = settings => {
    // Apply the imported settings now.
    settings = JSON.parse(settings);
    // Check if the `settings` is a list or object.
    if (settings instanceof Array) {
      // Array means it's just a checklist. Don't overwrite any other settings...
      // NOTE: This will OVERWRITE the checklist! I'm assuming you've tracked the fish elsewhere...
      ViewModel.overwriteChecklist(settings);
    } else {
      // Otherwise, it should be valid settings.
      ViewModel.applySettings(settings);
    }

    // Update the fish entries.
    // TODO: [NEEDS-OPTIMIZATION]
    const earthTime = new Date();
    _(ViewModel.fishEntries).each(entry => {
      entry.update(earthTime, true);
      ViewModel.layout.updatePinnedState(entry);
      ViewModel.layout.updateCaughtState(entry);
    });
    // Update the display to update the fish table as well.
    ViewModel.updateDisplay(null);
    return true;
  };

  const getDate = () => Date.now();

  const compareDate = (cur, prev) => cur > prev;

  const saveSettings = force => {
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
  };

  const loadSettings = force => {
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
  };

  setInterval(() => {
    saveSettings();
  }, 15000);
  GM_registerMenuCommand("Load Settings", () => {
    loadSettings(true);
  });
  GM_registerMenuCommand("Save Settings", () => {
    saveSettings(true);
  });
});
