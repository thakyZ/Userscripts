// - The @grant directives are needed to restore the proper sandbox.
/* global waitForKeyElements */
import jQuery from "jquery";

jQuery(($) => {
  function removeFallback() {
    const elements = $(".us-stylecard--short .fallbackDiv");
    $(elements).each((_, element) => {
      element.parent().css({ display: "none" });
    });
  }

  waitForKeyElements(".fallbackDiv", removeFallback, true);
});
