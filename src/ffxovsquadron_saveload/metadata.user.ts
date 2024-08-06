import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFXIV Squadron App",
  namespace: "NekoBoiNick.Web.FFXIVSquadron.SaveLoad",
  version: "1.0.1",
  description: "Syncs Fish Tracking to soupcat",
  author: "Neko Boi Nick",
  match: "http://ffxivsquadron.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ffxivsquadron.com",
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_deleteValue",
    "GM_listValues",
    "GM_registerMenuCommand"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivsquadron_saveload/ffxivsquadron_saveload.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
