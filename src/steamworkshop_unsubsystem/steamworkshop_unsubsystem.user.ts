import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  function unSubSystematically() {
    const subbedMods = $("[class^='general_btn subscribe toggled']").children();
    $(subbedMods).each((index, element) => {
      $(element).trigger("click");
      if (index >= $(subbedMods).length - 1) {
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    });
  }

  function addButton() {
    const buttonHtml = "<span class=\"general_btn subscribe\"><div class=\"unsubscribeIcon\"></div><span>Unsubscribe Individually</span></span>";
    const button = $(buttonHtml);
    $(".subscribeCollection > div[style^=\"clear: right\"]").before($(button));
    $(button).on("click", unSubSystematically);
  }

  function run() {
    const collectionTest = $(".collectionChildren");
    if ($(collectionTest).length > 0) {
      addButton();
    }
  }

  run();
});
