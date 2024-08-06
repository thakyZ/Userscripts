import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Twitch Remove Prime Notifications",
  namespace: "NekoBoiNick.Web.TwitchPrime.NotifRM",
  version: "1.0.2",
  description: "Remove Twitch's notifications for Prime.",
  author: "Neko Boi Nick",
  match: "https://www.twitch.tv/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=twitch.tv",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/twitch_prime_notifs/twitch_prime_notifs.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
