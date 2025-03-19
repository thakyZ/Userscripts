// ==UserScript==
// @name         Curse Forge Default Download Button
// @namespace    NekoBoiNick.Web
// @version      1.0.2.1
// @description  Changes the "Install" button to a Download Button by default.
// @author       Neko Boi Nick
// @match        https://beta.curseforge.com/*/*
// @match        https://www.curseforge.com/*/*
// @match        https://curseforge.com/*/*
// @match        https://legacy.curseforge.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @connect      www.curseforge.com
// @connect      curseforge.com
// @connect      beta.curseforge.com
// @connect      legacy.curseforge.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     modalTemplate https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/modal.template.html
// ==/UserScript==
/* global jQuery */
/* eslint camelcase: [ "error", { allow: [ "^GM_", "^GM_config_id$" ] } ] */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const GM_config_id = "CurseForge_Additions_Config";

  function isOnFileDL(mutation) {
    return $("section.file-details", $(mutation.target)).length > 0;
  }

  /**
   * Creates a template from the UserScript meta resources.
   * @param {*} resource The template name from UserScript resources.
   * @param {Object} replaceObj The object containing information about replacement in the template.
   * @returns {Element} An element.
   */
  function createElements(resource, replaceObj = {}) {
    const templateHtml = GM_getResourceText(resource);
    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "")
      .replaceAll(/\r?\n<\/template>$/gi, "");
    const template = $(templateTruncated);
    for (const [key, value] of Object.entries(replaceObj)) {
      $(template).html($(template).html().replaceAll(key, value));
    }

    return template;
  }

  const useXHRForFileName = true;

  async function fetchFileName(fileId) {
    try {
      let projectId = $(".project-details-box section dt:contains(\"Project ID\")").next().text();

      const request = await GM.xmlHttpRequest({
        method: "GET",
        url: `https://api.curseforge.com/v1/mods/${projectId}/files/${fileId}`,
        timeout: 2000,
        headers: {
          "Accept": "application/json",
          "x-api-key": GM_config.get("curseForgeApiKey"),
        }
      });

      if (typeof request.statusText === "undefined") {
        console.debug(request);
        throw new Error(`Failed with status code of undefined. Typeof request: ${typeof request}`);
      } else if (request.statusText.toLowerCase() !== "ok") {
        console.debug(request);
        throw new Error(`Failed with status code of ${request.statusText}`);
      }
      console.debug(request);

      if (typeof unsafeWindow.nbn === "undefined") {
        unsafeWindow.nbn = {};
      }

      unsafeWindow.nbn.request = request;
      unsafeWindow.nbn.$ = $;

      let output = JSON.parse(request.responseText).data.fileName;

      unsafeWindow.nbn.output = output;

      return output;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function createURL(selector = undefined) {
    let fileId;
    if (window.location.href.split("/")[6] === "files" && !isNaN(Number(window.location.href.split("/")[7]))) {
      fileId = window.location.href.split("/")[7];
    } else if (window.location.href.split("/")[6] !== "files") {
      fileId = $(selector).attr("href").split("/").reverse()[0];
    }

    let fileName;
    if (typeof selector === "undefined" || $("body .section-file-name *:last-child").length === 0) {
      /* eslint-disable-next-line no-lonely-if */
      if (useXHRForFileName) {
        fileName = await fetchFileName(fileId);
      } else {
        throw new Error("No other method is implemented to fetch the filename for a direct download.");
      }
    } else {
      if (window.location.href.split("/")[2].startsWith("legacy")) {
        // JavaScript: document.getElementsByTagName("article")[0].children[1].firstElementChild.lastElementChild.innerText
        fileName = $("body article *:nth-child(2) *:first-child *:last-child").text();
      } else {
        // JavaScript: document.getElementsByClassName("section-file-name")[0].lastElementChild.innerText
        fileName = $("body .section-file-name *:last-child").text();
      }
    }

    return "https://mediafilez.forgecdn.net/files/" + Number(fileId.slice(0, 4)) + "/" + Number(fileId.slice(4)) + "/" + encodeURIComponent(fileName);
  }

  async function alterDownloadButton(selector) {
    if (!$(selector).attr("href").startsWith("https://mediafilez.forgecdn.net/files/")) {
      const newUrl = await createURL(selector);
      $(selector).attr("href", newUrl);
    }
  }

  function alterDownloadButtonWrapper(selector) {
    (async function() {
      await alterDownloadButton(selector);
    })();
  }

  function callback(mutationList, _) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && $(mutation.target).attr("class") === "tab-content") {
        if (isOnFileDL(mutation)) {
          if ($("div#menuButton button span").text() === "InstallInstall") {
            if ($("section.file-details h2 #menuButton button", $(mutation.target)).length > 0) {
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).off("click");
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).html("");
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).html($("section.file-details h2 #menuButton .more-options li:last-child a", $(mutation.target)).html());
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).on("click", function (event) {
                event.stopPropagation();
                window.open($("section.file-details h2 #menuButton .more-options li:last-child a", $(this)).attr("href"));
              });
            }
          } else if ($("div#menuButton a span").text() === "InstallInstall") {
            $("section.file-details h2 #menuButton a:not(\".btn-more-options\")", $(mutation.target)).off("click");
            $("section.file-details h2 #menuButton a:not(\".btn-more-options\")", $(mutation.target)).html("");
            $("section.file-details h2 #menuButton a:not(\".btn-more-options\")", $(mutation.target)).html($("section.file-details h2 #menuButton .more-options li:last-child a", $(mutation.target)).html());
            alterDownloadButtonWrapper("section.file-details h2 #menuButton a[href]");
          }

          if ($("section.file-details h2 #menuButton a", $(mutation.target)).length > 0) {
            alterDownloadButtonWrapper("section.file-details h2 #menuButton a[href]");
          }
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("section.tab-content")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function main() {
    if ($(".project-header .actions #menuButton").length > 0) {
      if ($(".project-header .actions #menuButton button").length > 0) {
        $(".project-header .actions #menuButton button:not(\".btn-more-options\")").off("click");
        $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html("");
        $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html($(".project-header .actions #menuButton .more-options li:last-child a").html());
        $(".project-header .actions #menuButton button:not(\".btn-more-options\")").on("click", (event) => {
          event.stopPropagation();
          window.open($(".project-header .actions #menuButton .more-options li:last-child a").attr("href"));
        });
      } else if ($(".project-header .actions #menuButton a[href]").length > 0) {
        alterDownloadButtonWrapper(".project-header .actions #menuButton a[href]");
      }

      if ($("section.file-details h2 #menuButton button").length > 0) {
        $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").off("click");
        $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html("");
        $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html($("section.file-details h2 #menuButton .more-options li:last-child a").html());
        $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").on("click", (event) => {
          event.stopPropagation();
          window.open($("section.file-details h2 #menuButton .more-options li:last-child a").attr("href"));
        });
      } else if ($("section.file-details h2 #menuButton a[href]").length > 0) {
        alterDownloadButtonWrapper("section.file-details h2 #menuButton a[href]");
      }

      setupMutationObserver();
    }

    if ($(".project-card").length > 0) {
      $(".project-card").each(function () {
        $("#menuButton button:not(\".btn-more-options\")", $(this)).html("");
        $("#menuButton button:not(\".btn-more-options\")", $(this)).html($("#menuButton .more-options li:last-child a").html());
        $("#menuButton button:not(\".btn-more-options\")", $(this)).on("click", function (event) {
          event.stopPropagation();
          window.open($(".more-options li:last-child a", $(this).parent()).attr("href"));
        });
      });
    }
  }

  const setupGMConfigFrame = () => {
    const configWrapper = $(createElements("modalTemplate", { "%modal_id%": GM_config.id, "%modal_label%": `${GM_config.id}_label` }));
    $("body").append(configWrapper);
    return configWrapper[0];
  };

  const gmConfigFrame = setupGMConfigFrame();

  /**
   *
   * @param {*} frame
   * @returns
   */
  function modifyGM_configFrame(frame, state) {
    if (state === "hide") {
      $(frame).css({ display: "none" });
    } else {
      $(frame).css({ display: "block" });
      $(frame).children().find("button").addClass("btn-secondary");
      const clientHeight = Number($(frame).prop("clientHeight"));
      const clientWidth = Number($(frame).prop("clientWidth"));
      $(frame).css({ position: "fixed", top: `calc((100% - ${clientHeight})/2)`, left: `calc((100% - ${clientWidth})/2)` });
    }
  }

  GM_registerMenuCommand("config", () => {
    GM_config.open();
  });

  const gmConfigCSS = `
#${GM_config_id} {
  height: fit-content !important;
  width: fit-content !important;
  inset: calc((100% - 171px) / 2) auto auto calc((100% - 1272px)/2) !important;
  background: #1a1a1a !important;
  padding: 32px !important;
  border: unset !important;
}
#${GM_config_id} *,
#${GM_config_id} .config_header,
#${GM_config_id} input,
#${GM_config_id} button,
#${GM_config_id} label,
#${GM_config_id} a,
#${GM_config_id} div,
#${GM_config_id} .reset,
#${GM_config_id} .reset a,
#${GM_config_id}_buttons_holder {
  font-family: inherit !important;
  color: #e5e5e5 !important;
}
#${GM_config_id} .config_var {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin: 0 1rem 0 0;
}
#${GM_config_id} label {
  font-size: 14px !important;
  font-weight: 400 !important;
  flex-basis: fit-content;
  flex-shrink: 0;
  max-height: min-content;
}
#${GM_config_id} input {
  width: -moz-available;
  display: block;
  flex-shrink: 1;
}
#${GM_config_id} > div[id*="_wrapper"] > div[id*="_buttons_holder"] {
  float: right;
  margin-top: 12px;
}
#${GM_config_id} > div[id*="_wrapper"] > div[id*="_buttons_holder"] > button {
  padding: 8px 16px;
  margin: 0 12px 0 0;
}
#${GM_config_id} > div[id*="_wrapper"] > div[id*="_buttons_holder"] > button:nth-child(2) {
  grid-area: action-end;
  margin: 0;
}
`;

GM_config.init({
    id: GM_config_id,
    title: "CurseForge Additions Config",
    fields: {
      curseForgeApiKey: {
        label: "CurseForge API Key",
        type: "text",
        default: ""
      }
    },
    events: {
      init() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:none;");
         */
        main();
      },
      open() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:block;");
         */
        modifyGM_configFrame(GM_config.frame, "show");
      },
      save(val) {
        console.debug(val);
      },
      close() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:none;");
         */
        modifyGM_configFrame(GM_config.frame, "hide");
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });

  // Let id = -1;
  // id = setInterval(function() {
  //  if ($("#menuButton button:not(\".btn-more-options\")").
  // }, 100);
});
