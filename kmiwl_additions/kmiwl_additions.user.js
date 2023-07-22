// ==UserScript==
// @name         Kmiwl Additions
// @namespace    NekoBoiNick.Web.Kmiwl.Additions
// @version      1.0.1.1
// @description  Additional features added to Kmiwl's Website
// @author       Neko Boi Nick
// @match        https://ffxiv.kmiwl.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://ffxiv.kmiwl.de
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
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/kmiwl_additions/kmiwl_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/kmiwl_additions/kmiwl_additions.user.js
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
        choices: ["Default", "Dark", "Black"],
        default: "Default"
      },
      ui: {
        type: "select",
        choices: ["Default", "Material UI"],
        default: "Default"
      }
    },
    onSave() {
      changeBackground();
      changeUI();
    }
  });

  const materialUIImg = "";

  const cssKeys = {
    customCSS: {
      Dark: [/body\{background:#212121;\}/gim, "body{background:#212121;}"],
      Black: [/body\{background:#000;\}/gim, "body{background:#000;}"],
      MaterialUI: [/\\#cache\\\{background-image:url\\\(\\"\\"\\\);\\\}/gim, `#cache{background-image:url("${materialUIImg}");}`],
      replace(text, type) {
        const _type = (type) => {
          switch (type) {
          case cssKeys.customCSS.Dark:
            return cssKeys.customCSS.Dark[1].toString();
          case cssKeys.customCSS.Black:
            return cssKeys.customCSS.Black[1].toString();
          case cssKeys.customCSS.MaterialUI:
            return cssKeys.customCSS.MaterialUI[1].toString();
          default:
            return "";
          }
        };

        const DarkMatch = cssKeys.customCSS.Dark[0].test(text);
        const BlackMatch = cssKeys.customCSS.Black[0].test(text);
        const MaterialUIMatch = cssKeys.customCSS.MaterialUI[0].test(text);
        if (DarkMatch) {
          text = text.replace(cssKeys.customCSS.Dark[0], _type(type));
        }

        if (BlackMatch) {
          text = text.replace(cssKeys.customCSS.Black[0], _type(type));
        }

        if (MaterialUIMatch) {
          text = text.replace(cssKeys.customCSS.MaterialUI[0], _type(type));
        }

        if ((!DarkMatch && !BlackMatch) || !MaterialUIMatch) {
          text = `${text}${_type(type)}`;
        }

        return text;
      }
    }
  };
  const insertCSS = (object, type) => {
    /* Soup
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */

    if ($("head style#customCSS-NekoBoiNick").length === 0) {
      $("head").append("<style id=\"customCSS-NekoBoiNick\"></style>");
    } else if (object !== undefined && object !== null) {
      if (type === "bg") {
        if (object.key === "Dark") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Dark));
        }

        if (object.key === "Black") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Black));
        }

        if (object.key === "MaterialUI") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.Light));
        }

        if (object.key === "Default") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), "default"));
        }
      } else if (type === "ui") {
        if (object.key === "Material UI") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), cssKeys.customCSS.MaterialUI));
        }

        if (object.key === "Default") {
          $("head style#customCSS-NekoBoiNick").text(cssKeys.customCSS.replace($("head style#customCSS-NekoBoiNick").text().toString(), "default"));
        }
      }
    }
  };

  const changeBackground = () => {
    const background = config.get("background");
    /* Soup
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */
    insertCSS({ key: background }, "bg");
  };

  const changeUI = () => {
    const ui = config.get("ui");
    /* Soup
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */

    insertCSS({ key: ui }, "ui");
  };

  if (window.location.pathname.match(/\/\w\w\/link-character/gi) !== null) {
    /* Old Code
     * $("#content ul li:first-Child").css({"line-height":"32px"});
     */
    $("<button class=\"btn small\" type=\"button\" id=\"copyLodestoneCode\">Copy Lodestone Code</button>").insertAfter($("#content ul li:first-Child span#lodestoneCode"));
    $("button#copyLodestoneCode").on("click", () => {
      GM_setClipboard($("span#lodestoneCode").text().toString());
    });
  }

  insertCSS();
  changeBackground();
});
