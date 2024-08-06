import { isNotANumber, assertIsString, isString, _jQuery as jQuery } from "../library/index.js";
import { GM_configStruct as GMConfig } from "../gm_config.js";
import { Settings } from "./classes.js";

jQuery(($) => {
  const settings: Settings = { websites: [] };

  function loadSettings() {
    const _settings = config.get("websites").valueOf();
    if (!isString(_settings)) {
      return;
    }
    assertIsString(_settings);

    settings.websites = [..._settings.split("\n")];
  }

  function fixLinks() {
    for (const website of settings.websites) {
      if (website === "") {
        return;
      }

      const elements = $(`a[href^="${website}"]`);
      for (const [index, element] of Object.entries(elements)) {
        if (isNotANumber(index)) continue;
        const href = $(element).attr("href");
        if (isString(href)) {
          assertIsString(href);
          $(element).attr("href", href.replace(new RegExp(`https?://${website}/quick?token=[a-zA-Z0-9]+&url=`, "gi"), ""));
        }
      }
    }
  }

  function callback(mutationList: MutationRecord[]) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        fixLinks();
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => observer.disconnect());
  }

  function setupGMConfigFrame(): HTMLElement {
    const configWrapper = $("<div class=\"config-wrapper\"></div>");
    const element = $("<div id=\"GlamourDresser_Additions_Config\"></div>");
    $(configWrapper).append($(element));
    $("body").append($(configWrapper));
    return element[0];
  }

  const gmConfigFrame: HTMLElement  = setupGMConfigFrame();

  GM_registerMenuCommand("Load Settings", () => loadSettings());
  GM_registerMenuCommand("Open Settings", () => config.open());

  const gmConfigCSS = GM_getResourceText("GMConfigCSS");
  const config = new GM_configStruct({
    id: "bypass_ad_links",
    title: "Bypass Ad Links Config",
    fields: {
      websites: {
        label: "Websites",
        type: "textarea",
        default: ""
      }
    },
    events: {
      init() {
        this.frame?.setAttribute("style", "display:none;");
        loadSettings();
        $(window.location).on("hashchange", () => fixLinks());
        fixLinks();
        setupMutationObserver();
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });
});
