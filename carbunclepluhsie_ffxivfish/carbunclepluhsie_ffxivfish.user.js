// ==UserScript==
// @name         Fish Tracking App
// @namespace    NekoBoiNick.Web.CarbunclePluhsie.FFXIVFish
// @version      1.0.0
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
// ==/UserScript==
/* global $, ViewModel, _ */

var SettingsSaveName = "FishTrackingApp.Settings";
var DateSaveName = "FishTrackingApp.Date";

$(document).ready(function() {
  let getSettings = function() {
    return JSON.stringify(ViewModel.settings, (key, value) => value instanceof Set ? [...value] : value);
  };
  let setSettings = function(settings) {
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
    let earthTime = new Date();
    _(ViewModel.fishEntries).each(entry => {
      entry.update(earthTime, true);
      ViewModel.layout.updatePinnedState(entry);
      ViewModel.layout.updateCaughtState(entry);
    });
    // Update the display to update the fish table as well.
    ViewModel.updateDisplay(null);
    return true;
  };
  let getDate = function() {
    return Date.now();
  };
  let compareDate = function(cur, prev) {
    if (cur > prev) {
      return true;
    } else {
      return false;
    }
  };
  let saveSettings = function(force) {
    var date = GM_getValue(DateSaveName);
    var settings = getSettings();
    var settings_prev = GM_getValue(SettingsSaveName);
    var date_now = getDate();
    if (force) {
      GM_setValue(SettingsSaveName, settings);
      GM_setValue(DateSaveName, date_now);
      return false;
    } else {
      if (compareDate(date_now, date) && settings != settings_prev) {
        GM_setValue(SettingsSaveName, settings);
        GM_setValue(DateSaveName, date_now);
        return true;
      } else {
        return false;
      }
    }
  };
  let loadSettings = function(force) {
    var date = GM_getValue(DateSaveName);
    var settings = GM_getValue(SettingsSaveName);
    if (force) {
      setSettings(settings);
      return true;
    } else {
      if (!compareDate(getDate(), date) && settings != getSettings()) {
        setSettings(settings);
        return true;
      } else {
        return false;
      }
    }
  };
  setInterval(function() {
    saveSettings();
  }, 15000);
  GM_registerMenuCommand("Load Settings", function() {
    loadSettings(true);
  });
  GM_registerMenuCommand("Save Settings", function() {
    saveSettings(true);
  });
});
