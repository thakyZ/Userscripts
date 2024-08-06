import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "TikTok Download Video",
  namespace: "NekoBoiNick.Web.TikTok.SaveVideo",
  version: "1.0.1.1",
  description: "Adds a download button to TikTok Videos",
  author: "Neko Boi Nick",
  match: "https://www.tiktok.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=tiktok.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM.xmlHttpRequest",
    "GM_setClipboard"
  ],
  connect: "v16-webapp-prime.us.tiktok.com",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/tiktok_downloadvideo/tiktok_downloadvideo.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
