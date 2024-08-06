import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Steam Add All Workshop Items to Collection",
  namespace: "NekoBoiNick.Steam.Workshop.Collection.AddAllItems",
  version: "1.0.2",
  description: "Makes GUI to add or remove all items to or from a collection.",
  author: "Neko Boi Nick",
  match: "https://steamcommunity.com/sharedfiles/managecollection/?id=*",
  icon: "https://www.google.com/s2/favicons?domain=steamcommunity.com",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_add_all_workshop/steam_add_all_workshop.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
