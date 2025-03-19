// ==UserScript==
// @name         YouTube DLP Handler
// @namespace    NekoBoiNick/Web/YouTube
// @version      1.0.2.1
// @description  Uses a protocol to make youtube-dl download videos.
// @author       Neko Boi Nick
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/youtube_mp4handler/youtube_mp4handler.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/youtube_mp4handler/youtube_mp4handler.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";
  /** @type {String} */
  const PLUGIN_ID = "YouTube-handler";

  /** @enum {Number} */
  const ButtonPlacement = {
    IronDropdown: 0,
    Title: 1,
  };

  /**
   * @typedef Options
   * @type {Object}
   * @prop {String} downloadDirectory        The directory to tell yt-dlp to download to.
   * @prop {ButtonPlacement} buttonPlacement The button placement to render the dom element at.
   */

  /**
   * @typedef DownloadButtonCtor
   * @type {Object}
   * @prop {String} title   The command to run for this download button
   * @prop {String} command The command to run for this download button
   */

  /**
   * @typedef DownloadButtons
   * @type {Record<String, DownloadButtonCtor>}
   */

  /** @type {String} */
  const DOWNLOAD_ICON_SVG_PATH = "M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z";

  // TODO: Create a single button with a menu to download via a robust amount of options.
  /** @type {DownloadButtons} */
  const DOWNLOAD_BUTTON_DEFS = {
    audioMPA: {
      title: "Download M4A",
      command: "ytdl:-x --audio-format m4a --audio-quality 0 --no-color {unsafeWindow_location_href} -o {output_dir}",
    },
    audioMP3: {
      title: "Download MP3",
      command: "ytdl:-x --audio-format mp3 --audio-quality 0 --no-color {unsafeWindow_location_href} -o {output_dir}",
    },
    video: {
      title: "Download Video",
      command: "ytdl:{unsafeWindow_location_href} -o {output_dir}",
    },
  };

  /** @type {Record<ButtonPlacement, String>} */
  const BUTTON_SVG = {
    [ButtonPlacement.IronDropdown]: `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                                       <g class="style-scope yt-icon">
                                         <path d="${DOWNLOAD_ICON_SVG_PATH}" class="style-scope yt-icon" />
                                       </g>
                                     </svg>`,
    [ButtonPlacement.Title]: `<svg viewBox="0 0 24 24" focusable="false" height="24" width="24">
                                <path d="${DOWNLOAD_ICON_SVG_PATH}" />
                              </svg>`
  };

  /** @type {Array<{ btn: JQuery<HTMLElement>; options: DownloadButtonCtor }>} */
  const BUTTONS = [];

  /** @type {Options} */
  const OPTIONS = {
    buttonPlacement: ButtonPlacement.IronDropdown,
    downloadDirectory: "%USERPROFILE%/Downloads/"
  };

  function setupCSS() {
    GM_addStyle(`
#bottom-grid #${PLUGIN_ID}-player-tools {
  position: unset;
 margin-left: auto;
}
#${PLUGIN_ID}-player-tools {
  display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
}
#${PLUGIN_ID}-player-tools > div {
	cursor: pointer;
	width: 36px;
	height: 36px;
	justify-content: center;
	display: flex;
	align-items: center;
	fill: var(--yt-spec-text-primary);
	position: relative;
}
#${PLUGIN_ID}-player-tools > div:hover {
  background-color: var(--yt-spec-10-percent-layer);
  border-radius: 18px;
}
#${PLUGIN_ID}-tools > div > svg {
	pointer-events: none;
	user-select: none;
}
`);
  }

  /**
   * Gets the wrapper element of the button
   * @param {JQuery<HTMLElement>} div The title of the button.
   * @returns {JQuery<HTMLElement> | undefined}
   */
  function getButtonWrapper(div) {
    if (OPTIONS.buttonPlacement === ButtonPlacement.IronDropdown) {
      return div;
    }

    if (OPTIONS.buttonPlacement === ButtonPlacement.Title) {
      /** @type {String} */
      const buttonWrapperID = `#${PLUGIN_ID}-player-tools`;
      if (div.find(buttonWrapperID).length > 0) {
        return div.find(buttonWrapperID).first();
      }

      const btnWrapper = $(`<div id="${buttonWrapperID.replace(/^#/, "")}" />`);
      div.append(btnWrapper);
      /** @type {JQuery<HTMLDivElement>} */
      const iridiumPlayerTools = div.find("#iridium-player-tools");

      if (iridiumPlayerTools.length > 0) {
        btnWrapper.css({
          right: `${iridiumPlayerTools.first().css("width").replaceAll(/[\D.]/g, "")}px`,
        });
      }

      return btnWrapper;
    }

    throw new Error("Invalid Button Placement Option");
  }

  /**
   * Gets the html element of the button
   * @param {String} title The title of the button.
   * @param {String} id    The safe id of the button.
   * @returns {JQuery<HTMLElement>}
   */
  function getButtonElement(title, id) {
    if (OPTIONS.buttonPlacement === ButtonPlacement.IronDropdown) {
      return $(`<ytd-menu-service-item-renderer id="${PLUGIN_ID}-${id}-shortcut" class="style-scope ytd-menu-popup-renderer iron-selected" use-icons="" system-icons="" role="menuitem" tabindex="-1" aria-selected="true">
                  <tp-yt-paper-item class="style-scope ytd-menu-service-item-renderer" style-target="host" role="option" tabindex="0" aria-disabled="false">
                    <yt-icon class="style-scope ytd-menu-service-item-renderer">
                      ${BUTTON_SVG[OPTIONS.buttonPlacement]}
                    </yt-icon>
                    <yt-formatted-string class="style-scope ytd-menu-service-item-renderer" />
                    <ytd-badge-supported-renderer class="style-scope ytd-menu-service-item-renderer" disable-upgrade="" hidden="" />
                  </tp-yt-paper-item>
                </ytd-menu-service-item-renderer>`.replaceAll(/(?<=\/?>)[\s\n\r]+(?=<)/g, ""));
    }

    if (OPTIONS.buttonPlacement === ButtonPlacement.Title) {
      return $(`<div id="${PLUGIN_ID}-${id}-shortcut" title="${title}" ${PLUGIN_ID}-enabled="">${BUTTON_SVG[OPTIONS.buttonPlacement]}</div>`.replaceAll(/(?<=\/?>)[\s\n\r]+(?=<)/g, ""));
    }

    throw new Error("Invalid Button Placement Option");
  }

  /**
   * Gets the element where the button should be placed
   * @returns {JQuery<HTMLElement>}
   */
  function getButtonPlacement() {
    if (OPTIONS.buttonPlacement === ButtonPlacement.IronDropdown) {
      return $("tp-yt-iron-dropdown tp-yt-paper-listbox[id=\"items\"].ytd-menu-popup-renderer");
    }

    if (OPTIONS.buttonPlacement === ButtonPlacement.Title) {
      return $("#above-the-fold > #title");
    }

    throw new Error("Invalid Button Placement Option");
  }

  /**
   * Gets the highest value of a set of elements based on a css property.
   * @param {JQuery<HTMLElement>[] | JQuery<HTMLElement>} elements The list of elements to query.
   * @param {String}                                      tag       The CSS tag to query.
   * @returns {Number}
   * @throws {TypeError} Thrown if the CSS tag does not contain a number of any form or contains multiple number sets.
   */
  function getHighest(elements, tag) {
    /** @type {Number} */
    const output = -1;
    if (Array.isArray(elements)) {
      return Math.max(...elements.map((element) => Number.parseInt(element.css(tag).replaceAll(/[\D.]/g, ""), 10)).filter((int) => !Number.isNaN(int)));
    }

    try {
      return Math.max(...elements.map((index, element) => Number.parseInt($(element).css(tag).replaceAll(/[\D.]/g, ""), 10)).filter((int) => !Number.isNaN(int)));
    } catch (error) {
      console.error(error);
      /** @type {Number} */
      const int = Number.parseInt(elements.first().css(tag).replaceAll(/[\D.]/g, ""), 10);
      if (!Number.isNaN(int)) {
        return int;
      }
    }

    return output;
  }

  /**
   * Fixes formatting in each button
   * @param {JQuery<HTMLElement>} btn   The button to fix the formatting of.
   * @param {String}              title The button title.
   * @returns {void}
   */
  function fixFormatting(btn, title) {
    if (OPTIONS.buttonPlacement === ButtonPlacement.IronDropdown) {
      /** @type {JQuery<HTMLElement>} */
      const ytFormattedStringElement = btn.find("yt-formatted-string.ytd-menu-service-item-renderer");
      if (ytFormattedStringElement.attr("is-empty") !== undefined) {
        ytFormattedStringElement.removeAttr("is-empty");
        ytFormattedStringElement.text(title);
      }

      /** @type {JQuery<HTMLElement>} */
      const ytIconElement = btn.find("yt-icon");
      if (ytIconElement.find("svg").length === 0) {
        ytIconElement.html(BUTTON_SVG[OPTIONS.buttonPlacement].replaceAll(/(?<=\/?>)[\s\n\r]+(?=<)/g, ""));
      }

      /** @type {JQuery<HTMLElement>} */
      const ytIronDropdown = $("tp-yt-iron-dropdown");
      /** @type {JQuery<HTMLElement>} */
      const ytMenuPopupRenderer = ytIronDropdown.find("ytd-menu-popup-renderer[slot=\"dropdown-content\"]");
      /** @type {Number} */
      const dropdownButtonOffset = 36;
      ytMenuPopupRenderer.css({
        maxHeight: `${Number.parseInt(ytMenuPopupRenderer.css("max-height").replaceAll(/[\D.]/g, ""), 10) + (dropdownButtonOffset * BUTTONS.length)}px`,
        maxWidth: `${getHighest(BUTTONS.map((entry) => entry.btn), "width")}px`,
      });
      ytIronDropdown.css({
        top: `${Number.parseInt(ytIronDropdown.css("top").replace("px", ""), 10) - (dropdownButtonOffset * BUTTONS.length)}px`,
      });
    }
  }

  /**
   * Patches the button into the youtube page.
   * @returns {void}
   */
  function patch() {
    /** @type {JQuery<HTMLElement>} */
    const div = getButtonPlacement();

    if (div.length > 0) {
      /**
       * Create the button wrapper
       * @type {JQuery<HTMLElement>}
       */
      const btnWrapper = getButtonWrapper(div);

      for (const [buttonId, buttonOptions] of Object.entries(DOWNLOAD_BUTTON_DEFS)) {
        // If the button already exists continue along, as well if the key is not a string or the buttonOptions is not an object.
        if ($(`#${PLUGIN_ID}-${buttonId}-shortcut`).length > 0 || typeof buttonId !== "string" || typeof buttonOptions !== "object") {
          continue;
        }

        /**
         * Create the button
         * @type {JQuery<HTMLElement>}
         */
        const btn = getButtonElement(buttonOptions.title, buttonId);

        btnWrapper.append(btn);

        /* Trigger protocol handler */
        btn.on("click", () => {
          const command = buttonOptions.command.replace("{unsafeWindow_location_href}", unsafeWindow.location.href).replace("{output_dir}", OPTIONS.downloadDirectory + "%(title)s.%(ext)s");
          console.log(command);
          window.open(command, "_blank");
        });

        if (OPTIONS.buttonPlacement === ButtonPlacement.IronDropdown) {
          fixFormatting(btn, buttonOptions.title);
        }

        BUTTONS.push({
          btn,
          options: buttonOptions,
        });
      }
    }
  }

  /**
   * Checks if any of the already created buttons have been directly tampered with.
   * @param {MutationRecord} mutation The current mutation record to check.
   * @returns {Boolean}
   */
  function isAnyButtonTampered(mutation) {
    return BUTTONS.find((entry) => $(mutation.target).is(entry.btn)) !== undefined;
  }

  /**
   * Callback for the {@link MutationObserver}
   * @param {MutationRecord[]} mutationList The list of mutations that were made.
   * @param {MutationObserver} _observer    The observer that called this callback.
   * @returns {void}
   */
  function callback(mutationList, _observer) {
    for (const mutation of mutationList) {
      if (/https:\/\/(www\.)?youtube\.com\/watch\?.+/gi.test(unsafeWindow.location.href)) {
        if (isAnyButtonTampered(mutation)) {
          // Correct the button elements if they have been tampered with.
          /* TODO: Setup 10 minute interval to check just incase */
          for (const button of BUTTONS) {
            fixFormatting(button.btn, button.options.title);
          }
        }
      }
    }
  }

  /**
   * Sets up the mutation observer for patching in the buttons
   * @returns {void}
   */
  function setupMutationObserver() {
    /** @type {HTMLElement} */
    const targetNode = document.body;
    /** @type {MutationObserverInit} */
    const config = { attributes: true, childList: true, subtree: true };
    /** @type {MutationObserver} */
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  /**
   * YT-DLP downloader embeded into youtube.
   * @see {@link https://plisio.net/blog/yt-dlp}
   * @see {@link https://wiki.archlinux.org/title/Yt-dlp}
   * @see {@link https://github.com/yt-dlp/yt-dlp/wiki}
   * @returns {void}
   */
  function run() {
    setupCSS();
    /** @type {() => void} */
    const onEvent = () => {
      if (/https:\/\/(www\.)?youtube\.com\/watch\?.+/gi.test(unsafeWindow.location.href)) {
        patch();
      }

      // Clean up disposed buttons.
      /** @type {Number} */
      let index = 0;
      for (const entry of BUTTONS) {
        if (entry !== undefined && $("body").find(entry.btn).length === 0) {
          BUTTONS.splice(index, 1);
        }
        index++;
      }
    };

    // Event Listeners found at https://github.com/ParticleCore/Iridium/blob/41dd083a129eaaa191dc510f5353471a977c804d/src/firefox/js/background-inject.js
    unsafeWindow.addEventListener("yt-page-data-updated", onEvent, true);
    unsafeWindow.addEventListener("yt-navigate-start", onEvent, false);
    unsafeWindow.addEventListener("yt-navigate-finish", onEvent, false);
    unsafeWindow.addEventListener("yt-next-continuation-data-updated", onEvent, true);
    unsafeWindow.addEventListener("popstate", onEvent, true);
    unsafeWindow.addEventListener("iron-overlay-opened", onEvent, true);
    setupMutationObserver();
  }

  run();
});
