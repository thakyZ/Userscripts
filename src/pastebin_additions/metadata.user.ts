import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Pastebin Additions",
  namespace: "NekoBoiNick.Web.Pastebin.Additions",
  version: "1.0.1",
  description: "Adds things to Pastebin",
  author: "Neko Boi Nick",
  match: "https://pastebin.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=pastebin.com",
  license: "MIT",
  grant: "GM_setClipboard",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/pastebin_additions/pastebin_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/pastebin_additions/pastebin_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
