import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "XIV Party Finder Additions",
  namespace: "NekoBoiNick.Web.XivPF.Additions",
  version: "1.0.1.1",
  description: "Adds some additional feature to Ko-Fi",
  author: "Neko Boi Nick",
  match: "https://xivpf.com/listings",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=xivpf.com",
  license: "MIT",
  grant: [
    "unsafeWindow",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText",
    "GM.getResourceUrl",
    "GM.xmlHttpRequest"
  ],
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/xivpf_additions/xivpf_additions.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/xivpf_additions/xivpf_additions.user.js"
};
