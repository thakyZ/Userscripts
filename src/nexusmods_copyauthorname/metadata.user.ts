import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Nexus Mods Copy Author Name",
  namespace: "NekoBoiNick.Web.NexusMods.CopyAuthorName",
  version: "1.0.4.1",
  description: "Adds a copy author name button to Nexus Mods mod page.",
  author: "Neko Boi Nick",
  match: "https://www.nexusmods.com/*/mods/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com",
  grant: "GM_setClipboard",
  license: "MIT",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/nexusmods_copyauthorname/nexusmods_copyauthorname.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
