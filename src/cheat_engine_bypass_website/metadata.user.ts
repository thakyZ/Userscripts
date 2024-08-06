import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Cheat Engine Bypass Website",
  namespace: "NekoBoiNick.CheatEngine.Fixes",
  version: "1.0.2",
  description: "Bypasses the ad website when downloading cheat engine.",
  author: "NekoBoiNick",
  match: "http://ffsrchmgr.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=cheatengine.org",
  license: "MIT",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/cheat_engine_bypass_website/cheat_engine_bypass_website.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
