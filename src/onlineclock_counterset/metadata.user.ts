import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Online Clock Counter Set",
  namespace: "NekoBoiNick.Web.OnlineClock.Counter.SpecificSet",
  version: "1.0.1",
  description: "Adds a text box that allows you to set the Counter so you can count down.",
  author: "Neko Boi Nick",
  match: "https://counter.onlineclock.net/",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=onlineclock.net",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
