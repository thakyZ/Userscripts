import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "No Old Reddit",
  namespace: "NekoBoiNick.Reddit.NoOld",
  version: "1.0.0",
  description: "Changes links that redirect to old reddit so that they use the new design",
  author: "Neko Boi Nick",
  match: "*://*.reddit.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=reddit.com",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
