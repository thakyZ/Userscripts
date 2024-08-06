import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Twitter Additions",
  namespace: "NekoBoiNick.Web.Twitter.Additions",
  version: "1.0.2",
  description: "Changes things on Twitter.",
  author: "Neko Boi Nick",
  match: [
    "https://twitter.com/*",
    "https://x.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=twitter.com",
  grant: [
    "unsafeWindow",
    "GM_addStyle",
    "GM_getResourceText",
    "GM.getResourceUrl"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/twitter_additions/twitter_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/twitter_additions/twitter_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    style: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/twitter_additions/style.min.css"
  }
};
