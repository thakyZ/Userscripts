import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Garland Tools Additions",
  namespace: "NekoBoiNick.Web.GarlandTools.Additions",
  version: "1.0.1",
  description: "Adds various features to Garland Tools",
  author: "Neko Boi Nick",
  match: [
    "https://garlandtools.org/db/*",
    "https://www.garlandtools.org/db/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=garlandtools.org",
  license: "MIT",
  grant: "GM_setClipboard",
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/garlandtools_additions/garlandtools_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/garlandtools_additions/garlandtools_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
