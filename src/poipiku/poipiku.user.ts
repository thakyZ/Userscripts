// - The @grant directives are needed to restore the proper sandbox.
import jQuery from "jquery";

jQuery(($) => {
  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        $("body, .Wrapper").each((_, element) => {
          element.addEventListener("contextmenu", (event) => {
            event.stopImmediatePropagation();
          }, { capture: true });
          element.addEventListener("drag", (event) => {
            event.stopImmediatePropagation();
          }, { capture: true });
          element.addEventListener("dragstart", (event) => {
            event.stopImmediatePropagation();
          }, { capture: true });
          element.addEventListener("copy", (event) => {
            event.stopImmediatePropagation();
          }, { capture: true });
        });
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
  GM_addStyle("*{user-select:text !important;-webkit-user-select:text !important;-moz-user-select:text !important !important;-ms-user-select:text !important;-webkit-touch-callout:text !important}");
});
