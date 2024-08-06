import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  const anchors = $("a");
  const regex = /^https?:\/\/(np|old)\.reddit\.com/i;
  for (const [, anchor] of Object.entries(anchors)) {
    const attr = $(anchor).attr("href");
    if (typeof attr !== "undefined" && attr !== false && regex.test($(anchor).attr("href"))) {
      $(anchor).attr("href", $(anchor).attr("href").replace(regex, "https://reddit.com"));
    }

    if (regex.test($(anchor).text())) {
      $(anchor).text($(anchor).text().replace(regex, "https://reddit.com"));
    }
  }
});
