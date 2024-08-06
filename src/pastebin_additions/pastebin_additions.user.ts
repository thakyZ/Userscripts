import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  function checkForProgress(ele) {
    if (/%\[\d+\/\d+\]/gi.test($(ele).html())) {
      $(ele).html($(ele).html().replaceAll(/%\[(\d+)\/(\d+)\]/gi, "<progress value=\"$1\" max=\"$2\"/>"));
    }
  }

  function init() {
    const variableHeader = $(".source.markdown");
    $(variableHeader).each(function () {
      checkForProgress($(this));
    });
  }

  init();
});
