import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Bad Twitter No Intrests",
  namespace: "NekoBoiNick.Web.Twitter.NoIntrests",
  version: "1.0.99",
  description: "Misspelled version of Bad Twitter No Interests",
  author: "Neko Boi Nick",
  match: "https://twitter.com/settings/your_twitter_data/twitter_interests",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=twitter.com",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/badtwitter_nointerests/badtwitter_nointerests.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
