import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "TModLoader Workshop Page Formatter",
  namespace: "NekoBoiNick.Web.Steam.Workshop.TModLoader",
  version: "1.0.1",
  description: "Format TModLoader workshop pages.",
  author: "Neko Boi Nick",
  match: "https://steamcommunity.com/sharedfiles/filedetails/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand"
  ],
  require: [
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_tmodloader_formatter/steamworkshop_tmodloader_formatter.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_tmodloader_formatter/steamworkshop_tmodloader_formatter.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
