// ==UserScript==
// @name         Wikia/Fandom Additional Features.
// @namespace    NekoBoiNick.Web
// @version      1.1.4
// @description  Adds custom things to Wikia/Fandom
// @author       Neko Boi Nick
// @match        https://ridgeside.fandom.com/wiki/Relic_Fox_Mask
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fandom_additions/fandom_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fandom_additions/fandom_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* cSpell:ignore createProgressbar */

/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const GMConfigID = "Fandom_Additions_Config";

  if (typeof $("body").outerHtml === "undefined") {
    $.fn.outerHtml = function (newHtml = undefined) {
      if (typeof newHtml !== "undefined") {
        // Do nothing.
      } else {
        const clone = this.clone();
        const measure = $("<div style=\"display: none;\" />");
        measure.append(clone);
        const html = measure.html();
        measure.remove();
        return html;
      }
    };
  }

  /**
   * @returns {void}
   */
  function handleGlobalNavigationRemoval() {
    let globalNavigation = $("body > div.global-navigation");
    if (globalNavigation.length >= 1) {
      if (globalNavigation.length !== 1) {
        console.warn("Found more than 1 of selector \"body > div.global-navigation\" using the first instance.");
        globalNavigation = globalNavigation.first();
      }

      globalNavigation.css({ display: "none" });
      let mainContent = globalNavigation.next();
      mainContent = mainContent.is("body > div.main-container") ? mainContent : $("body > div.main-container");
      if (mainContent.length > 1) {
        console.warn("Found more than 1 of selector \"body > div.global-navigation\" using the first instance.");
        mainContent = mainContent.first();
      } else if (mainContent.length === 0) {
        console.error("Found zero instances of selector \"body > div.global-navigation\" using the first instance.");
        return;
      }

      const mainContentMarginLeft = mainContent.css("margin-left");
      console.debug(`mainContent.css("margin-left") = ${mainContentMarginLeft}`);
      console.debug(`mainContent.css("bottom") = ${mainContent.css("bottom")}`);
      if (typeof mainContentMarginLeft !== "undefined") {
        mainContentMarginLeft.css({ marginLeft: "unset" });
      }
    }
  }

  /**
   * @returns {void}
   */
  function openConfig() {
    $("body > div.config-modal").css({ display: "inherit" });
    GM_config.open();
  }

  /**
   * @returns {void}
   */
  function editPages() {
    console.debug(`GM_config.get("removeFandomSidebar") = ${GM_config.get("removeFandomSidebar")}`);
    if (GM_config.get("removeFandomSidebar") === true) {
      handleGlobalNavigationRemoval();
    }
  }

  /**
   * Creates a template from the UserScript meta resources.
   * @param {*} resource The template name from UserScript resources.
   * @param {object} replaceObj The object containing information about replacement in the template.
   * @returns {HTMLElement} An element.
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

  /**
   * @param   {string} styleBlockID      The identifier for the style block.
   * @returns {JQuery<HTMLStyleElement>}
   */
  function ensureStyleBlock(styleBlockID) {
    // Query style block by ID.
    let styleBlock = $(`style#${styleBlockID}`);
    if (styleBlock.length === 0) {
      // Create style block
      styleBlock = $(`<style id="${styleBlockID}"></style>`);
      $("head").append(styleBlock);
    } else if (styleBlock.length > 1) {
      // Merge style blocks
      const _styleBlock = $(`<style id="${styleBlockID}"></style>`);
      for (const [index, block] of Object.entries(styleBlock)) {
        if (isNaN(Number(index))) {
          continue;
        }

        _styleBlock.text(_styleBlock.text() + "\n" + block.text());
        block.remove();
      }

      styleBlock = _styleBlock;
      $("head").append(styleBlock);
    }

    return styleBlock;
  }

  function appendStyleBlock(styleBlockID, style) {
    const trimText = (text) => {
      // Remove extra blank lines.
      text = text.replaceAll(/(\r?\n){2,}/g, "");
      // Replace tabs.
      text = text.replaceAll(/(?<=^|\t)\t/gm, "  ");
      // Find extra indent then outdent.
      const splitText = text.split(/\r?\n/);
      /* @type {number | null} */
      let firstIndentLength = null;
      /* @type {number | null} */
      let lastIndentTier = null;
      /* @type {boolean} */
      let iterateOnce = false;

      for (const [index, line] of splitText.map((x, i) => [i, x])) {
        const indentRegex = /^( +)([^ ])/gm;
        const match = line.match(indentRegex);

        if (firstIndentLength === null && match !== null && match.length >= 2) {
          firstIndentLength = match[1].length;
        }

        if (firstIndentLength === null) {
          console.warn("firstIndentLength is null");
        }

        if (match !== null && match.length >= 2) {
          const indent = match[1].length;
          let indentTier = 0;

          if (firstIndentLength !== null && indent > firstIndentLength) {
            indentTier = firstIndentLength;
          }

          if (lastIndentTier !== null && indent > lastIndentTier) {
            indentTier = lastIndentTier;
          } else if (lastIndentTier === null && iterateOnce) {
            console.warn("lastIndentTier is null");
          }

          if (lastIndentTier !== null && indent < lastIndentTier && indent > firstIndentLength) {
            indentTier = lastIndentTier - 1;
          }

          splitText[index] = line.replace(new RegExp(`^${" ".repeat(indent)}`), " ".repeat(indentTier * 2));
          iterateOnce = true;
          lastIndentTier = indentTier;
        }
      }

      text = splitText.join("\n");
    };

    const styleBlock = ensureStyleBlock(styleBlockID);
    // Handle new style appending
    styleBlock.text(`${styleBlock.text()}\n${style}`);
  }

  /**
   * @returns {JQuery<HTMLElement>}
   */
  function setupGMConfigFrame() {
    appendStyleBlock("nbn-gm_config-style",
      `
      .config-modal {
	    	align-items: center;
	    	display: flex;
		    justify-content: center;
		    z-index: 799;
	    }
      .config-modal, .config-modal::before {
	      bottom: 0;
	      left: 66px;
	      position: fixed;
	      right: 0;
	      top: 0;
      }
      .config-modal:before {
        animation: searchOverlayFadeIn .2s;
        background-color: #1e0c1be6;
        content: " ";
        display: block;
      }
      .config-modal__content {
        animation: searchModalSlideIn .2s;
        background-color: var(--fandom-dropdown-background-color);
        border: 1px solid var(--fandom-border-color);
        border-radius: 6px;
        box-shadow: 0 0 10px 0 #1a1a1a40;
        min-height: calc((100% / 3) * 2);
        min-width: calc((100% / 3) * 2);
        padding: 18px;
        position: fixed;
        z-index: 1;
        top: calc(100% / 6);
        left: calc(100% / 6);
      }
      .config-module__closeIcon {
      	color: #fff;
      	cursor: pointer;
      	margin-left: 100%;
      	position: absolute;
      	right: 0;
      	top: -42px;
      }
    `);

    const configModal = $("<div class=\"config-modal\"></div>");
    const configModalContent = $("<div class=\"config-modal__content\"></div>");
    const closeButton = $("<svg class=\"wds-icon config-module__closeIcon\" data-testid=\"config-modal-icon-close\"><use xlink:href=\"#wds-icons-close\"></use></svg>");
    const configModalForm = $("<div class=\"config-module__form\"></div>");

    configModal.append(configModalContent);
    configModalContent.append(closeButton);
    configModalContent.append(configModalForm);
    $("body").append(configModal);

    configModal.on("click", (event) => {
      console.log("event", event);
      GM_config.close();
    });

    closeButton.on("click", () => {
      GM_config.close();
    });

    configModal.css({ display: "none" });
    return configModalForm[0];
  }

  /**
   * @param {HTMLElement} frame
   * @returns {void}
   */
  function modifyGM_configFrame(frame) {
    $(frame).removeAttr("style");

    const header = $(frame).find(`#${GMConfigID}_header`);
    if (typeof header.hasClass === "undefined" || typeof header.outerHtml === "undefined") {
      if (typeof header.hasClass === "undefined") {
        console.warn("jQuery.hasClass is undefined");
      }

      if (typeof header.outerHtml === "undefined") {
        console.warn("jQuery.outerHtml is undefined");
      }
    } else {
      if (!header.hasClass("page-header__bottom")) {
        header.addClass("page-header__bottom");
        header.attr("style", "color: var(--fandom-global-nav-link-color) !important;");
        const headerInnerHtml = header.html();
        const headerHeadingOne = $("<h1 class=\"page-header__title\" id=\"firstHeading\"></h1>");
        const headerSpan = $("<span class=\"mw-page-title-main\"></span>");
        headerSpan.append(headerInnerHtml);
        headerHeadingOne.append(headerSpan);
        header.html(headerHeadingOne.outerHtml());
      }
    }
  }

  /**
   * Removes the default GM_config styles.
   * @param {GM_config} config The instance of GM_config.
   * @returns {void}
   */
  function removeDefaultGM_configStyles(config) {
    const styles = $("head > style[type=\"text/css\"]");
    for (const [index, style] of Object.entries(styles)) {
      if (isNaN(Number(index))) {
        continue;
      }

      if ($(style).text().startsWith(`#${config.id} *`)) {
        $(style).text(".input-group .input-group-prepend+.input-group-text>input.form-control[type=\"checkbox\"]{height:fit-content !important}.input-group>.input-group-text.input-group-append{background-color:#fff;border-top-left-radius:0;border-bottom-left-radius:0}");
      }
    }
  }

  GM_config.init({
    id: GMConfigID,
    title: "Fandom/Wikia Additions Config",
    fields: {
      removeFandomSidebar: {
        label: "Remove Fandom Sidebar",
        type: "checkbox",
        default: false
      }
    },
    events: {
      /** @returns {void} */
      init() {
        editPages();

        GM_registerMenuCommand("Config", openConfig);
      },
      /** @returns {void} */
      open() {
        removeDefaultGM_configStyles(GM_config);
        $("body > div.config-modal").css({ display: "inherit" });
        modifyGM_configFrame(GM_config.frame);
        // unsafeWindow.$(GM_config.frame).modal("show");
      },
      /**
       * @param {any} _val
       * @returns {void}
       */
      save(_val) {
        console.debug(`GM_config.save(_val) | _val = ${_val}`);
      },
      /** @returns {void} */
      close() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:none;");
         */
        removeDefaultGM_configStyles(GM_config);
        $("body > div.config-modal").css({ display: "none" });
        // unsafeWindow.$(GM_config.frame).modal("hide");
      }
    },
    // Disabled:
    // css: GM_getResourceText("GMConfigCSS"),
    frame: setupGMConfigFrame(),
  });
});
