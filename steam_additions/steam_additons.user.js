// ==UserScript==
// @name         Steam Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  try to take over the world!
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_additons/steam_additons.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_additons/steam_additons.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     add_all_workshop_items https://cdn.jsdelivr.net/gh/thakyz/Userscripts/add_all_workshop_items/add_all_workshop_items.min.css
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

jQuery(($) => {
  "use strict";

  /**
   * Asynchronously sleep for a set amount of time.
   * @param {String | Number} time A string representing the amount of time to wait,
   *                               Or number representing the number of miliseconds to wait.
   * @returns {Promise<void>}
   */
  function sleep(time) {
    /** @type {Number} */
    let ms = 0;
    if (typeof time === "string" && /^(\d+)(s|ms|m|h)$/.test(time)) {
      /** @type {RegExpMatchArray | null} */
      const matches = time.match(/^(\d+)(s|ms|m|h)$/);
      if (matches !== null) {
        /** @type {string} */
        const unit = matches[2];
        /** @type {number} */
        let initialTime = Number(matches[1]);
        if (!isNaN(initialTime)) {
          if (unit === "h") {
            initialTime *= 60;
          }

          if (unit === "m") {
            initialTime *= 60;
          }

          if (unit === "s") {
            initialTime *= 1000;
          }

          ms = initialTime;
        }
      }
    } else if (typeof time === "number") {
      ms = Number(time);
    }

    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Appends a style sheet to the head element
   * @param {string} css The string of css to append to head.
   * @param {string | undefined} id The id of the stylesheet element.
   * @returns {void}
   */
  function setupCSS(css, id) {
    /* Test for if the head element already contains such a object. */
    if (typeof id !== "undefined") {
      if ($("head").find(`#${id}`).length > 0) {
        console.warn(`Document's head element already contains style with id: ${id}`);
        return;
      }
    } else if ($("head > style").filter((x) => $(x).text() !== css).length > 0) {
      console.warn("Document's head element already contains style with the same inner text.");
      return;
    }

    /** @type {string} */
    let element = "<style";
    if (typeof id !== "undefined") {
      element += ` id="${id}"`;
    }

    element += `>${css}</style>`;

    $("head").append(element);
  }

  setupCSS(GM_getResourceText("add_all_workshop_items"), "ascm");

  /** @type {JQueryHTMLElement} */
  let addAllBtn;
  /** @type {JQueryHTMLElement} */
  let remAllBtn;
  /** @type {JQueryHTMLElement} */
  let progress;

  /**
   * Creates the buttons required for the script.
   * @returns {void}
   */
  function createButtons() {
    if (addAllBtn === undefined && remAllBtn === undefined && progress === undefined && $($("div.collectionAddItemsSection").children()[0]).prop("nodeName") !== "a") {
      addAllBtn = $("<a id=\"ascm-addall\" class=\"btn-green-steamui btn_medium noicon ascm\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m12 6h6v6h6v6h-6v6h-6v-6h-6v-6h6z' fill='currentColor'/></svg></span></a>");
      $(addAllBtn).insertBefore($($("div.collectionAddItemsSection").children()[0]));
      remAllBtn = $("<a id=\"ascm-removeall\" class=\"btn-red-steamui btn_medium noicon ascm\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m6 12h18v6h-18z' fill='currentColor'/></svg></span></a>");
      $(remAllBtn).insertAfter($(addAllBtn));
      progress = $("<span id=\"ascm-progress\" class=\"ascm\"></span>");
      $(progress).insertAfter($(remAllBtn));
      $(addAllBtn).on("click", async () => {
        $("#ascm-progress").text("<Pending>");
        /** @type {JQueryHTMLElement} */
        const collectionItems = $("div#MySubscribedItems div.itemChoice:not(.inCollection)");
        /** @type {number} */
        const totalItems = $(collectionItems).length;
        /** @type {JQueryHTMLElement} */
        const collectionName = $("div.manageCollectionHeader div.breadcrumbs a").eq(2).text().trim();
        /** @type {URL} */
        const url = new URL(document.location.href);
        /** @type {string | null} */
        const collectionId = url.searchParams.get("id");
        /**
         *
         * @param {number} index The index element of the workshop item in the list to add to the collection.
         * @param {JQueryHTMLElement} object The element of the workshop item to add to the collection.
         * @returns {void}
         */
        function addToCollection(index, object) {
          $.ajax({
            type: "POST",
            url: "https://steamcommunity.com/sharedfiles/addchild",
            data: {
              id: collectionId,
              sessionid: window.g_sessionID,
              childid: $(object).attr("id").replace("choice_MySubscribedItems_", ""),
              activeSection: collectionName,
            },
            /**
             * A function to be called if the request succeeds.
             * @param {unknown} data The data returned from the server, formatted according to the `dataType`
             *                       parameter or the `dataFilter` callback function
             * @param {string} textStatus A string describing the status
             * @returns {Promise<void>}
             */
            async success(data, textStatus) {
              if (data && textStatus === "success") {
                $(object).addClass("inCollection");
                $("#ascm-progress").text(`${Math.ceil((index / totalItems) * 100)}%`);
                if (index >= totalItems) {
                  $("#ascm-progress").text("100% Done!");
                  await sleep(5000);
                  $("#ascm-progress").text("");
                  if (/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/i.test(window.location.href)) {
                    window.location.href = window.location.href.replace(/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/i, "&activeSection=MySubscribedItems");
                  } else {
                    window.location.href = `${window.location.href}&activeSection=MySubscribedItems`;
                  }
                }
              }
            },
          });
        }

        for (const [index, item] of Object.entries(collectionItems)) {
          addToCollection(index, $(item));
          // eslint-disable-next-line no-await-in-loop
          await sleep(1000);
        }
      });

      $(remAllBtn).on("click", async () => {
        /** @type {JQueryHTMLElement} */
        const collectionItems = $("div#MySubscribedItems div.itemChoice.inCollection");
        /** @type {number} */
        const totalItems2 = $(collectionItems).length;
        for (const [index, item] of Object.entries(collectionItems)) {
          // eslint-disable-next-line new-cap
          window.RemoveChildFromCollection($($(item).attr("id").replace("choice_MySubscribedItems_", "")));
          $("#ascm-progress").text(`${Math.floor((index / totalItems2) * 100)}%`);
          if (index >= totalItems2) {
            $("#ascm-progress").text("100% Done!");
            // eslint-disable-next-line no-await-in-loop
            await sleep(5000);
            $("#ascm-progress").text("");
          }

          // eslint-disable-next-line no-await-in-loop
          await sleep(1000);
        }
      });
    }
  }

  function callback (mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes" || mutation.type === "childList") {
        if ($(mutation.target).attr("id") === "MySubscribedItemsTab" && $(mutation.target).hasClass("active")) {
          createButtons();
        } else if ($(mutation.target).attr("id") === "MySubscribedItemsTab" && !$(mutation.target).hasClass("active")) {
          if (addAllBtn !== undefined && remAllBtn !== undefined) {
            $(addAllBtn).off("click");
            $(addAllBtn).remove();
            addAllBtn = undefined;
            $(remAllBtn).off("click");
            $(remAllBtn).remove();
            remAllBtn = undefined;
            $(progress).remove();
            progress = undefined;
          }
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $(".manageCollectionItemsBody")[0];
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function checkForPage() {
    if ($("#MySubscribedItemsTab").attr("class").includes("active")) {
      createButtons();
    }
  }

  /**
   * The main function of this script.
   * @returns {Promise<void>}
   */
  async function main() {
    addAllWorkshopItemsToCollection();
  }

  /**
   * Add All Workshop Items to Collection.
   * Makes GUI to add or remove all items to or from a collection.
   *
   * Code borrows from: https://www.reddit.com/r/CitiesSkylines/comments/8hrdsd/add_all_subscribed_items_to_steam_collections_at/
   * Code is made by u/kluvo2
   *
   * Due to current Steam Workshop Collection Issues this script must be disabled before using.
   *
   * Steps:
   * 1. Start creating a new collection
   * 2. Save the title and the details of the collection
   * 3. Go to the My Subscribed Items tab.
   * 4. Enable Script
   * 5. 5. This will create 2 new buttons above the table with the subscribed items. Press the green button to add all subscribed items into this collection and the red button to remove all subscribed items from this collection.
   * 6. After you press the green button, open the "Network" tab in the developer console and wait until the last request gets a "200" response.
   * 7. Refresh the page, your collection will be updated.
   * To see how it looks on the page, see the screenshot: https://imgur.com/a/w8qZ3VM
   *
   * @returns {void}
   */
  function addAllWorkshopItemsToCollection() {
    if (!/^https:\/\/steamcommunity\.com\/sharedfiles\/managecollection\/\?.*(?=id=\d+)/.test(window.location.href)) {
      return;
    }

    checkForPage();
    setupCSS();
    setupMutationObserver();
  }

  main();
});
