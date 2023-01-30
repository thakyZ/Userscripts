// ==UserScript==
// @name         Glamour Dresser Copy Author Name
// @namespace    NekoBoiNick.Web.GlamourDresser.CopyAuthorName
// @version      1.0.1
// @description  Adds a copy author name button to Nexus Mods mod page.
// @author       Neko Boi Nick
// @match        https://www.glamourdresser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glamourdresser.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      darkDashboard: {
        type: "select",
        choices: ["Default", "Dark"],
        default: "Default"
      }
    },
    onSave: val => changeUI(val)
  });

  const changeUI = val => {
    if (!/https:\/\/(www\.)?glamourdresser\.com\/wp-admin/gi.test(window.location.href)) {
      return false;
    }

    if (val.darkDashboard === "Default") {
      if ($("body").attr("class").includes("nbn_dark")) {
        $("body").removeClass("nbn_dark");
      }
    } else if (!$("body").attr("class").includes("nbn_dark")) {
      $("body").addClass("nbn_dark");
    }
  };

  changeUI(config.get("darkDashboard"));

  const creatorInfo = () => {
    if (window.location.href.includes("mods") || window.location.href.includes("poses") || window.location.href.includes("presets") || window.location.href.includes("resources")) {
      return $("div.elementor-author-box__text");
    }

    if (window.location.href.includes("author")) {
      return $("div.elementor-author-box__text div:first-child h4");
    }
  };

  const defaultDarkBG = "#242525";
  const variableTextLength = () => {
    if ($(".elementor-author-box__name a h4").text().toString().length > "a quick brown fox".length) {
      return "calc((100% + 58px) * -1)";
    }

    return "-58px;";
  };

  const calcVariableCSS = () => {
    if ($(".elementor-author-box__name a h4").text().toString().length <= "a quick brown fox".length) {
      return `width: calc(100% - (58px * 2));
  max-width: calc(100% - (58px * 2));
  margin-left: 58px;`;
    }

    return "";
  };

  const createObjects = () => {
    /* Old code
    const AuthorBoxHeight = () => {
      return (-1 * (33 + (($(creatorInfo()).outerHeight() - 33) / 2)));
    };
    const AuthorBoxWidth = () => {
      return (-1 * ((174.11 / 2) + ($(creatorInfo()).outerWidth() / 2)));
    };
    */
    let tempButton = `<div class="elementor-element elementor-element-76f0e0a elementor-align-center elementor-widget elementor-widget-button copy-author-widget">
    <div class="elementor-widget-container">
			  <div class="elementor-button-wrapper">
			    <button class="elementor-button-link elementor-button elementor-size-xs action-copy-author" role="button" style="padding: 10px 20px;">
						<span class="elementor-button-content-wrapper">
						  <span class="elementor-button-text">
                <img class="clipboard" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgyIiBoZWlnaHQ9IjE4MiIgdmlld0JveD0iMCAwIDE4MiAxODIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSAyNC44MTgsNDkuNjM2NCBWIDE2NS40NTUgSCAxNDAuNjM3IFYgMTgyIEggMjQuODE4IGMgLTkuMSwwIC0xNi41NDU1LC03LjQ0NSAtMTYuNTQ1NSwtMTYuNTQ1IFYgNDkuNjM2NCBIIDI0LjgxOCBNIDE1Ny4xODEsMTYuNTQ1NSBjIDkuMSwwIDE2LjU0Niw3LjQ0NTQgMTYuNTQ2LDE2LjU0NTQgdiA5OS4yNzMxIGMgMCw5LjEgLTcuNDQ2LDE2LjU0NSAtMTYuNTQ2LDE2LjU0NSBIIDU3LjkwODkgYyAtOS4xLDAgLTE2LjU0NTUsLTcuNDQ1IC0xNi41NDU1LC0xNi41NDUgViAzMy4wOTA5IGMgMCwtOS4xIDcuNDQ1NSwtMTYuNTQ1NCAxNi41NDU1LC0xNi41NDU0IEggODQuMjE2MSBDIDg3LjY5MDcsNi45NDkwOSA5Ni43OTA3LDAgMTA3LjU0NSwwIDExOC4zLDAgMTI3LjQsNi45NDkwOSAxMzAuODc1LDE2LjU0NTUgaCAyNi4zMDYgbSAtNDkuNjM2LDAgYyAtNC41NSwwIC04LjI3MjUsMy43MjI3IC04LjI3MjUsOC4yNzI3IDAsNC41NSAzLjcyMjUsOC4yNzI3IDguMjcyNSw4LjI3MjcgNC41NSwwIDguMjcyLC0zLjcyMjcgOC4yNzIsLTguMjcyNyAwLC00LjU1IC0zLjcyMSwtOC4yNzI3IC04LjI3MiwtOC4yNzI3IE0gNzQuNDU0Myw0OS42MzY0IFYgMzMuMDkwOSBIIDU3LjkwODkgViAxMzIuMzY0IEggMTU3LjE4MSBWIDMzLjA5MDkgaCAtMTYuNTQ1IHYgMTYuNTQ1NSB6IiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+Cg==" alt="Copy Author Name">
              </span>
		        </span>
					</button>
        </div>
			</div>
    </div>`;
    tempButton = $(tempButton);
    $(creatorInfo()).after(tempButton);
    $(".action-copy-author").on("click", () => {
      GM_setClipboard($(".elementor-author-box__name").text().replace(/\s+$/g, "").replace(/^\s+/g, "").replace(" ", "_"));
    });
  };

  const blankAvatar = "data:image/jpeg;base64,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"
    + "ygD//2Q==";

  window.prototype += { soup: blankAvatar };

  const placeholderImage = "data:image/png;base64,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"
    + "fTw9fjd4uXS19rKz9LEyMvDx8rBxcjAxMe/w8bHy87M0NPU2Nvd4eTk6Ovy9/rY3eDJztG9wsW0ubyyt7q3u762ur21uby0uLuzt7q4vL+7v8LIzdDV2t3BxsmzuLu3vL+4vcC5vsG6vsG5vcC1ur3Q1djl6u3p7fDr7/Lo7O/x9fjy9vnX2969wcS8wMPW2t3v8/b0+Pvq7vH"
    + "1+fzt8fSxtbjGys3l6ezk6eywtLfb4OPz9/rh5eiusrWytrna3+Lx9vmwtbi2u77g5Oe+wsW6v8Lc4eTz+Pu7wMOus7bi5+rM0dStsrXDyMvAxcjn6+7X3N/T19rw9PevtLfV2dyxtrnIzM+8wcTh5unU2dzf5Ofg5ejP1NfO09b0+fyrsLPHzM/m6u31+v3Eycz3/P/Z3uHc4"
    + "OPj6Ou/xMfb3+K+w8bFys3Cx8rL0NPT2NvW297u8vXs8PPi5un2+v2vs7ba3uHe4+assbTY3N/CxsnLz9LR1tnGy87P09bJzdDKztHS1tnQ1NfO0tXj5+rR1dj2+/6qr7Le4uXN0dStsbTN0tX3+/7f4+bFyczZ3eAOkagtAAAACXBIWXMAAAsSAAALEgHS3X78AAAHkWlUWHR"
    + "YTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2M"
    + "SwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4NCiAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4NCiAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9"
    + "ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94Y"
    + "XAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNS0wOC0yOFQwODo"
    + "1NTo1NyswNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTYtMDQtMTVUMTA6NTc6MDMrMDc6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTYtMDQtMTVUMTA6NTc6MDMrMDc6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IjAwM"
    + "DAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTgyMkFBQkZBNjczMTZEN0Y"
    + "iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTg2M0QyNUU5MzIxNjgxMTgwODNFRThDNjRGODYxOUEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1ODYzRDI1RTkzMjE2ODExODA4M0VFOEM2NEY4NjE5QSI+DQogICAgICA8eG1wTU06SGlzdG9yeT4NC"
    + "iAgICAgICAgPHJkZjpTZXE+DQogICAgICAgICAgPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTg2M0QyNUU5MzIxNjgxMTgwODNFRThDNjRGODYxOUEiIHN0RXZ0OndoZW49IjIwMTUtMDgtMjhUMDg6NTU6NTcrMDc"
    + "6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIC8+DQogICAgICAgICAgPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gaW1hZ2UvanBlZyIgL"
    + "z4NCiAgICAgICAgICA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTk2M0QyNUU5MzIxNjgxMTgwODNFRThDNjRGODYxOUEiIHN0RXZ0OndoZW49IjIwMTUtMDgtMjhUMDk6Mzc6MzIrMDc6MDAiIHN0RXZ0OnNvZnR3YXJ"
    + "lQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iIC8+DQogICAgICAgICAgPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4MjJBQUJGQTY3M"
    + "zE2RDdGIiBzdEV2dDp3aGVuPSIyMDE2LTA0LTE1VDEwOjU3OjAzKzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIiAvPg0KICAgICAgICA8L3JkZjpTZXE+DQogICAgICA8L3htcE1"
    + "NOkhpc3Rvcnk+DQogICAgPC9yZGY6RGVzY3JpcHRpb24+DQogIDwvcmRmOlJERj4NCjwveDp4bXBtZXRhPg0KPD94cGFja2V0IGVuZD0iciI/Ptkb+uMAACBcSURBVHhe7d2PfxNV3i/wOWd+j6CIP7ZCOpN0BsiPmZpCa0ao7Qpyt6axWYqLshYrP1QWL/dRFIT2yqPPKvoo1"
    + "/vouvvcP/d+z8y0TZtpO0mD0M7nvWsKJUmbvL6fnHPmOz8kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCcXYxKnG8bplv4WfSNH6JVLnDNZvHp6C+Tk2wCJKBriq0x/iP4kiUrJjygaSpQSmf4CsE70wSlxiofC6dOUqkSmT1W6zQl6yckgyhVFUpN3BSAWzafEjfgEpULRdCNX6OWaJpdVSkn0+sXbAbBKZEN8hIqvi"
    + "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";

  const createPlaceholderImage = () => {
    $(".elementor-post.mods").children(".elementor-post__text").each(function () {
      if ($(this).prev().length === 0) {
        const Banner = `<a class="elementor-post__thumbnail__link" href="${$(".elementor-post__read-more", $(this)).attr("href")}"><div class="elementor-post__thumbnail"><img width="1608" height="881" src="`
          + placeholderImage
          + "\" class=\"attachment-grid size-grid\" alt=\"\" loading=\"lazy\"></div></a>";
        $(Banner).insertBefore($(this));
      }
    });
  };

  createPlaceholderImage();

  createObjects();

  const addTempModPageImage = () => {
    if (/https:\/\/www\.glamourdresser\.com\/mods\/.+/gi.test(window.location.href)) {
      if ($(".elementor-carousel-image").length > 0
        && $($(".elementor-carousel-image")[0]).attr("style").split(": ")[0] === "background-image"
        && $($(".elementor-carousel-image")[0]).attr("style").split(": ")[1] === "url()") {
        $($(".elementor-carousel-image")[0]).css({ "background-image": `url("${placeholderImage}")` });
      }
    }
  };

  addTempModPageImage();

  const setupCSS = () => {
    $("head").append("<link rel=\"stylesheet\" href=\""
      + "data:text/css;base64,OnJvb3R7LS1mb3JlZ3JvdW5kLWZvbnQtY29sb3I6I2ZmZjstLWFjY2VudC1mb250LWNvbG9yOiMwMDgwZmY7LS1kYXJrLWJhY2tncm91bmQtMDojMDAwOy0tZGFyay1iYWNrZ3JvdW5kLTE6IzAyMDMwMzstLWRhcmstYmFja2dyb3VuZC0yOiMwOT"
      + "BCMEQ7LS1kYXJrLWJhY2tncm91bmQtMzojMWQyMzI3Oy0tYnJpZ2h0LWJvcmRlci0wOiNhN2FhYWQ7LS1icmlnaHQtYm9yZGVyLTE6IzlCQURCRn1ib2R5LndwLWFkbWluLm5ibl9kYXJre2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtL"
      + "WJyaWdodC1ib3JkZXItMSl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50ICN3cGJvZHktY29udGVudCAud3JhcCBoMXtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAjY29udGV4dHVhbC1oZWxwLWJhY2t7YmFja2dyb3VuZC1j"
      + "b2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgLmNvbnRleHR1YWwtaGVscC10YWJzIC5hY3RpdmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Ym9yZGV"
      + "yLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgLmNvbnRleHR1YWwtaGVscC10YWJzIC5hY3RpdmUgYXtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYX"
      + "JrICNkYXNoYm9hcmQtd2lkZ2V0cyAucG9zdGJveC1jb250YWluZXIgLmVtcHR5LWNvbnRhaW5lcntvdXRsaW5lLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKX0ubmJuX2RhcmsgI2Rhc2hib2FyZC13aWRnZXRzIC5wb3N0Ym94LWNvbnRhaW5lciAuZW1wdHktY29ud"
      + "GFpbmVyOmFmdGVye2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrICNtYWpvci1wdWJsaXNoaW5nLWFjdGlvbnN7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMik7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0w"
      + "KX0ubmJuX2RhcmsgI21lbnUtbWFuYWdlbWVudCAubWVudS1lZGl0e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Lm5ibl9kYXJrICNtZW51LXNldHRpbmdzLWNvbHVtbiAuYWN"
      + "jb3JkaW9uLWNvbnRhaW5lcntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayAuY29tbWVudC1heXN7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm"
      + "91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLmZlYXR1cmUtZmlsdGVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Lm5ib"
      + "l9kYXJrIC5pbWdlZGl0LWdyb3Vwe2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Lm5ibl9kYXJrIC5tYW5hZ2UtbWVudXN7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJh"
      + "Y2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLm1lbnUtaXRlbS1oYW5kbGV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0"
      + "zKX0ubmJuX2RhcmsgLnBvcHVsYXItdGFnc3tiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayAuc3R1ZmZib3h7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLW"
      + "JhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLndpZGdldC1pbnNpZGV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zK"
      + "X0ubmJuX2RhcmsgLndpZGdldC10b3B7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLndpZGdldHMtaG9sZGVyLXdyYXB7YmFja2dyb3VuZC1jb2xvcjp2YXIo"
      + "LS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLndwLWVkaXRvci1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcms"
      + "tYmFja2dyb3VuZC0zKTtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgcC5wb3B1bGFyLXRhZ3N7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym"
      + "9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgdGFibGUud2lkZWZhdHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayAubWVka"
      + "WEtdG9vbGJhci53cC1maWx0ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgI21pbm9yLXB1Ymxpc2hpbmctYWN0aW9uc3twYWRkaW5nOjAgMTBweH0ubmJu"
      + "X2RhcmsgI21pbm9yLXB1Ymxpc2hpbmctYWN0aW9ucyBpbnB1dHttYXJnaW4tYm90dG9tOjVweH0ubmJuX2RhcmsgI3Bvc3Qtc3RhdHVzLWluZm97YmFja2dyb3VuZC1jb2xvcjojMDAwO2JvcmRlcjpub25lfS5uYm5fZGFyayAjc2NyZWVuLW1ldGF7YmFja2dyb3VuZC1jb2x"
      + "vcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMik7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93LXNldHRpbmdze2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2Jvcm"
      + "Rlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93LXNldHRpbmdzOmFjdGl2ZXtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xK"
      + "Ttjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAjc2NyZWVuLW1ldGEtbGlua3MgLnNob3ctc2V0dGluZ3M6Zm9jdXN7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9y"
      + "KX0ubmJuX2RhcmsgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93LXNldHRpbmdzOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGlucHV0W3R5cGU9Y29sb3Jde2JhY2t"
      + "ncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1kYXRlXXtiYWNrZ3JvdW5kLWNvbG9yOn"
      + "ZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGlucHV0W3R5cGU9ZGF0ZXRpbWUtbG9jYWxde2JhY2tncm91bmQtY29sb3I6dmFyK"
      + "C0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1kYXRldGltZV17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJh"
      + "Y2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayBpbnB1dFt0eXBlPWVtYWlsXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTt"
      + "ib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGlucHV0W3R5cGU9bW9udGhde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcj"
      + "p2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1udW1iZXJde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrL"
      + "WJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1wYXNzd29yZF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3Vu"
      + "ZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayBpbnB1dFt0eXBlPXNlYXJjaF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp"
      + "2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayBpbnB1dFt0eXBlPXRlbF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW"
      + "5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayBpbnB1dFt0eXBlPXRleHRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtM"
      + "Sk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT10aW1lXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigt"
      + "LWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGlucHV0W3R5cGU9dXJsXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9"
      + "udC1jb2xvcil9Lm5ibl9kYXJrIGlucHV0W3R5cGU9d2Vla117YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm"
      + "5fZGFyayBzZWxlY3R7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayBzZWxlY3Q6ZGlzYWJsZWR7Y"
      + "29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgLndwLWNvcmUtdWkgc2VsZWN0e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdy"
      + "b3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgLndwLWNvcmUtdWkgc2VsZWN0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1"
      + "mb250LWNvbG9yKX0ubmJuX2RhcmsgLndwLWNvcmUtdWkgc2VsZWN0OmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LW"
      + "NvbG9yKX0ubmJuX2RhcmsgLndwLWNvcmUtdWkgc2VsZWN0IG9wdGlvbntjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAud3AtY29yZS11aSAuYnV0dG9ue2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpfS5uYm5fZ"
      + "GFyayAud3AtY29yZS11aSAuYnV0dG9uOmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9y"
      + "ZGVyLTEpIWltcG9ydGFudH0ubmJuX2RhcmsgLndwLWNvcmUtdWkgLmJ1dHRvbi1zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSl9Lm5ibl9kYXJrIC53cC1jb3JlLXVpIC5idXR0b24tc2Vjb25kYXJ5OmRpc2FibGVke2JhY2tncm9"
      + "1bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH0ubmJuX2RhcmsgLndwLWNvcmUtdWkgLm"
      + "J1dHRvbi1kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKSFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpbXBvcnRhbnQ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKSFpbXBvcnRhbnR9L"
      + "m5ibl9kYXJrIC53cC1jb3JlLXVpIC5idXR0b24tc2Vjb25kYXJ5LmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2"
      + "YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH0ubmJuX2RhcmsgLndwLWNvcmUtdWkgLmJ1dHRvbi1zZWNvbmRhcnlbZGlzYWJsZWRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGF"
      + "yay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH0ubmJuX2RhcmsgLndwLWNvcmUtdWkgLmJ1dHRvbi5kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKSFpbXBvcnRhbn"
      + "Q7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpbXBvcnRhbnQ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKSFpbXBvcnRhbnR9Lm5ibl9kYXJrIC53cC1jb3JlLXVpIC5idXR0b25bZGlzYWJsZWRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFya"
      + "y1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH0ubmJuX2RhcmsgLndwLWNvcmUtdWkgLmF0dGFjaG1lbnQtcHJldmlld3ti"
      + "YWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgdGV4dGFyZWF7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5"
      + "kLWZvbnQtY29sb3IpfS5uYm5fZGFyayB0ZXh0YXJlYTpkaXNhYmxlZHtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfS5uYm5fZGFyayBpbnB1dFt0eXBlPXNlYXJjaF0uc2VhcmNoe2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci"
      + "1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgLndpZGVmYXQgdGhlYWQgdGR7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSl9Lm5ibl9kYXJrIC53aWRlZmF0IHRoZWFkI"
      + "HRoe2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpfS5uYm5fZGFyayAud2lkZWZhdCB0aGVhZCB0ciB0ZHtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAud2lkZWZhdCB0aGVhZCB0ciB0aHtjb2xvcjp2YXIoLS1mb3JlZ3Jv"
      + "dW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAud2lkZWZhdCB0Zm9vdCB0ZHtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX0ubmJuX2RhcmsgLndpZGVmYXQgdGZvb3QgdGh7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSl9Lm5ibl9kYXJrIC5"
      + "3aWRlZmF0IHRmb290IHRyIHRke2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC53aWRlZmF0IHRmb290IHRyIHRoe2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC53aWRlZmF0IHRke2NvbG9yOnZhcigtLW"
      + "ZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC53aWRlZmF0IHRoe2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrICN0aXRsZWRpdiAjdGl0bGV7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Y29sb3I6dmFyKC0tZ"
      + "m9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1jaGVja2JveF17YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgaW5wdXRbdHlwZT1yYWRpb117YmFj"
      + "a2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX0ubmJuX2RhcmsgI3dwLWNvbnRlbnQtZWRpdG9yLXRvb2xze2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayAuYWx0ZXJ"
      + "uYXRle2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayAjd3Bmb290ZXJ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgaW5wdXQuZGlzYWJsZWR7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgaW"
      + "5wdXQ6ZGlzYWJsZWR7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2Rhcmsgc2VsZWN0LmRpc2FibGVke2NvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Lm5ibl9kYXJrIHRleHRhcmVhLmRpc2FibGVke2NvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9L"
      + "m5ibl9kYXJrIC5kcmFnLWRyb3AgI2RyYWctZHJvcC1hcmVhe2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Lm5ibl9kYXJrIC5lZGl0LWF0dGFjaG1lbnQtZnJhbWUgLmVkaXQtbWVkaWEtaGVhZGVyIC5sZWZ0e2JvcmRlci1jb2xvcjp2YXIoLS1kYXJr"
      + "LWJhY2tncm91bmQtMyl9Lm5ibl9kYXJrIC5lZGl0LWF0dGFjaG1lbnQtZnJhbWUgLmVkaXQtbWVkaWEtaGVhZGVyIC5sZWZ0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0"
      + "ubmJuX2RhcmsgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLmxlZnQ6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfS5uYm5fZGFyayAuZWRpdC"
      + "1hdHRhY2htZW50LWZyYW1lIC5lZGl0LW1lZGlhLWhlYWRlciAucmlnaHR7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLnJpZ2h0OmZvY3Vze2JhY2tncm91b"
      + "mQtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLnJpZ2h0OmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0t"
      + "YnJpZ2h0LWJvcmRlci0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgW2Rpc2FibGVkXTpob3Zlcntjb2xvcjojMDAwfS5uYm5fZGFyayAuZWRpdC1hdHRhY2h"
      + "tZW50LWZyYW1lIC5hdHRhY2htZW50LWluZm8gLmZpbGVuYW1le2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC51cGxvYWQtcGhwIC5tZWRpYS1tb2RhbC1jbG9zZXtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm"
      + "5fZGFyayAudXBsb2FkLXBocCAubWVkaWEtbW9kYWwtY2xvc2U6Zm9jdXN7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfS5uYm5fZGFyayAudXBsb2FkLXBocCAubWVkaWEtbW9kYWwtY"
      + "2xvc2U6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfS5uYm5fZGFyayAubWVkaWEtZnJhbWUtY29udGVudHtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMp"
      + "O2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSl9Lm5ibl9kYXJrIC5tZWRpYS1mcmFtZS1jb250ZW50IC5hdHRhY2htZW50LWluZm97YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I"
      + "6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX0ubmJuX2RhcmsgLmF0dGFjaG1lbnQtaW5mb3tib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfS5uYm5fZGFyayBzcGFuLmFjZi1zd2l0Y2gtb2Zme2NvbG9yOiMwMDB9Lm5ibl9kYXJrIC5tY2UtYnRuIGJ1dHRvbn"
      + "tib3JkZXI6bm9uZTtib3JkZXItdG9wLWNvbG9yOnRyYW5zcGFyZW50O2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5tY2UtdG9vbGJhciAubWNlLWljb3tib3JkZXI6bm9uZTtib3JkZXItdG9wLWNvbG9yOnRyYW5zcGFyZW50O2NvbG9yO"
      + "nZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5tY2UtdG9vbGJhciAubWNlLWJ0bi1ncm91cCAubWNlLWJ0bjpmb2N1c3tiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtib3JkZXItY29sb3I6dmFyKC0tYWNjZW50LWZvbnQtY29sb3Ip"
      + "O2JveC1zaGFkb3c6bm9uZTtjb2xvcjp2YXIoLS1hY2NlbnQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5tY2UtdG9vbGJhciAubWNlLWJ0bi1ncm91cCAubWNlLWJ0bjpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtib3JkZXItY29sb3I6dmFyKC0"
      + "tYWNjZW50LWZvbnQtY29sb3IpO2JveC1zaGFkb3c6bm9uZTtjb2xvcjp2YXIoLS1hY2NlbnQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5tY2UtdG9vbGJhciAubWNlLWJ0bi1ncm91cCAubWNlLWJ0bjpob3ZlciAubWNlLWljb3tjb2xvcjp2YXIoLS1hY2NlbnQtZm9udC1jb2"
      + "xvcil9Lm5ibl9kYXJrIC5tY2UtdG9vbGJhciAubWNlLWJ0bi1ncm91cCAubWNlLWJ0bi5tY2UtbGlzdGJveHtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgLnF0LWRmdzpmb2N1c3tiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZ"
      + "C0wKTtib3JkZXItY29sb3I6dmFyKC0tYWNjZW50LWZvbnQtY29sb3IpO2JveC1zaGFkb3c6bm9uZTtjb2xvcjp2YXIoLS1hY2NlbnQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5xdC1kZnc6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCk7Ym9yZGVy"
      + "LWNvbG9yOnZhcigtLWFjY2VudC1mb250LWNvbG9yKTtib3gtc2hhZG93Om5vbmU7Y29sb3I6dmFyKC0tYWNjZW50LWZvbnQtY29sb3IpfS5uYm5fZGFyayAubm90aWNle2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApO2JvcmRlci1ib3R0b20tY29sb3I6dmF"
      + "yKC0tYnJpZ2h0LWJvcmRlci0xKTtib3JkZXItcmlnaHQtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKTtib3JkZXItdG9wLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSl9Lm5ibl9kYXJrIGRpdi5lcnJvcntiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC"
      + "0wKTtib3JkZXItYm90dG9tLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXJpZ2h0LWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXRvcC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpfS5uYm5fZGFyayBkaXYudXBkYXRlZHtiYWNrZ"
      + "3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtib3JkZXItYm90dG9tLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXJpZ2h0LWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXRvcC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEp"
      + "fS5uYm5fZGFyayAucG9zdGJveHtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpfS5uYm5fZGFyayAucG9zdGJveD5kaXYuaW5zaWRle2Rpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbjowfS5uYm5fZGFyayAucG9zdGJveD5kaXYuaW5zaWRlPnB7bWFyZ2l"
      + "uOjAgMCAxZW19Lm5ibl9kYXJrIC5wb3N0Ym94IC5wb3N0Ym94LWhlYWRlciBoMntjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAucG9zdGJveC1oZWFkZXJ7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKX0ubmJuX2Rhcm"
      + "sgLnF1aWNrdGFncy10b29sYmFye2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGRpdi5tY2UtdG9vbGJhci1ncnB7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtM"
      + "yk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX0ubmJuX2RhcmsgLmh0bWwtYWN0aXZlIC5zd2l0Y2gtaHRtbHtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIo"
      + "LS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAudG1jZS1hY3RpdmUgLnN3aXRjaC10bWNle2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGgye2NvbG9yOnZhcig"
      + "tLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGgze2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIGZvcm0jeW91ci1wcm9maWxlIHRhYmxlLmZvcm0tdGFibGUgdGhbc2NvcGU9cm93XXtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLW"
      + "ZvbnQtY29sb3IpfS5uYm5fZGFyayBmb3JtI3lvdXItcHJvZmlsZSB0YWJsZS5mb3JtLXRhYmxlIGxhYmVse2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC5tZWRpYS1mcmFtZS10aXRsZSBoMXtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvb"
      + "nQtY29sb3IpfS5uYm5fZGFyayBsYWJlbFtmb3I9bmV3X2FwcGxpY2F0aW9uX3Bhc3N3b3JkX25hbWVde2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Lm5ibl9kYXJrIC51c2VyLXNlc3Npb25zLXdyYXAuaGlkZS1pZi1uby1qcyB0aHtjb2xvcjp2YXIoLS1m"
      + "b3JlZ3JvdW5kLWZvbnQtY29sb3IpfS5uYm5fZGFyayAud3JhcCAuYWRkLW5ldy1oMntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKX0ubmJuX2RhcmsgLndyYXAgLmFkZC1uZXctaDI6YWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1"
      + "iYWNrZ3JvdW5kLTEpfS5uYm5fZGFyayAud3JhcCAucGFnZS10aXRsZS1hY3Rpb257YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSl9Lm5ibl9kYXJrIC53cmFwIC5wYWdlLXRpdGxlLWFjdGlvbjphY3RpdmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS"
      + "1kYXJrLWJhY2tncm91bmQtMSl9Lm5ibl9kYXJrIC53cC1zd2l0Y2gtZWRpdG9ye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb"
      + "2xvcil9Lm5ibl9kYXJrIDpyb290ey0tYWNjZW50LWZvbnQtY29sb3I6IzAwODBmZjstLWJyaWdodC1ib3JkZXItMDojYTdhYWFkOy0tYnJpZ2h0LWJvcmRlci0xOiM5QkFEQkY7LS1kYXJrLWJhY2tncm91bmQtMDojMDAwOy0tZGFyay1iYWNrZ3JvdW5kLTE6IzAyMDMwMzst"
      + "LWRhcmstYmFja2dyb3VuZC0yOiMwOTBCMEQ7LS1kYXJrLWJhY2tncm91bmQtMzojMWQyMzI3Oy0tZm9yZWdyb3VuZC1mb250LWNvbG9yOiNmZmZ9Lm5ibl9kYXJrIGRpdiBwLnN1Ym1pdCBpbnB1dCNzYXZlLmJ1dHRvbnstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTthcHBlYXJ"
      + "hbmNlOm5vbmU7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOiMyMjcxYjE7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOnNvbGlkO2JvcmRlci13aWR0aDoxcHg7Ym94LXNpemluZzpib3JkZXItYm94O2NvbG9yOi"
      + "MyMjcxYjE7Y3Vyc29yOnBvaW50ZXI7ZGlzcGxheTppbmxpbmUtYmxvY2s7ZGlzcGxheTpibG9jaztmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoyLjE1Mzg0NjE1O21hcmdpbjowO21hcmdpbi1ibG9jay1lbmQ6MDttYXJnaW4tYmxvY2stc3RhcnQ6MDttYXJnaW4taW5sa"
      + "W5lLWVuZDowO21hcmdpbi1pbmxpbmUtc3RhcnQ6MDttaW4taGVpZ2h0OjMwcHg7cGFkZGluZzowIDEwcHg7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1kZWNvcmF0aW9uOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5uYm5fZGFyayBkaXYjcHJldmlldy1hY3Rpb257ZGlzcGxh"
      + "eTotd2Via2l0LWJveH0ubmJuX2RhcmsgZGl2I3NhdmUtYWN0aW9ue2Rpc3BsYXk6LXdlYmtpdC1ib3h9Lm5ibl9kYXJrIGRpdi5tY2UtcGFuZWx7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Lm5ibl9kYXJrIC5zZWxlY3QyLWNvbnRhaW5lci0tZGVmYXV"
      + "sdCAuc2VsZWN0Mi1zZWxlY3Rpb24tLW11bHRpcGxle2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfS5uYm5fZGFyayAuc2VsZWN0Mi1kcm9wZG93bntiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX0ubmJuX2RhcmsgLm1lZGlhLW1vZGFsLW"
      + "NvbnRlbnR7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Lm5ibl9kYXJrIGZpZWxkc2V0I2NvbG9yLXBpY2tlciAuY29sb3Itb3B0aW9uLnNlbGVjdGVke2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfS5uYm5fZGFyayAud3AtZWRpdG9yL"
      + "WV4cGFuZCAjd3AtY29udGVudC1lZGl0b3ItdG9vbHN7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Lm5ibl9kYXJrIC5zZWxlY3QyLWNvbnRhaW5lci4tYWNmIC5zZWxlY3QyLXNlbGVjdGlvbntib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0w"
      + "KX0ubmJuX2RhcmsgLmFjZi10YXhvbm9teS1maWVsZCAuY2F0ZWdvcnljaGVja2xpc3QtaG9sZGVye2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfS5uYm5fZGFyayBkaXYucG9zdGJveHtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0yKX0ubmJ"
      + "uX2RhcmsgZGl2W2RhdGEtcXJjb2RlKj1vdHBhdXRoXT5pbWd7ZmlsdGVyOmludmVydCgxMDAlKX1sdC1oaWdobGlnaHRlci5uYm5fZGFya34jdGlueW1jZXtiYWNrZ3JvdW5kLWNvbG9yOiMwMDAwMDF9Lm5ibl9kYXJrIHAuc3VibWl0e2JvcmRlcjpub25lO2JvcmRlci1ib3"
      + "R0b20tbGVmdC1yYWRpdXM6MDtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czowO21hcmdpbjo1cHggMDttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOjAgMTBweDt0ZXh0LWFsaWduOmxlZnR9Lm5ibl9kYXJrIHVsI2FkbWlubWVudSBhLndwLWhhcy1jdXJyZW50LXN1Ym1lbnU6Y"
      + "WZ0ZXJ7Ym9yZGVyLXJpZ2h0LWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX0ubmJuX2RhcmsgdWwjYWRtaW5tZW51PmxpLmN1cnJlbnQ+YS5jdXJyZW50OmFmdGVye2JvcmRlci1yaWdodC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9"
      + "\"></link>");
    $("head").append(`<style id="darkFixStyle">
:root {
  --e-global-color-accent-dark: #eee;
  --e-global-color-secondary-dark: #777;
  --e-global-color-primary-dark: #eee;
}
html.wp-dark-mode-active .elementor-widget-posts .elementor-post__read-more {
  color: var(--e-global-color-accent-dark);
}
html.wp-dark-mode-active header .elementor-widget-container a img, div[data-widget_type="theme-site-logo.default"] a img {
  filter: invert(100%);
}
html.wp-dark-mode-active .elementor-widget-author-box .elementor-author-box__name, html.wp-dark-mode-active .elementor-widget-posts .elementor-post__title, .elementor-widget-posts .elementor-post__title a {
  color: var(--e-global-color-secondary-dark);
}
html.wp-dark-mode-active .elementor-widget-heading .elementor-heading-title {
  color: var(--e-global-color-primary-dark);
}
button.elementor-button.action-copy-author {
  background-color: var( --e-global-color-accent );
  font-family: nunito sans,Sans-serif;
  text-decoration-color: initial;
  text-shadow: rgba(13, 13, 13, 0.3) 0px 0px 10px;
  color: rgb(229, 224, 216);
  border-radius: 0 0 0 0;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 13px;
  width: auto;
  box-shadow: none;
  fill: rgb(229, 224, 216);
  display: inline-block;
  line-height: 1;
  text-align: center;
  transition: all .3s;
  border: none;
  box-shadow: 0 0 0 0 #000;
  transform: translateY(0);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
button.elementor-button.action-copy-author:hover, button.elementor-button.action-copy-author:focus:hover {
  background-color: #107116 !important;
}
button.elementor-button.action-copy-author:active {
  box-shadow: 0 5px 10px 5px #000;
  transform: translateY(5px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
button.elementor-button.action-copy-author:focus {
  outline: none;
  background-color: var( --e-global-color-accent ) !important;
}
.action-copy-author img.clipboard {
    max-height: calc(18px * var(--wp-dark-mode-scale));
    max-width: calc(18px * var(--wp-dark-mode-scale));
}
html.wp-dark-mode-active .elementor-element>.elementor-background-overlay {
  background-image: linear-gradient(180deg,#FFFFFF00 60%,${defaultDarkBG} 100%) !important;
}
.elementor-author-box__name {
  width: fit-content;
  display: inline-block;
}
div:not(.elementor-author-box--biography-yes)[data-widget_type="author-box.default"] div.elementor-widget-container div.elementor-author-box .elementor-author-box__text {
  min-width: 100%;
  width: 100%;
}
div.elementor-author-box__text div:not(.elementor-button-wrapper):first-child {
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
div.elementor-author-box__text div:first-child h4.elementor-author-box__name {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    ${calcVariableCSS()}
}
.elementor-author-box__text a {
  align-items: center;
}
div:not(.elementor-author-box--biography-yes)[data-widget_type="author-box.default"] div.elementor-widget-container div.elementor-author-box .copy-author-widget {
  left: ${variableTextLength()}
}
.copy-author-widget {
  position: relative;
  width: fit-content;
  display: inline-block;
}
.postbox > div.inside {
  display: inline-block;
  margin: 0;
}
.postbox > div.inside > p {
    margin: 0 0 1em 0;
}
</style>`);
  };

  setupCSS();
});
