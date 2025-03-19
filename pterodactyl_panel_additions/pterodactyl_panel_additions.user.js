// ==UserScript==
// @name         Pterodactyl Panel Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Additions to Pterodactyl Panel
// @author       Neko Boi Nick
// @match        https://panel.nekogaming.xyz/*
// @match        https://pterod.nekogaming.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterodactyl.io
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// ==/UserScript==
/* cSpell:ignore createProgressbar */
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  /**
   * Enum for date time stamp formats.
   * @readonly
   * @enum {Number}
   */
  const DateTimeFormat = {
    /**
     *
     */
    AS_IS: 0,
    UNIX_LOCAL: 1,
    UNIX_UTF: 2,
    AS_IS_UTF: 3,
  };

  /**
   * Runs the command to copy all of the items to clipboard.
   * @param {JQueryElement} element The element of the file tree list.
   * @param {number} index The current index of the map function.
   * @param {Boolean} shift If the shift key was held down to open options dialog.
   * @param {Boolean} vintageStoryUpdaterFormat If we should use the vintage story updater format.
   * @param {Boolean[]} args Other args (unused).
   */
  function copyFileToList(element, index, quote = false, vintageStoryUpdaterFormat = false, ..._args) {
    const fileTitle = element.find("> a > div[class*=\"FileObjectRow___StyledDiv-\"] > div[class*=\"FileObjectRow___StyledDiv2-\"]");
    if (fileTitle.length === 0) {
      return undefined;
    }

    const text = fileTitle.text();
    if (typeof text !== "string") {
      return undefined;
    }

    if (vintageStoryUpdaterFormat) {
      return `mod${index}=${text.trim()}`;
    }

    return text.trim();
  }

  /**
   * Runs the command to copy all of the items to clipboard.
   * @param {JQuery<HTMLElement>} element The element of the file tree list.
   * @param {number} index The current index of the map function.
   * @param {Boolean} shift If the shift key was held down to open options dialog.
   * @param {Boolean[]} args Other args (unused).
   */
  function copyFileJsonList(element, index, shift = false, ..._args) {

  }

  /**
   * Runs the command to copy all of the items to clipboard.
   * @param {JQuery<HTMLElement>} element The element of the file tree list.
   * @param {Boolean} shift If the shift key was held down to open options dialog.
   */
  function copyFileTreeItems(element, shift = false) {
    /** @type {Function<JQuery<HTMLElement>, int, ...>} */
    let algo = copyFileJsonList;

    /** @type {Boolean} */
    let quote = false;
    /** @type {Boolean} */
    let jsonFormat = false;
    /** @type {Boolean} */
    let copyDateTime = false;
    /** @type {DateTimeFormat} */
    let dateTimeFormat = DateTimeFormat.AS_IS;
    /** @type {Boolean} */
    let vintageStoryUpdaterFormat = false;

    if (shift === true) {
      algo = copyFileToList;
      vintageStoryUpdaterFormat = true;
    }

    /** @type {JQuery<HTMLElement>[]} */
    const fileNames = Object.entries(element).map(
      /**
       * @param {} x
       * @param {*} index
       * @returns
       */
      (x, index) => algo(x, index, quote, vintageStoryUpdaterFormat)
    );
  }

  /**
   * Adds a button that runs the command to copy all of the items to clipboard.
   * @param {JQueryElement} headerElement The element of the file tree header.
   * @param {JQueryElement} fileTreeElement The element of the file tree list.
   */
  function addCopyButtonToHeader(headerElement, fileTreeElement) {
    if (headerElement.find("button#copyFileTree").length > 0) {
      const templateButton = headerElement.find("button").get(0);
      const copyFileTreeButton = templateButton.clone();
      copyFileTreeButton.text("Copy File Tree");
      copyFileTreeButton.attr("id", "copyFileTree");
      copyFileTreeButton.after(templateButton);
      copyFileTreeButton.on("click", (event) => {
        copyFileTreeItems(fileTreeElement, event.shiftKey);
      });
    }
  }

  const menuCommandRegistered = {};

  /**
   * Callback for the mutation observer.
   * @param {MutationRecord[]} mutationList List of mutations that happened on the webpage.
   * @returns {void}
   */
  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (/https:\/\/(?:panel|pterod)\..+\..+\/server\/[0-9a-z]+\/files#\/.+/i.test(window.location.href)) {
          /** @type {JQueryElement} */
          const fileEditContainer = $("section.fade-enter-done > div[class*=\"ContentContainer-\"] > div[class*=\"FileEditContainer___StyledDiv-\"]");
          /** @type {JQueryElement} */
          const fileTreeContainer = $("section.fade-enter-done > div[class*=\"ContentContainer-\"] > div[class=\"fade-appear-done fade-enter-done\"] > div[class*=\"style-module_\"]");
          /** @type {JQueryElement} */
          const fileHeaderContainer = $("section.fade-enter-done > div[class*=\"ContentContainer-\"] > div[class=\"flex flex-wrap-reverse md:flex-nowrap mb-4\"] > div[class*=\"style-module_\"]");
          if (fileEditContainer.length >= 0) {

          }

          if (fileTreeContainer.length >= 1) {
            if (fileHeaderContainer.length >= 0) {
              addCopyButtonToHeader(fileTreeContainer, fileHeaderContainer);
            } else if (!Object.hasOwn(menuCommandRegistered, "fileTree") || menuCommandRegistered.fileTree === false) {
              menuCommandRegistered.fileTree = true;
              GM_registerMenuCommand("Copy Items in File Tree", () => copyFileTreeItems(fileTreeContainer));
            }
          }
        }
      }
    }
  }

  /**
   * Initial setup for the webpage.
   * @returns {void}
   */
  function setupMutationObserver() {
    /** @type {HTMLBodyElement} */
    const targetNode = document.body;
    /** @type {MutationObserverInit} */
    const config = { attributes: true, childList: true, subtree: true };

    /** @type {MutationObserver} */
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
