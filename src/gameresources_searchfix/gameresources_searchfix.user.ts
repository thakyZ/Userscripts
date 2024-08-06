import jQuery from "jquery";

// cSpell:ignoreRegExp /(?<=#)headerad/

jQuery(($) => {
  const headerAd = $("#headerad");
  // Window.getComputedStyle(x).visibility === "hidden"
  if ($(headerAd).length === 1 && window.getComputedStyle(headerAd[0]).display === "none") {
    $("<div style=\"padding: 0.1px;\"></div>").insertAfter(headerAd[0]);
  }
});
