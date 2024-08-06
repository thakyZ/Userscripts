/* global ace */
import jQuery from "jquery";

jQuery(($) => {
  const themeSaveName = "TextEditor_GD_DefaultTheme";
  const setupMutationObserver = () => {
    $("#settingsMenuButton").on("click", () => {
      let ld = -1;
      ld = setInterval(() => {
        const theme = $("#-theme");
        if ($(theme).length > 0) {
          $(theme).on("change", () => {
            const selectedValue = $("#-theme option:selected").attr("value");
            GM_setValue(themeSaveName, selectedValue);
          });
          clearInterval(ld);
        }
      }, 100);
    });
    let kd = -1;
    kd = setInterval(() => {
      if (ace !== undefined) {
        ace.edit("mainEditor").renderer.on("afterRender", () => {
          const value = GM_getValue(themeSaveName);
          return value === "ace/theme/chrome" || ace.edit("mainEditor").getOption("theme") === value ? false : ace.edit("mainEditor").setOptions({ theme: value });
        });
        clearInterval(kd);
      }
    }, 100);
  };

  let id = -1;
  id = setInterval(() => {
    if ($("#mainEditor").length > 0) {
      setupMutationObserver();
      clearInterval(id);
    }
  }, 100);
});
