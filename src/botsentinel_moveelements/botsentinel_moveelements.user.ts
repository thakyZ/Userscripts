import { _jQuery as jQuery } from "../../library/index.js";

jQuery(($) => {
  "use strict";
  let id = -1;
  id = setInterval(() => {
    const div = $("div.bot-sentinel-account-status");

    if (div.length > 0) {
      /* Unknown code.
       * $(div).each((i, e) => {
       *   const divPrev = $(e).prev();
       *   if ($(divPrev).text().match("^@[a-zA-Z0-9]+") && $(divPrev).find("a[tabindex=\"-1\"") !== undefined) {
       *
       *   }
       * });
       */
      $(div).css({ "max-height": "20px" });
      clearInterval(id);
    }
  }, 100);
});
