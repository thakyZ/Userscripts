import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Ariyala's FFXIV Toolkit Bookmarks",
  namespace: "NekoBoiNick.Web.AriyalaFFXIV.Shortcuts",
  version: "1.0.3",
  license: "MIT",
  description: "Adds a small box for shortcuts on the Wiki.",
  author: "Neko Boi Nick",
  match: "https://ffxiv.ariyala.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ffxiv.ariyala.com",
  grant: [
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ariyala_shortcuts/ariyala_shortcuts.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    css: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ariyala_shortcuts/styles.min.css",
    items: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ariyala_shortcuts/item.template.html"
  }
};
