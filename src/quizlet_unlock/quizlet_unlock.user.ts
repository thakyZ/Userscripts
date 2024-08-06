import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  function hideLoginButton() {
    const element = $(".LoginBottomBar").parent();
    if ($(element).css("display") !== "none") {
      $(element).attr("style", `${$(element).attr("style")};display:none !important;`);
    }
  }

  function deblurTerms() {
    const children = $(".SetPageTerms-term").children().children().children().children().children();
    for (const [index, element] of Object.entries(children)) {
      if (!isNaN(index) && $(element).css("filter") !== "none") {
        $(element).attr("style", `${$(element).attr("style")};filter:none !important;`);
      }
    }
  }

  function showAllTerms() {
    const terms = $(".SetPageTerm");
    for (const [index, element] of Object.entries(terms)) {
      if (!isNaN(index) && !$(element).hasClass("is-showing")) {
        $(element).add("class", "is-showing");
        console.log("Found broken page");
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    function callback(mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes" || mutation.type === "childList" || mutation.type === "subtree") {
          hideLoginButton();
          deblurTerms();
          showAllTerms();
        }
      }
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  let id = -1;
  id = setInterval(() => {
    if ($("body").length > 0) {
      setupMutationObserver();
      clearInterval(id);
    }
  }, 100);

  hideLoginButton();
  deblurTerms();
  showAllTerms();
});
