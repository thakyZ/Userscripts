import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Text Editor for Google Drive Change Default Theme",
  namespace: "NekoBoiNick.Web.GoogledDrive.TextEditor.Theme.Default",
  version: "1.0.1",
  description: "Gives an option to change the default theme of the Text Editor for Google Drive",
  author: "Neko Boi Nick",
  match: "https://texteditor.co/",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=texteditor.co",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/TextEditor_GD_DefaultTheme/TextEditor_GD_DefaultTheme.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
