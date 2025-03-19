// ==UserScript==
// @name         Wiki.gg Additions
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  Additions to wiki.gg
// @author       Neko Boi Nick
// @match        https://wiki.gg/*
// @match        https://*.wiki.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wiki.gg
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/wikigg_additions/wikigg_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/wikigg_additions/wikigg_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  function tryGetValue(json, key, _default = null) {
    if (typeof key !== "string" && typeof key !== "number") {
      console.error(`Failed to patch json object value, typeof argument key is not string or number, got "${typeof key}"`);
      return undefined;
    }

    if (typeof json !== "object") {
      return _default;
    }

    if (!Object.hasOwn(json, key)) {
      return _default;
    }

    return json[key];
  }

  function tryParseJson(text, isArray = false) {
    let data = isArray ? [] : {};
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.debug(error);
      data = isArray ? [] : {};
    }

    return data;
  }

  function patchTableData(url, table, row, bool) {
    if (typeof url !== "string") {
      console.error(`Failed to patch table data, typeof argument url is not string, got "${typeof url}"`);
      return;
    }

    if (typeof table !== "number") {
      console.error(`Failed to patch table data, typeof argument table is not number, got "${typeof table}"`);
      return;
    }

    if (typeof row !== "number") {
      console.error(`Failed to patch table data, typeof argument row is not number, got "${typeof row}"`);
      return;
    }

    if (typeof bool !== "boolean") {
      console.error(`Failed to patch table data, typeof argument bool is not boolean, got "${typeof bool}"`);
      return;
    }

    const { config } = window.nbn;
    const data = tryParseJson(config.get("tables_to_checklist_data"));

    if (!Object.hasOwn(data, url)) {
      data[url] = {};
    }

    if (!Object.hasOwn(data[url], table)) {
      data[url][table] = {};
    }

    data[url][table][row] = bool;

    config.set("tables_to_checklist_data", JSON.stringify(data));
    config.save();
  }

  function checkboxChanged(event) {
    const target = $(event.target);
    const [index, jndex] = target.attr("id").split(/[_-]/).map((entry) => Number(entry)).filter((entry) => !isNaN(entry));
    patchTableData(unsafeWindow.location.href, index, jndex, target.prop("checked"));
  }

  function modifyTables() {
    const { config } = window.nbn;
    const data = tryParseJson(config.get("tables_to_checklist_data"));
    console.log("data", data);

    if (!config.get("tables_to_checklist").includes(unsafeWindow.location.href)) {
      return;
    }

    const currentData = tryGetValue(data, unsafeWindow.location.href, {});
    console.log("currentData", currentData);

    $("body").find("main").find("table").each((i, _table) => {
      const tableData = tryGetValue(currentData, i, {});
      console.log("tableData", tableData);
      const table = $(_table);
      const tableHead = table.find("thead");

      if (tableHead.length > 0 && tableHead.children().length > 0) {
        const tableRow = tableHead.first("tr");
        tableRow.append("<th></th>");
      }

      const tableBody = table.find("tbody");

      if (tableBody.length > 0) {
        const tableRows = tableBody.find("tr");

        tableRows.each((j, _tableRow) => {
          const rowData = tryGetValue(tableData, j, false);
          console.log("rowData", rowData);
          const tableRow = $(_tableRow);
          if (tableRow.children().first().is("th")) {
            tableRow.append("<th></th>");
          } else {
            const tableCell = $("<td></td>");
            const input = $(`<input type="checkbox" id="table-${i}_row-${j}" name="table-${i}_row-${j}" ${rowData === true ? "checked=\"\" " : ""}/>`);
            input.on("change", (event) => checkboxChanged(event));
            tableCell.append(input);
            tableRow.append(tableCell);
          }
        });
      }
    });
  }

  /**
   * Sleep until number of milliseconds are over.
   * @param {Number} ms Milliseconds to wait to continue.
   * @returns {Promise<void>} The completed sleep task.
   */
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   *
   * @param {HTMLElement} frame
   * @returns {void}
   */
  function modifyConfigFrame(frame) {
    const { config } = window.nbn;
    $(frame).attr("style", "background-color:unset !important;display:block;");
    $(frame).find(`#${config.id}_wrapper`).addClass("modal-dialog");
    const oldChildren = $(frame).find(`#${config.id}_wrapper`).find(`div[id*="${config.id}_"]:not(#${config.id}_content)`);
    const modalContent = $(`<div class="modal-content" id="${config.id}_content"></div>`);
    $(frame).find(`#${config.id}_wrapper`).append(modalContent);

    if (oldChildren.length === 0) {
      console.error("Old child elements of gmConfigFrame were not found.");
      return;
    }

    for (const [index, element] of Object.entries(oldChildren)) {
      if (isNaN(index)) {
        continue;
      }

      $(element).appendTo($(modalContent));
    }

    const header = $(modalContent).find(`#${config.id}_header`);
    const headerText = header.text();
    header.addClass("modal-header");

    header.html(`<h5 class="modal-title" id="${config.id}_label">${headerText}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`);

    const modalFooter = $(modalContent).find(`#${config.id}_buttons_holder`);
    modalFooter.addClass("modal-footer");
    const closeButton = modalFooter.find(`#${config.id}_closeBtn`);
    closeButton.attr("data-dismiss", "modal");
    closeButton.addClass("btn");
    closeButton.addClass("btn-secondary");
    const saveButton = modalFooter.find(`#${config.id}_saveBtn`);
    saveButton.addClass("btn");
    saveButton.addClass("btn-primary");
    const resetButton = modalFooter.find("div > .reset");
    resetButton.addClass("btn");
    resetButton.addClass("btn-warning");

    const sections = $(modalContent).find("div.section_header_holder, div.config_var");
    const modalBody = $("<div class=\"modal-body\"></div>");
    $(header).after(modalBody);

    for (const [index, element] of Object.entries(sections)) {
      if (isNaN(index)) {
        continue;
      }

      if ($(element).hasClass("config_var") && $(element).find("input").hasAttr("type") && $(element).find("input").attr("type") !== "hidden") {
        $(element).addClass("input-group");
        $(element).addClass("mb-3");
        let label = $(element).find("label");
        $(label).changeElementType("span");
        label = $(element).find("span");
        $(label).addClass("input-group-text");
        const input = $(element).find(`input[id*="${config.id}_field_"]`);
        $(input).addClass("form-control");
        const groupPrepend = $("<div class=\"input-group-prepend\"></div>");
        if ($(input).hasAttr("type") && $(input).attr("type") === "checkbox") {
          $(element).append(groupPrepend);
          const groupAppend = $("<div class=\"input-group-text input-group-append\"></div>");
          $(element).append(groupAppend);
          $(groupAppend).append(input);
        } else {
          $(element).prepend(groupPrepend);
        }

        $(groupPrepend).append(label);
      }

      $(element).appendTo($(modalBody));
    }
  }

  /**
   * Removes the default GM_config styles.
   * @param {GM_config} config The instance of GM_config.
   * @returns {void}
   */
  function removeDefaultConfigStyles(config) {
    // TODO: Finish this method.
    // config.frame
  }

  function init() {
    if (!Object.hasOwn(window, "nbn") || typeof window.nbn !== "object") {
      window.nbn = {
        gmConfigCSS: "",
      };
    }

    window.nbn.config = new GM_config({
      id: "Wiki_GG_Additions_Config",
      title: "Wiki.gg Additions Config",
      fields: {
        tables_to_checklist: {
          label: "Tables to checklist",
          type: "textlist",
          default: "https://abioticfactor.wiki.gg/wiki/Cooking_Guide"
        },
        tables_to_checklist_data: {
          type: "hidden",
          default: "{}"
        },
      },
      events: {
        /** @returns {void} */
        init() {
          GM_registerMenuCommand("Config", () => {
            window.nbn.config.open();
          });
          modifyTables();
          removeDefaultConfigStyles(this);
        },
        /** @returns {void} */
        open() {
          removeDefaultConfigStyles(window.nbn.config);
          modifyConfigFrame(window.nbn.config.frame);
        },
        /**
       * @param {any} val
       * @returns {void}
       */
        save(val) {
          console.debug(val);
        },
        /** @returns {void} */
        close() {
          removeDefaultConfigStyles(window.nbn.config);
        }
      },
      types: {
        textlist: {
          default: null,
          toNode(configId) {
            let { value } = this;
            const { id, create, settings: field, _default } = this;
            let listBox = null;
            let table = null;
            let thead = null;
            let tbody = null;
            let tr = null;
            let th = null;
            let td = null;
            let addInput = null;
            let addBtn = null;
            let rmBtn = null;
            const retNode = create("div", {
              className: "config_var",
              id: `${configId}_${id}_var`,
              title: field.title || "",
            });

            // Ensure typeof value is Array
            if (value.includes(",")) {
              value = value ? value.split(",") : _default;
            } else {
              value = [value];
            }

            // Create the field lable
            table = create("table", {});
            thead = create("thead", {});
            tr = create("tr", {});
            th = create("th", {});
            th.appendChild(create("label", {
              innerHTML: field.label,
              id: `${configId}_${id}_field_label`,
              for: `${configId}_field_${id}`,
              className: "field_label"
            }));
            tr.appendChild(th);
            th = null;
            th = create("th", {});
            tr.appendChild(th);
            thead.appendChild(tr);
            tr = null;
            table.appendChild(thead);
            thead = null;
            tbody = create("tbody", {});
            tr = create("tr", {});
            td = create("td", {});

            listBox = create("select", {
              id: `${configId}_field_${id}`,
              style: "width:-moz-available",
              size: 5
            });
            // Create the inputs for each part of the date
            for (let i = 0, len = value.length; i < len; ++i) {
              const props = {
                id: `${configId}_field_${id}_${i}`,
                value: value ? value[i] : "",
                innerText: value ? value[i] : "",
              };

              // Actually create and append the input element
              listBox.appendChild(create("option", props));
            }

            td.appendChild(listBox);
            tr.appendChild(td);
            td = null;
            td = create("td", {
              style: "vertical-align:top",
            });
            rmBtn = create("button", {
              type: "button",
              id: `${configId}_field_${id}_rm_btn`,
              innerText: "-",
              onclick(e) {
                $(e.target).parents().find("table").find("select").find("option:selected").remove();
              },
            });
            td.appendChild(rmBtn);
            tr.appendChild(td);
            td = null;
            tbody.appendChild(tr);
            tr = null;
            tr = create("tr", {});
            td = create("td", {});
            addInput = create("input", {
              type: "text",
              id: `${configId}_field_${id}_add_input`,
              style: "width:-moz-available",
            });
            td.appendChild(addInput);
            tr.appendChild(td);
            td = null;
            td = create("td", {});
            addBtn = create("button", {
              type: "button",
              id: `${configId}_field_${id}_add_btn`,
              innerText: "+",
              onclick(e) {
                const table = $(e.target).parents().find("table");
                const select = $(table).find("select");
                const add = $(table).find("input[type=\"text\"]");
                const i = $(select).find("option").length - 1;
                select.append(create("option", {
                  id: `${configId}_field_${id}_${i}`,
                  value: add.val(),
                  innerText: add.val(),
                }));
              },
            });
            td.appendChild(addBtn);
            tr.appendChild(td);
            tbody.appendChild(tr);
            tr = null;
            table.appendChild(tbody);
            tbody = null;
            retNode.appendChild(table);
            table = null;
            return retNode;
          },
          toValue() {
            let rval = this.value;
            if (this.wrapper) {
              rval = $(this.wrapper).find("select").find("option").map((_, option) => option.value).get().join(",");
            }

            // We are just returning a string to be saved
            // If you want to use this value you'll want a Date object
            return rval;
          },
          reset() {
            // Empty all the input fields
            if (this.wrapper) {
              $(this.wrapper).find("select").find("option").remove();
            }
          },
        },
        hidden: {
          default: null,
          toNode(configId) {
            const { value, id, create, _default } = this;
            const retNode = create("div", {
              className: "config_var",
              id: `${configId}_${id}_var`,
              style: "display:none",
            });
            retNode.appendChild(create("input", {
              id: `${configId}_field_${id}`,
              value: value ? value : _default,
            }));
            return retNode;
          },
          toValue() {
            const { value } = this;
            return this.wrapper ? $(this.wrapper).find("input").val() : value;
          },
          reset() {
            const { _default } = this;
            if (this.wrapper) {
              $(this.wrapper).find("input").val(_default);
            }
          },
        },
      },
    });
  }

  init();
});
