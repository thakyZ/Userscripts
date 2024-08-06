import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Fish Tracking App",
  namespace: "NekoBoiNick.Web.CarbunclePluhsie.FFXIVFish",
  version: "1.0.3",
  description: "Syncs Fish Tracking to the browser's local storage.",
  author: "Neko Boi Nick",
  match: "https://ff14fish.carbuncleplushy.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ff14fish.carbuncleplushy.com",
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_deleteValue",
    "GM_listValues",
    "GM_registerMenuCommand"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/carbunclepluhsie_ffxivfish/carbunclepluhsie_ffxivfish.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/carbunclepluhsie_ffxivfish/carbunclepluhsie_ffxivfish.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
