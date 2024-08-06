import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  const regex = /^https?:\/\/(www\.)?jdoqocy\.com\/click(-\d+-\d+)\?URL=/g;
  for (const [, link] of Object.entries($("a"))) {
    if (regex.test($(link).attr("href"))) {
      $(link).attr("href", decodeURIComponent($(link).attr("href").replace(regex, "")));
    }
  }
});
