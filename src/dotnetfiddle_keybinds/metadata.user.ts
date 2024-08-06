import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "DotNet Fiddle Keybinds",
  namespace: "NekoBoiNick.Web.DotNetFiddle.Keybinds",
  version: "1.0.0",
  description: "try to take over the world!",
  author: "NekoBoiNick",
  match: "https://dotnetfiddle.net/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=dotnetfiddle.net",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_info"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/jquery.hotkeys@0.1.0/jquery.hotkeys.min.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/dotnetfiddle_keybinds/dotnetfiddle_keybinds.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/dotnetfiddle_keybinds/dotnetfiddle_keybinds.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
