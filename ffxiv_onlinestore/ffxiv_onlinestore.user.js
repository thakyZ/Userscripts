// ==UserScript==
// @name         Final Fantasy XIV Online Store Changes
// @namespace    NekoBoiNick.Web
// @version      1.0.1
// @description  QoL changes for the Final Fantasy XIV Online Store.
// @author       Neko Boi Nick
// @match        https://store.finalfantasyxiv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxiv_onlinestore/ffxiv_onlinestore.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxiv_onlinestore/ffxiv_onlinestore.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     css https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ffxiv_onlinestore/style.css
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  // GM_addStyle(GM_getResourceText("css"));
  const cacheDataName = "OnlineStoreAPI";

  /* Currency and Names:
   * ja-jp: JPY
   * en-us: USD
   * en-gb: GBP
   * en-gb: EUR
   * fr-fr: GBP
   * fr-fr: EUR
   * de-de: GBP
   * de-de: EUR
   */
  const getUserDisplayPreferences = () => {
    const langHeader = $(".global-header-lang-main");
    const langName = window.location.href.replaceAll(/^https:\/\/store\.finalfantasyxiv\.com\/ffxivstore\/(\w{2}-\w{2})\/.*/gi, "$1");
    const langLabel = langHeader.find(".global-header-lang-label").text().replaceAll(/^\s*/gi, "").replaceAll(/\s*$/gi, "");

    return { name: langName, currency: langLabel };
  };

  let data = {};

  async function get(uri) {
    return new Promise((resolve, reject) => {
      try {
        GM.xmlHttpRequest({
          method: "GET",
          url: uri,
          headers: {
            referer: "https://store.finalfantasyxiv.com/",
            origin: "https://store.finalfantasyxiv.com"
          },
          onload(response) {
            if (response.status === 200) {
              const text = response.responseText;
              return resolve(text);
            }

            return reject(Error("failed"));
          }
        });
      } catch (error) {
        console.error(`Failed to get the product data at the uri: ${uri}\n${error}`);
        reject(Error("failed"));
      }
    });
  }

  /* Online store product API
   * https://api.store.finalfantasyxiv.com/ffxivcatalog/api/products/?lang=en-us&currency=USD&limit=1000
   */
  const getCache = async () => {
    const pref = getUserDisplayPreferences();
    const uri = `https://api.store.finalfantasyxiv.com/ffxivcatalog/api/products/?lang=${pref.name}&currency=${pref.currency}&limit=1000`;
    let _string = "";
    try {
      const response = await get(uri);
      try {
        const json = JSON.parse(response);
        const date = new Date().toISOString();
        const cachedData = { date, data: json };
        _string = JSON.stringify(cachedData);
      } catch (error) {
        console.error(`Failed to parse and cache product information at uri ${uri}\n${error}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Failed to get/parse/obtain the product data at the uri: ${uri}\n${error}`);
      return undefined;
    }

    return _string;
  };

  const loadCache = async () => {
    let _data = GM_getValue(cacheDataName);

    if (_data === undefined) {
      const value = await getCache();
      GM_setValue(cacheDataName, value);
      _data = value;
      console.log("Fetched and cached product data");
    }

    let _json = JSON.parse(_data);
    const date = new Date();
    const _date = date.getTime();
    const olddate = new Date(Date.parse(_json.date));
    const _olddate = olddate.getTime();
    const futureDate = new Date(olddate.setMonth(olddate.getMonth() + 1)).getTime();

    if (_date >= _olddate && _date >= futureDate) {
      const value = await getCache();
      GM_setValue(cacheDataName, value);
      _data = value;
      _json = JSON.parse(_data);
      console.log("Fetched and cached product data");
    }

    data = _json;
  };

  (async () => {
    try {
      await loadCache();
      console.log("Loaded cache.");
    } catch (error) {
      console.error(error);
    }
  })();

  const getObjectUri = element => {
    const thumbUri = $(element).find("div.item-card-image img").attr("src");
    const item = data.data.products.find(item => item.thumbnailUrl === thumbUri);
    console.log(data);
    const pref = getUserDisplayPreferences();
    return `https://store.finalfantasyxiv.com/ffxivstore/${pref.name}/product/${item.id}`;
  };

  const detectListings = () => {
    const itemsListed = $(".main .container .panel .content .item-liquid-box .item-liquid-cell");
    if (itemsListed.length > 0) {
      $(itemsListed).each((index, element) => {
        if ($(element).data("evented") !== true) {
          $(element).on("contextmenu", eventObject => {
            if (eventObject.shiftKey) {
              const uri = getObjectUri(eventObject.currentTarget);
              GM_openInTab(uri);
            }
          });
          $(element).data("evented", true);
        }
      });
    }
  };

  const setupMutationObserver = () => {
    const targetNode = $(".main .container .panel .content")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if ($(mutation.target).hasClass("container-navi")) {
            detectListings();
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  GM_registerMenuCommand("Reset Cache", () => {
    (async () => {
      try {
        const value = await getCache();
        const _json = JSON.parse(value);
        GM_setValue(cacheDataName, value);
        data = _json;
        console.log("Reset the cache.");
      } catch (error) {
        console.error(error);
      }
    })();
  });

  setupMutationObserver();
  detectListings();
});
