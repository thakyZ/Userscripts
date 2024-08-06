import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Speed Test Redirect",
  namespace: "NekoBoiNick.Web.Search.SpeedTest",
  copyright: "2023, Neko Boi Nick",
  version: "1.0.2.1",
  license: "MIT",
  description: "Redirects the search engine to a proper speed test site.",
  author: "Neko Boi Nick",
  match: [
    "*://*.google.com/*",
    "*://*.duckduckgo.com/*",
    "*://*.bing.com/*",
    "*://*.yahoo.com/*",
    "*://*.yandex.com/*"
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=speedtest.net",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM.getValue",
    "GM.setValue",
    "GM_addStyle",
    "GM_registerMenuCommand"
  ],
  "run-at": "document-start",
  require: [
    "https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js",
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/speed_test_redirect/speed_test_redirect.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
