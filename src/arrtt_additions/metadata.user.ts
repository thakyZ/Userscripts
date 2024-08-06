import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "ARR Triple Triad Additions",
  namespace: "NekoBoiNick.Web.ARRTripleTriad.Additions",
  version: "1.0.3",
  description: "Adds additional features to ARR Triple Triad.",
  author: "Neko Boi Nick",
  match: "https://arrtripletriad.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=arrtripletriad.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand",
    "GM_setClipboard"
  ],
  require: [
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/arrtt_additions/arrtt_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/arrtt_additions/arrtt_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
