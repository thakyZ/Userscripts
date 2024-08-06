/* global waitForKeyElements */
import jQuery from "jquery";

jQuery(($) => {
  const debug = false;

  function setupMyClass(jNode) {
    const regex = /^https:\/\/imgur\.com\/user\/[a-zA-Z0-9]+\/favorites\/folder\/\d+\/[a-zA-Z0-9]+\//g;
    const address = window.location.href;
    const element = $(jNode);

    if (element.length > 0) {
      if (debug) {
        console.log("length > 0");
        console.log(address);
        console.log(regex.test(address));
      }

      if (regex.test(address)) {
        window.location.assign(address.replace(regex, "https://imgur.com/a/"));
      }
    }
  }

  waitForKeyElements(".Page404", setupMyClass, true);
});
