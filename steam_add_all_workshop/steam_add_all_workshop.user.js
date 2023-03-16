// ==UserScript==
// @name         Steam Add All Workshop Items to Collection
// @namespace    NekoBoiNick.Steam.Workshop.Collection.AddAllItems
// @version      1.0.2
// @description  Makes GUI to add or remove all items to or from a collection.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/managecollection/?id=*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
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
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
  const SetupCSS = () => {
    $("head").append(`<style id="ASCM"></style>`);
    $("head style#ASCM").html(`
.ASCM {
    position: absolute;
    top: 120px;
    width: 30px;
    height: 30px;
}

.ASCM#ASCM_removeall {
    right: 75px;
}

.ASCM#ASCM_addall {
    right: 40px;
}

.ASCM span {
    padding: 0 0px !important;
}

.btn_red_steamui {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #EFA9A9 !important;
    background: transparent;
    text-shadow: 1px 1px 0px rgba( 0, 0, 0, 0.3 );
}


.btn_red_steamui > span {
    border-radius: 2px;
    display: block;
    background: #6fa720;
    background: -webkit-linear-gradient( top, #B02222 5%, #8A1B1B 95%);
    background: linear-gradient( to bottom, #B02222 5%, #8A1B1B 95%);
    background: linear-gradient( to right, #B02222 5%, #8A1B1B 95%);
}

.ASCM > span svg path {
  filter:drop-shadow(1px 1px 0px rgb(0 0 0 / 30%));
}

.btn_red_steamui:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover {
    text-decoration: none !important;
    color: #fff;
    !important; background: transparent;
}

.btn_red_steamui:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover > span {
    background: #8ed629;
    background: -webkit-linear-gradient( top, #D62929 5%, #A62121 95%);
    background: linear-gradient( to bottom, #D62929 5%, #A62121 95%);
    background: linear-gradient( to right, #D62929 5%, #A62121 95%);
}

.btn_red_steamui.btn_active, btn_red_steamui.active {
    text-decoration: none !important;
    color: #fff;
    !important; background: transparent;
}

.btn_red_steamui.btn_active > span, btn_red_steamui.active > span {
    background: #8ed629;
    background: -webkit-linear-gradient( top, #D62929 5%, #A62121 95%);
    background: linear-gradient( to bottom, #D62929 5%, #A62121 95%);
    background: linear-gradient( to right, #D62929 5%, #A62121 95%);
}

.ASCM span:before {
    width: 30px;
    height: 30px;
    display: inline-block;
}

.ASCM#ASCM_progress {
    right: 40px;
    top: 152px;
    font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
    color: #8f98a0;
    font-size: 12px;
    text-align: center;
    width: 65px;
    overflow: hidden;
    white-space: nowrap;
}
.ASCM#ASCM_progress:hover {
  cursor: default;
}
.ASCM#ASCM_progress {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
}
`);
  };
  let addAllBtn;
  let remAllBtn;
  let progress;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const CreateButtons = () => {
    if (
      addAllBtn === undefined &&
      remAllBtn === undefined &&
      progress === undefined &&
      $($("div.collectionAddItemsSection").children()[0]).prop("nodeName") !== "a"
    ) {
      addAllBtn = $(
        `<a id="ASCM_addall" class="btn_green_steamui btn_medium noicon ASCM"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m12 6h6v6h6v6h-6v6h-6v-6h-6v-6h6z' fill='currentColor'/></svg></span></a>`
      );
      $(addAllBtn).insertBefore($($("div.collectionAddItemsSection").children()[0]));
      remAllBtn = $(
        `<a id="ASCM_removeall" class="btn_red_steamui btn_medium noicon ASCM"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m6 12h18v6h-18z' fill='currentColor'/></svg></span></a>`
      );
      $(remAllBtn).insertAfter($(addAllBtn));
      progress = $(`<span id="ASCM_progress" class="ASCM"></span>`);
      $(progress).insertAfter($(remAllBtn));
      $(addAllBtn).on("click", async function () {
        $("#ASCM_progress").text(`<Pending>`);
        let collectionItems = $("div#MySubscribedItems div.itemChoice:not(.inCollection)");
        let totalItems = $(collectionItems).length;
        let items = [];
        const collection_name = $("div.manageCollectionHeader div.breadcrumbs a").eq(2).text().trim();
        const url = new URL(document.location.href);
        const collection_id = url.searchParams.get("id");
        let currentItem = 0;
        const addToCollection = (object) => {
          $.ajax({
            type: "POST",
            url: "https://steamcommunity.com/sharedfiles/addchild",
            data: {
              id: collection_id,
              sessionid: window.g_sessionID,
              childid: $(object).attr("id").replace("choice_MySubscribedItems_", ""),
              activeSection: collection_name,
            },
            success: async function (data, textStatus, jqXHR) {
              if (data && textStatus === "success") {
                $(object).addClass("inCollection");
                $("#ASCM_progress").text(`${Math.ceil((currentItem / totalItems) * 100)}%`);
                currentItem += 1;
                if (currentItem >= totalItems) {
                  $("#ASCM_progress").text(`100% Done!`);
                  await sleep(5000);
                  $("#ASCM_progress").text("");
                  currentItem = 0;
                  totalItems = 0;
                  window.location.href =
                    window.location.href.match(/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi) !== null
                      ? window.location.href.replace(/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi, "&activeSection=MySubscribedItems")
                      : `${window.location.href}&activeSection=MySubscribedItems`;
                }
              }
            },
          });
        };
        for (let i = 0; i < totalItems; i++) {
          addToCollection($($(collectionItems)[i]));
          await sleep(1000);
        }
      });
      $(remAllBtn).on("click", async function () {
        let collectionItems = $("div#MySubscribedItems div.itemChoice.inCollection");
        let totalItems2 = $(collectionItems).length;
        let currentItem2 = 0;
        for (let i = 0; i < totalItems2; i++) {
          window.RemoveChildFromCollection($($(collectionItems)[i]).attr("id").replace("choice_MySubscribedItems_", ""));
          $("#ASCM_progress").text(`${Math.floor((currentItem2 / totalItems2) * 100)}%`);
          currentItem2 += 1;
          if (currentItem2 >= totalItems2) {
            $("#ASCM_progress").text(`100% Done!`);
            await sleep(5000);
            $("#ASCM_progress").text("");
            currentItem2 = 0;
          }
          await sleep(1000);
        }
      });
    }
  };
  const SetupMutationObserver = () => {
    const targetNode = $(".manageCollectionItemsBody")[0];
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          if ($(mutation.target).attr("id") === "MySubscribedItemsTab" && $(mutation.target).hasClass("active")) {
            CreateButtons();
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
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    $(document).on("unload", function () {
      observer.disconnect();
    });
  };
  const CheckForPage = () => {
    if ($("#MySubscribedItemsTab").attr("class").includes("active")) {
      CreateButtons();
    }
  };
  CheckForPage();
  SetupCSS();
  SetupMutationObserver();
});
