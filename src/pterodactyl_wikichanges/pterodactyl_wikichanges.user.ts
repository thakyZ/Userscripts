import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  GM_addStyle(GM_getResourceText("css"));

  const mdiContentCopy = "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z";

  const createSVG = () => `<svg viewbox="0 0 24 24" width="0.875rem" height="0.875rem" fill="#fff"><path d="${mdiContentCopy}"/></svg>`;

  function modifyCodeBox(codeBox, codes) {
    const parent = $(codeBox).parent().parent();
    const container = $("<div class=\"codebox_buttons\"></div>");
    $(container).insertBefore($(parent));
    $(parent).prependTo($(container));
    const buttons = $("<div class=\"buttons\"></div>");
    $(container).prepend($(buttons));
    for (const element of codes) {
      const row = $("<div class=\"row\"></div>");
      if (element !== "") {
        const copyButton = $(`<button id="copyLine2">${createSVG()}</button>`);
        $(row).append($(copyButton));
        $(copyButton).data("code", element);
        $(copyButton).on("click", (event) => {
          GM_setClipboard($(event.currentTarget).data().code);
        });
      }

      $(buttons).append($(row));
    }
  }

  function addCopyButtons(codeBox) {
    const code = $(codeBox).html().split("\n");
    const codes = [];
    for (const element of code) {
      let coded = element.replaceAll(/<span class="token comment">.*<\/span>/gi, "");
      coded = coded.replaceAll(/<span class="token(?: [\w-]+){1,2}"><span class="token(?: [\w-]+){1,2}">(.*?)(?:<\/span>){1,2}/gi, "$1");
      coded = coded.replaceAll(/<span class="token(?: [\w-]+){1,2}">(.+?)((<\/span>){1,2}|<span class="token(?: [\w-]+){1,2}">)/gi, "$1");
      codes.push(coded.trim());
    }

    if (codes.slice(-1)[0] === "") {
      codes.pop();
    }

    modifyCodeBox(codeBox, codes);
  }

  function detectScriptBoxes() {
    const codeBoxes = $(".content > div[class*=\"language-\"] > pre[class*=\"language-\"]:not(.language-text) code");
    if (codeBoxes.length > 0) {
      $(codeBoxes).each((index, element) => {
        addCopyButtons(element);
      });
    }
  }

  function setupMutationObserver() {
    const targetNode = $("#app")[0];
    const config = { attributes: true, childList: true, subtree: true };

    function callback(mutationList) {
      for (const mutation of mutationList) {
        console.log(mutation);
        if (mutation.type === "childList") {
          if ($(mutation.target).hasClass("theme-container") || $(mutation.target).hasClass("global-ui") || $(mutation.target).hasClass("page")) {
            detectScriptBoxes();
          }
        }
      }
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
  detectScriptBoxes();
});
