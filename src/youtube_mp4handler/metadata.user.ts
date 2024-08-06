import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "YouTube MP4 Handler",
  namespace: "NekoBoiNick.Web.YouTube.MP4Handler",
  version: "1.0.2.1",
  description: "Uses a protocol to make youtube-dl download MP4's.",
  author: "Neko Boi Nick",
  match: "*://*.youtube.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=youtube.com",
  license: "MIT",
  "run-at": "document-end",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/youtube_mp4handler/youtube_mp4handler.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/youtube_mp4handler/youtube_mp4handler.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
};
