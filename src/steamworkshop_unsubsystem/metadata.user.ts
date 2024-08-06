import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Steam Workshop Unsubscribe Systematically",
  namespace: "NekoBoiNick.Web.Steam.Workshop.UnSubSystematically.",
  version: "1.0.0.1",
  description: "Adds a new button to unsubscribe from a collection systematically instead of all at once.",
  author: "Neko Boi Nick",
  match: "https://steamcommunity.com/sharedfiles/filedetails/?id=*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_unsubsystem/steamworkshop_unsubsystem.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_unsubsystem/steamworkshop_unsubsystem.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
