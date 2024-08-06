import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Discord Image Embed Zoom No Resize",
  namespace: "NekoBoiNick.Web.Discord.ImageNoResize",
  version: "1.0.0.1",
  description: "Disables the resizing of images when clicking the embedded image in discord.",
  author: "Neko Boi Nick",
  match: "https://discord.com/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=discord.com",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/discord_imagenoresize/discord_imagenoresize.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/discord_imagenoresize/discord_imagenoresize.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
