// ==UserScript==
// @name         XIV Party Finder Additions
// @namespace    NekoBoiNick.Web.XIVPF.Additions
// @version      1.0.1
// @description  Adds some additional feature to Ko-Fi
// @author       Neko Boi Nick
// @match        https://xivpf.com/listings
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xivpf.com
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/xivpf_additions/xivpf_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/xivpf_additions/xivpf_additions.user.js
// ==/UserScript==
/* global jQuery, List */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  "use strict";

  /* eslint-disable-next-line no-unused-vars */
  let stateWasNull = false;

  const state = {
    allowed: [],
    centre: "All",
    list: null,
    lang: null,
  };

  function getJsClass() {
    return document.children[0].className === "js";
  }

  function loadState() {
    let saved = localStorage.getItem("state");

    if (saved === null) {
      stateWasNull = true;
    } else {
      try {
        saved = JSON.parse(saved);
        if (!Array.isArray(saved.allowed)) {
          saved = {};
          stateWasNull = true;
        }
      } catch (error) {
        saved = {};
        stateWasNull = true;
        console.error(error);
      }

      for (const key in saved) {
        if (Object.prototype.hasOwnProperty.call(saved, key)) {
          state[key] = saved[key];
        }
      }
    }
  }

  function setUpList() {
    const options = {
      valueNames: [
        "duty",
        "creator",
        "description",
        { data: ["centre"] },
      ],
    };
    const list = new List("container", options);
    return list;
  }

  function convertDataCenterToRegion(item) {
    let output = false;

    if (state.centre === "NA" && (item.values().centre === "Aether" || item.values().centre === "Crystal" || item.values().centre === "Dynamis" || item.values().centre === "Primal")) {
      output = true;
    } else if (state.centre === "EU" && (item.values().centre === "Chaos" || item.values().centre === "Light")) { // NOSONAR
      output = true;
    } else if (state.centre === "JA" && (item.values().centre === "Elemental" || item.values().centre === "Gaia" || item.values().centre === "Mana" || item.values().centre === "Meteor")) { // NOSONAR
      output = true;
    } else if (state.centre === "OC" && (item.values().centre === "Materia")) { // NOSONAR
      output = true;
    } // NOSONAR

    return output;
  }

  function refilter() {
    function categoryFilter(item) {
      const category = item.elm.dataset.pfCategory;

      return category === "unknown" || state.allowed.includes(category);
    }

    function dataCentreFilter(item) {
      return state.centre === "All" || state.centre === item.values().centre || convertDataCenterToRegion(item);
    }

    state.list.filter((item) => dataCentreFilter(item) && categoryFilter(item));
  }

  /* eslint-disable no-extend-native */
  // Fetched from: https://www.freecodecamp.org/news/how-to-capitalize-words-in-javascript/#iterate-over-each-word
  String.prototype.capitalizeSentence = function () {
    const words = this.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  };
  /* eslint-enable no-extend-native */

  function getTotalListings(optgroup) {
    const options = $(optgroup).find("option");
    let total = -1;

    for (const [key, option] of Object.entries(options)) {
      if (isNaN(key)) {
        break;
      }

      const numMatch = $(option).text().match(/(\d+)/i)[0];
      if (!isNaN(numMatch)) {
        total += parseInt(numMatch, 10);
      }
    }

    return total === -1 ? total : (total + 1);
  }

  function setUpNewDataCentreFilter() {
    const select = $("#data-centre-filter");
    for (const [key, optgroup] of Object.entries($(select).find("optgroup"))) {
      if (isNaN(key)) {
        break;
      }

      const label = $(optgroup).attr("label");
      let transformValue = "";

      switch (label) {
      case "north america":
        transformValue = "NA";
        break;
      case "europe":
        transformValue = "EU";
        break;
      case "japan":
        transformValue = "JA";
        break;
      case "oceania":
        transformValue = "OC";
        break;
      default:
        transformValue = undefined;
        break;
      }

      const newOption = `<option value="${transformValue}">${label.capitalizeSentence()} (${getTotalListings(optgroup)})</option>`;

      if (typeof transformValue !== "undefined") {
        $(optgroup).prepend($(newOption));
      }
    }
  }

  function setUpDataCentreFilter() {
    const select = $("#data-centre-filter");

    const dataCentres = {};

    for (const [key, elem] of Object.entries($("#listings > .listing"))) {
      if (isNaN(key)) {
        break;
      }

      const { centre } = elem.dataset;

      if (!Object.prototype.hasOwnProperty.call(dataCentres, centre)) {
        dataCentres[centre] = 0;
      }

      dataCentres[centre] += 1;
    }

    for (const [key, opt] of Object.entries($(select).find("options"))) {
      if (isNaN(key)) {
        break;
      }

      const centre = opt.value;

      let count = 0;

      if (Object.prototype.hasOwnProperty.call(dataCentres, centre)) {
        count = dataCentres[centre];
      }

      if (centre === "All") {
        count = Object.values(dataCentres).reduce((a, b) => a + b, 0);
      }

      opt.innerText += ` (${count})`;
    }

    $(select).on("change", (event) => {
      event.stopPropagation();
      event.preventDefault();
      state.centre = $(select).val();
      refilter();
    });
  }

  if (getJsClass()) {
    loadState();
    state.list = setUpList();
    setUpNewDataCentreFilter();
    setUpDataCentreFilter();
    refilter();
  }
});
