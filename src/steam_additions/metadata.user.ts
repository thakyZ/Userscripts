import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Steam Additions",
  namespace: "NekoBoiNick.Web.Steam.Additions",
  version: "1.0.0",
  description: "try to take over the world!",
  author: "Neko Boi Nick",
  match: [
    "https://steamcommunity.com/*",
    "https://store.steampowered.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_getValue",
    "GM_setValue",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand",
    "GM_getResourceText"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_additons/steam_additons.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_additons/steam_additons.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    add_all_workshop_items: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/add_all_workshop_items/add_all_workshop_items.min.css"
  }
};
