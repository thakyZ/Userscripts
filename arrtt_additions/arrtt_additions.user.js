// ==UserScript==
// @name         ARR Triple Triad Additions
// @namespace    NekoBoiNick.Web.ARRTripleTriad.Additions
// @version      1.0.3
// @description  Adds additional features to ARR Triple Triad.
// @author       Neko Boi Nick
// @match        https://arrtripletriad.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arrtripletriad.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/arrtt_additions/arrtt_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/arrtt_additions/arrtt_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery, MonkeyConfig */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      background: {
        type: "select",
        choices: ["Default", "Dark", "Black", "Light"],
        default: "Default"
      }
    },
    onSave(_) {
      changeBackground();
    }
  });
  const cssKeys = {
    customCSS: {
      Dark: [/@media\sall\sand\s\(min-width:\s1024px\)\s\{\n\s*html\s\{\n\s*background:\s#212121;\n\s*\}\n\s*\}/gim, "@media all and (min-width: 1024px) {\n    html {\n      background: #212121;\n    }\n  }"],
      Black: [/@media\sall\sand\s\(min-width:\s1024px\)\s\{\n\s*html\s\{\n\s*background:\s#000;\n\s*\}\n\s*\}/gim, "@media all and (min-width: 1024px) {\n    html {\n      background: #000;\n    }\n  }"],
      Light: [/@media\sall\sand\s\(min-width:\s1024px\)\s\{\n\s*html\s\{\n\s*background:\s#fff;\n\s*\}\n\s*\}\n\s*#content\s\{\n\s*color:\s#000;\n\s*}/gim, "@media all and (min-width: 1024px) {\n    html {\n      background: #fff;\n    }\n  }\n  #content {\n    color: #000;\n  }"],
      replace(text, type) {
        function getType(type) {
          switch (type) {
            case cssKeys.customCSS.Dark:
              return cssKeys.customCSS.Dark[1].toString();
            case cssKeys.customCSS.Black:
              return cssKeys.customCSS.Black[1].toString();
            case cssKeys.customCSS.Light:
              return cssKeys.customCSS.Light[1].toString();
            default:
              return "";
          }
        }

        const DarkMatch = text.match(cssKeys.customCSS.Dark[0]);
        const BlackMatch = text.match(cssKeys.customCSS.Black[0]);
        const LightMatch = text.match(cssKeys.customCSS.Light[0]);
        if (DarkMatch !== null) {
          text = text.replace(cssKeys.customCSS.Dark[0], getType(type));
        }

        if (BlackMatch !== null) {
          text = text.replace(cssKeys.customCSS.Black[0], getType(type));
        }

        if (LightMatch !== null) {
          text = text.replace(cssKeys.customCSS.Light[0], getType(type));
        }

        if (DarkMatch === null && BlackMatch === null && LightMatch === null) {
          text = `${text}${getType(type)}`;
        }

        return text;
      }
    }
  };
  function insertCSS(object) {
    /* Unknown code.
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */
    if ($("head style#customCSS-NekoBoiNick").length === 0) {
      $("head").append(`<style id="customCSS-NekoBoiNick">
  button#copyLodestoneCode {
    border: 0;
    bottom: 2px;
    position: relative;
  }
  #content ul li {
    line-height: 32px;
  }
  #compactCards img {
    max-width: 40px;
  }
</style>`);
    } else if (typeof object !== "undefined" && object !== null) {
      if (object.key === "Dark") {
        $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Dark));
      }

      if (object.key === "Black") {
        $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Black));
      }

      if (object.key === "Light") {
        $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Light));
      }

      if (object.key === "Default") {
        $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), "default"));
      }
    }
  }

  function changeBackground() {
    const background = config.get("background");
    /* Unknown code.
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */
    insertCSS({ key: background });
  }

  if (window.location.pathname.match(/\/\w\w\/link-character/gi) !== null) {
    // $("#content ul li:first-Child").css({"line-height":"32px"});
    $("<button class=\"btn small\" type=\"button\" id=\"copyLodestoneCode\">Copy Lodestone Code</button>").insertAfter($("#content ul li:first-Child span#lodestoneCode"));
    $("button#copyLodestoneCode").on("click", () => {
      GM_setClipboard($("span#lodestoneCode").text().toString());
    });
  }

  insertCSS();
  changeBackground();
});
