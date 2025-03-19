// ==UserScript==
// @name        GreasyFork Bullshit Filter Fork
// @namespace   NekoBoiNick/Web/GreasyFork/BullshitFilter
// @version     2021.3.31
// @description Hides scripts for popular browser games and social networks as well as scripts that use "foreign" characters in descriptions. Applies to posts in Forum too.
// @author      kuehlschrank, darkred, valacar, Graphen
// @license     MIT
// @icon        https://raw.githubusercontent.com/darkred/Userscripts/master/GreasyFork_Bullshit_Filter/large.png
// @match       https://{greasy,sleazy}fork.org/**/{scripts,discussions,users}/**
// @include     /^https:\/\/(greasy|sleazy)fork\.org\/(.*\/)?(scripts|discussions|users).*$/
// @exclude     /^https:\/\/(greasy|sleazy)fork\.org\/(.*\/)?(scripts\/[\w-]+\/feedback|discussions\/[\d]+|users\/.*\/conversations.*)$/
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==
/**
 * This is a modified version of this script (https://github.com/darkred/Userscripts/issues) by darkred
 * which is a modified version of (http://userscripts-mirror.org/scripts/show/97145) by kuehlschrank.
 * Thanks a lot to:
 * - darkred for the improved script,
 * - kuehlschrank for making another great script,
 * - valacar for the refactoring,
 * - Graphen for the "Non-Latin" regex.
 */
