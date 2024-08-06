import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Trello Additions",
  namespace: "NekoBoiNick.Web.Trello.Additions",
  version: "1.0.0.1",
  description: "Adds features to trello specifically for FFXIV mods.",
  author: "Neko Boi Nick",
  match: "https://trello.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=trello.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/trello_additions/trello_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/trello_additions/trello_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
