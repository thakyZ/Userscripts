// ==UserScript==
// @name         FFXIV Lodestone Additions
// @namespace    NekoBoiNick.Web.FFXIV.Lodestone.Additions
// @version      1.0.0
// @description  Adds various things to the FFXIV Lodestone.
// @author       Neko Boi Nick
// @match        https://*.finalfantasyxiv.com/lodestone/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_notification
// @connect      api.nekogaming.xyz
// @connect      cdn.discordapp.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivlodestone_additions/ffxivlodestone_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivlodestone_additions/ffxivlodestone_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     GMConfigCSS https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ffxivlodestone_additions/GM_config-style.min.css
// ==/UserScript==
/* global jQuery, GM_config */
this.$ = this.jQuery = jQuery.noConflict(true);

jQuery(($) => {
  "use strict";

  const gmConfigID = "FFXIV_Lodestone_Additions_Config";

  if (/^https:\/\/(\w+\.)?finalfantasyxiv\.com\/lodestone/.test(window.location.href)) {
    GM_registerMenuCommand("Config", () => {
      GM_config.open();
    });
  }

  /* eslint-disable-next-line camelcase */
  function modifyGM_configFrame(frame) {
    const previousStyle = $(frame).attr("style");
    const newStyle = [];

    // Transform Current Styles
    for (const style of previousStyle.split(";")) {
      newStyle.push(style);
    }

    // Add new styles
    newStyle.push("border-radius:0.5rem");
    $(frame).attr("style", newStyle.join(";"));
  }

  function modifyGrandCompanyLogo() {
  }

  const gmConfigCSS = GM_getResourceText("GMConfigCSS").replaceAll("GM_Config_ID", gmConfigID);

  const limitKeyDownEvent = (event) => {
    console.log(event);
    const input = event.target;
    if (input.size !== -1 && input.value.length >= input.size) {
      input.value = input.value.substr(0, input.size - 1);
    }
  };

  function convertKeyToTitle(key) {
    switch (key) {
      case "fcName":
        return "FC Name:";
      case "iconId":
        return "Icon ID:";
      case "url":
        return "URL:";
      default:
        return "unknown";
    }
  }

  function createListElement(object) {
    const { list, create, configId, value, id, i, target = null } = object;
    const listIndex = create("li", {
      innerHTML: "",
      id: `${configId}_${id}_field_list_scroll_wrapper`,
      for: `${configId}_field_${id}`,
      className: "field_list_index"
    });

    if (target === null) {
      list.appendChild(listIndex);
    } else {
      $(target).before(listIndex);
    }

    // Create the field label
    listIndex.appendChild(create("label", {
      innerHTML: `${i}`,
      id: `${configId}_${id}_field_label_${i}`,
      for: `${configId}_field_${id}`,
      className: "field_list_label"
    }));

    for (const [key, subValue] of Object.entries(value[i])) {
      // Create the field label
      listIndex.appendChild(create("label", {
        innerHTML: convertKeyToTitle(key),
        id: `${configId}_${id}_field_label_${i}_${key}`,
        for: `${configId}_field_${id}_${i}`,
        className: "field_list_input_label"
      }));

      const props = {
        id: `${configId}_field_${id}_${i}_${key}`,
        type: key === "iconId" ? "number" : "text",
        size: key === "iconId" ? 8 : (key === "fcName" ? 24 : -1),
        value: key === "iconId" ? (subValue ? subValue : 0) : (subValue ? subValue : ""),
        onkeydown: limitKeyDownEvent
      };

      // Actually create and append the input element
      listIndex.appendChild(create("input", props));
    }

    const delButton = create("button", {
      type: "button",
      innerHTML: "-",
      id: `${configId}_${id}_field_list_${i}_del`,
      for: `${configId}_field_${id}_${i}`,
      className: "field_list_add",
      onclick(event) {
        const index = $(event.target).closest("li")[0];
        index.parentNode.remove(index);
      }
    });

    listIndex.appendChild(delButton);
  }

  GM_config.init({
    id: gmConfigID,
    title: "FFXIV Lodestone Additions Config",
    fields: {
      logosToReplace: {
        label: "Logos to Replace",
        type: "list<string,int,string>",
        default: []
      }
    },
    events: {
      init() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:none;");
         */

        modifyGrandCompanyLogo();
      },
      open() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:block;");
         */
        modifyGM_configFrame(GM_config.frame);
        console.log(`($.fn.createElement !== undefined) ?= ${typeof $.fn.createElement !== "undefined"}`);
      },
      save(vales) {
        console.debug(vales);
      },
      close() {
        /**
         * Unused.
         * GM_config.frame.setAttribute("style", "display:none;");
         */
      }
    },
    css: gmConfigCSS,
    types: {
      "list<string,int,string>": {
        default: [],
        toNode() {
          const configId = gmConfigID;
          let { value, id, create, settings } = this;
          const format = (settings.format || "mm&dd&yyyy").split("&");
          const retNode = create("div", {
            className: "config_var",
            id: `${configId}_${id}_var`,
            title: settings.title || ""
          });

          // Save the format array to the field object so
          // it's easier to hack externally
          this.format = format;

          // Create the field label
          retNode.appendChild(create("label", {
            innerHTML: settings.label,
            id: `${configId}_${id}_field_label`,
            for: `${configId}_field_${id}`,
            className: "field_label"
          }));

          try {
            // Unused
            // value = JSON.parse(value);
            value = JSON.parse(JSON.stringify(value));
          } catch (exception) {
            console.error(value);
            console.error(exception);
            value = this.default;
          }

          // Create the field label
          const listScrollWrapper = create("div", {
            innerHTML: "",
            id: `${configId}_${id}_field_list_scroll_wrapper`,
            for: `${configId}_field_${id}`,
            className: "field_list_scroll_wrapper"
          });

          retNode.appendChild(listScrollWrapper);

          const list = create("ul", {
            innerHTML: "",
            id: `${configId}_${id}_field_list_scroll_wrapper`,
            for: `${configId}_field_${id}`,
            className: "field_list_unordered"
          });

          listScrollWrapper.appendChild(list);

          for (let i = 0; i < value.length; i++) {
            createListElement({ list, create, configId, value, id, i, target: null });
          }

          const listIndexLast = create("li", {
            innerHTML: "",
            id: `${configId}_${id}_field_list_scroll_wrapper`,
            for: `${configId}_field_${id}`,
            className: "field_list_index"
          });

          list.appendChild(listIndexLast);

          const addButton = create("button", {
            type: "button",
            innerHTML: "+",
            id: `${configId}_${id}_field_list_add`,
            for: `${configId}_field_${id}`,
            className: "field_list_add",
            onclick(event) {
              const list = $(event.target).closest("ul")[0];
              const newListIndex = $(event.target).closest("ul").find("li").length - 1;
              createListElement({ list, create, configId, value, id, i: newListIndex, target: event.target });
            }
          });

          listIndexLast.appendChild(addButton);

          return retNode;
        },
        toValue() {
          const rval = [];
          if (this.wrapper) {
            const listIndexes = this.wrapper.getElementsByTagName("li");

            // Join the field values together separated by slashes
            for (let i = 0, ilen = listIndexes.length; i < ilen; ++i) {
              const inputs = listIndexes[i].getElementsByTagName("input");
              const temp = { fcName: "", iconId: 0, url: "" };

              for (let j = 0, jlen = inputs.length; j < jlen; ++j) {
                // Don't save values that aren't numbers
                if (j === 1 && isNaN(Number(inputs[j].value))) {
                  GM_notification({ text: "icon_id is invalid", title: "error" });
                  temp.iconId = 0;
                } else {
                  temp.iconId = Number(inputs[j].value);
                }

                if (j === 0) {
                  temp.fcName = inputs[j].value;
                }

                if (j === 2) {
                  temp.url = inputs[j].value;
                }
              }

              rval.push(temp);
            }
          }

          // We are just returning a string to be saved
          // If you want to use this value you'll want a Date object
          return rval;
        },
        reset() {
          const rval = [{ fcName: "", iconId: 0, url: "" }];
          // Empty all the input fields
          if (this.wrapper) {
            const listIndexes = this.wrapper.getElementsByTagName("li");

            // Join the field values together separated by slashes
            for (let i = 0, ilen = listIndexes.length - 1; i < ilen; ++i) {
              const inputs = listIndexes[i].getElementsByTagName("input");

              if (i < ilen - 2) {
                listIndexes[i].parentNode.remove(listIndexes[i]);
              } else {
                for (let j = 0, jlen = inputs.length; j < jlen; ++j) {
                  // Don't save values that aren't numbers
                  inputs[j].value = j === 1 ? 0 : "";
                }
              }
            }

            return rval;
          }
        }
      }
    }
  });
});
