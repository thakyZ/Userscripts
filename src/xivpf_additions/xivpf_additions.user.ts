import jQuery from "jquery";
import { isString, isNotANumber } from "library/index.js";
import { State, DataCenters, ListItemValues, DataCenterWorldType } from "./classes.js";
import List from "list.js";

jQuery(($) => {
  "use strict";

  let stateWasNull = false;

  const state: State = {
    allowed: [],
    centre: "All",
    list: null,
    lang: null,
  };

  function getJsClass(): boolean {
    return document.children[0].className === "js";
  }

  function loadState() {
    const storageString: string | null = localStorage.getItem("state");
    let saved: State = ({} as State);

    if (storageString === null) {
      stateWasNull = true;
    } else {
      try {
        saved = JSON.parse(storageString);

        if (!Array.isArray(saved.allowed!)) {
          saved = state;
          stateWasNull = true;
        }
      } catch (error) {
        saved = state;
        stateWasNull = true;
        console.error(error);
      }

      for (const key in saved) {
        if (Object.hasOwn(saved, key)) {
          (state as Record<keyof State, any>)[key as keyof typeof saved] = saved[key as keyof typeof saved];
        }
      }
    }

    if (stateWasNull) {
      console.warn("state was null.");
    }
  }

  function setUpList() {
    const options: List.ListOptions = {
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

  function convertDataCenterToRegion(values: ListItemValues) {
    let output = false;

    if (state.centre === "NA" && (values.centre === "Aether" || values.centre === "Crystal" || values.centre === "Dynamis" || values.centre === "Primal")) {
      output = true;
    } else if (state.centre === "EU" && (values.centre === "Chaos" || values.centre === "Light")) { // NOSONAR
      output = true;
    } else if (state.centre === "JA" && (values.centre === "Elemental" || values.centre === "Gaia" || values.centre === "Mana" || values.centre === "Meteor")) { // NOSONAR
      output = true;
    } else if (state.centre === "OC" && (values.centre === "Materia")) { // NOSONAR
      output = true;
    } // NOSONAR

    return output;
  }

  function refilter() {
    function categoryFilter(item: List.ListItem) {
      const category: PartyFinderCategory | undefined = item.elm.dataset["pfCategory"];

      return typeof category !== "undefined" && (category === "unknown" || state.allowed.includes(category));
    }

    function dataCentreFilter(values: ListItemValues) {
      return state.centre === "All" || state.centre === values.centre || convertDataCenterToRegion(values);
    }

    state.list?.filter((item) => dataCentreFilter((item.values() as ListItemValues)) && categoryFilter(item));
  }

  // Fetched from: https://www.freecodecamp.org/news/how-to-capitalize-words-in-javascript/#iterate-over-each-word
  function capitalizeSentence(text: string): string {
    const words = text.split(" ");

    for (let i: number = 0; i < words.length; i++) {
      words[i] = `${words[i][0].toUpperCase()}${words[i].substring(1)}`;
    }

    return words.join(" ");
  }

  function getTotalListings<TElement extends Element = HTMLElement>(optgroup: TElement): number {
    const options = $<TElement>(optgroup).find<HTMLOptionElement>("option");
    let total = -1;

    for (const [key, option] of Object.entries(options)) {
      if (isNotANumber(key)) {
        continue;
      }

      const numMatch = $(option).text().match(/(\d+)/);

      if (numMatch !== null && !isNotANumber(numMatch[0])) {
        total += parseInt(numMatch[0], 10);
      }
    }

    return total === -1 ? total : (total + 1);
  }

  function setUpNewDataCentreFilter() {
    const select = $("#data-centre-filter");

    for (const [key, optgroup] of Object.entries($(select).find("optgroup"))) {
      if (isNotANumber(key)) {
        continue;
      }

      const label = $(optgroup).attr("label");

      if (typeof label === "undefined") {
        continue;
      }

      let transformValue: string | null = "";

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
          transformValue = null;
          break;
      }

      const newOption = `<option value="${transformValue}">${capitalizeSentence(label)} (${getTotalListings(optgroup)})</option>`;

      if (transformValue !== null) {
        $(optgroup).prepend($(newOption));
      }
    }
  }

  function setUpDataCentreFilter() {
    const select = $("#data-centre-filter");

    const dataCentres: DataCenters = ({} as DataCenters);

    for (const [key, elem] of Object.entries($("#listings > .listing"))) {
      if (isNotANumber(key)) {
        continue;
      }

      const centre: DataCenterWorldType = (elem.dataset["centre"] as DataCenterWorldType);

      if (!Object.hasOwn(dataCentres, centre)) {
        dataCentres[centre] = 0;
      }

      dataCentres[centre] += 1;
    }

    for (const [key, opt] of Object.entries($(select).find<HTMLOptionElement>("options"))) {
      if (isNotANumber(key)) {
        continue;
      }

      const centre: DataCenterWorldType = (opt.value as DataCenterWorldType);

      let count = 0;

      if (Object.hasOwn(dataCentres, centre)) {
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
      const value = $(select).val();

      if (isString(value)) {
        state.centre = (value as DataCenterWorldType);
      }

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
