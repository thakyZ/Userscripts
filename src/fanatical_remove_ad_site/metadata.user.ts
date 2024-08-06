import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Fanatical Remove Malware Ad Site",
  namespace: "NekoBoiNick.Web.Fanatical.AntiMalware",
  version: "1.0.2",
  description: "Removes known malware ad site from various sites",
  author: "Neko Boi Nick",
  match: "https://isthereanydeal.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=isthereanydeal.com",
  license: "MIT",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fanatical_remove_ad_site/fanatical_remove_ad_site.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
