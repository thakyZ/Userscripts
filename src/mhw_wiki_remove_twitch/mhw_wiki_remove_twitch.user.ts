// - The @grant directives are needed to restore the proper sandbox.
/* waitForKeyElements */
import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  const setupMyClass = jNode => {
    const flexWrapper = $(jNode).width();
    const margin = 15;
    const pageContentWrapperWidth = $("#page-content-wrapper").width();
    const setToWidthPageContentWrapper = flexWrapper - (margin * 2);
    const setToMarginPageContentWrapper = (flexWrapper - pageContentWrapperWidth) - margin;
    $("#page-content-wrapper").css("margin-left", (setToMarginPageContentWrapper * -1) + "px");
    $("#page-content-wrapper").css("width", setToWidthPageContentWrapper + "px");
  };

  waitForKeyElements(".Page404", setupMyClass, true);
});
