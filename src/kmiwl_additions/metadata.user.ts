import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Kmiwl Additions",
  namespace: "NekoBoiNick.Web.Kmiwl.Additions",
  version: "1.0.1.1",
  description: "Additional features added to Kmiwl's Website",
  author: "Neko Boi Nick",
  match: "https://ffxiv.kmiwl.de/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=https://ffxiv.kmiwl.de",
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
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/kmiwl_additions/kmiwl_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/kmiwl_additions/kmiwl_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
