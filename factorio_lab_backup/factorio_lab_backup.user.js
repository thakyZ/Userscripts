// ==UserScript==
// @name         Factorio Lab Backup Preferences
// @namespace    NekoBoiNick.Web
// @version      2024-09-27
// @description  Saves the state of site storage and loads if it is empty.
// @author       Neko Boi Nick
// @match        https://factoriolab.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=factoriolab.github.io
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// ==/UserScript==
/* cSpell:ignore Factorio, FactorioLab */
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);
this.jQuery(($) => {
  /**
   * @returns {string[]}
   */
  function getLocalStorageKeys() {
    /** @type {string[]} */
    const output = [];
    /** @type {Storage} */
    const storage = unsafeWindow.localStorage;

    for (let i = 0; i < storage.length; i++) {
      /** @type {string|null} */
      const key = storage.key(i);

      if (typeof key === "string") {
        output.push(key);
      }
    }

    return output;
  }

  /**
   * @param {string} data
   * @returns {string|any}
   */
  function tryGetJSON(data) {
    /** @type {string|any} */
    let output = data;

    try {
      output = JSON.parse(data);
    } catch (error) {
      console.debug(error);
      output = data;
    }

    return output;
  }

  /**
   * @returns {object}
   */
  function getLocalStorage() {
    /** @type {[string,string|any][]} */
    const output = [];
    /** @type {Storage} */
    const storage = unsafeWindow.localStorage;

    for (const key of getLocalStorageKeys()) {
      /** @type {string|null} */
      const data = storage.getItem(key);

      if (typeof data === "string") {
        /** @type {string|any} */
        const json = tryGetJSON(data);
        output.push([key, json]);
      }
    }

    return Object.fromEntries(output);
  }

  /**
   * @param {string|any} data
   * @returns {string}
   */
  function tryStringifyJSON(data) {
    /** @type {string|any} */
    let output = data;

    try {
      output = JSON.stringify(data);
    } catch (error) {
      console.debug(error);
      output = data;
    }

    return output;
  }

  /**
   * @param {any} data
   * @returns {void}
   */
  function setLocalStorage(data) {
    /** @type {Storage} */
    const storage = unsafeWindow.localStorage;

    for (const [key, value] of Object.entires(data)) {
      storage.setItem(key, tryStringifyJSON(value));
    }
  }

  /**
   * @returns {void}
   */
  function backupLocalStorage() {
    try {
      /** @type {any} */
      const data = getLocalStorage();
      /** @type {string} */
      const json = JSON.stringify(data);
      /** @type {string} */
      const currentData = GM_config.get("storageData");

      if (json !== currentData) {
        GM_config.set("storageData", json);
        GM_config.set("lastBackupDate", Date.now());
        GM_config.save();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @returns {void}
   */
  function restoreLocalStorage() {
    try {
      /** @type {string} */
      const data = GM_config.get("storageData");

      if (data === "") {
        return;
      }

      /** @type {any} */
      const json = JSON.parse(data);
      setLocalStorage(json);
    } catch (error) {
      console.error(error);
    }
  }

  /** @type {string|null} */
  let lastUrl = null;

  /** @type {Promise<void>} */
  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }

  /** @type {number} */
  let timeout = 1000;
  /** @type {number} */
  let lastDate = 0;
  /** @type {number} */
  let singleton = 0;

  async function loopForUrlChange() {
    try {
      if (singleton > 0) {
        return;
      }

      lastDate = Date.now();
      singleton = 1;

      while (lastUrl !== null && lastUrl === unsafeWindow.location.href) {
        if (Date.now() > lastDate + timeout) {
          return;
        }

        await sleep(500);
      }

      lastUrl = unsafeWindow.location.href;
      /** @type {number|NaN} */
      const lastBackupDate = parseInt(GM_config.get("lastBackupDate"), 10);

      if (getLocalStorageKeys().length === 0) {
        restoreLocalStorage();
      } else if (!isNaN(lastBackupDate) && lastBackupDate < Date.now()) {
        backupLocalStorage();
      }
    } catch (error) {
      console.error(error);
    } finally {

      singleton = 0;
    }
  }

  GM_config.init({
    id: "Factorio_Lab_Backup_Config",
    title: "Factorio Lab Backup Config",
    fields: {
      storageData: {
        label: "Storage Data",
        type: "textbox",
        default: "",
      },
      lastBackupDate: {
        label: "Last Backup Date",
        type: "textbox",
        default: "0",
      },
      debug: {
        label: "Debug",
        type: "checkbox",
        default: false,
      },
    },
    events: {
      /** @returns {void} */
      init() {
        $("body").on("click", () => {
          loopForUrlChange();
        });

        /* CSpell:ignoreRegExp \/\^https:\\\/\\\/\(www\\\.\)\?xivmodarchive\\\.com\\\/\/ */
        if (/^https:\/\/factoriolab\.github\.io\//.test(window.location.href)) {
          GM_registerMenuCommand("Config", () => GM_config.open());
        }
      },
      /** @returns {void} */
      open() {
      },
      /**
       * @param {any} val
       * @returns {void}
       */
      save(_val) {
      },
      /** @returns {void} */
      close() {
      }
    },
    // css: GM_getResourceText("GMConfigCSS"),
    // frame: setupGMConfigFrame(),
  });
});
