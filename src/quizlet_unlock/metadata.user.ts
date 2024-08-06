import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Quizlet Unlock",
  namespace: "NekoBoiNick.Web.Quizlet.Unlock",
  version: "1.0.1.1",
  description: "Unlocks Quizlet Paywalls. Please do not use this to cheat on tests, I used this to just not have to pay for Quizlet when studying.",
  author: "Neko Boi Nick",
  match: "https://quizlet.com/*",
  icon: "https://www.google.com/s2/favicons?domain=quizlet.com",
  grant: "GM_log",
  "run-at": "document-start",
  license: "MIT",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/quizlet_unlock/quizlet_unlock.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
