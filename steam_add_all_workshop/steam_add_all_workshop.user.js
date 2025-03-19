// ==UserScript==
// @name         Steam Add All Workshop Items to Collection
// @namespace    NekoBoiNick.Web
// @version      1.0.2
// @description  Makes GUI to add or remove all items to or from a collection.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/managecollection/?id=*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     style https://cdn.jsdelivr.net/gh/thakyz/Userscripts/steam_add_all_workshop/styles.min.css
// ==/UserScript==

/* global jQuery */
this.jQuery = jQuery.noConflict(true);

/* ===============
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
 * 5. 5. This will create 2 new buttons above the table with the subscribed items. Press the green button to add all subscibed items into this collection and the red button to remove all subscribed items from this collection.
 * 6. After you press the green button, open the "Network" tab in the developer console and wait until the last request gets a "200" response.
 * 7. Refresh the page, your collection will be updated.
 * To see how it looks on the page, see the screenshot: https://imgur.com/a/w8qZ3VM
 */

this.jQuery(($) => {
  GM_addStyle(GM_getResourceText("style"));

  /** @type {JQuery<HTMLAnchorElement> | null} */
  let addAllBtn = null;
  /** @type {JQuery<HTMLAnchorElement> | null} */
  let remAllBtn = null;
  /** @type {JQuery<HTMLAnchorElement> | null} */
  let progress = null;

  function sleep (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function createButtons () {
    const firstChild = $("div.collectionAddItemsSection").children().first();
    if (addAllBtn === null && remAllBtn === null && progress === null && firstChild.prop("nodeName") !== "a") {
      addAllBtn = $("<a id=\"ASCM_addall\" class=\"btn_green_steamui btn_medium noicon ASCM\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m12 6h6v6h6v6h-6v6h-6v-6h-6v-6h6z' fill='currentColor'/></svg></span></a>");
      addAllBtn.insertBefore(firstChild);
      remAllBtn = $("<a id=\"ASCM_removeall\" class=\"btn_red_steamui btn_medium noicon ASCM\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m6 12h18v6h-18z' fill='currentColor'/></svg></span></a>");
      remAllBtn.insertAfter(addAllBtn);
      progress = $("<span id=\"ASCM_progress\" class=\"ASCM\"></span>");
      progress.insertAfter(remAllBtn);
      addAllBtn.on("click", async () => {
        $("#ASCM_progress").text("<Pending>");
        /** @type {JQuery<HTMLDivElement>} */
        const collectionItems = $("div#MySubscribedItems div.itemChoice:not(.inCollection)");
        /** @type {Number} */
        const totalItems = collectionItems.length;
        /** @type {String} */
        const collectionName = $("div.manageCollectionHeader div.breadcrumbs a").eq(2).text().trim();
        /** @type {URL} */
        const url = new URL(document.location.href);
        /** @type {String} */
        const collectionId = url.searchParams.get("id");
        /**
         * Adds items to the Stream collection via an Ajax request.
         * @param {Number} index
         * @param {Object} object
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
            async success (data, textStatus) {
              if (data && textStatus === "success") {
                $(object).addClass("inCollection");
                $("#ASCM_progress").text(`${Math.ceil((index / totalItems) * 100)}%`);
                if (index >= totalItems) {
                  $("#ASCM_progress").text("100% Done!");
                  await sleep(5000);
                  $("#ASCM_progress").text("");
                  window.location.href
                    = /&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi.test(window.location.href)
                      ? window.location.href.replace(/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi, "&activeSection=MySubscribedItems")
                      : `${window.location.href}&activeSection=MySubscribedItems`;
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
        const collectionItems = $("div#MySubscribedItems div.itemChoice.inCollection");
        const totalItems2 = $(collectionItems).length;
        for (const [index, item] of Object.entries(collectionItems)) {
          // eslint-disable-next-line new-cap
          window.RemoveChildFromCollection($($(item).attr("id").replace("choice_MySubscribedItems_", "")));
          $("#ASCM_progress").text(`${Math.floor((index / totalItems2) * 100)}%`);
          if (index >= totalItems2) {
            $("#ASCM_progress").text("100% Done!");
            // eslint-disable-next-line no-await-in-loop
            await sleep(5000);
            $("#ASCM_progress").text("");
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

  function setupMutationObserver () {
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

  const checkForPage = () => {
    if ($("#MySubscribedItemsTab").attr("class").includes("active")) {
      createButtons();
    }
  };

  checkForPage();
  setupMutationObserver();
});
