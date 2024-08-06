import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "XIV Mod Archive Additions",
  namespace: "NekoBoiNick.Web.XIVModArchive.Additions",
  version: "1.1.4",
  description: "Adds custom things to XIV Mod Archive",
  author: "Neko Boi Nick",
  match: [
    "https://xivmodarchive.com/*",
    "https://www.xivmodarchive.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=xivmodarchive.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText",
    "GM.getResourceUrl",
    "GM.xmlHttpRequest",
    "GM_registerMenuCommand"
  ],
  connect: [
    "api.nekogaming.xyz",
    "cdn.discordapp.com",
    "static.xivmodarchive.com"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    style: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/styles.min.css",
    blankAvatar: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/blankAvatar.base64",
    blankAvatarPng: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/blankAvatar.png",
    pageNumberElements: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/pageNumberElements.template.html",
    copyAuthorName: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/copyAuthorName.template.html",
    deleteAllMessages: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/deleteAllMessages.template.html",
    GMConfigCSS: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/GM_config-style.min.css",
    modalTemplate: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/xivmodarchive_additions/modal.template.html"
  }
};
