import { _jQuery as jQuery } from "../../library/index.js";

jQuery(($) => {
  "use strict";

  // Code to add getting all attributes from elements.
  (function (old) {
    $.fn.attr = function (...args) {
      if (args.length === 0) {
        if (this.length === 0) {
          return null;
        }

        const obj = {};
        $.each(this[0].attributes, function () {
          if (this.specified) {
            obj[this.name] = this.value;
          }
        });
        return obj;
      }

      return old.apply(this, args);
    };
  })($.fn.attr);

  const newSpoilerTag = $("<div></div>");
  const oldSpoilerTag = $("#BBCBox_message_button_1_21");
  $.each($(oldSpoilerTag).attr().items, (key, value) => {
    $(newSpoilerTag).attr(key, value);
  });

  $(newSpoilerTag).text("Spoiler");
  $(newSpoilerTag).css({
    backgroundSize: "cover",
    backgroundColor: "#E4E4E4 !important",
    color: "#000 !important",
    padding: "1px 2px 1px 2px !important",
    fontSize: "12px !important",
    border: "1px #BBB solid !important",
    marginTop: "0px !important",
    minHeight: "22px !important",
    display: "inline-block !important",
  });
  $(newSpoilerTag).on("mouseover", () => {
    $(this).css("background-image");
    $(this).css({ backgroundColor: "#58BE5E !important" });
    this.instanceRef.handleButtonMouseOver(this);
  });
  $(newSpoilerTag).on("mouseover", () => {
    $(this).css("background-image");
    $(this).css({ backgroundColor: "#E4E4E4 !important" });
    this.instanceRef.handleButtonMouseOver(this);
  });

  $(oldSpoilerTag).replaceWith(newSpoilerTag);
});
