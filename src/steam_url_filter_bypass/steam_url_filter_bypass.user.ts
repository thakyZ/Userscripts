
(function () {
  "use strict";

  const regex = /^https:\/\/steamcommunity\.com\/linkfilter\//i;

  if (window.location.href.includes("/linkfilter/")) {
    if (window.location.href.includes("?url=")) {
      window.location.href = window.location.href.replace(/\?url=/g, "");
    }

    console.log(`Transfering to: https://${location.replace(regex, "")}`);
    window.location.assign(`https://${location.replace(regex, "")}`);
  }
})();
