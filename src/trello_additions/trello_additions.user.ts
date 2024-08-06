/// <reference path="../../types/gm_config.d.ts" />
import jQuery from "jquery";

jQuery(($) => {
  "use strict";
  let gmConfigCSS = "";

  function setupCSS() {
  }

  function checkCurrentPage() {
  }

  function setupFrame() {
    const tempFrame = $("<div id=\"trello_additions\" class=\"nbn gmConfigFrame\"></div>");
    $("body").append(tempFrame);
    return $(tempFrame);
  }

  function loadConfigCSS() {
    gmConfigCSS = ":root { }";
  }

  GM_registerMenuCommand("Config", () => {
    GM_config.open();
  });

  loadConfigCSS();

  const gmConfigFrame = setupFrame();

  // Your code here...
  GM_config.init({
    id: "Trello_Additions_Config",
    title: "The Trello Additions Config",
    fields: {
      modpages: {
        label: "List of mod pages",
        type: "hidden",
        value: "",
      }
    },
    events: {
      init() {
        GM_config.frame.setAttribute("style", "display:none;");
        setupCSS();
      },
      open() {
        GM_config.frame.setAttribute("style", "display:block;");
      },
      save(val) {
        checkCurrentPage(val);
      },
      close() {
        GM_config.frame.setAttribute("style", "display:none;");
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });
});
