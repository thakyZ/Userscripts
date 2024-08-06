import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Ko-Fi Additions",
  namespace: "NekoBoiNick.Web.KoFi.Additions",
  version: "1.0.1",
  description: "Adds some additional feature to Ko-Fi",
  author: "Neko Boi Nick",
  match: "https://ko-fi.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ko-fi.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText",
    "GM.getResourceUrl",
    "GM.xmlHttpRequest",
    "GM_getValue",
    "GM_setValue"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/library/nekogaming.userscript.lib.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/kofi_additions/kofi_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    css: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/styles.min.css",
    copyAuthor: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/copyauthor.template.html",
    notificationButtons: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/kofi_additions/notifButtons.template.html"
  }
};
