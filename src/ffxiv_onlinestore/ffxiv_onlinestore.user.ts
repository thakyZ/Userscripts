import jQuery from "jquery";

jQuery(($) => {
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
  function getUserDisplayPreferences() {
    const langHeader = $(".global-header-lang-main");
    /* CSpell:ignoreRegExp \/\^https:\\\/\\\/store\\\.finalfantasyxiv\\\.com\\\/ffxivstore\\\/\(\\w\{2\}-\\w\{2\}\)\\\/\.\*\/gi */
    const langName = window.location.href.replaceAll(/^https:\/\/store\.finalfantasyxiv\.com\/ffxivstore\/(\w{2}-\w{2})\/.*/gi, "$1");
    const langLabel = langHeader.find(".global-header-lang-label").text().replaceAll(/^\s*/gi, "").replaceAll(/\s*$/gi, "");

    return { name: langName, currency: langLabel };
  }

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
  async function getCache() {
    const pref = getUserDisplayPreferences();
    const uri = `https://api.store.finalfantasyxiv.com/ffxivcatalog/api/products/?lang=${pref.name}&currency=${pref.currency}&limit=1000`;
    let tempString = "";
    try {
      const response = await get(uri);
      try {
        const json = JSON.parse(response);
        const date = new Date().toISOString();
        const cachedData = { date, data: json };
        tempString = JSON.stringify(cachedData);
      } catch (error) {
        console.error(`Failed to parse and cache product information at uri ${uri}\n${error}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Failed to get/parse/obtain the product data at the uri: ${uri}\n${error}`);
      return undefined;
    }

    return tempString;
  }

  async function loadCache() {
    let tempData = GM_getValue(cacheDataName);

    if (tempData === undefined) {
      const value = await getCache();
      GM_setValue(cacheDataName, value);
      tempData = value;
      console.log("Fetched and cached product data");
    }

    let tempJson = JSON.parse(tempData);
    const date = new Date();
    const newDate = date.getTime();
    const oldDate = new Date(Date.parse(tempJson.date));
    const newOldDate = oldDate.getTime();
    const futureDate = new Date(oldDate.setMonth(oldDate.getMonth() + 1)).getTime();

    if (newDate >= newOldDate && newDate >= futureDate) {
      const value = await getCache();
      GM_setValue(cacheDataName, value);
      tempData = value;
      tempJson = JSON.parse(tempData);
      console.log("Fetched and cached product data");
    }

    data = tempJson;
  }

  (async () => {
    try {
      await loadCache();
      console.log("Loaded cache.");
    } catch (error) {
      console.error(error);
    }
  })();

  function getObjectUri(element) {
    const thumbUri = $(element).find("div.item-card-image img").attr("src");
    const item = data.data.products.find((item) => item.thumbnailUrl === thumbUri);
    console.log(data);
    const pref = getUserDisplayPreferences();
    return `https://store.finalfantasyxiv.com/ffxivstore/${pref.name}/product/${item.id}`;
  }

  function detectListings() {
    const itemsListed = $(".main .container .panel .content .item-liquid-box .item-liquid-cell");
    if (itemsListed.length > 0) {
      $(itemsListed).each((index, element) => {
        // CSpell:ignore evented
        if ($(element).data("evented") !== true) {
          $(element).on("contextmenu", (eventObject) => {
            if (eventObject.shiftKey) {
              const uri = getObjectUri(eventObject.currentTarget);
              GM_openInTab(uri);
            }
          });
          $(element).data("evented", true);
        }
      });
    }
  }

  const setupMutationObserver = () => {
    const targetNode = $(".main .container .panel .content")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          /* CSpell:ignore container-navi */
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
