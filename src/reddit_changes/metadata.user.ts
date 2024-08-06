import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Reddit Changes",
  namespace: "NekoBoiNick.Web.Reddit.CHanges",
  version: "1.0.3.1",
  description: "Does changes for reddit.",
  author: "Neko Boi Nick",
  match: [
    "https://www.reddit.com/*",
    "https://reddit.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=reddit.com",
  license: "MIT",
  grant: "unsafeWindow",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_changes/reddit_changes.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
