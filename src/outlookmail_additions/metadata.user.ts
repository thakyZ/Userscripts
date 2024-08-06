import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Outlook Mail Additions",
  namespace: "NekoBoiNick.Web.OutlookMail.Additions",
  version: "1.0.0",
  description: "Additions to Outlook Web Mail",
  author: "Neko Boi Nick",
  match: "https://outlook.live.com/mail/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=live.com",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/outlookmail_additions/outlookmail_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/outlookmail_additions/outlookmail_additions.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
