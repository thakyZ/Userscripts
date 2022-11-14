// ==UserScript==
// @name         FFLogs To XIV Analysis
// @namespace    NekoBoiNick.Web.FFLogs.ButtonToXIVAnalysis
// @version      1.0.3
// @description  Adds a button to FFLogs reports to redirect to XIV Analysis
// @author       Neko Boi Nick
// @match        https://www.fflogs.com/reports/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fflogs.com
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/fflogs_toxivanalysis/fflogs_toxivanalysis.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/fflogs_toxivanalysis/fflogs_toxivanalysis.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, fights */

$(document).ready(() => {
  var mainMenu = $("#main-menu");
  var createButton = () => {
    return `<div class="goto-xivanalysis"><div class="xivanalysis-btn"><div class="xivanalysis-icon" alt="XIV Analysis"></div><div class="xivanalysis-label"><div class="xivanalysis-text">XIV Analysis</div></div></div></div>`;
  };
  var createCSS = () => {
    $("head").append(`<style>
  .goto-xivanalysis {
    flex-shrink: 0;
    position: relative;
  }
  .xivanalysis-btn {
    align-items: center;
    justify-content: center;
    padding: 8px;
    flex-direction: row;
    gap: 8px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    transition: background .24s ease-out;
    background: linear-gradient(90deg, #141414 0%, #1E1E1E 100%);
    border: 1px solid #323232;
    box-shadow: 0px 2px 4px rgba(0,0,0,.95);
    border-radius: 4px;
    padding: 8px 8px 8px 12px;
    cursor: pointer;
  }
  .xivanalysis-btn:hover {
    background: linear-gradient(90deg, #144662 0%, #13784D 100%);
  }
  .xivanalysis-icon {
    color: #b2b2b2;
    width: 18px;
    height: 18px;
    font-size: 18px;
    transition: color .14s ease-out;
    display: inline-block;
    font: normal normal normal 14px/1 'Material-Design-Iconic-Font';
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .xivanalysis-icon:before {
    content: '';
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAABj1BMVEUAAACfJjafLUCfJTafJTconyScJy2hIzSfJTafJjafJTaeJjefJjafJTagJjefJDafJTafJTafJTafJTafJTagJzegJjWgKTqfJDalIEGfJTafJTafJTafJTefJTegJDefJTafJTefJTafJTafJjafJTafJTafJTefJTafJTafJjafJjWfJjcoX4qfJTafJTafJTafJTafJTefJjefJTefJTafJTegJTafJjagJTagJTefJDafJjafJTagJTagJDefJjefJTafJTefJTafJTefJTefJTafJTafJjaeJTafJTYlPp6eJTegIDMlPp4lPp4mPp0lPp4lP50jcGUnniWfJjYlPp0lPp0lP54lPp0lP54nmiUlPp0nniUmPp4nnSUlP54lPp4lPZwlPp4lPp0lPp4lPp4mPp4lPpwonSYnnSUlPp4nniUnniUlPp0nniUnniUnnSQmnyYlPp4nnSYlPp4nnSUonSUoniUlPZ0lPp4oniYlP54lPp0lPp4oniYpniUnnCefJjcmP54oniaGBrKVAAAAgnRSTlMAyQP8+TgGCe3p8w32Kygb4HzX1MAeFxE+B4OAnXc2JKWhiNuzkVo5sFAzIRQEzcSrjGbi3qhtamNXTUVBcl8w8bbQvJhJ5blUmpX65w/2sj5bDwn6mdnKUDMZFfDw08l6ZiDq4IhvRyQk4b+6mJWOcFQq5aakfWVGKijTqp2PrD00uwaqigAADgVJREFUeNrU2ndTE0EYBvAnd2cuvccAMQUNGBGxgBEViSKgorH37tjb2PtY5okf3FwUDe5tktskGn5/Mgw87G7Yd99d9CH/KFYdLcEcVpshMohVZo9OJrG6lH0kK1hVQl6ShobVpHyMNV6sJod9tLjQ73ans/gpnOdPefS5NMnY0N5geTRv8JcM+pqZp40B9Bd3CA1Cc7ThcaOvhCeY+B17MBOgnXn0leQUyUA6hZrKrghtGf1VeVTirAscmj+XMCgxhL6yjW042F/b4SjbMOFHP0l52VpsHH1lO1tb7LOiNGSwJSOLntlxWOkQ1do+9EyGnFWoMVpLoGd2k/SaTieHrelB9MpYgHR6ihvcTsG/3L5TU7SMQ0pL5lJYYU+MbQiE0Ss7WReExNr5/SS923aEl79QipP/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");
    position:absolute;
    width: 18px;
    height: 18px;
    background-size: contain;
  }
  .xivanalysis-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .xivanalysis-text {
    margin-top: 0;
    margin-right: 6px;
    transition: color .14s ease-out;
    font-weight: 400;
    font-size: 13px;
    line-height: 17px;
    color: #b2b2b2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .xivanalysis-btn:hover .xivanalysis-text {
    color: #fff;
  }
  .xivanalysis-ply-btn-box {
    border: none !important;
    padding: 0 !important;
    min-width: 22px !important;
  }
  .xivanalysis-plyr-btn {
    cursor: pointer;
    max-height: 15px;
    min-width: 18px;
    min-height: 18px;
    display: block !important;
    padding: 2px;
    border: 1px solid #323232;
    border-radius: 4px;
  }
  .xivanalysis-plyr-btn:hover {
    background: linear-gradient(90deg, #144662 0%, #13784D 100%);
  }
</style>`);
  };
  createCSS();
  $($(".report-bar-top-right-section").children()[0]).before(createButton());
  $(".goto-xivanalysis > .xivanalysis-btn").on("click", () => {
    const SiteRegex = new RegExp(/https:\/\/(www\.)?fflogs.com\/reports\/([a-zA-Z0-9]+)\/?(#.*)?/g);
    const FightRegex = new RegExp(/[#&]fight=(\d{1,}|last)/g);
    const SourceRegex = new RegExp(/[#&]source=(\d{1,})/g);
    const location = window.location.href;
    if (location.match(SiteRegex) !== null) {
      let computed = `https://xivanalysis.com/fflogs/${window.location.href.replace(SiteRegex, "$2")}`;
      if (location.match(FightRegex) !== null) {
        try {
          let fightNumber = parseInt(location.match(FightRegex)[0].replace(FightRegex, "$1"));
          if (location.match(FightRegex)[0].replace(FightRegex, "$1") === "last") {
            fightNumber = fights.length;
          }
          computed = `${computed}/${fightNumber}`;
        } catch (e) {
          console.error({message:"Failed to parse fight int",stack:e});
        }
      }
      if (location.match(SourceRegex) !== null) {
        try {
          computed = `${computed}/${parseInt(location.match(SourceRegex)[0].replace(SourceRegex, "$1"))}`;
        } catch (e) {
          console.error({message:"Failed to parse source int",stack:e});
        }
      }
      let win = window.open(computed, "_blank");
      if (win) {
        win.focus();
      } else {
        alert("Please allow popups for this website");
      }
    }
  });

  const SetupMutationObserver = () => {
    const targetNode = $("#report-view-contents")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && $(mutation.target).attr("class") === "summary-table report dataTable") {
          const WhichTab = () => {
            if ($("a:contains(\"Damage Done\").filter-type-tab.drop", $("#filter-type-tabs")).attr("class").split(" ").includes("selected")) {
              return { type: 0, check: true };
            } else if ($("a:contains(\"Healing\").filter-type-tab.drop", $("#filter-type-tabs")).attr("class").split(" ").includes("selected")) {
              return { type: 1, check: true };
            } else if ($("a:contains(\"Damage Taken\").filter-type-tab.drop", $("#filter-type-tabs")).attr("class").split(" ").includes("selected")) {
              return { type: 2, check: true };
            } else {
              return { type: -1, check: false };
            }
          };
          if (WhichTab().check && ($("span#filter-source-text").text() === "All Sources" || $("span#filter-source-text").text() === "All Friendlies")) {
            $("table.summary-table.report.dataTable tbody tr td.main-table-name.report-table-name", $("#summary")).each(function(i, e) {
              if ($(this).text().includes("Limit Break")) {
                return;
              }
              if ($("tr td", $(this)).length === 2) {
                const xivAnalysisBtn = $(`<td class="xivanalysis-ply-btn-box"><div class="xivanalysis-plyr-btn xivanalysis-icon" id="icon-9-0-5"></td>`);
                $(xivAnalysisBtn).insertAfter($("tr td", $(this))[$("tr td", $(this)).length - 1]);
                $(xivAnalysisBtn).on("click", function() {
                  const SiteRegex = new RegExp(/https:\/\/(www\.)?fflogs.com\/reports\/([a-zA-Z0-9]+)\/?(#.*)?/g);
                  const FightRegex = new RegExp(/[#&]fight=(\d{1,}|last)/g);
                  const location = window.location.href;
                  if (location.match(SiteRegex) !== null) {
                    let computed = `https://xivanalysis.com/fflogs/${window.location.href.replace(SiteRegex, "$2")}`;
                    let sourceId = 0;
                    try {
                      sourceId = parseInt($($(this).parents("td.main-table-name.report-table-name").parent()).attr("id").split("-")[3]);
                    } catch (e) {
                      console.error({message:"Failed to parse source int",stack:e});
                    }
                    if (location.match(FightRegex) !== null) {
                      try {
                        let fightNumber = parseInt(location.match(FightRegex)[0].replace(FightRegex, "$1"));
                        if (location.match(FightRegex)[0].replace(FightRegex, "$1") === "last") {
                          fightNumber = fights.length;
                        }
                        computed = `${computed}/${fightNumber}/${sourceId}`;
                      } catch (e) {
                        console.error({message:"Failed to parse fight int",stack:e});
                      }
                    }
                    let win = window.open(computed, "_blank");
                    if (win) {
                      win.focus();
                    } else {
                      alert("Please allow popups for this website");
                    }
                  }
                });
              }
            });
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", function() {
      observer.disconnect();
    });
  };

  SetupMutationObserver();
});
