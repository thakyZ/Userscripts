// ==UserScript==
// @name         Etro.gg Changes
// @namespace    NekoBoiNick.Web.Etro.Changes
// @version      1.0.0
// @description  Various Changes to Etro.gg
// @author       Neko Boi Nick
// @match        https://etro.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etro.gg
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/etro_changes/etro_changes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/etro_changes/etro_changes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const insertStyles = () => {
    const etroChangesCheck = $("#nbnEtroStyles");
    if (etroChangesCheck.length > 0) {
      return;
    }

    $("head").append(`
<style id="nbnEtroStyles">
.sortButtonsContainer {
    display: grid;
    gap: 5px;
    width: 160px;
    height: 50%;
    position: -webkit-sticky;
    top: 50px;
    position: sticky;
    padding: 10px 0 0 0;
}
.sortButtonsContainer > button {
    grid-column: 1;
}
.etro-gearset-sticky-sidebar + .mantine-Stack-root div.single > div {
    grid-column: 1;
}
.etro-gearset-sticky-sidebar + .mantine-Stack-root div.inGame {

}
</style>`);
  };

  const inGameLayoutMap = {
    0: "Primary Tool",
    1: null,
    2: "Head",
    3: "Secondary Tool",
    4: "Body",
    5: "Earrings",
    6: "Hands",
    7: "Necklace",
    8: "Legs",
    9: "Bracelet",
    10: "Feet",
    11: "Left Ring",
    12: "Food",
    13: "Right Ring",
    14: "FC Actions",
    15: "Notes"
  };

  const defaultLayoutMap = {
    0: "Primary Tool",
    1: "Secondary Tool",
    2: "Head",
    3: "Body",
    4: "Hands",
    5: "Legs",
    6: "Feet",
    7: "Earrings",
    8: "Necklace",
    9: "Bracelet",
    10: "Left Ring",
    11: "Right Ring",
    12: "Food",
    13: "FC Actions",
    14: "Notes"
  };

  const blank = $("<div></div>");

  const handleInGame = element => {
    if ($($(element).children("div")[1]).html() !== $(blank).html()) {
      $($(element).children("div")[0]).after(blank);
    }

    for (const [key, value] of Object.entries(inGameLayoutMap)) {
      if (key === "0" || key === "1") {
        continue;
      }

      $(element).children("div").find(`:contains('${value}')`).parent("div:not([class])").detach().insertAfter($(element).children("div")[key - 1]);
      $(element).children("div").find(`:contains('${value}')`).parent("div:not([class])").css({ gridColumn: (key % 2) + 1 });
    }
  };

  const unhandleInGame = element => {
    if ($($(element).children("div")[1]).html() !== $(blank).html()) {
      $($(element).children("div")[1]).remove();
    }

    for (const [key, value] of Object.entries(defaultLayoutMap)) {
      if (key === "0") {
        continue;
      }

      $(element).children("div").find(`:contains('${value}')`).parent("div:not([class])").detach().insertAfter($(element).children("div")[key - 1]);
      $(element).children("div").find(`:contains('${value}')`).parent("div:not([class])").removeAttr("style");
    }
  };

  const setSortType = type => {
    const grid = $(".etro-gearset-sticky-sidebar + .mantine-Stack-root > div:nth-child(3)");
    if (type === "default") {
      if ($(grid).hasClass("single")) {
        $(grid).removeClass("single");
      }

      if ($(grid).hasClass("inGame")) {
        $(grid).removeClass("inGame");
        unhandleInGame(grid);
      }
    } else if (type === "single") {
      if ($(grid).hasClass("inGame")) {
        $(grid).removeClass("inGame");
        unhandleInGame(grid);
      }

      $(grid).addClass("single");
    } else if (type === "inGame") {
      if ($(grid).hasClass("single")) {
        $(grid).removeClass("single");
      }

      $(grid).addClass("inGame");
      handleInGame(grid);
    }
  };

  const addSortButtons = () => {
    const etroChangesCheck = $(".sortButtonsContainer");
    if (etroChangesCheck.length > 0) {
      return;
    }

    insertStyles();
    const stackRoot = $(".etro-gearset-sticky-sidebar + .mantine-Stack-root");
    const sortButtonsContainer = $("<div class=\"sortButtonsContainer\"></div>");
    const defaultSortButton = $("<button type=\"button\" class=\"bp3-button bp3-outlined etro-button-hover-primary-fill\" tabindex=\"0\"></button>");
    const defaultSortIcon = $("<span icon=\"defaultSort\" class=\"bp3-icon\">"
      + "<svg data-icon=\"defaultSort\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">"
      + "<desc>defaultSort</desc>"
      + "<path d=\"M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z\" fill-rule=\"evenodd\">"
      + "</path></svg></span>");
    const singleSortButton = $("<button type=\"button\" class=\"bp3-button bp3-outlined etro-button-hover-primary-fill\" tabindex=\"0\"></button>");
    const singleSortIcon = $("<span icon=\"singleSort\" class=\"bp3-icon\">"
      + "<svg data-icon=\"singleSort\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">"
      + "<desc>singleSort</desc>"
      + "<path d=\"M8,2H16A2,2 0 0,1 18,4V20A2,2 0 0,1 16,22H8A2,2 0 0,1 6,20V4A2,2 0 0,1 8,2M8,10V14H16V10H8M8,16V20H16V16H8M8,4V8H16V4H8Z\" fill-rule=\"evenodd\">"
      + "</path></svg></span>");
    const inGameSortButton = $("<button type=\"button\" class=\"bp3-button bp3-outlined etro-button-hover-primary-fill\" tabindex=\"0\"></button>");
    const inGameSortIcon = $("<span icon=\"inGameSort\" class=\"bp3-icon\">"
      + "<svg data-icon=\"inGameSort\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">"
      + "<desc>inGameSort</desc>"
      + "<path d=\"M7.97,16L5,19C4.67,19.3 4.23,19.5 3.75,19.5A1.75,1.75 0 0,1 2,17.75V17.5L3,10.12C3.21,7.81 5.14,6 7.5,6H16.5C18.86,6 20.79,7.81 21,10.12L22,17.5V17.75A1.75,1.75 0 0,1 20.25,19.5C19.77,19.5 19.33,19.3 19,19L16.03,16H7.97M7,8V10H5V11H7V13H8V11H10V10H8V8H7M16.5,8A0.75,0.75 0 0,0 15.75,8.75A0.75,0.75 0 0,0 16.5,9.5A0.75,0.75 0 0,0 17.25,8.75A0.75,0.75 0 0,0 16.5,8M14.75,9.75A0.75,0.75 0 0,0 14,10.5A0.75,0.75 0 0,0 14.75,11.25A0.75,0.75 0 0,0 15.5,10.5A0.75,0.75 0 0,0 14.75,9.75M18.25,9.75A0.75,0.75 0 0,0 17.5,10.5A0.75,0.75 0 0,0 18.25,11.25A0.75,0.75 0 0,0 19,10.5A0.75,0.75 0 0,0 18.25,9.75M16.5,11.5A0.75,0.75 0 0,0 15.75,12.25A0.75,0.75 0 0,0 16.5,13A0.75,0.75 0 0,0 17.25,12.25A0.75,0.75 0 0,0 16.5,11.5Z\" fill-rule=\"evenodd\">"
      + "</path></svg></span>");
    $(sortButtonsContainer).insertAfter(stackRoot);
    $(defaultSortButton).appendTo(sortButtonsContainer);
    $(defaultSortIcon).appendTo(defaultSortButton);
    $(singleSortButton).appendTo(sortButtonsContainer);
    $(singleSortIcon).appendTo(singleSortButton);
    $(inGameSortButton).appendTo(sortButtonsContainer);
    $(inGameSortIcon).appendTo(inGameSortButton);
    $(defaultSortButton).on("click", () => {
      setSortType("default");
    });
    $(singleSortButton).on("click", () => {
      setSortType("single");
    });
    $(inGameSortButton).on("click", () => {
      setSortType("inGame");
    });
  };

  const funnyPaddingGone = () => {
    let id = -1;
    id = setInterval(() => {
      const soup = () => {
        const elements = [];
        $("*").each((index, element) => {
          if ($(element).attr("id") !== undefined && /etro-ad-[\w-]+/.test($(element).attr("id"))) {
            elements.push(element);
          }
        });
        return elements;
      };

      const gottenSoup = soup();

      for (const [, element] of Object.entries(gottenSoup)) {
        $(element).css({ display: "none" });
      }

      if (gottenSoup.length > 0) {
        clearInterval(id);
      }
    }, 100);
  };

  const runScript = () => {
    if (/https:\/\/etro\.gg\/gearset\/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi.test(window.location.href)) {
      addSortButtons();
    }

    funnyPaddingGone();

    $(".mantine-Header-root .mantine-Group-root .mantine-Group-root:nth-child(2) a").on("click", () => {
      funnyPaddingGone();
    });
    $("body").on("load", () => {
      funnyPaddingGone();
    });
    $(".mantine-Header-root .mantine-Group-root .mantine-Group-root:nth-child(3) .mantine-UnstyledButton-root").on("click", () => {
      let id = -1;
      id = setInterval(() => {
        const element = $(".mantine-Header-root .mantine-Group-root .mantine-Group-root .mantine-Menu-dropdown");

        if ($(element).length > 0) {
          $(".mantine-Header-root .mantine-Group-root .mantine-Group-root .mantine-Menu-dropdown a").on("click", () => {
            funnyPaddingGone();
          });
          $(".mantine-Header-root .mantine-Group-root .mantine-Group-root .mantine-Menu-dropdown button").on("click", () => {
            funnyPaddingGone();
          });

          clearInterval(id);
        }
      }, 100);
    });
  };

  const setupMutationObserver = () => {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, _) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && $(mutation.target).attr("class").includes("mantine-AppShell-main")) {
          runScript();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  setupMutationObserver();
});
