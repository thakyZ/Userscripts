import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Monster Hunter World Wiki Remove Twitch Stream",
  namespace: "NekoBoiNick.MonsterHunterWorld.Wiki.RemoveTwitch",
  version: "1.0.1",
  description: "Removes twitch steam and ads from the Monster Hunter World Wiki",
  author: "NekoBoiNick",
  match: "https://monsterhunterworld.wiki.fextralife.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=fextralife.com",
  grant: "none",
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://gist.github.com/raw/2625891/waitForKeyElements.js"
  ],
  license: "MIT",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/mhw_wiki_remove_twitch/mhw_wiki_remove_twitch.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
