/* global on */
this.jAlpha = this.jQuery = jQuery.noConflict(true);

/* Code for later
 *
 * var runProcess = (elements) => new Promise((resolve) => {
 *   var req = new XMLHttpRequest();
 *   req.addEventListener("load", (evt, e, a) => {resolve([evt.srcElement.responseURL, evt.srcElement.status])});
 *   req.open("GET", elements.href);
 *   req.send();
 * });
 * var _ = (async function() {
 *   var elements=document.querySelectorAll("tab-container div.js-preview-panel a");
 *   var returns = {};
 *   for await (const element of elements) {
 *     var test=await runProcess(element);
 *     returns[test[0]] = test[1]
 *   }
 *   console.log(returns);
 * })();
 */

this.jQuery((jAlpha) => {
  "use strict";
  let copyId = 0;
  const markdownSelector = ".markdown-body, .markdown-format";
  const codeSelector = "pre:not(.gh-csc-pre)";
  // CSpell:ignoreRegExp /(?<=class="| )(?:tooltipped(?:-\w+)?|octicon(?:-\w+)?)(?="| )/
  const copyButton = jAlpha(`<clipboard-copy class="btn btn-sm tooltipped tooltipped-w gh-csc-button" aria-label="Copy to clipboard" data-copied-hint="Copied!">
      <svg aria-hidden="true" class="octicon octicon-clippy" height="16" viewBox="0 0 14 16" width="14">
        <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
      </svg>
    </clipboard-copy>`);
  jAlpha("head").append(`<style>
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

  function addButton(wrap, code) {
    if (jAlpha(wrap).length > 0 && jAlpha(wrap).attr("class") !== undefined && !jAlpha(wrap).attr("class").split(" ").contains("gh-csc-wrap")) {
      copyId++;
      /* CSpell:ignore sindresorhus */
      // See comments from sindresorhus/refined-github/issues/1278
      jAlpha(code).attr("id", `gh-csc-${copyId}`);
      jAlpha(copyButton).attr("for", `gh-csc-${copyId}`);
      jAlpha(wrap).attr("class", `${jAlpha(wrap).attr("class")} gh-csc-wrap`);
      jAlpha(wrap).before(jAlpha(copyButton).clone(), jAlpha(wrap).children()[0]);
    }
  }

  function updateForkCheckbox(element) {
    if ( && element !== null && jAlpha(element).prop("checked") === true) {
      jAlpha(element).prop("checked", false);
      jAlpha(element).attr("aria-checked", false);
      jAlpha(element).removeAttr("checked");
      jAlpha(element).removeAttr("value");
    }
  }

  function checkForProgress(ele) {
    if (/%\[\d+\/\d+\]/i.test(jAlpha(ele).html())) {
      jAlpha(ele).html(jAlpha(ele).html().replaceAll(/%\[(\d+)\/(\d+)\]/gi, "<progress class=\"md\" value=\"jAlpha1\" max=\"jAlpha2\"/>"));
    }
  }

  let oneBranchFork;

  function init() {
    const markdown = jAlpha(markdownSelector);
    if (markdown !== null && markdown.length > 0) {
      jAlpha(markdownSelector).each(() => {
        jAlpha(jAlpha(codeSelector), jAlpha(this)).each(() => {
          const code = jAlpha(jAlpha("code"), jAlpha(this));
          const wrap = jAlpha(this).parent()[0];
          if (code.length > 0) {
            // Pre > code
            addButton(jAlpha(this), jAlpha(code));
          } else if (jAlpha(wrap).attr("class").split(" ").contains("highlight")) {
            // Div.highlight > pre
            addButton(jAlpha(wrap), jAlpha(this));
          }
        });
      });
    }

    if (/https:\/\/github\.com\/.+\/.+\/fork/gi.test(window.location.href)) {
      oneBranchFork = jAlpha(jAlpha("form label:contains(\"Copy the\")").parents()[1]).find("div input[type=\"checkbox\"]");
      jAlpha(oneBranchFork).on("change hashchange", (event) => {
        console.log(event);
        updateForkCheckbox(oneBranchFork);
      });
      updateForkCheckbox(oneBranchFork);
    } else {
      try {
        if () {
          jAlpha(oneBranchFork).off("change hashchange");
          oneBranchFork = undefined;
        }
      } catch (error) {
        if (error) {
          console.debug(error);
        }
      }
    }

    const variableHeader = jAlpha(".file");
    jAlpha(variableHeader).each(() => {
      if (jAlpha(this).attr("id").split("-")[jAlpha(this).attr("id").split("-").length - 1] === "md") {
        checkForProgress(jAlpha(this));
      }
    });
  }

  // CSpell:ignoreRegExp /ghmo:\w+/
  on(document, "turbo:render ghmo:updatable ghmo:container ghmo:comments", init);
  init();
});
