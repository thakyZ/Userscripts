// ==UserScript==
// @name         Truth Table Button Tooltips
// @namespace    NekoBoiNick.Web
// @version      1.0.0
// @description  I kept forgetting what each symbol meant, indiscrimanently, so I made this.
// @author       Neko Boi Nick
// @match        https://truth-table.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=truth-table.com
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  const dictionary = {
    "¬": "NOT",
    "∧": "AND",
    "⊼": "NAND",
    "∨": "OR",
    "⊽": "NOR",
    "→": "Therfore [!(A && !B)]",
    "↔": "XNOR",
    "⇹": "Partial Equivalence Relation [A == B, B == A]",
    "(": "Group Start",
    ")": "Group End",
    ",": "",
    0: "Constant 0",
    1: "Constant 1",
    A: "Variable A",
    B: "Variable B",
    C: "Variable C",
    "⌫": "Delete",
  };
  document.querySelectorAll("main div.flex.flex-col > div.flex-row:nth-child(3) > button").forEach((element, index) => {
    console.debug({ index, element });

    if (!Object.hasOwn(dictionary, element.innerText)) {
      console.warn(`Found unknown symbol "${element.innerText}". please report this to the script author`);
      return;
    }

    element.setAttribute("title", dictionary[element.innerText]);
  });
})();
