import { JQuery, jQuery } from "../../library/index.js";

jQuery(($) => {
  "use strict";

  const links: JQuery<HTMLAnchorElement> = $<HTMLAnchorElement>("a");
  const regex: RegExp = /^https?:\/\/adfoc\.us\/serve\/sitelinks\/\?id=\d*&url=/g;

  for (let i = 0; i < $(links).length; i++) {
    const attribute: string | undefined = $(links[i]).attr("href");

    if (attribute && regex.test(attribute)) {
      $(links[i]).attr("href", attribute.replace(regex, ""));
    }
  }
});
