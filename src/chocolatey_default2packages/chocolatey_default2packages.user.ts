import { _jQuery as jQuery } from "../library/index.js";

jQuery(() => {
  "use strict";

  async function redirect() {
    if (/^https:\/\/(?:community\.)?chocolatey.org\/?\??/i.test(window.location.href)) {
      if (document.referrer !== "" && !/chocolatey.org/.test(document.referrer)) {
        window.location.href = "https://community.chocolatey.org/packages";
      }
    }
  }

  (async function () {
    await redirect();
  })();
});
