import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  if (/https:\/\/(?:www\.)?youtube\.com\/watch\?.+/i.test(window.location.href)) {
    /* Attempt to add to DOM every 100ms */
    const id = setInterval(() => {
      const div = $("tp-yt-iron-dropdown tp-yt-paper-listbox[id=\"items\"].ytd-menu-popup-renderer");

      if (div.length > 0) {
        /* Create button */
        const btn = $("<ytd-menu-service-item-renderer class=\"style-scope ytd-menu-popup-renderer iron-selected\" use-icons=\"\" system-icons=\"\" role=\"menuitem\" tabindex=\"-1\" aria-selected=\"true\"><tp-yt-paper-item class=\"style-scope ytd-menu-service-item-renderer\" style-target=\"host\" role=\"option\" tabindex=\"0\" aria-disabled=\"false\"><yt-icon class=\"style-scope ytd-menu-service-item-renderer\"><svg viewBox=\"0 0 24 24\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\" class=\"style-scope yt-icon\" style=\"pointer-events: none; display: block; width: 100%; height: 100%;\"><g class=\"style-scope yt-icon\"><path d=\"M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z\" class=\"style-scope yt-icon\"></path></g></svg></yt-icon><yt-formatted-string class=\"style-scope ytd-menu-service-item-renderer\">Download M4A</yt-formatted-string><ytd-badge-supported-renderer class=\"style-scope ytd-menu-service-item-renderer\" disable-upgrade=\"\" hidden=\"\"></ytd-badge-supported-renderer></tp-yt-paper-item></ytd-menu-service-item-renderer>");

        $(btn).insertAfter(div.children()[div.children().length - 1]);

        if ($("yt-formatted-string.ytd-menu-service-item-renderer", $(btn)).attr("is-empty") !== undefined) {
          $("yt-formatted-string.ytd-menu-service-item-renderer", $(btn)).removeAttr("is-empty");
          $("yt-formatted-string.ytd-menu-service-item-renderer", $(btn)).text("Download M4A");
        }

        if ($("yt-icon svg", $(btn)).length === 0) {
          $("yt-icon", $(btn)).html("<svg viewBox=\"0 0 24 24\" preserveAspectRatio=\"xMidYMid meet\" focusable=\"false\" class=\"style-scope yt-icon\" style=\"pointer-events: none; display: block; width: 100%; height: 100%;\"><g class=\"style-scope yt-icon\"><path d=\"M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z\" class=\"style-scope yt-icon\"></path></g></svg>");
        }

        const dropdownBox = $("tp-yt-iron-dropdown ytd-menu-popup-renderer[slot=\"dropdown-content\"]");

        $(dropdownBox).css({ maxHeight: `${parseInt($(dropdownBox).css("max-height").replace("px", ""), 10) + 36}px`,
          maxWidth: `${parseInt($(btn).css("width").replace("px", ""), 10)}px` });

        const dropdownContainer = $(dropdownBox).parents().find("tp-yt-iron-dropdown")[1];

        $(dropdownContainer).css({ top: `${parseInt($(dropdownContainer).css("top").replace("px", ""), 10) - 36}px` });

        /* Trigger protocol handler */
        $(btn).on("click", () => {
          console.log(`ytdl:-x --audio-format m4a --audio-quality 0 --no-color ${window.location.href}`);
          window.open(`ytdl:-x --audio-format m4a --audio-quality 0 --no-color ${window.location.href}`, "_blank");
        });
        clearInterval(id);
      }
    }, 100);
  }
});
