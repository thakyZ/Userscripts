import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Snopes Remove TP Module",
  namespace: "NekoBoiNick.Snopes.TPModule",
  version: "1.0.2",
  description: "Removes Snopes' Stupid TP Module",
  author: "Neko Boi Nick",
  match: "https://www.snopes.com/*",
  icon: "https://www.google.com/s2/favicons?domain=snopes.com",
  grant: "none",
  license: "MIT",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/snopes_remove_module/snopes_remove_module.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
