// ==UserScript==
// @name         DOL SOUp
// @namespace    Soup
// @version      2024-10-20
// @description  try to take over the world!
// @author       You
// @match        https://*.dolmods.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dolmods.net
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
#passages.fontSize20 {
  margin: 5em;
  min-width: -moz-available;
}
.passage {
}
.fontSize20 > .passage,
.fontSize20 > .passage > div[class*="main-"] {
  font-size: 40px;
  line-height: 100%;
}
.fontSize20 > .passage > a,
.fontSize20 > .passage > span,
.fontSize20 > .passage > div:not([class*="main-"]),
.fontSize20 > .passage > div[class*="main-"] > a,
.fontSize20 > .passage > div[class*="main-"] > span,
.fontSize20 > .passage > div[class*="main-"] > div {
  font-size: 20px !important;
}

`);
})();
