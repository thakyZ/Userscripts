import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Piccrew Translate",
  namespace: "NekoBoiNick.Web.Piccrew.Translate",
  version: "1.0.0",
  description: "Translates Piccrew's site to english",
  author: "Neko Boi Nick (thakyZ)",
  match: "https://picrew.me/*",
  icon: "https://www.google.com/s2/favicons?domain=picrew.me",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/piccrew_translate/piccrew_translate.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
