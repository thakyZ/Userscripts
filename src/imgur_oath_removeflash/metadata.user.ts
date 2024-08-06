import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Imgur OAuth 2.0 Remove Flash Content",
  namespace: "NekoBoiNick.Web.Imgur.OAuth.2-0.RemoveFlash",
  version: "1.0.0",
  description: "Removes old flash from the Imgur OAuth 2.0 Page",
  author: "Neko Boi Nick",
  match: [
    "https://api.imgur.com/oauth2/pin?pin=*",
    "file:///D:/Files/System/Programs/single-file-companion/downloads/Imgur_OAuth.html"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=imgur.com",
  grant: "GM_setClipboard",
  license: "MIT",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_oath_removeflash/imgur_oath_removeflash.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/imgur_oath_removeflash/imgur_oath_removeflash.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
