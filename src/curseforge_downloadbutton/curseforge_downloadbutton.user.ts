import { isNotANumber, jQuery, JQuery } from "../../library/index.js";

jQuery(($) => {
  function isOnFileDL(mutation: MutationRecord) {
    return $("section.file-details", $(mutation.target)).length > 0;
  }

  function callback(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && $(mutation.target).attr("class") === "tab-content") {
        if (isOnFileDL(mutation) && $("div#menuButton button span").text() === "InstallInstall") {
          if ($(mutation.target).find("section.file-details h2 #menuButton").length > 0) {
            const moreOptionsButton: JQuery<HTMLButtonElement> = $(mutation.target).find<HTMLButtonElement>("section.file-details h2 #menuButton button:not(\".btn-more-options\")");
            moreOptionsButton.off("click");
            moreOptionsButton.html("");
            const anchor: JQuery<HTMLAnchorElement> = $(mutation.target).find<HTMLAnchorElement>("section.file-details h2 #menuButton .more-options li:last-child a");
            moreOptionsButton.html(anchor.html());
            moreOptionsButton.on("click", function (event: MouseEvent) {
              if (event.target === null) return;
              event.stopPropagation();
              const anchor: JQuery<HTMLAnchorElement> = $(event.target).find<HTMLAnchorElement>("section.file-details h2 #menuButton .more-options li:last-child a");
              const href: string | undefined = anchor.attr("href");
              window.open();
            });
          }
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode: HTMLElement = $<HTMLElement>("section.tab-content")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  if ($<HTMLElement>(".project-header .actions #menuButton").length > 0) {
    $<HTMLButtonElement>(".project-header .actions #menuButton button:not(\".btn-more-options\")").off("click");
    $<HTMLButtonElement>(".project-header .actions #menuButton button:not(\".btn-more-options\")").html("");
    $<HTMLButtonElement>(".project-header .actions #menuButton button:not(\".btn-more-options\")").html($<HTMLAnchorElement>(".project-header .actions #menuButton .more-options li:last-child a").html());
    $<HTMLButtonElement>(".project-header .actions #menuButton button:not(\".btn-more-options\")").on("click", (event) => {
      event.stopPropagation();
      window.open($<HTMLAnchorElement>(".project-header .actions #menuButton .more-options li:last-child a").attr("href"));
    });
    if ($<HTMLElement>("section.file-details h2 #menuButton").length > 0) {
      $<HTMLButtonElement>("section.file-details h2 #menuButton button:not(\".btn-more-options\")").off("click");
      $<HTMLButtonElement>("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html("");
      $<HTMLButtonElement>("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html($<HTMLAnchorElement>("section.file-details h2 #menuButton .more-options li:last-child a").html());
      $<HTMLButtonElement>("section.file-details h2 #menuButton button:not(\".btn-more-options\")").on("click", (event) => {
        event.stopPropagation();
        window.open($<HTMLAnchorElement>("section.file-details h2 #menuButton .more-options li:last-child a").attr("href"));
      });
    }

    setupMutationObserver();
  }

  if ($<HTMLElement>(".project-card").length > 0) {
    for (const [, element] of Object.entries($<HTMLElement>(".project-card")).filter((x) => !isNotANumber(x[0]))) {
      const moreOptionsButton: JQuery<HTMLButtonElement> = $(element).find<HTMLButtonElement>("#menuButton button:not(\".btn-more-options\")");
      moreOptionsButton.html("");
      const anchor: JQuery<HTMLAnchorElement> = $<HTMLAnchorElement>("#menuButton .more-options li:last-child a");
      moreOptionsButton.html(anchor.html());
      moreOptionsButton.on("click", function (event) {
        event.stopPropagation();
        const anchor: JQuery<HTMLAnchorElement> = $(this).parent().find<HTMLAnchorElement>(".more-options li:last-child a");
        window.open(anchor.attr("href"));
      });
    }
  }
  // Let id = -1;
  // id = setInterval(function() {
  //  if ($("#menuButton button:not(\".btn-more-options\")").
  // }, 100);
});
