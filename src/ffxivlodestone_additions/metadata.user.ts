import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFXIV Lodestone Additions",
  namespace: "NekoBoiNick.Web.FFXIV.Lodestone.Additions",
  version: "1.0.1",
  description: "Adds various things to the FFXIV Lodestone.",
  author: "Neko Boi Nick",
  match: "https://*.finalfantasyxiv.com/lodestone/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_registerMenuCommand",
    "GM_deleteValue",
    "GM_setValue",
    "GM_getValue",
    "GM_listValues",
    "GM_getResourceText",
    "GM_addStyle",
    "GM_notification"
  ],
  connect: [
    "api.nekogaming.xyz",
    "cdn.discordapp.com"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js",
    "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivlodestone_additions/ffxivlodestone_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivlodestone_additions/ffxivlodestone_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    GMConfigCSS: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ffxivlodestone_additions/GM_config-style.min.css"
  }
};
