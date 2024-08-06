import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Final Fantasy XIV Online Store Changes",
  namespace: "NekoBoiNick.Web.FFXIV.OnlineStore.Changes",
  version: "1.0.1",
  description: "QoL changes for the Final Fantasy XIV Online Store.",
  author: "Neko Boi Nick",
  match: "https://store.finalfantasyxiv.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com",
  license: "MIT",
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_registerMenuCommand",
    "GM.xmlHttpRequest",
    "GM_openInTab"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxiv_onlinestore/ffxiv_onlinestore.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxiv_onlinestore/ffxiv_onlinestore.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    css: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/ffxiv_onlinestore/style.css"
  }
};
