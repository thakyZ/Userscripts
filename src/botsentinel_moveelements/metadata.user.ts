import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Bot Sentinel Move Elements",
  namespace: "NekoBoiNick.Web.BotSentinel.ElementsMove",
  version: "1.0.1",
  description: "Tries to move all the elements regarding the Bot Sentinel extension on Twitter",
  author: "Neko Boi Nick",
  match: "https://twitter.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=twitter.com",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/botsentinel_moveelements/botsentinel_moveelements.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/botsentinel_moveelements/botsentinel_moveelements.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
