import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Gamer Escape Additions",
  namespace: "NekoBoiNick.Web.FFXIV.GamerEscape.Additions",
  version: "1.0.5",
  description: "Adds new features to Gamer Escape",
  author: "Neko Boi Nick",
  match: [
    "https://ffxiv.gamerescape.com/wiki/*",
    "https://ffxiv.gamerescape.com/w/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=gamerescape.com",
  license: "MIT",
  grant: [
    "GM_setValue",
    "GM_getValue",
    "unsafeWindow",
    "GM_deleteValue",
    "GM_listValues",
    "GM_addStyle",
    "GM_registerMenuCommand",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js",
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/gamerescape_additions/gamerescape_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    css: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/gamerescape_additions/style.min.css"
  }
};
