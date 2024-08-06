import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Steam Workshop Delete Facebook",
  namespace: "NekoBoiNick.Steam.Community.Workshop.Facebook",
  version: "0.1",
  description: "Deletes Facebook tags in SteamWorkshop Item Pages.",
  author: "Neko Boi Nick",
  match: "https://steamcommunity.com/sharedfiles/filedetails/?id=*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_deletefacebook/steamworkshop_deletefacebook.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_deletefacebook/steamworkshop_deletefacebook.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
