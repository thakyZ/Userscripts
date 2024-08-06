import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "FFLogs To XIV Analysis",
  namespace: "NekoBoiNick.Web.FFLogs.ButtonToXIVAnalysis",
  version: "1.0.4",
  description: "Adds a button to FFLogs reports to redirect to XIV Analysis",
  author: "Neko Boi Nick",
  match: "https://www.fflogs.com/reports/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=fflogs.com",
  license: "MIT",
  grant: "none",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fflogs_toxivanalysis/fflogs_toxivanalysis.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/fflogs_toxivanalysis/fflogs_toxivanalysis.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts"
};
