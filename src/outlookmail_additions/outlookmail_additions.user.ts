import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if ($(mutation.target).is("section[aria-label=\"Section details\"] > div:last-child > div") || $(mutation.target).is("section[aria-label=\"Section details\"]")) {
          // Do nothing.
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
