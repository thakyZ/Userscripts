import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Aether Link Additions",
  namespace: "NekoBoiNick.Web.FFXIV.Aetherlink.Additions",
  version: "1.0.2",
  description: "Adds new features to Aether Link.",
  author: "Neko Boi Nick",
  match: "https://*.aetherlink.app/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=aetherlink.app",
  license: "MIT",
  grant: "GM_setClipboard",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/aetherlink_additions/aetherlink_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/aetherlink_additions/aetherlink_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
