// ==UserScript==
// @name         TikTok Download Video
// @namespace    NekoBoiNick.Web.TikTok.SaveVideo
// @version      1.0.1.1
// @description  Adds a download button to TikTok Videos
// @author       Neko Boi Nick
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  /**
 * @callback saveAsCallback
 * @param {Error} error - Error
 * @param {Number} progress - Progress fraction
 * @param {Boolean} complete - Completion Yes/No
 */

  /**
 * Download any file via XHR
 * @param {String} url - Target URL
 * @param {String=} name - Filename
 * @param {saveAsCallback} callback - Callback
 */
  function saveAs(url, name, callback = () => {}) {
    console.debug("saveAs");

    // Parse URL
    const urlObject = new URL(url);
    const urlHref = urlObject.href;
    const urlFilename = urlObject.pathname.replace(/\?.*$/, "");

    // Resolve filename
    const filename = name || urlFilename;

    // Create XHR Request
    const request = new XMLHttpRequest();

    // XHR Open
    request.open("GET", urlHref);

    // XHR Headers
    request.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8");
    request.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
    request.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
    request.setRequestHeader("Upgrade-Insecure-Requests", "1");
    request.setRequestHeader("Sec-Fetch-Dest", "document");
    request.setRequestHeader("Sec-Fetch-Mode", "navigate");
    request.setRequestHeader("Sec-Fetch-Site", "none");
    request.setRequestHeader("Sec-Fetch-User", "?1");
    request.setRequestHeader("DNT", "1");

    // Error handler
    request.onerror = (e) => {
      callback(new Error(`Network Request failed.\n${e}`));
    };

    // Progress handler
    request.onprogress = (event) => {
      callback(null, (event.loaded / event.total));
    };

    // Completion handler
    request.onload = (event) => {
      console.debug("saveAs", "onload", event);
      console.info("onload", "xhr.readyState", request.readyState); // NOTE: readyState will be 1

      // Create new File object with generic MIME type
      const file = new File([request.response], "", { type: "application/octet-stream" });

      // Create ObjectURL
      const objectUrl = window.URL.createObjectURL(file);

      // Create helper element
      const anchorElement = document.createElement("a");
      anchorElement.style.display = "none";
      anchorElement.target = "_self";
      anchorElement.href = objectUrl;
      anchorElement.download = filename;
      document.body.appendChild(anchorElement);

      // Trigger download
      anchorElement.click();

      // Revoke ObjectURL
      window.URL.revokeObjectURL(objectUrl);

      // Remove element
      anchorElement.remove();

      callback(null, 1, true);
    };

    // XHR Send
    request.send();
  }

  unsafeWindow.saveAs = saveAs;

  const downloadIcon = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M8 17H16V15H8V17M16 10H13.5V6H10.5V10H8L12 14L16 10Z\" /></svg>";

  let downloadButton;

  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  let videoUri = "";
  let id = "";
  let user = "";

  function downloadVideo() {
    const videoPlayer = $("#main-content-video_detail video");
    if ($(videoPlayer).length === 1 && typeof $(videoPlayer).attr("src") !== "undefined") {
      user = unsafeWindow.location.href.split("/")[3].slice(1);
      id = unsafeWindow.location.href.split("/")[5];
      videoUri = $(videoPlayer).attr("src");
      unsafeWindow.saveAs(videoUri, `${user}_${id}.mp4`, (error, progress, complete) => {
        if (error) {
          try {
            unsafeWindow.open(videoUri, "_blank");
          } catch {
            $(downloadButton).css({ fill: "red" });
          }
        } else if ($(downloadButton).css("fill") === "red") {
          $(downloadButton).css({ fill: "unset" });
        }

        if (complete) {
          (async () => {
            if ($(downloadButton).css("fill") !== "green") {
              $(downloadButton).css({ fill: "green" });
              await sleep(1000);
              $(downloadButton).css({ fill: "unset" });
            }
          })();
        }
      });
    } else {
      let loc = window.location.href;
      loc = loc.replace(/\?.+$/gi, "");
      loc = document.createTextNode(loc);
      unsafeWindow.open(`https://taksave.com/info?url=${encodeURI(loc.data)}`, "_blank");
    }
  }

  function fixLinks() {
    if ($("#tiktak-download-button").length > 0) {
      return;
    }

    const commentIcon = $("span[data-e2e=\"browse-comment-icon\"]");
    const infoContainer = $("div[class*=\"-DivInfoContainer\"] > button");
    const actionItemContainer = $("div[class*=\"-DivActionItemContainer\"] > button:last-child");
    if (typeof commentIcon !== "undefined" && commentIcon.length > 0) {
      for (const [, element] of Object.entries(commentIcon)) {
        const cIParent = $(element).parent();
        downloadButton = $(cIParent).clone(true);
        $("svg", $(downloadButton)).remove();
        $("strong", $(downloadButton)).remove();
        $("span", $(downloadButton)).attr("data-e2e", "browse-download-icon");
        $(downloadButton).removeAttr("disabled");
        $("span", $(downloadButton)).html(downloadIcon);
        $(downloadButton).attr("id", "tiktak-download-button");
        $(downloadButton).insertAfter(cIParent);
        $(downloadButton).on("click", () => downloadVideo());
      }
    } else if (typeof infoContainer !== "undefined" && infoContainer.length > 0
               && typeof actionItemContainer !== "undefined" && actionItemContainer.length > 0) {
      for (const [index, element] of Object.entries(infoContainer)) {
        if (index > 1) {
          return;
        }

        const cIParent = $(element);
        downloadButton = $(actionItemContainer).clone(true);
        $("svg", $(downloadButton)).remove();
        $("strong", $(downloadButton)).remove();
        $("span", $(downloadButton)).attr("data-e2e", "browse-download-icon");
        $(downloadButton).removeAttr("disabled");
        $("span > div > div", $(downloadButton)).html(downloadIcon);
        $(downloadButton).attr("id", "tiktak-download-button");
        $(downloadButton).insertAfter(cIParent);
        $(downloadButton).on("click", () => downloadVideo());
      }
    }
  }

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        fixLinks();
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
