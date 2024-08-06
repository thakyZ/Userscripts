import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Steam Url Filter Bypasser",
  namespace: "NekoBoiNick.Web.Steam.UrlFilterBypass",
  version: "1.0.0",
  description: "Simple script to bypass steam url filter.",
  author: "Neko Boi Nick",
  match: "https://steamcommunity.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com",
  license: "MIT",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/steam_url_filter_bypass/steam_url_filter_bypass.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
