import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Bypass Ad Links",
  namespace: "NekoBoiNick.Web.Bypass.AdLinks",
  version: "1.0.5",
  description: "Bypass Ad Links in any website on the web.",
  author: "Neko Boi Nick",
  match: "*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=wikipedia.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand",
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: [
    "https://openuserjs.org/src/libs/sizzle/GM_config.js",
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/bypass_ad_links/bypass_ad_links.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    GMConfigCSS: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/GM_config-style.min.css"
  }
};
