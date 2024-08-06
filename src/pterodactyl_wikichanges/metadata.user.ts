import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Pterodactyl Wiki Changes",
  namespace: "NekoBoiNick.Web.Pterodactyl.Wiki.Changes",
  version: "1.0.4.1",
  description: "Changes things on the Pterodactyl wiki",
  author: "Neko Boi Nick",
  match: "https://pterodactyl.io/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=pterodactyl.io",
  license: "MIT",
  grant: [
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/pterodactyl_wikichanges/pterodactyl_wikichanges.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/pterodactyl_wikichanges/pterodactyl_wikichanges.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    css: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/pterodactyl_wikichanges/style.min.css"
  }
};
