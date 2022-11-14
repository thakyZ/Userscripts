// ==UserScript==
// @name         FFXIV Squadron App
// @namespace    NekoBoiNick.Web.FFXIVSquadron.SaveLoad
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
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, sqMissionSolver, _, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

const SettingsSaveName = "FFXIVSquadronApp.Settings";
const DateSaveName = "FFXIVSquadronApp.Date";
const IconUrlSaveName = "FFXIVSquadronApp.IronUrl";

$(document).ready(function() {
  let getSettings = function() {
    return btoa(localStorage.getItem('squadron'));
  };
  let setSettings = function(settings) {
    try {
      // Apply the imported settings now.
      localStorage.setItem('squadron', atob(settings));
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

  let currentSealsImage = [];

  const getBase64Image = (url, callback) => {
    GM_xmlhttpRequest({method:"GET",url:url,responseType:"arraybuffer",onload:function(data){
      if(data.response.length < 1){
        callback(null, {event:event});
        return;
      }
      // Create an array of 8-bit unsigned integers
      var arr = new Uint8Array(data.response);

      // String.fromCharCode returns a 'string' from the specified sequence of Unicode values
      var raw = String.fromCharCode.apply(null, arr);

      //btoa() creates a base-64 encoded ASCII string from a String object
      var b64 = btoa(raw);

      var dataType = 'png';
      //ta-da your image data url!
      var dataURL = 'data:image/' + dataType + ';base64,' + b64;
      callback(dataURL);
    },onerror:function(data){
      callback(null, {event:data});
    },headers:{referer:"https://www.ffxivsquadron.com/",origin:"https://www.ffxivsquadron.com/"}});
  }

  const SetupCurrentCrafters = () => {
    let pages = 0;
    let currencyId = 0;
    let itemIconUrl = "";
    let exit = false;
    const storedImage = GM_getValue(IconUrlSaveName);
    if (storedImage !== undefined && storedImage.length > 0) {
      currentSealsImage = storedImage;
      return {ExitState:true,ExitCode:1};
    }
    let images = [];
    $.ajax({type:"GET",url:"https://xivapi.com/CollectablesShopRewardScrip",dataType:"json",success:function(data){
      pages = ((parseInt(data.Pagination.PageTotal) - 1) * 100) + 1;
      $.ajax({type:"GET",url:`https://xivapi.com/CollectablesShopRewardScrip/${pages}`,dataType:"json",success:function(data){
        currencyId = parseInt(data.Currency);
        $.ajax({type:"GET",url:`https://xivapi.com/Currency/${currencyId}`,dataType:"json",success:function(data){
          itemIconUrl = `https://xivapi.com${data.Item.IconHD}`;
          getBase64Image(itemIconUrl,function(data, error){
            if (error) {
              console.error({message:`Failed to parse image: \`${itemIconUrl}\``,data:data,error:error});
              exit = true;
              return;
            }
            images.push(data);
            $.ajax({type:"GET",url:`https://xivapi.com/Currency/${currencyId + 1}`,dataType:"json",success:function(data){
              itemIconUrl = `https://xivapi.com${data.Item.IconHD}`;
              getBase64Image(itemIconUrl,function(data, error){
                if (error) {
                  console.error({message:`Failed to parse image: \`${itemIconUrl}\``,data:data,error:error});
                  exit = true;
                  return;
                }
                images.push(data);
                currentSealsImage = images;
                GM_setValue(IconUrlSaveName, images);
              });
            },error:function(jqXHR, textStatus, errorThrown){
              console.error({message:`Failed to get Currency with ID: ${currencyId}`,data:jqXHR,error:errorThrown,response:textStatus});
              exit = true;
            }});
            if (exit) {
              return {ExitState:false,ExitCode:2};
            }
          });
        },error:function(jqXHR, textStatus, errorThrown){
          console.error({message:`Failed to get Currency with ID: ${currencyId}`,data:jqXHR,error:errorThrown,response:textStatus});
          exit = true;
        }});
      },error:function(jqXHR, textStatus, errorThrown){
        console.error({message:`Failed to get Collectables Reward Scrip with ID: ${pages}`,data:jqXHR,error:errorThrown,response:textStatus});
        exit = true;
      }});
    },error:function(jqXHR, textStatus, errorThrown){
      console.error({message:"Failed to get Collectables Reward Scrips",data:jqXHR,error:errorThrown,response:textStatus});
      exit = true;
    }});
    if (exit) {
      return {ExitState:false,ExitCode:1};
    }
    return {ExitState:true,ExitCode:0};
  }

  const SetupMutationObserver = () => {
    const targetNode = $("#content-right")[0];
    const config = { attributes: false, childList: true, subtree: true };
    const updateIcon = SetupCurrentCrafters();

    if (updateIcon.ExitState === false) {
      return;
    }

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && $(mutation.addedNodes[0]).attr("class").split(" ")[0] === "result-line") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = $(mutation.addedNodes[i]);
            const chemistries = $(node).children(".stats-and-training").children(".chemistries");
            if (chemistries.length > 0) {
              const activeChemistries = $(chemistries).children("div:not(.title-stat)");
              for (let j = 0; j < activeChemistries.length; j++) {
                const chemImage = $(".img-chem img", $(activeChemistries[j]))
                if ($(chemImage).attr("src") === "images/cra_scrips.png") {
                  $(chemImage).attr("src", `${currentSealsImage[1]}`);
                  $(chemImage).attr("width","32");
                  $(chemImage).attr("height","32");
                }
                if ($(chemImage).attr("src") === "images/gat_scrips.png") {
                  $(chemImage).attr("src", `${currentSealsImage[1]}`);
                  $(chemImage).attr("width","32");
                  $(chemImage).attr("height","32");
                }
              }
            }
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", function() {
      observer.disconnect();
    });
  };

  SetupMutationObserver();
});
