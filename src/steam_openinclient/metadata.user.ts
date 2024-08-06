import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Open URL in Steam Button",
  namespace: "NekoBoiNick.Web.Steam.OpenInClient",
  version: "1.0.3",
  description: "Adds a button to open pages in the Steam client.",
  author: "Neko Boi Nick",
  match: [
    "https://steamcommunity.com/*",
    "https://store.steampowered.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com",
  license: "MIT",
  grant: "GM_addStyle",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_openinclient/steam_openinclient.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
