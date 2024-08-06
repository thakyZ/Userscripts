import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Etro.gg Changes",
  namespace: "NekoBoiNick.Web.Etro.Changes",
  version: "1.0.0",
  description: "Various Changes to Etro.gg",
  author: "Neko Boi Nick",
  match: "https://etro.gg/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=etro.gg",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/etro_changes/etro_changes.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/etro_changes/etro_changes.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
