/* global $, jQuery */
import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  const adBoard = $("main.container .row.p-1");
  if (adBoard.length > 0) {
    adBoard.hide();
  }
});
