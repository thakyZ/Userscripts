import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "fExtra Life Wiki Fixes",
  namespace: "NekoBoiNick.Web.FExtraLife.Wiki.Fixes",
  version: "1.0.4",
  description: "Tries to fix some issues about fExtra Life's wiki pages.",
  author: "NekoBoiNick",
  match: "https://*.wiki.fextralife.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=fextralife.com",
  grant: "GM_log",
  "run-at": "document-start",
  license: "MIT",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fextralife_wiki_fixes/fextralife_wiki_fixes.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
