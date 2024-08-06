import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Curse Forge Redirect",
  namespace: "NekoBoiNick.CurseForge.Redirect",
  version: "1.0.3",
  description: "Redirect Method to redirect to the better curse forge page dedicated to the game you are looking at.",
  author: "Neko Boi Nick",
  match: [
    "*://www.curseforge.com/minecraft/*",
    "*://minecraft.curseforge.com/mc-mods/*",
    "*://minecraft.curseforge.com/*",
    "*://curseforge.com/*",
    "*://www.curseforge.com/*",
    "*://legacy.curseforge.com/*"
  ],
  exclude: "*://minecraft.curseforge.com/projects/",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  icon: "https://github.com/thakyZ/Userscripts/raw/master/curseforge_redirect/curse-icon.png",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "GM_deleteValue",
    "GM.xmlHttpRequest"
  ],
  connect: [
    "https://legacy.curseforge.com*",
    "https://www.curseforge.com*"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_redirect/curseforge_redirect.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
