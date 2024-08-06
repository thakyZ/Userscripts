import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Paissa Price Copy",
  namespace: "NekoBoiNick.Web.FFXIV.Paissa.Copy",
  version: "1.0.0",
  description: "Adds link to copy price to clipboard.",
  author: "Neko Boi Nick",
  match: "https://zhu.codes/?/paissa*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=zhu.codes",
  license: "MIT",
  grant: "GM_setClipboard",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/paissa_pricecopy/paissa_pricecopy.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/paissa_pricecopy/paissa_pricecopy.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
