import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Github Additions",
  namespace: "NekoBoiNick.Web.Github.Additions",
  version: "1.0.2.2",
  description: "try to take over the world!",
  author: "Neko Boi Nick",
  match: [
    "https://gist.github.com/*",
    "https://github.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=github.com",
  license: "MIT",
  "run-at": "document-end",
  grant: [
    "GM_setClipboard",
    "GM_getValue",
    "GM_setValue"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://github.com/thakyZ/GitHub-userscripts/raw/master/mutations.js",
    "https://github.com/thakyZ/GitHub-userscripts/raw/master/utils.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/github_additions/github_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/github_additions/github_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
