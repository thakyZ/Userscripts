import { jQuery, modifyModAuthorName, modifyModName } from "../../library/index.js";

jQuery(($) => {
  const getModAuthor = () => modifyModAuthorName($(".author").text());

  const getModName = () => modifyModName($(".page-title .active").text());

  function callback(mutationList: MutationRecord[]) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if ($(mutation.target).attr("id") === "__next") {
          const downloadsButton = $(".downloads");

          if ($(downloadsButton).length <= 0) {
            return;
          }

          $(downloadsButton).on("click", () => {
            GM_setClipboard(`[${getModAuthor()}] ${getModName()}`);
          });
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("#__next")[0];
    const config = { attributes: false, childList: true, subtree: true };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
