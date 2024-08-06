import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Remove UserStyles Ad Boxes",
  namespace: "NekoBoiNick.UserStyles.Ads",
  version: "1.0.0.1",
  description: "Removes divs for ads on UserStyles",
  author: "NekoBoiNick",
  match: "https://userstyles.org/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=userstyles.org",
  grant: "none",
  license: "MIT",
  "run-at": "document-end",
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://gist.github.com/raw/2625891/waitForKeyElements.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/remove_userstyles_ad_boxes/remove_userstyles_ad_boxes.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/remove_userstyles_ad_boxes/remove_userstyles_ad_boxes.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
