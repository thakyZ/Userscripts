import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFXIV Team Craft Additions",
  namespace: "MekoBoiNick.Web.FFXIV.TeamCraft.Additions",
  version: "1.0.1",
  description: "Adds new things to FFXIV Team Craft",
  author: "Neko Boi Nick",
  match: [
    "https://guides.ffxivteamcraft.com/*",
    "https://ffxivteamcraft.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=ffxivteamcraft.com",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivteamcraft_additions/ffxivteamcraft_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivteamcraft_additions/ffxivteamcraft_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
