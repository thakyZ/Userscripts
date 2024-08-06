import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFXIV Squadron App",
  namespace: "NekoBoiNick.Web.FFXIVSquadron.SaveLoad",
  version: "1.0.5",
  description: "Syncs the FFXIV Sqadron App Data",
  author: "Neko Boi Nick",
  match: [
    "https://www.ffxivsquadron.com/*",
    "https://ffxivsquadron.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ffxivsquadron.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_xmlhttpRequest",
    "GM_registerMenuCommand"
  ],
  require: [
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
