import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Curse Forge Default Download Button",
  namespace: "NekoBoiNick.Web.CurseForge.DownloadButton",
  version: "1.0.2.1",
  description: "Changes the \"Install\" button to a Download Button by default.",
  author: "Neko Boi Nick",
  match: [
    "https://beta.curseforge.com/*/*",
    "https://curseforge.com/*/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=curseforge.com",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
