// The @grant directives are needed to restore the proper sandbox.
import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  const debug = true;
  $(document).ready(() => {
    ($ => {
      $.fn.detectOriginalText = $class => {
        if (debug) {
          console.log("detectedStrings : " + $($class).length);
        }

        return $($class);
      };
    })(jQuery);

    $(document).detectOriginalText(".search-Form_UseRangeLabel").each(function () {
      switch ($(this).text()) {
        case "個人":
          $(this).text("Personal");
          break;
        case "非商用":
          $(this).text("Non-commercial");
          break;
        case "商用":
          $(this).text("Commercial");
          break;
        case "加工":
          $(this).text("Processing");
          break;
        default:
          break;
      }
    });
  });
});
