import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Poipiku Enable Context Menu",
  namespace: "NekoBoiNick.Web.Poipiku.ContextMenuEnable",
  version: "1.0.2.1",
  description: "Enables the context menu on Poipiku",
  author: "Neko Boi Nick",
  match: [
    "https://poipiku.com/*",
    "https://poipiku.com/166698/5711723.html"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=poipiku.com",
  grant: "GM_addStyle",
  license: "MIT",
  require: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/poipiku/poipiku.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
