import "../../types/gm_config.d.ts";
import { CssKeys, ThemeType } from "./classes.js";
import { JQuery, jQuery } from "../../library/index.js";
import { metadata } from "./metadata.user.js";

jQuery(($) => {
  const pluginId = `${metadata.name?.toString()} Config`;
  const config = new GM_configStruct({
    id: pluginId.replaceAll(" ", "_"),
    title: pluginId,
    fields: {
      background: {
        type: "radio",
        default: "default",
        options: ["default", "dark", "black", "light"],
        label: "Background",
        title: "Background"
      }
    },
    events: {
      save() {
        changeBackground();
      }
    }
  });
  const cssKeys: CssKeys = new CssKeys();

  function changeBackground() {
    /* Unknown code.
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */
    cssKeys.insertCss({ key: (config.get("background") as ThemeType) });
  }

  if (window.location.pathname.match(/\/\w\w\/link-character/gi) !== null) {
    // $("#content ul li:first-Child").css({"line-height":"32px"});
    const button: JQuery<HTMLButtonElement> = $<HTMLButtonElement>("<button class=\"btn small\" type=\"button\" id=\"copyLodestoneCode\">Copy Lodestone Code</button>");
    const span: JQuery<HTMLSpanElement> = $<HTMLSpanElement>("#content ul li:first-Child span#lodestoneCode");

    span.after(button);
    button.on("click", () => GM_setClipboard(span.text()));
  }

  cssKeys.insertCss();
  changeBackground();
});
