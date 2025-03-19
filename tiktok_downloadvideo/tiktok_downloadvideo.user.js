/* CSpell:ignore tiktok */
/* CSpell:ignore tiktak */
// ==UserScript==
// @name         TikTok Download Video
// @namespace    NekoBoiNick.Web
// @version      1.0.1.1
// @description  Adds a download button to TikTok Videos
// @author       Neko Boi Nick
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        GM_setClipboard
// @connect      v16-webapp-prime.us.tiktok.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
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

    const onErrorFunction = (event) => {
      console.debug(event);
      try {
        const event2String = `${event}`;
        callback(new Error(`Network Request failed.\n${event2String}`));
      } catch (error) {
        console.error(error);
        callback(new Error("Network Request failed."));
      }
    };

    const onProgressFunction = (event) => {
      callback(null, (event.loaded / event.total));
    };

    const onLoadFunction = (event) => {
      try {
        const readyState = typeof event.target === "undefined" ? event.readyState : event.target.readyState;
        // A const response = typeof event.target === "undefined" ? event.response : event.target.response;
        // const responseText = typeof event.target === "undefined" ? event.responseText : event.target.responseText;
        // const responseHeaders = typeof event.target === "undefined" ? event.responseHeaders : event.target.responseHeaders;
        console.debug("saveAs", "onload", event);
        console.info("onload", "xhr.readyState", readyState); // NOTE: readyState will be

        // Create new File object with response content type.
        // const file = new File([response], "", { type: Object.fromEntries(responseHeaders.split(/\r?\n/).map((e) => e.split(": ")))["content-type"] });

        // Create ObjectURL
        // const objectUrl = window.URL.createObjectURL(file);
        // Unused
        // const rHSplit = responseHeaders.split(/\r?\n/);
        // const rHMap = rHSplit.map((e) => {
        //   return e.split(": ")
        // });
        // const rHObject = Object.fromEntries(rHMap);
        // const contentType = rHObject["content-type"];
        // const base64 = btoa(responseText);
        // const objectUrl = "data:" + contentType + ";base64," + base64;
        // GM_setClipboard(objectUrl);

        // Create helper element
        const anchorElement = $(`<a style="display:none" target="_self" href="${event.finalUrl}" download="${filename}">download ${filename}</a>`);
        $("body").append($(anchorElement));

        // Trigger download
        $(anchorElement).click();

        // Revoke ObjectURL
        window.URL.revokeObjectURL(event.finalUrl);

        // Remove element
        anchorElement.remove();

        callback(null, 1, true);
      } catch (error) {
        console.debug({ event, error });
        callback(new Error("Failed Load Function"), 1);
      }
    };

    // Create XHR Request
    if ((typeof GM !== "undefined" || GM !== null)
        && (typeof GM.xmlHttpRequest !== "undefined" || GM.xmlHttpRequest !== null)) {
      /* Unused
        GM.xmlHttpRequest({
        method: "GET",
        url,
        headers: {
          "User-Agent": unsafeWindow.navigator.userAgent,
          "Content-Type": "video/mp4",
          Accept: "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*\/*;q=0.5",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Origin: "https://www.tiktok.com",
          "Sec-Fetch-Dest": "video",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-User": "?1",
          DNT: "1",
          "Sec-GPC": "1",
          Range: "bytes=0-",
          Referer: "https://www.tiktok.com/",
          Connection: "keep-alive",
          Cookies: unsafeWindow.document.cookie
        },
        onload(response) {
          console.debug({ type: "onload", response });
          onLoadFunction(response);
        },
        onprogress(response) {
          console.debug({ type: "onprogress", response });
          onProgressFunction(response);
        },
        onerror(response) {
          console.debug({ type: "onerror", response });
          onErrorFunction(typeof XMLHttpRequest);
        }
      });
      */
      const anchorElement = $(`<a  target="_self" href="${url}" download="${filename}">download ${filename}</a>`);
      $(anchorElement).appendTo($("body"));
      console.log($(anchorElement));
      console.log("soup");

      // Trigger download
      $(anchorElement).click();

      // Revoke ObjectURL
      window.URL.revokeObjectURL(url);

      // Remove element
      anchorElement.remove();
      callback(null, 1, true);
    } else {
      const request = new XMLHttpRequest();

      // XHR Headers
      request.setRequestHeader("User-Agent", unsafeWindow.navigator.userAgent);
      request.setRequestHeader("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5");
      request.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
      request.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
      request.setRequestHeader("Origin", "https://www.tiktok.com");
      /* Unused;
      request.setRequestHeader("Sec-Fetch-Dest", "video");
      request.setRequestHeader("Sec-Fetch-Mode", "cors");
      request.setRequestHeader("Sec-Fetch-Site", "same-site");
      request.setRequestHeader("Sec-Fetch-User", "?1");
      request.setRequestHeader("DNT", "1");
      request.setRequestHeader("Sec-GPC", "1");
      request.setRequestHeader("Range", "bytes=0-");
      request.setRequestHeader("Referer", "https://www.tiktok.com/");
      request.setRequestHeader("Connection", "keep-alive");
      request.setRequestHeader("Cookie", "");
      */

      // XHR Open
      request.open("GET", urlHref);

      // Error handler
      request.onerror = (event) => onErrorFunction(event);

      // Progress handler
      request.onprogress = (event) => onProgressFunction(event);

      // Completion handler
      request.onload = (event) => {
        onLoadFunction(event);
      };

      // XHR Send
      request.send();
    }
  }

  /* Unused
  function interceptAjax() {
    document.querySelector("body").ajaxSuccess((event, requestData) => {
      console.log(requestData.responseText);
    });
  }

  function addJSNode(text, sURL, funcToRun) {
    const D = document;
    const scriptNode = D.createElement("script");
    scriptNode.type = "text/javascript";
    if (text) {
      scriptNode.textContent = text;
    }

    if (sURL) {
      scriptNode.src = sURL;
    }

    if (funcToRun) {
      scriptNode.textContent = `(${funcToRun.toString()})()`;
    }

    const tArg = D.getElementsByTagName("head")[0] || D.body || D.documentElement;
    tArg.appendChild(scriptNode);
  }

  addJSNode(null, null, interceptAjax);
  */

  unsafeWindow.saveAs = saveAs;

  const downloadIcon = "<svg fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M8 17H16V15H8V17M16 10H13.5V6H10.5V10H8L12 14L16 10Z\" /></svg>";

  let downloadButton;

  const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  function getUniqueFileName(part = false) {
    const user = unsafeWindow.location.href.split("/")[3].slice(1);
    const id = unsafeWindow.location.href.split("/")[5];
    if (part) {
      return [user, id];
    }

    return `${user}_${id}.mp4`;
  }

  function downloadVideo() {
    const videoPlayer = $("#main-content-video_detail video");
    if ($(videoPlayer).length === 1 && typeof $(videoPlayer).attr("src") !== "undefined") {
      const uniqueFileName = getUniqueFileName();
      const videoUri = $(videoPlayer).attr("src");
      unsafeWindow.saveAs(videoUri, uniqueFileName, (error, progress, complete) => {
        if (error) {
          console.error(error);
          try {
            // Unused
            // unsafeWindow.open(videoUri, "_blank");
          } catch (error) {
            console.error(error);
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
    /* CSpell:ignoreRegExp #tiktak */
    if (document.querySelectorAll("#tiktak-download-button").length > 0) {
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
        if (index > 1 || isNaN(index)) {
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
