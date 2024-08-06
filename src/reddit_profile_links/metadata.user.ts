import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Reddit User Profile Links",
  namespace: "NekoBoiNick.Web.Reddit.UserProfileLinks.",
  version: "1.0.4.1",
  description: "Adds links to Reddit User Profiles if provided.",
  author: "thakyZ",
  match: [
    "https://www.reddit.com/user/*",
    "https://www.reddit.com/u/*"
  ],
  icon: "https://www.google.com/s2/favicons?domain=reddit.com",
  license: "MIT",
  grant: "unsafeWindow",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
