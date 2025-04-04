// ==UserScript==
// @name         Reddit Changes
// @namespace    NekoBoiNick.Web
// @version      1.0.3.1
// @description  Does changes for reddit.
// @author       Neko Boi Nick
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        unsafeWindow
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  function doAllEqual(arr, val) {
    return arr.every((ele) => ele === val);
  }

  function removeElement() {
    const blockElements = [];
    const outReturn = [];

    blockElements.push($("button:last-child:contains('Shop Avatars')"));
    blockElements.push($("a[href='/coins'] > *"));
    blockElements.push($("#COIN_PURCHASE_DROPDOWN_ID"));
    blockElements.push($("a[href='/premium'] > *"));
    blockElements.push($("a[href='/premium'] + button > span"));
    blockElements.push($("button > span:contains('Create Avatar')"));
    blockElements.push($("a[href*='https://ads.reddit.com'] > *"));
    blockElements.push($("div[data-test-id=\"frontpage-sidebar\"]"));

    for (const [, element] of Object.entries(blockElements)) {
      if ($(element).length > 0) {
        $($(element).parent()).css("display", "none");
        outReturn.push(true);
      }
    }

    return doAllEqual(outReturn, true);
  }

  function downloadButton(MenuBarCopy) {
    const button = $(MenuBarCopy).clone();
    $($($(button).children()[0]).children()[1]).html("<span></span>Download");
    const iconClasses = $($($($(button).children()[0]).children()[0]).children()[0]).attr("class");
    $($($($(button).children()[0]).children()[0]).children()[0]).attr("id", "");
    $($($($(button).children()[0]).children()[0]).children()[0]).attr("class", iconClasses.replace(/icon-award/g, "icon-download"));
    $($($(button).children()[0]).children().find("span")[2]).attr("id", "download_button");
    $(button).on("click", () => {
      let address = window.location.href;
      const regex = /https:\/\/(old\.|www\.)?reddit.com\/(r\/[a-zA-Z0-9_-]+\/comments\/[a-zA-Z0-9]+\/)/g;
      address = address.replace(regex, "https://redditsave.com/$2");
      window.open(address, "_blank");
    });
    return button;
  }

  function addDownloadButton() {
    const mediaContainer = $("div[data-testid=\"post-container\"] div[data-click-id=\"media\"]");
    if ($(mediaContainer).length > 0) {
      const videoSource = $(mediaContainer).children().find("video > source[src][type]");
      if ($(videoSource).length > 0) {
        const postContent = $("div[data-testid=\"post-container\"] > div[data-test-id=\"post-content\"]").children();
        const postMenuBar = $($($(postContent)[postContent.length - 1]).children()[0]);
        const menuBarLast = $($(postMenuBar).children()[3]);
        const menuBarCopy = $($(postMenuBar).children()[1]);
        $(downloadButton(menuBarCopy)).insertAfter(menuBarLast);
        return true;
      }

      return true;
    }

    return false;
  }

  function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
  }

  const imageTemplate = "https://i.redd.it/%.png";

  function fetchImageLink(imageIndex = -1) {
    return new Promise((resolve, reject) => {
      let url = getPathFromUrl(document.location.href);
      url += ".json";
      $.get(url, (data) => {
        let imageId = "";
        const imageIds = Object.keys(data[0].data.children[0].data.media_metadata);

        if (imageIndex === -1) {
          imageId = imageIds[0];
        } else {
          if (imageIds.length < imageIndex) {
            reject(new Error(`Value of argument imageIndex [${imageIndex}] is larger than the count of imageIds [${imageIds.length}]`))
          }

          imageId = imageIds[imageIndex];
        }

        resolve(imageTemplate.replace("%", imageId));
      }).fail((error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.error("Failed to fetch post api");
          reject(new Error("Failed to fetch post api"));
        }
      });
    });
  }

  function transformImageLinks() {
    const mediaContainer = $("div[data-testid=\"post-container\"] a > img");
    const mediaCarousel = $("div[data-testid=\"post-container\"] > div[data-test-id=\"post-content\"] ul");
    if ($(mediaContainer).length > 0) {
      (async function () {
        const imageLink = await fetchImageLink();
        $(mediaContainer).parent().attr("href", imageLink);
        $(mediaContainer).src("href", imageLink);
      })();

      return true;
    }

    if ($(mediaCarousel).length > 0) {
      const carouselItems = $(mediaCarousel).find("li a > div > img");

      if ($(carouselItems).length > 0) {
        for (const [index, element] of Object.entries(carouselItems)) {
          if (isNaN(Number(index))) {
            continue;
          }

          (async function () {
            const imageLink = await fetchImageLink(Number(index));
            $(element).parents("a").attr("href", imageLink);
            $(element).attr("src", imageLink);
          })();
        }

        return true;
      }
    }

    return false;
  }

  let removeWatchers = [];

  /* Unused variable (for now)
   * const watchForRemoval = (watchElem, parentElem) => {
   *   const watcher = new MutationObserver(mutated => {
   *     let wasRemoved = false;
   *     mutated.forEach(mutant => wasRemoved || mutant.removedNodes.forEach(removed => {
   *       wasRemoved = wasRemoved || removed === watchElem;
   *     }));
   *
   *     if (wasRemoved) {
   *       parentElem.append(watchElem);
   *     }
   *   });
   *   watcher.observe(parentElem, { childList: true });
   *   removeWatchers.push(watcher);
   * };
   */

  const clearRemoveWatchers = () => {
    removeWatchers.forEach((obs) => obs.disconnect()); // NOSONAR
    removeWatchers = [];
  };

  const redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher);
  if (redditWatcher) {
    redditWatcher.body.onUpdate(addDownloadButton);
    redditWatcher.body.onChange(transformImageLinks);
    redditWatcher.body.onUpdate(removeElement);
    redditWatcher.feed.onUpdate(addDownloadButton);
    redditWatcher.feed.onChange(clearRemoveWatchers);
  }

  let lastFirstPost = null;

  (new MutationObserver(() => {
    addDownloadButton();
    transformImageLinks();
    removeElement();
    clearRemoveWatchers();

    const listing = document.querySelector(".mantine-AppShell-main");
    const firstPost = listing && listing.querySelector(".ListingLayout-outerContainer");
    if (firstPost !== lastFirstPost) {
      lastFirstPost = firstPost;
      clearRemoveWatchers();
    }
  })).observe(document.body, { childList: true, subtree: true });
});
