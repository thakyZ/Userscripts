import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  function removeResize(element, attribute) {
    if (element.length > 0) {
      const matches = $(element).attr(attribute).match(/(\?width=\d+&height=\d+)/i);

      if (matches !== null && matches.length >= 1) {
        $(element).attr(attribute, $(element).attr(attribute).replace(matches[0], ""));
      }
    }
  }

  function main() {
    const hasFocusLockDialog = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]").length === 1;

    if (hasFocusLockDialog) {
      const focusBox = $("div[class*=\"focusLock-\"][role=\"dialog\"][aria-label=\"Image\"]");
      if (focusBox.length > 0) {
        const image = focusBox.find("div[class*=\"imageWrapper-\"]").find("img");
        if (image.length > 0) {
          removeResize(image, "src");
        } else {
          const gif = focusBox.find("video[aria-label=\"GIF\"]").parent().parent().find("a");
          const gifVideo = focusBox.find("video[aria-label=\"GIF\"]");
          removeResize(gif, "href");
          removeResize(gifVideo, "poster");
        }
      }
    }
  }

  function setupMutationObserver() {
    const config = { attributes: true, subtree: true, };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      main();
      observer.observe(document, config);
    });

    observer.observe(document, config);
  }

  setupMutationObserver();
});
