import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Avorion Forum Fixes",
  namespace: "NekoBoiNick.Avorion.ForumFixes",
  version: "1.0.2.1",
  description: "Changes some issues with the __old__ Avorion forums.",
  author: "Neko Boi Nick",
  match: "https://www.avorion.net/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=www.avorion.net",
  license: "MIT",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
