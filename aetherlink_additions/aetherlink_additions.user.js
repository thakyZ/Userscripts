// ==UserScript==
// @name         Aether Link Additions
// @namespace    NekoBoiNick.Web.FFXIV.Aetherlink.Additions
// @version      1.0.2
// @description  Adds new features to Aether Link.
// @author       Neko Boi Nick
// @match        https://*.aetherlink.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aetherlink.app
// @license      MIT
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/aetherlink_additions/aetherlink_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/aetherlink_additions/aetherlink_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global jQuery */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  function transliterate(word) {
    let answer = "";
    const a = {};

    a["Ё"] = "E";
    a["Й"] = "N";
    a["Ц"] = "T";
    a["У"] = "y";
    a["К"] = "K";
    a["Е"] = "E";
    a["Н"] = "H";
    a["Г"] = "T";
    a["Ш"] = "W";
    a["Щ"] = "W";
    a["З"] = "3";
    a["Х"] = "X";
    a["Ъ"] = "b";
    a["ё"] = "e";
    a["й"] = "n";
    a["ц"] = "u";
    a["у"] = "y";
    a["к"] = "k";
    a["е"] = "e";
    a["н"] = "H";
    a["г"] = "r";
    a["ш"] = "w";
    a["щ"] = "w";
    a["з"] = "3";
    a["х"] = "x";
    a["ъ"] = "b";
    a["Ф"] = "o";
    a["Ы"] = "bl";
    a["В"] = "b";
    a["А"] = "А";
    a["П"] = "N";
    a["Р"] = "P";
    a["О"] = "O";
    a["Л"] = "N";
    a["Д"] = "A";
    a["Ж"] = "X";
    a["Э"] = "3";
    a["ф"] = "o";
    a["ы"] = "bl";
    a["в"] = "B";
    a["а"] = "a";
    a["п"] = "n";
    a["р"] = "p";
    a["о"] = "o";
    a["л"] = "n";
    a["д"] = "A";
    a["ж"] = "x";
    a["э"] = "3";
    a["Я"] = "R";
    a["Ч"] = "4";
    a["С"] = "C";
    a["М"] = "M";
    a["И"] = "N";
    a["Т"] = "T";
    a["Ь"] = "b";
    a["Б"] = "b";
    a["Ю"] = "lo";
    a["я"] = "R";
    a["ч"] = "4";
    a["с"] = "c";
    a["м"] = "m";
    a["и"] = "n";
    a["т"] = "T";
    a["ь"] = "b";
    a["б"] = "b";
    a["ю"] = "lo";
    a["Є"] = "E";
    a["є"] = "E";
    a["Ι"] = "I";
    a["ι"] = "I";

    for (const i in word) {
      if (Object.hasOwn(word, i)) {
        if (a[word[i]] === undefined) {
          answer += word[i];
        } else {
          answer += a[word[i]];
        }
      }
    }

    return answer;
  }

  function checkEveryLetter(name) {
    let newName = "";
    for (let i = 0; i < name.length; i++) {
      const code = name.codePointAt(i);
      if (code - 119808 >= 0 && code - 119808 < 1025) {
        newName += String.fromCodePoint(((code - 119808) % 52) + 65);
      } else if (code >= 56745 || (code >= 9728 && code <= (9728 + 1024))) {
        newName = newName.toString();
      } else {
        newName += transliterate(String.fromCodePoint(code));
      }
    }

    return newName;
  }

  const getModAuthor = () => checkEveryLetter($(".author").text()
    .replace(/\s/gi, "_")
    .replace(/[[(\]){}.]/gi, ""))
    /* eslint no-control-regex: off */
    .replace(/\s?[\u0000-\u001F\u007B-\uFFFF]\s?/gi, "");

  const getModName = () => $(".page-title .active").text()
    .replace(/Bibo\+/gi, "Bibo-Plus")
    .replace(/B\+/gi, "Bibo-Plus")
    .replace(/\s?[[(]TBSE(\/FTM)?[\])]/gi, "-TBSE$1")
    .replace(/TBSE(\/(FTM))/gi, "TBSE-$2")
    .replace(/\s?\[(\w+)\]$/gi, "-$1")
    .replace(/\s?\(F\)$/gi, "-Female")
    .replace(/\s?\(M\)$/gi, "-Female")
    .replace(/(\s-\s|\.|\s\/\s)/gi, "-")
    .replace(/(\sand\s|\s?&\s?)/gi, "+")
    .replace(/Hair (\d+)(\+\d+)/gi, "Hair-$1$2")
    .replace(/\s#(\d+)/gi, "-$1")
    .replace(/\s\(All\sFaces\)/gi, "-All_Faces")
    .replace(/(\[(.*)\]\s?)(.*)/gi, "$3-$2")
    .replace(/\s[\u0000-\u001F\u007B-\uFFFF]\s/gi, "-")
    .replace(/['?\\/*:"<>|,!]/gi, "")
    .replace(/\s?[\u0000-\u001F\u007B-\uFFFF]\s?/gi, "")
    .replace(/\s/gi, "_");

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if ($(mutation.target).attr("id") === "__next") {
          const downloadsButton = $(".downloads");
          if ($(downloadsButton).length <= 0) {
            return;
          }

          $(downloadsButton).on("click", () => {
            GM_setClipboard(`[${getModAuthor()}] ${getModName()}`);
          });
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("#__next")[0];
    const config = { attributes: false, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  setupMutationObserver();
});
