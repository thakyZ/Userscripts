import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Glamour Dresser Copy Author Name",
  namespace: "NekoBoiNick.Web.GlamourDresser.CopyAuthorName",
  version: "1.2.0",
  description: "Adds a copy author name button to Nexus Mods mod page.",
  author: "Neko Boi Nick",
  match: "https://www.glamourdresser.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=glamourdresser.com",
  license: "MIT",
  grant: [
    "GM_getValue",
    "GM_setValue",
    "unsafeWindow",
    "GM_addStyle",
    "GM_deleteValue",
    "GM_registerMenuCommand",
    "GM_setClipboard",
    "GM_addStyle",
    "GM_getResourceText"
  ],
  require: [
    "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
    "https://openuserjs.org/src/libs/sizzle/GM_config.js"
  ],
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  resource: {
    fix: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/dark_fix_style.min.css",
    iframe: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/dark_iframe.min.css",
    blankAvatar: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/blankAvatar.base64",
    placeholderImage: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/placeholderImage.base64",
    blankAvatarJPG: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/blankAvatar.jpg",
    placeholderImagePNG: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/placeholderImage.png",
    copyButtonTemplate: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/copyButton.template.html",
    GMConfigCSS: "https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/GM_config-style.min.css"
  }
};
