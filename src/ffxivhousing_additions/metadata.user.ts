import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFXIV Housing Preview Images",
  namespace: "NekoBoiNick.Web.FFXIVHousing.Additions",
  version: "1.0.2",
  description: "Add Preview Popups to FFXIV Housing's Website",
  author: "Neko Boi Nick",
  match: "https://en.ff14housing.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ff14housing.com",
  grant: "unsafeWindow",
  require: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivhousing_additions/ffxivhousing_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivhousing_additions/ffxivhousing_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
