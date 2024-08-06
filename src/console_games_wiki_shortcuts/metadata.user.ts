import { Metadata } from "esbuild-plugin-userscript";

export const metadata: Metadata = {
  name: "Console Games Wiki Shortcuts",
  namespace: "NekoBoiNick.Web.ConsoleGamesWiki.Shortcuts",
  version: "1.0.1",
  license: "MIT",
  description: "Adds a small box for shortcuts on the Wiki.",
  author: "Neko Boi Nick",
  match: "https://ffxiv.consolegameswiki.com/wiki/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=consolegameswiki.com",
  grant: "none",
  downloadURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/console_games_wiki_shortcuts/console_games_wiki_shortcuts.user.js",
  updateURL: "https://raw.githubusercontent.com/thakyz/Userscripts/master/console_games_wiki_shortcuts/console_games_wiki_shortcuts.user.js",
  supportURL: "https://github.com/thakyZ/Userscripts/issues",
  homepageURL: "https://github.com/thakyZ/Userscripts",
  require: "https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"
};
