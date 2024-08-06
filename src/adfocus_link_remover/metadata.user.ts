import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Adfocus Link Remover",
  namespace: "NekoBoiNick.Global.AdFocusLinkRemover",
  version: "1.0.3.1",
  description: "Removes AdFocus redirects if possible.",
  author: "Neko Boi Nick",
  match: "*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=adfoc.us",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/adfocus_link_remover/adfocus_link_remover.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
