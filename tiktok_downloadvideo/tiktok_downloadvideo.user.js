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
      request.setRequestHeader("Cookie", "ttwid=1%7CHAsVQWPAFGyBYtZIobmy4-rUrsm5e-UnJ7RgGJnF3Ms%7C1690470045%7C8d79db607b7cca1113d744e8f9fcefdd0f54d6957f25496218540f6a79fd3ab8; tt_chain_token=AGvvVvBLpXi9EQZ3RXmx1g==; msToken=jgZ5aHlyibUy0fG4J4e1t7dfIKAondm8h9_qkFvcGYiVVj0DT_PQPiXEA5detmmMmdoZdtyJKfAzJXSTDP9zesk2L2xA-GGfaDeCRXLKjxsMCEoNDb4T6S6bTXxIBOS0IdLN; passport_csrf_token=e377d30e9d116dab1eed60b13885f3ef; passport_csrf_token_default=e377d30e9d116dab1eed60b13885f3ef; tt-target-idc-sign=HykYQGsGmpaAVcZr8fnARyosnwk-6aL9ymxtHLr9ncB3PfEai2c1dL-Q-hrrEaWo5qmyyHgAWpH3vD_Ui1klDcGBeGwcYT8JNsfrPIH20RViv27SAu9fHH9XioXF4BY9S1SYvL6wJ9R9QtpJmdT9ESXjr8HqYQh06PdrPJ91rd1TWKVZxUks6vQpeaJiAhMUlpT2J-waLas2svNcUhlWSBehW-IAJCE1zEVjlwBqNx0KJsTkhvOn5ylTrBugjwvQykhkzjI3LZpWUlJFQtO1iPHKvffMLOpk9CIC1bt0wgm_h2c5zt8Zjw9kKZtqTfF32nVzpzv2vD0TTkWT9yfB6SmJwEVsoF99DDAy679hObx_Kgo4r90vuzuineYnKzY4Evu63hT7Wb5nix8NQa4Uwxm-bKs4PSLr_B9MDQ8Z-1Exm5ADyuHo21VX_V9s8jRHvb6etRnjvh9S_lp0x1hl9bWF9pnE7rAbPiCdgQQg0Khvn0YR9hnd3E7OCOIjCYYw; tt_csrf_token=06hIEd20-l3Hxf1G4j83WypKylZ2jgRquZa4; s_v_web_id=verify_ljvsoiyy_4AYS74Ua_wRUv_45XW_988P_5PlYDhPOCT7F");
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

    const targ = D.getElementsByTagName("head")[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
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
