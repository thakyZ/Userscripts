// ==UserScript==
// @name         Bionic Twitch
// @version      0.1
// @description  Bionic reading in twitch cat.
// @author       cat2002
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Waits for the element to exist.
   * @param {HTMLElement} elment   The element in question.
   * @param {String}      selector The selector to find the element.
   * @param {Boolean}     update   Whether or not to push an update.
   * @returns {void}
   */
  function waitForElement(elment, selector, update = false) {
    return new Promise((resolve) => {
      if (!update && ((Array.isArray(selector) && elment.querySelector(selector[0])) || (!Array.isArray(selector) && elment.querySelector(selector)))) {
        resolve(elment.querySelector(selector));
        return;
      }

      const observer = new MutationObserver((_mutations) => {
        if (Array.isArray(selector)) {
          for (const el of selector) {
            if (elment.querySelector(el)) {
              if (!update) {
                observer.disconnect();
              }

              resolve(elment.querySelector(el));
            }
          }
        } else if (elment.querySelector(selector)) {
          if (!update) {
            observer.disconnect();
          }

          resolve(elment.querySelector(selector));
        }
      });

      observer.observe(elment.body, {
        childList: true,
        subtree: true
      });

      if (update) {
        document.addEventListener("unload", () => {
          observer.disconnect();
        }, true);
      }
    });
  }

  /**
   * Replaces the matched string with a subclass for bionic style.
   * @param {String} match The string that needs to be replaced.
   * @returns {String}
   */
  function replacer(match) {
    console.debug(match);
    const l = Math.ceil(match.length / 2);
    return "<b class=\"bionic\">" + match.substring(0, l) + "</b>" + match.substring(l);
  }

  /**
   * Matches the query selector in an array to a target element with parent element.
   * @param {HTMLElement} target  The element to target.
   * @param {HTMLElement} element The parent element to query.
   * @param {String[]}    array   The array of selectors.
   * @returns {Boolean}
   */
  function matchQuerySelectorOfArray(target, element, array) {
    return Array.isArray(array) && array.filter((item) => target === element.querySelector(item)).length >= 1;
  }

  GM_addStyle(".chat-scrollable-area__message-container { font-weight: 1; color: #dddddd; } .bionic { font-weight: bold; color: #efeff1; }");

  /** @type {HTMLBodyElement} */
  const targetNode = document.body;
  /** @type {String[]} */
  const selector = [
    ".seventv-chat-list", // SevenTV chatbox
    ".bttv-chat-scroller", // Better Twitch TV chatbox
    ".simplebar-content", // Fall back to default Twitch chatbox
  ];

  /**
   * Callback function to execute when mutations are observed
   * @param {MutationRecord[]} mutationList
   * @param {MutationObserver} _observer
   */
  function callback (mutationList, _observer) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (typeof targetNode.querySelector("[aria-label=\"Chat messages\"]") !== "undefined" && matchQuerySelectorOfArray(mutation.target, targetNode, selector)) {
          for (const node of mutation.addedNodes) {
            /* eslint-disable-next-line max-depth */
            if (node.nodeType === Node.ELEMENT_NODE) {
              /** @type {HTMLElement[]} */
              const fragments = Array.from(node.getElementsByClassName("text-fragment"));
              /** @type {HTMLElement[]} */
              const tokens = Array.from(node.getElementsByClassName("text-token"));
              /** @type {HTMLElement[]} */
              const selected = fragments.length > 0 ? fragments : tokens.length > 0 ? tokens : [];
              /* eslint-disable-next-line max-depth */
              for (const textFragment of selected) {
                console.debug("text: " + textFragment.innerHTML);
                textFragment.innerHTML = textFragment.innerHTML.replaceAll(/\b(?<!&|&#)[a-zA-Z']+\b/g, replacer);
              }
            }
          }
        }
      }
    }
  }

  function setupMutationObserver() {
    /** @type {MutationObserverInit} Options for the observer (which mutations to observe) */
    const config = { childList: true, subtree: true };

    /** @type {MutationObserver} */
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    document.addEventListener("unload", () => {
      observer.disconnect();
    }, true);
  }

  setupMutationObserver();
})();
