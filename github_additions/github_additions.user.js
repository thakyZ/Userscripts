// ==UserScript==
// @name         Github Additions
// @namespace    NekoBoiNick.Web.Github.Additions
// @version      1.0.2.1
// @description  try to take over the world!
// @author       Neko Boi Nick
// @match        https://gist.github.com/*
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://github.com/thakyZ/GitHub-userscripts/raw/master/mutations.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/github_additions/github_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/github_additions/github_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

$(document).ready(() => {
  "use strict";
  let copyId = 0;
  const markdownSelector = ".markdown-body, .markdown-format";
  const codeSelector = "pre:not(.gh-csc-pre)";
  const copyButton = $(`<clipboard-copy class="btn btn-sm tooltipped tooltipped-w gh-csc-button" aria-label="Copy to clipboard" data-copied-hint="Copied!">
      <svg aria-hidden="true" class="octicon octicon-clippy" height="16" viewBox="0 0 14 16" width="14">
        <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
      </svg>
    </clipboard-copy>`);
  $("head").append(`<style>
    .gh-csc-wrap {
      position: relative;
    }
    .gh-csc-wrap:hover .gh-csc-button {
      display: block;
    }
    .gh-csc-button {
      display: none;
      padding: 3px 6px;
      position: absolute;
      top: 3px;
      right: 3px;
      z-index: 20;
    }
    .gh-csc-wrap.ghd-code-wrapper .gh-csc-button {
      right: 31px;
    }
    .gh-csc-button svg {
      vertical-align: text-bottom;
    }
    .file progress.md {
      width: 100%
      width: -moz-available;         /* WebKit-based browsers will ignore this. */
      width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
      width: fill-available;
    }
  </style>`);

  const addButton = (wrap, code) => {
    if ($(wrap).length > 0 && $(wrap).attr("class") !== undefined && !$(wrap).attr("class").split(" ").contains("gh-csc-wrap")) {
      copyId++;
      // See comments from sindresorhus/refined-github/issues/1278
      $(code).attr("id", `gh-csc-${copyId}`);
      $(copyButton).attr("for", `gh-csc-${copyId}`);
      $(wrap).attr("class", `${$(wrap).attr("class")} gh-csc-wrap`);
      $(wrap).before($(copyButton).clone(), $(wrap).children()[0]);
    }
  };

  const checkForProgress = ele => {
    if (/%\[\d+\/\d+\]/i.test($(ele).html())) {
      $(ele).html($(ele).html().replaceAll(/%\[(\d+)\/(\d+)\]/gi, "<progress class=\"md\" value=\"$1\" max=\"$2\"/>"));
    }
  };

  const init = () => {
    const markdown = $(markdownSelector);
    if (markdown.length > 0) {
      $(markdownSelector).each(() => {
        $($(codeSelector), $(this)).each(() => {
          const code = $($("code"), $(this));
          const wrap = $(this).parent()[0];
          if (code.length > 0) {
            // Pre > code
            addButton($(this), $(code));
          } else if ($(wrap).attr("class").split(" ").contains("highlight")) {
            // Div.highlight > pre
            addButton($(wrap), $(this));
          }
        });
      });
    }

    if (/https:\/\/github\.com\/.+\/.+\/fork/gi.test(window.location.href)) {
      const oneBranchFork = $("form#fork_repository input[type=\"checkbox\"]#fork_repository_one_branch_fork");
      if (oneBranchFork && $(oneBranchFork).prop("checked") === true) {
        $(oneBranchFork).prop("checked", false);
      }
    }

    const variableHeader = $(".file");
    $(variableHeader).each(() => {
      if ($(this).attr("id").split("-")[$(this).attr("id").split("-").length - 1] === "md") {
        checkForProgress($(this));
      }
    });
  };

  document.addEventListener("turbo:render", init);
  document.addEventListener("ghmo:container", init);
  document.addEventListener("ghmo:comments", init);
  init();
});
