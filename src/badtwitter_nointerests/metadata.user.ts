import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Bad Twitter No Interests",
  namespace: "NekoBoiNick.Web.Twitter.NoInterests",
  version: "1.0.5.4",
  description: "Disables all of what Twitter thinks you are interested in.",
  author: "Neko Boi Nick",
  match: [
    "https://twitter.com/*",
    "https://x.com/*",
    "https://twitter.com/settings/*",
    "https://x.com/settings/*",
    "https://twitter.com/settings/your_twitter_data/*",
    "https://x.com/settings/your_twitter_data/*",
    "https://twitter.com/settings/your_twitter_data/twitter_interests",
    "https://x.com/settings/your_twitter_data/twitter_interests"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=x.com",
  grant: [
    "unsafeWindow",
    "GM_addStyle",
    "GM_getResourceText",
    "GM.getResourceUrl"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    style: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/badtwitter_nointerests/style.min.css",
    buttons: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/badtwitter_nointerests/button.template.html"
  }
};
