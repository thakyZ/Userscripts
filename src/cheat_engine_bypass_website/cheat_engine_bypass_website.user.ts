import { _jQuery as jQuery } from "../library/index.js";

jQuery(($) => {
  "use strict";

  const skipButtonClass = ".skip_button";
  const urlCheck = /^https?:\/\/ffsrchmgr\.com\/\d+\/\w+(?:\?install_id=.+)?$/i;

  const loc = window.location.href;

  if (urlCheck.test(loc)) {
    const test = $<HTMLElement>(skipButtonClass);

    if (test.html().includes("Skip")) {
      setTimeout(() => {
        $(skipButtonClass).trigger("click");
      }, 1000);
    }
  }
});
