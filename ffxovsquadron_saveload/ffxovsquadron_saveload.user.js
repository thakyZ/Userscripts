// ==UserScript==
// @name         FFXIV Squadron App
// @namespace    NekoBoiNick.Web.FFXIVSquadron.SaveLoad
// @version      1.0.0
// @description  Syncs Fish Tracking to soupcat
// @author       Neko Boi Nick
// @match        http://ffxivsquadron.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxivsquadron.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxovsquadron_saveload/ffxovsquadron_saveload.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxovsquadron_saveload/ffxovsquadron_saveload.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, sqMissionSolver, _ */

var SettingsSaveName = "FFXIVSquadronApp.Settings";
var DateSaveName = "FFXIVSquadronApp.Date";

$(document).ready(function() {
  let getSettings = function() {
    return btoa(JSON.stringify(sqMissionSolver.getSquadron()[sqMissionSolver.activeSquadron]));
  };
  let setSettings = function(settings) {
    try {
      // Apply the imported settings now.
      sqMissionSolver.getSquadron()[sqMissionSolver.activeSquadron] = JSON.parse(atob(settings));
      localStorage.setItem('squadron', JSON.stringify(sqMissionSolver.getSquadron()));
      // Update the display to update the squadron table as well.
      sqMissionSolver.load();
    } catch (e) {
      console.log("The import of settings failed.");
      console.log(e);
      return false;
    }
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
