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
// cSpell:ignore steamui, noicon
import jQuery from "jquery";

jQuery(($) => {
  const setupCSS = () => {
    $("head").append(`<style id="add-all-subscribed-collection-manager">
  .add-all-subscribed-collection-manager {
      position: absolute;
      top: 120px;
      width: 30px;
      height: 30px;
  }

  .add-all-subscribed-collection-manager#add-all-subscribed-collection-manager_removeall {
      right: 75px;
  }

  .add-all-subscribed-collection-manager#add-all-subscribed-collection-manager_addall {
      right: 40px;
  }

  .add-all-subscribed-collection-manager span {
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

  .add-all-subscribed-collection-manager > span svg path {
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

  .add-all-subscribed-collection-manager span:before {
      width: 30px;
      height: 30px;
      display: inline-block;
  }

  .add-all-subscribed-collection-manager#add-all-subscribed-collection-manager_progress {
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
  .add-all-subscribed-collection-manager#add-all-subscribed-collection-manager_progress:hover {
    cursor: default;
  }
  .add-all-subscribed-collection-manager#add-all-subscribed-collection-manager_progress {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
  }
</style>`);
  };

  let addAllBtn;
  let remAllBtn;
  let progress;
  const sleep = ms => new Promise(r => {
    setTimeout(r, ms);
  });
  const createButtons = () => {
    if (! && ! && ! && $($("div.collectionAddItemsSection").children()[0]).prop("nodeName") !== "a") {
      addAllBtn = $("<a id=\"add-all-subscribed-collection-manager_addall\" class=\"btn_green_steamui btn_medium noicon add-all-subscribed-collection-manager\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m12 6h6v6h6v6h-6v6h-6v-6h-6v-6h6z' fill='currentColor'/></svg></span></a>");
      $(addAllBtn).insertBefore($($("div.collectionAddItemsSection").children()[0]));
      remAllBtn = $("<a id=\"add-all-subscribed-collection-manager_removeall\" class=\"btn_red_steamui btn_medium noicon add-all-subscribed-collection-manager\"><span><svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='m6 12h18v6h-18z' fill='currentColor'/></svg></span></a>");
      $(remAllBtn).insertAfter($(addAllBtn));
      progress = $("<span id=\"add-all-subscribed-collection-manager_progress\" class=\"add-all-subscribed-collection-manager\"></span>");
      $(progress).insertAfter($(remAllBtn));
      $(addAllBtn).on("click", async () => {
        $("#add-all-subscribed-collection-manager_progress").text("<Pending>");
        const collectionItems = $("div#MySubscribedItems div.itemChoice:not(.inCollection)");
        const totalItems = $(collectionItems).length;
        const collectionName = $("div.manageCollectionHeader div.breadcrumbs a").eq(2).text().trim();
        const url = new URL(document.location.href);
        const collectionId = url.searchParams.get("id");
        const addToCollection = (index, object) => {
          $.ajax({
            type: "POST",
            url: "https://steamcommunity.com/sharedfiles/addchild",
            data: {
              id: collectionId,
              sessionid: window.g_sessionID,
              childid: $(object).attr("id").replace("choice_MySubscribedItems_", ""),
              activeSection: collectionName,
            },
            async success(data, textStatus) {
              if (data && textStatus === "success") {
                $(object).addClass("inCollection");
                $("#add-all-subscribed-collection-manager_progress").text(`${Math.ceil((index / totalItems) * 100)}%`);
                if (index >= totalItems) {
                  $("#add-all-subscribed-collection-manager_progress").text("100% Done!");
                  await sleep(5000);
                  $("#add-all-subscribed-collection-manager_progress").text("");
                  window.location.href
                    = /&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi.test(window.location.href)
                      ? window.location.href.replace(/&activeSection=(MyItems|MyFavoriteItems|MySubscribedItems)/gi, "&activeSection=MySubscribedItems")
                      : `${window.location.href}&activeSection=MySubscribedItems`;
                }
              }
            },
          });
        };

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
          $("#add-all-subscribed-collection-manager_progress").text(`${Math.floor((index / totalItems2) * 100)}%`);
          if (index >= totalItems2) {
            $("#add-all-subscribed-collection-manager_progress").text("100% Done!");
            // eslint-disable-next-line no-await-in-loop
            await sleep(5000);
            $("#add-all-subscribed-collection-manager_progress").text("");
          }

          // eslint-disable-next-line no-await-in-loop
          await sleep(1000);
        }
      });
    }
  };

  const setupMutationObserver = () => {
    const targetNode = $(".manageCollectionItemsBody")[0];
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          if ($(mutation.target).attr("id") === "MySubscribedItemsTab" && $(mutation.target).hasClass("active")) {
            createButtons();
          } else if ($(mutation.target).attr("id") === "MySubscribedItemsTab" && !$(mutation.target).hasClass("active")) {
            if ( && ) {
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

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  const checkForPage = () => {
    if ($("#MySubscribedItemsTab").attr("class").includes("active")) {
      createButtons();
    }
  };

  checkForPage();
  setupCSS();
  setupMutationObserver();
});
