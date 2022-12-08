// ==UserScript==
// @name         Curse Forge Default Download Button
// @namespace    NekoBoiNick.Web.CurseForge.DownloadButton
// @version      1.0.1
// @description  Changes the "Install" button to a Download Button by default.
// @author       Neko Boi Nick
// @match        https://beta.curseforge.com/*/*
// @match        https://curseforge.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
  const SetupMutationObserver = () => {
    const targetNode = $("section.tab-content")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && $(mutation.target).attr("class") === "tab-content") {
          const IsOnFileDL = () => {
            if ($("section.file-details", $(mutation.target)).length > 0) {
              return true;
            } else {
              return false;
            }
          };
          if (IsOnFileDL() && $("div#menuButton button span").text() === "InstallInstall") {
            if ($("section.file-details h2 #menuButton", $(mutation.target)).length > 0) {
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).off("click");
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).html("");
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).html($("section.file-details h2 #menuButton .more-options li:last-child a", $(mutation.target)).html());
              $("section.file-details h2 #menuButton button:not(\".btn-more-options\")", $(mutation.target)).on("click", function(e) {
                e.stopPropagation();
                window.open($("section.file-details h2 #menuButton .more-options li:last-child a", $(mutation.target)).attr("href"));
              });
            }
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", function() {
      observer.disconnect();
    });
  };
  if ($(".project-header .actions #menuButton").length > 0) {
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").off("click");
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html("");
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html($(".project-header .actions #menuButton .more-options li:last-child a").html());
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").on("click", function(e) {
      e.stopPropagation();
      window.open($(".project-header .actions #menuButton .more-options li:last-child a").attr("href"));
    });
    if ($("section.file-details h2 #menuButton").length > 0) {
      $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").off("click");
      $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html("");
      $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").html($("section.file-details h2 #menuButton .more-options li:last-child a").html());
      $("section.file-details h2 #menuButton button:not(\".btn-more-options\")").on("click", function(e) {
        e.stopPropagation();
        window.open($("section.file-details h2 #menuButton .more-options li:last-child a").attr("href"));
      });
    }

    SetupMutationObserver();
  }
  if ($(".project-card").length > 0) {
    $(".project-card").each(function() {
      $("#menuButton button:not(\".btn-more-options\")", $(this)).html("");
      $("#menuButton button:not(\".btn-more-options\")", $(this)).html($("#menuButton .more-options li:last-child a").html());
      $("#menuButton button:not(\".btn-more-options\")", $(this)).on("click", function(e) {
        e.stopPropagation();
        window.open($(".more-options li:last-child a", $(this).parent()).attr("href"));
      });
    });
  }
  //let id = -1;
  //id = setInterval(function() {
  //  if ($("#menuButton button:not(\".btn-more-options\")").
  //}, 100);
});