/**
https:/./greasyfork.org/discussions
https:/./greasyfork.org/scripts
https:/./greasyfork.org/users
https:/./greasyfork.org/en/discussions
https:/./greasyfork.org/en/scripts
https:/./greasyfork.org/en/users
https:/./greasyfork.org/en/discussions/111111-a
https:/./greasyfork.org/en/scripts/111111-a
https:/./greasyfork.org/en/users/111111-a
https:/./sleazyfork.org/discussions
https:/./sleazyfork.org/scripts
https:/./sleazyfork.org/users
https:/./sleazyfork.org/en/discussions
https:/./sleazyfork.org/en/scripts
https:/./sleazyfork.org/en/users
https:/./sleazyfork.org/en/discussions/111111-a
https:/./sleazyfork.org/en/scripts/111111-a
https:/./sleazyfork.org/en/users/111111-a
 */
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  const DEBUGGING = 0;
  /* eslint-disable no-control-regex */
  const filters = {
    "Non-ASCII": /[^\x00-\x7F\s]+/,
    "Non-Latin": /[^\u0000-\u024F\u2000-\u214F\s]+/,
    Games: /Aimbot|AntiGame|Agar|agar\.io|alis\.io|angel\.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Balz|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bloble|Bonk|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|chopcoin\.io|Comunio|Conquer\s*Club|CosmoPulse|cursors\.io|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|doblons\.io|DotD|Dossergame|Dragons\s*of\s*Atlantis|driftin\.io|Dugout|\bDS[a-z]+\n|elites\.io|Empire\s*Board|eRep(ublik)?|Epicmafia|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|gota\.io|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(o|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Krunker|Last\s*Emperor|Legends?\s*of|Light\s*Rising|lite\.ext\.io|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|MooMoo|MyFreeFarm|narwhale\.io|Neopets|NeoQuest|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|pokeradar\.io|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|Skribbl|slither\.io|slitherplus\.io|slitheriogameplay|SpaceWars|splix\.io|Survivio|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|torto\.io|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|vertix\.io|War\s*of\s*Ninja|World\s*of\s*Tanks|West\s*Wars|wings\.io|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium|Yohoho|Zombs/iu,
    "Social Networks": /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|VK|vkontakte|ВКонтакте|Qzone|Twitter|TweetDeck/iu,
    Clutter: /^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n("|o)?t (install|download)|nicht installieren|(just )?(\ban? |\b)test(ing|s|\d|\b)|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download|theme|(night|dark) ?(mode)?/iu,
  };
  /* eslint-enable no-control-regex */

  const commonCss = `
    .filter-status {
      margin-left: 6px;
    }

    .filter-switches {
      display: inline-block;
    }

    :hover>.filter-switches {
      display: block;
    }

    .filter-on,
    .filter-off {
      display: block;
      width: 100px;
    }

    .filter-switches a {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .filter-switches a {
      margin-left: 8px;
      padding: 0 4px;
    }

    a.filter-on {
      background-color: #ffcccc;
      color: #333333;
      text-decoration: line-through;
    }

    a.filter-off {
      background-color: #ccffcc;
      color: #333333;
    }
  `;

  const isOnForum = /discussions|feedback/.test(window.location.href);

  const site = {};
  if (isOnForum) {
    site.css = ".discussion-list-item.filtered { display: none; } .filter-on, .filter-off { color: black; } " + commonCss;
    site.cssDebug = ".discussion-list-item.filtered { background-color: khaki; } " + commonCss;
    site.filterStatusLocation = ".list-option-groups";
    site.itemsToCheck = ".discussion-list-item";
    site.itemType = "discussions";
    site.removeFilter = function(el) {
      $(el).removeClass("filtered");
    };

    site.applyFilter = function(el, activeFilter) {
      const temp = $(el).children.find(":first-child");
      if ($(temp).length > 0 && $(temp).text().match(activeFilter)) {
        $(el).addClass("filtered");
        return true;
      }

      return false;
    };
  } else {
    site.css = "li.filtered { display: none; } " + commonCss;
    site.cssDebug = "li.filtered { background-color: khaki; } " + commonCss;
    site.filterStatusLocation = "#script-list-option-groups";
    site.itemsToCheck = "article > h2";
    site.itemType = "scripts";
    site.removeFilter = function(el) {
      $(el).parent().parent().removeClass("filtered");
    };

    site.applyFilter = function(el, activeFilter) {
      if ($(el).text().match(activeFilter)) {
        $(el).parent().parent().addClass("filtered");
        return true;
      }

      return false;
    };
  }

  insertStyle();
  insertStatus();
  filterScripts();
  insertSwitches();

  function insertStyle() {
    const style = $(`<style type="text/css">${DEBUGGING ? site.cssDebug : site.css}</style>`);
    $("head").append(style);
  }

  function insertStatus() {
    const p = $(site.filterStatusLocation);
    if (p.length > 0) {
      const status = $("<span class=\"filter-status\"></span>");
      p.append(status);
    }
  }

  function filterScripts() {
    const activeFilters = [];
    for (const filterType of Object.keys(filters)) {
      if (configGetValue(filterType, "on") === "on") {
        activeFilters.push(filters[filterType]);
      }
    }

    const nodes = $(site.itemsToCheck);
    let numFiltered = 0;

    for (const [index, node] of Object.entries(nodes)) {
      if (isNaN(Number(index))) {
        continue;
      }

      site.removeFilter(node);

      for (const activeFilter of activeFilters) {
        const filtered = site.applyFilter(node, activeFilter);

        if (filtered) {
          numFiltered++;
          break;
        }
      }
    }

    const filterStatus = $(".filter-status");

    if (filterStatus.length > 0) {
      const numUnfiltered = $(site.itemsToCheck).length - numFiltered;
      filterStatus.text(`${numUnfiltered} ${site.itemType} (${numFiltered} filtered)`);
    }
  }

  function insertSwitches() {
    const span = $("<span class=\"filter-switches\"></span>");
    for (const filterType of Object.keys(filters)) {
      span.append(createSwitch(filterType, configGetValue(filterType, "on") === "on"));
    }

    const filterStatus = $(".filter-status");
    if (filterStatus.length > 0) {
      filterStatus.parent().append(span);
    }
  }

  function createSwitch(label, isOn) {
    const a = $(`<a class="${isOn ? "filter-on" : "filter-off"}">${label}</a>`);
    a.on("click", (e) => {
      if (a.attr("class") === "filter-on") {
        a.attr("class", "filter-off");
        configSetValue(a.text(), "off");
      } else {
        a.attr("class", "filter-on");
        configSetValue(a.text(), "on");
      }

      filterScripts();
      e.preventDefault();
    });
    return a;
  }

  function configSetValue(name, value) {
    localStorage.setItem(name, value);
  }

  function configGetValue(name, defaultValue) {
    const value = localStorage.getItem(name);
    return value ? value : defaultValue;
  }
});
