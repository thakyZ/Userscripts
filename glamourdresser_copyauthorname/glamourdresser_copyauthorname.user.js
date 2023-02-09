// ==UserScript==
// @name         Glamour Dresser Copy Author Name
// @namespace    NekoBoiNick.Web.GlamourDresser.CopyAuthorName
// @version      1.0.4
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

  const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAG2CAMAAACwDhItAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAKL2lDQ1BJQ0MgUHJvZmlsZQAASMedlndUVNc"
    + "Wh8+9d3qhzTACUobeu8AA0nuTXkVhmBlgKAMOMzSxIaICEUVEmiJIUMSA0VAkVkSxEBRUsAckCCgxGEVULG9G1ouurLz38vL746xv7bP3ufvsvc9aFwCSpy+XlwZLAZDKE/CDPJzpEZFRdOwAgAEeYIApAExWRrpfsHsIEMnLzYWeIXICXwQB8HpYvAJw09AzgE4H/5+kWel8g"
    + "eiYABGbszkZLBEXiDglS5Auts+KmBqXLGYYJWa+KEERy4k5YZENPvsssqOY2ak8tojFOaezU9li7hXxtkwhR8SIr4gLM7mcLBHfErFGijCVK+I34thUDjMDABRJbBdwWIkiNhExiR8S5CLi5QDgSAlfcdxXLOBkC8SXcklLz+FzExIFdB2WLt3U2ppB9+RkpXAEAsMAJiuZyWf"
    + "TXdJS05m8HAAW7/xZMuLa0kVFtjS1trQ0NDMy/apQ/3Xzb0rc20V6Gfi5ZxCt/4vtr/zSGgBgzIlqs/OLLa4KgM4tAMjd+2LTOACApKhvHde/ug9NPC+JAkG6jbFxVlaWEZfDMhIX9A/9T4e/oa++ZyQ+7o/y0F058UxhioAurhsrLSVNyKdnpDNZHLrhn4f4Hwf+dR4GQZx4D"
    + "p/DE0WEiaaMy0sQtZvH5gq4aTw6l/efmvgPw/6kxbkWidL4EVBjjIDUdSpAfu0HKAoRINH7xV3/o2+++DAgfnnhKpOLc//vN/1nwaXiJYOb8DnOJSiEzhLyMxf3xM8SoAEBSAIqkAfKQB3oAENgBqyALXAEbsAb+IMQEAlWAxZIBKmAD7JAHtgECkEx2An2gGpQBxpBM2gFx0E"
    + "nOAXOg0vgGrgBboP7YBRMgGdgFrwGCxAEYSEyRIHkIRVIE9KHzCAGZA+5Qb5QEBQJxUIJEA8SQnnQZqgYKoOqoXqoGfoeOgmdh65Ag9BdaAyahn6H3sEITIKpsBKsBRvDDNgJ9oFD4FVwArwGzoUL4B1wJdwAH4U74PPwNfg2PAo/g+cQgBARGqKKGCIMxAXxR6KQeISPrEeKk"
    + "AqkAWlFupE+5CYyiswgb1EYFAVFRxmibFGeqFAUC7UGtR5VgqpGHUZ1oHpRN1FjqFnURzQZrYjWR9ugvdAR6AR0FroQXYFuQrejL6JvoyfQrzEYDA2jjbHCeGIiMUmYtZgSzD5MG+YcZhAzjpnDYrHyWH2sHdYfy8QKsIXYKuxR7FnsEHYC+wZHxKngzHDuuCgcD5ePq8AdwZ3"
    + "BDeEmcQt4Kbwm3gbvj2fjc/Cl+EZ8N/46fgK/QJAmaBPsCCGEJMImQiWhlXCR8IDwkkgkqhGtiYFELnEjsZJ4jHiZOEZ8S5Ih6ZFcSNEkIWkH6RDpHOku6SWZTNYiO5KjyALyDnIz+QL5EfmNBEXCSMJLgi2xQaJGokNiSOK5JF5SU9JJcrVkrmSF5AnJ65IzUngpLSkXKabUe"
    + "qkaqZNSI1Jz0hRpU2l/6VTpEukj0lekp2SwMloybjJsmQKZgzIXZMYpCEWd4kJhUTZTGikXKRNUDFWb6kVNohZTv6MOUGdlZWSXyYbJZsvWyJ6WHaUhNC2aFy2FVko7ThumvVuitMRpCWfJ9iWtS4aWzMstlXOU48gVybXJ3ZZ7J0+Xd5NPlt8l3yn/UAGloKcQqJClsF/hosL"
    + "MUupS26WspUVLjy+9pwgr6ikGKa5VPKjYrzinpKzkoZSuVKV0QWlGmabsqJykXK58RnlahaJir8JVKVc5q/KULkt3oqfQK+m99FlVRVVPVaFqveqA6oKatlqoWr5am9pDdYI6Qz1evVy9R31WQ0XDTyNPo0XjniZek6GZqLlXs09zXktbK1xrq1an1pS2nLaXdq52i/YDHbKOg"
    + "84anQadW7oYXYZusu4+3Rt6sJ6FXqJejd51fVjfUp+rv09/0ABtYG3AM2gwGDEkGToZZhq2GI4Z0Yx8jfKNOo2eG2sYRxnvMu4z/mhiYZJi0mhy31TG1Ns037Tb9HczPTOWWY3ZLXOyubv5BvMu8xfL9Jdxlu1fdseCYuFnsdWix+KDpZUl37LVctpKwyrWqtZqhEFlBDBKGJe"
    + "t0dbO1husT1m/tbG0Edgct/nN1tA22faI7dRy7eWc5Y3Lx+3U7Jh29Xaj9nT7WPsD9qMOqg5MhwaHx47qjmzHJsdJJ12nJKejTs+dTZz5zu3O8y42Lutczrkirh6uRa4DbjJuoW7Vbo/c1dwT3FvcZz0sPNZ6nPNEe/p47vIc8VLyYnk1e816W3mv8+71IfkE+1T7PPbV8+X7d"
    + "vvBft5+u/0erNBcwVvR6Q/8vfx3+z8M0A5YE/BjICYwILAm8EmQaVBeUF8wJTgm+Ejw6xDnkNKQ+6E6ocLQnjDJsOiw5rD5cNfwsvDRCOOIdRHXIhUiuZFdUdiosKimqLmVbiv3rJyItogujB5epb0qe9WV1QqrU1afjpGMYcaciEXHhsceiX3P9Gc2MOfivOJq42ZZLqy9rGd"
    + "sR3Y5e5pjxynjTMbbxZfFTyXYJexOmE50SKxInOG6cKu5L5I8k+qS5pP9kw8lf0oJT2lLxaXGpp7kyfCSeb1pymnZaYPp+umF6aNrbNbsWTPL9+E3ZUAZqzK6BFTRz1S/UEe4RTiWaZ9Zk/kmKyzrRLZ0Ni+7P0cvZ3vOZK577rdrUWtZa3vyVPM25Y2tc1pXvx5aH7e+Z4P6h"
    + "oINExs9Nh7eRNiUvOmnfJP8svxXm8M3dxcoFWwsGN/isaWlUKKQXziy1XZr3TbUNu62ge3m26u2fyxiF10tNimuKH5fwiq5+o3pN5XffNoRv2Og1LJ0/07MTt7O4V0Ouw6XSZfllo3v9tvdUU4vLyp/tSdmz5WKZRV1ewl7hXtHK30ru6o0qnZWva9OrL5d41zTVqtYu712fh9"
    + "739B+x/2tdUp1xXXvDnAP3Kn3qO9o0GqoOIg5mHnwSWNYY9+3jG+bmxSaips+HOIdGj0cdLi32aq5+YjikdIWuEXYMn00+uiN71y/62o1bK1vo7UVHwPHhMeefh/7/fBxn+M9JxgnWn/Q/KG2ndJe1AF15HTMdiZ2jnZFdg2e9D7Z023b3f6j0Y+HTqmeqjkte7r0DOFMwZlPZ"
    + "3PPzp1LPzdzPuH8eE9Mz/0LERdu9Qb2Dlz0uXj5kvulC31OfWcv210+dcXmysmrjKud1yyvdfRb9Lf/ZPFT+4DlQMd1q+tdN6xvdA8uHzwz5DB0/qbrzUu3vG5du73i9uBw6PCdkeiR0TvsO1N3U+6+uJd5b+H+xgfoB0UPpR5WPFJ81PCz7s9to5ajp8dcx/ofBz++P84af/Z"
    + "Lxi/vJwqekJ9UTKpMNk+ZTZ2adp++8XTl04ln6c8WZgp/lf619rnO8x9+c/ytfzZiduIF/8Wn30teyr889GrZq565gLlHr1NfL8wXvZF/c/gt423fu/B3kwtZ77HvKz/ofuj+6PPxwafUT5/+BQOY8/xvJtwPAAABy1BMVEXp7vHo7fDq7/Ln7O/r8PPm6+7v9Pfu8/bt8vXs8"
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
    + "mUZphL9VdzkghhBTV2zlGghJl45wHpRVTDDMtSn9u1/+pkDzz57ID8OHnjmuedfePEPNJgoNMsy47cEYA19hip8SH7p0OHCcMF2ihEnL2ynNFJyvSNHVU0TizCADehz01T2HSuUK9VqzSee5wdeTgTRq3Xtwujhl+uWjoBATDaYKjZxjh0/fmJ84pUDRZtKRaQjpxq244Svnjz"
    + "FVYXJCtohuSfThFuSZXls8sRrU8+VpsUnaZ4DEoShXxz54+tDxmnFlBWMJLmnxps0J6de+8PBM07oefR/ml0l9ZI7buh7jeJ0+MaQKXOGgIBEK1JFYlNn/4f7p9BrxGWS30FErET8hj9TebNpnmYcAck7mVMRMJmPvxhMh6FHK5CoSnIbkIbrhY7b8GZbLzUV9NOB0sElVdHea"
    + "szMhW6D5ldCUi055AUBTTKDoD3b+vM5E5t7QRIrUav+rB0E4ZyTbNZNqiWHgobn0grMm58/P/92M9qxAPKMptmKbOp/KdHa1LcbFA2aZOU4IZQNWoUEfqU2f+Edw8B23rxjymnOrJdGk/pYlWQkT0lZP3QGc87MCxPHJS5LioyBJLfEdhqTvVtOymKNKJcwDJO/5cK6gbNhh8W"
    + "5i+NRNJCPHFMlbv31fNcIsvJ5Kr7kQfyiO8w5B4Mz7y2IvQwoH4hIXjFe181jl6J9r/JtY0hC3yse/IMpAhJlBPJJYc2nyqPtpCo60MdqGDbiz9e9b3XITHhBw26Epfc1DCA5p2r6/sVK1wiSMunY2zZsvKM/B3NB8QPFZOin5xmrW+rlQrVrBAmCwBXsnPDp5XYmhP7oha47d"
    + "8WggMiISH4pxpVWod01ghQd242OkcgL13FEh3CF5ze8IAyclwxagmCv3hzj+r7SusrwPDf0pw9fffvKlSvX6L98+PDDNw8XKrXVD4qoYegFzkcajR9oF+YXM/WPF4P1A0XDHvmjZDV1XdMsLScs67q+/2+1VvIWxAHxfWe/QfHA+JFfsq7fuLRuaiG238x9YpksOi9WdIqPHJC"
    + "Z+j/5u5Vq8jasBMS+yRUREEQkr5huvDPbMYDQ3Nt3/fdeU2SqixwFhCkq/1//trgakJDeiYAC8i4zsaNJrhnmsWFvbY4ldva2g0/HORMHiijJnXJAlk5rn7VW9ygQb4gIyC1miJMuJneC3OGmeazcERC/4VJZfL7AaXCRmThPbT6IE0pa9fnVfdKiN8QTI4iOgOSaYr5LI0hUF"
    + "EIYBoFvf3o2OTVUbiqjbkqs+eFoJXkbiNiKRQGRDXonsBkrvxTji9lQzCZintsQU6yT0Rl6xRlPckIceNysj65uxVoJyDHVYBLHsbf5ZZgHRsJ1q3QvsF8UU6x8oXV687NKxxokGUEYjrvNNwQk1hUQ8U6sbMVCRPILAYkhIJCGISAxBATSICAJBARSISAxBARSISAxBARSISA"
    + "xBARS9RgQxiRFNBGTa0aLk36I2or+gb4ndk6RoibjbtMVEPRBQOgxIIokRxdSFxEQlSNLiiEOHOEKl2RVHJ26Fp9dBSMIpOoxIOIa+1RLYl9fVeWG1tQMhfKiaJrVbOpSXVLVKETJ3XcPBATS9LqZV0ykxDSLqsa0mvyzqy/vv33n2J13bh55+c26YTVN+leaZe2+/eQREEjTa"
    + "0Ci9YVMI4SusTe+PDzaGi0PD5fL5dHRQrn6zt1rim7KsrILL+6HgECqnhfpolgUU/9s37uFxXLFscXZcjxx5R23WCrat6+ypqGqu+864wgIpOoxINGZOGmU+PLw4mL1cq0VnY4wiK+M6/mBXSh8cVTSTIwgsEf0PILIkmXcu1wuVC+3K5X55NxZYhCJHl2rlS8d+1DDCAJ7RMa"
    + "AUJ3Q+kORJsemTo09N+0k9+4WBq5tP7/UVGVlVzUQugKCPggIGQNCn6PR+TdPLJ/63+EZP7kabgpxRZGS/Yx6nakm4/X40bsARhBIlTEgXFZkmT5Mp776vHQ/SsEm6PFzoTPyxdvXlTqFKnn4kw8BgTRZN/PSBEvmXDXOvhrM0PjR8YD1aGIS+I3QvXD5iiXW88nDn3wICKTJG"
    + "hAuq4qicu3f7emDod35gPXEal1s06pdan92naouefiTDwGBVBkDQjWi1Ln1tbgqgi8ulbwZceY53wvnW7N3VEvGCAK7XMaAMK7Iqv7ZnZIbUjyCzRfpoicSuH6l2vrmkGZiBIFdLusUizG5ae6fdUM/oCVGxwM2oH8RQ0itdriwePUcRhDY5TIGRKFVyGv/MWIn99pW6IZhyf3"
    + "DuNjyxcXFxp90XQFBHwSEzIt0Zql/n0nulIFYrRe/XRLltSsKDCMIpMo8xeLX903bHXfcWhD6fsNx3tJUqj1pFyzWERBIk3UzL+MauzzTWDvL9XboKQOv9JxClSchILBbZW4UKtbdC/4Wm3c3EDN4pxHY13RJFUdXPfEQEEiVMSCSye9caGSfYvlhENJwU/zY4BSQXVBhCAiky"
    + "hgQRfu6Wmi4m/c/NqKnDAPPvlU3omu5JU/z5EJAIFXWEUT7brbrYupb8GzRLGk4lac0SSQkeZYnFwICqbIFhC9NPTPie1vsxbuJ8svagFfo8XAUr2uis6uwgewU2RUQ9EFAyBiQk580SslRgz0pP1AUJg++xpghyQpnkrgMr6ju5Nv9wwgCqTIGZOFT18m+AFkz2lY1NsBF+to"
    + "TyaauxNdGEwmJvrUTCAikybiZly+8UBS9v561Cleag7zU4UqpsvqQ+eCQ3hSHOQ5kfEJAIE3WgCx970ST8l5VCk9ZyXMMhChVMatSryv7v7l0VzfpO5wP4DK0CAikyhiQqedtGkB6D0hr9CU9qugBomfjE0vPnQmdke9Ng0dnQ03+qX8ICKTKGpAfnFDsgJjcK7PW6FWxnXege"
    + "/NSPsypD4q25zvuXVWnJY44x/wOISCQKmtAnitSQETd9KYyerfJVWWwFcZN/YeRILQboXPhnmYOZIBCQCBVtoBIy/9pu2HQcz78SuuuPph4JDFgMpd140jRpt808H135seJ8cnJyR3PsroCgj4ICBkDMvW8Q//Q+xSrMnpPi06oNSCiM2jxI4u2ODMEBaTh3P/xq6XXp6i+xU/"
    + "p/ydhBIFUGQOy9BNNseJT8PakMvqGRfW14zXCSonKXLW0Q5fK9IuK30UclfWnh6cmLtK/7+yTHgGBNFl3dz/5QolmWL3PsUZbH1qDKK+V51Bk3Tryt0ptdSwLG6UzP509GW/J2kHDBQGBNJkD8nkx2OqEipspt+vaoAIiZlFMM45cGG23k6f3Pdd7tjj907jCGRP/xffuAwICq"
    + "bIG5P/4Tj/7Yg2/I5lxee8clT/X+f5vRr+otIPk2EZKbRA6pe9NXfRDEBAYtKxrkOW/j1ApJnfKrvCxsaO67ST6H8qhxUqtNd9Knt735xxvzrZLV1V9Z80WBARSZQzI1PgHMw23847ZjB7VZD6ARXqEm/qD4dFqtV2Zj0o4umn4QcNzzx/VDKrk/iEgkCpjQCTtzeEgOoo2myA"
    + "6wXXDqTFDlFffFcbFxdejJ2CSbBkPVvofGwXTP0+MTx4/3nc/pCsg6IOAkDEgzJLb5V62YgVedEz6ER7tTjiQGmtKN1b7Hxt5wfRPpxZOTFKdi5/V+8/DCAKpsgbEbH4520NAPDv0g9B23jDEM+08IEyqN61D5wv0zOJ36Po9GsHImZ/OLpygH9TfJz4CAmmybublqvV2xcm+S"
    + "A/9hu2Fxb9L5k7Hj+jBjMuaduNCtbrZhrSgMVe6//PZqb77IQgIpMkaEEmWhr6c2eKk1Rt4oec2nOIrulihD2BfXtnSH3zTmt/8vBFBeLA489PJvvshCAikyhgQ1ahfv+KNZB9CxI5bMwcmDbEvOpXYTtCjuSYdutD6ojW/0v/YKLQDb64083Pf/RAEBFJlDIhsMkP/0cl8ZkX"
    + "xkV70P19QZGVHB9yK0mSSYppHZmvzrfZa/2OD4KAdhEEw0nc/BAGBVJnXIIraPDE3ndxre57nnXnu7JQii+tH919hcUBM/Wa5Va3OV2mKFf2uHb9wzBM9Gvpu3/0QBARSZQ0IlZCqv11wxB3Efr3R1qTuJTN9insezYPalcvffMH15NF9iaqSipPLlnF7s/7HRu6Zn8YXxvo4P"
    + "qQrIOiDgJAxIOJTlBnGX0tuKOLRECNE8oh13IZofwTh/OXZwrVz0Vl5+kMFK76Is8MPKTdmN+t/dHGnv++rH4IRBFJlDQitfZmsaz84xYbvN8RaJDUhYeCKSg4qrUv/9n8ls++EJAVOpak2tRvnqXCjH5cayk5hv/0QBATSZN3MG10Epy4ZJ3+YcRuBG32W0yDSXbC2N+e6YVA"
    + "ePnrdVJXk0b0T1S1CQmVrPfivajt9vOoWhI2R+z/10Q9BQCBN5j5IdApcSR6fejjtNPww/jzvLltx0EgQeqXa3SG93k/DLiFKkmpWYpb54EJ1vpI8/bYC1ztYmv6+934IAgKpMgdEHO6qqK+/tvTQdnw3dfQgXui6DWekce8cjR9iP94doPLmGjtyoXKrtXr8x3ZC1w/76ocgI"
    + "JAqa0CohFSqlKmLCxP/ERYdV5zAIaVoxd5abvHpXzRTnFx6Zyd2p3yY0pHhdrvQriZPv63goBs0+umHICCQKntAaFovS2PHTyyfev05p2RHq+aOB8YagT1TfHh8gj6/qbLM5JG9o5Kkj3/FEP2Pyny1nfyorp+3kUdjmwhpz/0QBARS9RCQmLggtPnGrdFLhXa7WgtETgKaAHm"
    + "+68+Fduv87IMrmr6TiooeK4pS1TY//mM7cT9kLHs/pCsg9LrigPQwT4O9p8eAyKokqczQpZfulM/PjrbD6LFeGNJ/wch0qXzjitXsf+NVVKjiCxU2G+I99D828Cghr528eJyeTjzf9jWOEQRS9RgQhTHO6rLZHDKe+vLw6OzMSMmxiTMzXSraB36tm5bBeprbrJcUNE3m5KFe+"
    + "h8bBaHzj1+/Ovs6PVm2EQABgTSZN/MmqFhkzmW1rmiaqb7x3YM7X7SrlWq1ffjOobtXzCHDoAjR6jy5e89ENYuQULlat3vof3QLi2ceji9l7ocgIJCm14ConGZYVDCKREtwTTN0RX372rVrH56WTFNv6uJaHUwWuyf2SZQi1aokWebtb2h1nvxWPfPs4IBz/9fs58tCQCBVr4t"
    + "0haqFBhFGUaCyMxXT0DVN103DMBXxIEqHKe6zA/S83JKOfNO6tfnxH9sJvEYQ2sWHmfshCAik6jUgTJboE5lqjpJAf4tOOpLUD609xMMoOTtYhBDR/+BHhmvtQruXK0+vN2f7c66b/XxZCAik6nkNIslijiVzsZ9tVMyUEfoaXY85+qgWgdk0X9uJHt9H/2Mj0Q+hV5K9H4KAQ"
    + "KpeR5BHJ6pCMXkT+1/12//YKLj//cT4ibHj0U9IfkaqroCgDwLCkxKQZKImBqFzyoO++x/dZh5OjI9Niguqq1udPgIjCKR6QgJC9ZmMIOL4jwtUqP31PzYK/dL9h6fGT6hmtAEu+lmpEBBI0+tm3kdFxCMOSVN78Led9D828MISzbKWZC6aIVss1xEQSPPEBET8R/nglnn7QvV"
    + "y3/2PjTzXf7Z45uGCrjKusi2OcERAINWTs0gXowifGPvhT+6zrjjvw0CIXXsbxZGfFY2rfKsGPwICqZ6kgEjcXP6Afhsn+1nkt+MeCFx6STMvS4Zq8tOb70aJgECqJ2eKRQOIYvxxhEaPRvyLrNzsRGiLC8cF3uJ3unZaNTevdAQEUj2igDBxtC3barPRqqj6VFpAM0u5Oaj+x"
    + "0Yrx4eIHemltLlWV0DQBwHhUY0gNJlhsrL9kSFUmOIL1aw82P7Heg33T9+/tnBxUqmrYmNW98vDCAKpBh0QKjRRTrKsih2ztt0NKrk7jThqUzsyuP5Hl4b9j29PTVyUo35IyrHyCAikGfxm3rjgxe7wouiib21B3CMKCWtqOzv+YxvenHP/+YUFVRyrEh0jsgECAmkeTR+EMVU"
    + "WO41sf6CSKL0oR1p0/Efm81/1qmG7z9rTvy5ZYqWedrIVBARSDTwg8SO5OAgj2rl3e3Qvrsk3xPU/aoPqf3TxwqARFJ9XDKYqYpa1EQICqR5BQEQ/wzBNOaUMU4n78wfD7Vqh/chGkOCgG9IoUvyN63VFqSc/uQMCAqkGHBAqJRoQTP3lp0yFsW3X6Mn9FePmcKtWma9tev2Pn"
    + "fJssdk28Gc/NpqqmnLGRwQEUg0oIHGh0xdFVZh57u6Z4i+njo9NHhffjvYT7BJPv2R6CLPMzNf/2LH7DyfGT5xYlmiNpErKWoK7AoI+CAiDDQjdKKo5dLQQlEpvfTW2fFGmwlsJw3rx95L+x6VH1f/YKHTv/3p2/MQYZ3WmMHXt1I8YQSDV4KZYVPFirJCNoaPDi14wXXzrq09"
    + "oBOHRBt/kPqvi2BCuWoM8/mNbofOPbyfGLzJTnIu749dCQCDN4DbzUoXRjXTauE75mA8ajfvOpxNLq0PLBisBofmVdvu/Ko+u/7FB6DfcM/+5NCGLTg3vWK0jIJBmUAGJ40HLcsO6WhgWF9v056adXxbEGU54ypFKouSixzzi/sdGYeAfLM58P2XIMpfUjl8LAYFUAwtIfGOc2"
    + "zdcaFertJ7w5krO54bBVZZynqzk7txiRy60bj3C/scGgRfanlv8VtIUeV0/BAGBVIOaYlEN0YLCNO62RmvxEYEePZH/JtfF+a67RAER/Y8bw/OPsv/RpeGEc0Wn+DHTxNUZttiKhYCAMLhFOtWYot0bbrVpxtT2oyHBK1b/bHE5Gl660HcV4+Ziq9aar1Ggot+h4xd5RIIwcBu"
    + "ee/4jxVDFlUlXICCQaocBiQaO6EtdYcrQ3Y39jBH7l7PHJ48vi7vF/ZA4LTTt4lLz0R3/sR27+MFJSsja7vhdAUEfBITBBERUvKpYd8sb+xlhsfTWPyenOvoh8d0Hf/6r3gSlZxQj+p0SGEEg1c6nWFRlYjOVqgzdKw/TE4gnW33C0J8uvvXPi6v9kDgihNct7cb51sb7/1680"
    + "gGJAoIpFmxt55t545qX6sbQ1eHFrn5G1A95ca0fshIQml/pv2f/YyOv+LRidh5ZiIBAmp0GJI4HfRTrNL8aFjsbdmmccf612g8RpSYeI85/9Xv2P7oU/9ukgGyxBkFAQNhxQOIbc2jfYmG+1tXPEIXWGLE/XemHJHePj/+4Vcl8/fOBKz1Na5DoJcQQEEi10ykW1Y7of+h3W61"
    + "apbuf4QmBHaz0Q6KASNyUHgzPt0f7v4LUTnmlZzgW6bC9nS/SqbYU7eji6OXafGs+Kq3kRogKjT6vO/ohdCuO/6A0XX50x39sK16DrEFAIFWfAYkuLUVfJpcvLo8tnXphu35GqfjiqeUTY8sKTbSYJv1+x39spvT08tZTLPRBQOh3BKF8iMI5fnzq4tTE+6Vt+xlO8ZfXji9dP"
    + "K3wz4aMdy48rv7HKqxBIJP+p1gUEC6NHT8xdfaV0gg9UDxJxxOt5/nTI//654lJTVXPKTcv0Vrl8fQ/ViEgkMVON/Muf7J06tWZmXDbfkYYnrE/Hz/JmGXeHOT1P/qFgEAWfQdE1AwV1djS+PvFkWDbcveC4OB08cVx3uR3vqm0W8m3Hx8EBDLpd5EeB4RPnX1vxBHnT99uPUF"
    + "DRqPkfn5dvX2pdbly+bH1P1YgIJDJjkYQbpx8wbX9IHSTR28u+hmB/9dDw6OHq+3H1v9YhYBAJjtag5ja+zO2OGUhjSHRc3Q80Xqh64qaC1qFWo3y8fj6HysQEMikx4BQqYjZFRsT/Y+Tr23b/3hioQ8CmfQXEGl5bJnW5+8VH3s/o18YQSCT3qdYUf9jcvLi0qlXR0r0APHgj"
    + "ifYJRAQyKL3zbxUSXQzeeLkxAulkvfY+xn9QkAgi14DEseDsYsLE++NFGltvlshIJBJzwGJb6Ymfh6xQz987P2MfiEgkEmvUyyqFXH8x8kfHTd0vd0aDwQEMup9kU61pGgviP7HnNjFJHpsxxPsEggIZJIxINHAIf4zZS4b577btf2PFeiDQCa9BUSSRD6su6O7tv+xAiMIZJJ"
    + "9ikUBEd9VjXNXF7vOf7XrICCQRfbNvFRBdCPVjebd4fL8ru1/rEBAIIusAYnjwZhqWPuGh9tp57/aXRAQyCRzQOIbo/ny8Git8rtdz+ORQUAgk6xTLKoR0f8wXi6I6xtgBIGcyL5IpxpStH3ifFaHq7/f9TweFQQEMulhDXJi4eT7JXfXL89j6INAJhkDwhmvG2dfKNmBCMgey"
    + "AhGEMgk6wjCVf3ceyPTSftj9ycEAYEssm7mVerm9bvTxTA6AGT3HgWyBgGBLDIHxLC+W3Qae2X8QEAgo6xTLO3qbHmO/j3YG/lAQCCbjAExr7Zabbsh2oPRJCu+8y6GgEAmWQNyrFxr07+JwkFAID+yBIQxvvzDbj4APQX6IJBJ1oB8sOcCghEEMkBAYggIpMm0mRcBSe4EuYO"
    + "AJBAQSIWAxBAQSIWAxBAQSIWAxBAQSJU1IOiDQC5hBIlhBIFUCEgMAYE02MybQEAgDQKSQEAgFQISQ0AgFQISQ0AgFQISQ0AgVdaAoA8CuYQRJIYRBFIhIDEEBNJgM28CAYE0CEgCAYFUCEgMAYFUCEgMAYFUCEgMAYFU2wWECodJnI/94PpB0HG/Xa5dvqMojKvJq0wJCPogI"
    + "GQMyPJ/T9u+bTvuHlGdfVcxZLY2UHYFRLwTGEEgY0AmnxuxA9sN7D1iePGYbMgyAgJb234zrwiIxJUP//z1n5/6+qmv94wPTYVeXPIiERBIlyUg0a1iWYZu6XuFYSmSjIDAtrYNyCpGlSLqaE+gcEg8ekUJ+h4CAt2yBoQxLuYkewWnQEiyvPaKEBBIlS0gjClcFp+6ewXlnf7"
    + "XUfgICKTKPsXa27oCgj4ICAhIDCMIpEJAYggIpMm0u3seICCQBgFJICCQCgGJISCQCgGJISCQCgGJISCQyuTvznhrB3q4YeD79r/igOSqA8Dq198uV5K3wfcIfYkCQv+W3AdyhxnKsUWPQrHK82z7lyX6J1lSeG4qgzEuW59dLidvQjR8EPsWApJvTDfvLHYeTOt6nuu8MiH+S"
    + "YjvtfcxpS6fe6rSERBx47m3ZNFJRzM9t5hm3pxdnWDFGqUPTho0gND4sYd2T9waDSDN5sfDteQtEAGJ1iDHmCnCgYDkFTOM/bMdMywv9IK5ov+KppuKwqlu8oJpQ39ttzoCEq1CnBuSgoDkmqLvG7aTqiCeL+ZbrnfvtKUZmqWfzAlN4y99Uai14ndhJSCB85EiAoIpVn4x641"
    + "RJ6kKIfD8IPSL5WO//eXQoS/3P58Th357p1Wozs8n70IUEPpi39Npool85BdNva9UOwMSisoIGrXC7OLw8OLiTE4Mzxaq1WqtmrwLIiB+4HvBGxpNMxGQ/GIS129eqrXFjIKGj6Q8qEByJnnZqzwx0wyLz9A6jD5F4vcK8oiZ2nflNn1yri+SpG5yI3nZHWgMCZ1vTY4Fer4xR"
    + "a/Pj7ajEukolLhs8iN52avoO0HoBr+IgCAhOcYkWWl+eYkCQjXSXSe55YWBF5aeOSk2dSMgecZkSbvSKkfhQEDWeF7Dcf/fQvIuQV5xWWzI+u1SgICs4wVhMP3BwnEMHznHGeeqVX/XETv0IiCrQt+fnvvXqUnkI+eYwpiiNl8quSIgnQeG5FsQ2vffH1+ejN4jpCTfKCLaR4v"
    + "l+dp8tSpiIjpkSZ3kTxh6get789W/fTlkquiA5B59Ooqzipq3F0erreplkY48zrWCIG6Seq7tzYWB2/rmpmKo5toFdiCfoukD3ZxTbl+qXK5V465APgeQ6IWHDd+lEXTxHfU6U5W9dLZV6Ed0TBTdyEP8L7OLh8UuJzSG0CQjZ1Y/FlybFujOyAM2JMsSpliQRESVz+kfVRcL9"
    + "OEpdmQNacoRiaonR8LAazhnvOcli9XFYbjJmwQ5RgHh4uhBY+jarYLr0gq1YwSJPllzYOW1Bp5fmnn23xc0qa5IqjgeHXItmmBFX5nMNenqnD1TooisHqUeVU8ORC+WRsxiacT7cXJiWWYcuynCakAYE5s0Vd2cfPWAXRoZKcbXgnXdeKKVB67tFEsl5+CPnyxMjY3R8lyWsBE"
    + "LNrIs5drLd9qV1mh5eLicH8OFQrlcu/nb13xIxwEgsCmZ603LVN9+6d7Rq0dz5O7Ve29eU03N0rlK4wbWHpCOs7oqGVbTsrRcsTRdsyzd5IxxBcfYwmaYJBantGDPGXrp0QsX+ZBohR6/GwAbiJ6hqq6dp0CUTF7IsjhTHv1BfE4AbCWqkByWiUqvmeZYWINAOnGIqfhKH6Pxx"
    + "2pORC8+nmgxGkgA0kVrEBEP8eeVeVZOiCmWeOnRigQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgO0n6/8mbv3wGxk+1AAAAAElFTkSuQmCC";

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
      + "data:text/css;base64,OnJvb3R7LS1mb3JlZ3JvdW5kLWZvbnQtY29sb3I6I2ZmZmZmZjstLXByaW1hcnktYWNjZW50LWZvbnQtY29sb3I6IzAwODBmZjstLXNlY29uZGFyeS1hY2NlbnQtZm9udC1jb2xvcjojMjI3MWIxOy0tZGFyay1iYWNrZ3JvdW5kLTA6IzAwMDAwMD"
      + "stLWRhcmstYmFja2dyb3VuZC0xOiMwMjAzMDM7LS1kYXJrLWJhY2tncm91bmQtMjojMDkwQjBEOy0tZGFyay1iYWNrZ3JvdW5kLTM6IzFkMjMyNzstLWJyaWdodC1ib3JkZXItMDojYTdhYWFkOy0tYnJpZ2h0LWJvcmRlci0xOiM5QkFEQkZ9Ym9keS53cC1hZG1pbi5uYm5fZ"
      + "GFya3tiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjd3Bib2R5LWNvbnRlbnQgLndyYXAgaDF7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250"
      + "LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgI2NvbnRleHR1YWwtaGVscC1iYWNre2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1"
      + "pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5jb250ZXh0dWFsLWhlbHAtdGFicyAuYWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyay"
      + "Ajd3Bjb250ZW50IC5jb250ZXh0dWFsLWhlbHAtdGFicyAuYWN0aXZlIGF7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjZGFza"
      + "GJvYXJkLXdpZGdldHMgLnBvc3Rib3gtY29udGFpbmVyIC5lbXB0eS1jb250YWluZXJ7b3V0bGluZS1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50ICNkYXNoYm9hcmQtd2lkZ2V0cyAucG9zdGJveC1jb250"
      + "YWluZXIgLmVtcHR5LWNvbnRhaW5lcjphZnRlcntjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjbWFqb3ItcHVibGlzaGluZy1hY3Rpb25ze2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5"
      + "kLTIpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50ICNtZW51LW1hbmFnZW1lbnQgLm1lbnUtZWRpdHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY2"
      + "9sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjbWVudS1zZXR0aW5ncy1jb2x1bW4gLmFjY29yZGlvbi1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyL"
      + "WNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLmNvbW1lbnQtYXlze2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQt"
      + "Myl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5mZWF0dXJlLWZpbHRlcntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfWJvZHkud3AtYWRtaW4ubmJuX2Rhcms"
      + "gI3dwY29udGVudCAuaW1nZWRpdC1ncm91cHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAubWFuYWdlLW1lbnVze2"
      + "JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5tZW51LWl0ZW0taGFuZGxle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZ"
      + "GFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5wb3B1bGFyLXRhZ3N7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNv"
      + "bG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLnN0dWZmYm94e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9"
      + "keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53aWRnZXQtaW5zaWRle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb2"
      + "50ZW50IC53aWRnZXQtdG9we2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53aWRnZXRzLWhvbGRlci13cmFwe2JhY"
      + "2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53cC1lZGl0b3ItY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0t"
      + "ZGFyay1iYWNrZ3JvdW5kLTApO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHAucG9wdWxhci10YWdze2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1"
      + "jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHRhYmxlLndpZGVmYXR7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC"
      + "0zKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLm1lZGlhLXRvb2xiYXIud3AtZmlsdGVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pb"
      + "i5uYm5fZGFyayAjd3Bjb250ZW50ICNtaW5vci1wdWJsaXNoaW5nLWFjdGlvbnN7cGFkZGluZzowIDEwcHh9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50ICNtaW5vci1wdWJsaXNoaW5nLWFjdGlvbnMgaW5wdXR7bWFyZ2luLWJvdHRvbTo1cHh9Ym9keS53cC1h"
      + "ZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50ICNwb3N0LXN0YXR1cy1pbmZve2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2JvcmRlcjpub25lfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjc2NyZWVuLW1ldGF7YmFja2dyb3VuZC1"
      + "jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMik7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93LXNldHRpbmdze2JhY2tncm91bmQtY29sb3I6dm"
      + "FyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93L"
      + "XNldHRpbmdzOmFjdGl2ZXtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjc2NyZWVuLW1ldGEtbGlua3MgLnNob3ctc2V0dGluZ3M6"
      + "Zm9jdXN7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgI3NjcmVlbi1tZXRhLWxpbmtzIC5zaG93LXNldHRpbmdzOmhvdmVye2JvcmR"
      + "lci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGlucHV0W3R5cGU9Y29sb3Jde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW"
      + "5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1kYXRlXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhc"
      + "mstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGlucHV0W3R5cGU9ZGF0ZXRpbWUtbG9jYWxde2JhY2tn"
      + "cm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1"
      + "kYXRldGltZV17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udG"
      + "VudCBpbnB1dFt0eXBlPWVtYWlsXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZ"
      + "GFyayAjd3Bjb250ZW50IGlucHV0W3R5cGU9bW9udGhde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5Lndw"
      + "LWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1udW1iZXJde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWN"
      + "vbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1wYXNzd29yZF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3"
      + "JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBpbnB1dFt0eXBlPXNlYXJjaF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb"
      + "2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBpbnB1dFt0eXBlPXRlbF17YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dy"
      + "b3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBpbnB1dFt0eXBlPXRleHRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1"
      + "kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT10aW1lXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY2"
      + "9sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGlucHV0W3R5cGU9dXJsXXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xK"
      + "Ttib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGlucHV0W3R5cGU9d2Vla117YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJh"
      + "Y2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBzZWxlY3R7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJ"
      + "hY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBzZWxlY3Q6ZGlzYWJsZWR7Y29sb3I6dmFyKC0tYnJpZ2h0LW"
      + "JvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgc2VsZWN0e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZ"
      + "m9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgc2VsZWN0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91"
      + "bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgc2VsZWN0OmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp"
      + "2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgc2VsZWN0IG9wdGlvbntjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfW"
      + "JvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAud3AtY29yZS11aSAuYnV0dG9ue2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAud3AtY29yZS11aSAuYnV0dG9uOmRpc2Fib"
      + "GVke2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH1ib2R5LndwLWFkbWlu"
      + "Lm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgLmJ1dHRvbi1zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53cC1jb3JlLXVpIC5idXR0b24tc2Vjb25kYXJ"
      + "5OmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH1ib2R5Ln"
      + "dwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgLmJ1dHRvbi1kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKSFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpbXBvcnRhb"
      + "nQ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKSFpbXBvcnRhbnR9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53cC1jb3JlLXVpIC5idXR0b24tc2Vjb25kYXJ5LmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEp"
      + "IWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgLmJ1dHRvbi1zZWN"
      + "vbmRhcnlbZGlzYWJsZWRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWltcG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH"
      + "1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgLmJ1dHRvbi5kaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKSFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpb"
      + "XBvcnRhbnQ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKSFpbXBvcnRhbnR9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53cC1jb3JlLXVpIC5idXR0b25bZGlzYWJsZWRde2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpIWlt"
      + "cG9ydGFudDtib3JkZXItY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpIWltcG9ydGFudDtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpIWltcG9ydGFudH1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWNvcmUtdWkgLmF0dGFjaG1lbnQtcHJ"
      + "ldmlld3tiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGV4dGFyZWF7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2"
      + "dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCB0ZXh0YXJlYTpkaXNhYmxlZHtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29ud"
      + "GVudCBpbnB1dFt0eXBlPXNlYXJjaF0uc2VhcmNoe2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFk"
      + "bWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGFibGUgdGhlYWQgdGR7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHRhYmxlIHRoZWFkIHRoe2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGV"
      + "yLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCB0YWJsZSB0aGVhZCB0ciB0ZHtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCB0YWJsZSB0aGVhZCB0ciB0aHtjb2xvcjp2YXIoLS"
      + "1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCB0YWJsZSB0Ym9keSB0cjpudGgtY2hpbGQob2RkKXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpbXBvcnRhbnR9Ym9keS53cC1hZG1pbi5uY"
      + "m5fZGFyayAjd3Bjb250ZW50IHRhYmxlIHRmb290IHRke2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCB0YWJsZSB0Zm9vdCB0aHtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX1i"
      + "b2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGFibGUgdGZvb3QgdHIgdGR7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGFibGUgdGZvb3QgdHIgdGh7Y29sb3I6dmFyKC0tZm9yZWd"
      + "yb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGFibGUgdGR7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdGFibGUgdGh7Y29sb3I6dmFyKC0tZm9yZW"
      + "dyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdWwuc3RyaXBlZCBsaTpudGgtY2hpbGQob2RkKXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKSFpbXBvcnRhbnR9Ym9keS53cC1hZG1pbi5uYm5fZGFya"
      + "yAjd3Bjb250ZW50ICN0aXRsZWRpdiAjdGl0bGV7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1jaGVja2JveF17"
      + "YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXRbdHlwZT1yYWRpb117YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQ"
      + "tMSk7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgI3dwLWNvbnRlbnQtZWRpdG9yLXRvb2xze2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfWJvZHkud3AtYWRtaW4ubmJuX2Rhcm"
      + "sgI3dwY29udGVudCAuYWx0ZXJuYXRle2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAjd3Bmb290ZXJ7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrI"
      + "CN3cGNvbnRlbnQgaW5wdXQuZGlzYWJsZWR7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgaW5wdXQ6ZGlzYWJsZWR7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJr"
      + "ICN3cGNvbnRlbnQgc2VsZWN0LmRpc2FibGVke2NvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHRleHRhcmVhLmRpc2FibGVke2NvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5"
      + "fZGFyayAjd3Bjb250ZW50IC5kcmFnLWRyb3AgI2RyYWctZHJvcC1hcmVhe2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5lZGl0LWF0dGFjaG1lbnQtZnJhbWUgLmVkaXQtbWVkaWEtaGVhZG"
      + "VyIC5sZWZ0e2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5lZGl0LWF0dGFjaG1lbnQtZnJhbWUgLmVkaXQtbWVkaWEtaGVhZGVyIC5sZWZ0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyK"
      + "C0tYnJpZ2h0LWJvcmRlci0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLmxlZnQ6aG92ZXJ7YmFja2dyb3VuZC1j"
      + "b2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAuZWRpdC1hdHRhY2htZW50LWZyYW1lIC5lZGl0LW1lZGlhLWhlYWRlciAucmlnaHR7Ym9yZGVyLWN"
      + "vbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLnJpZ2h0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci"
      + "0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgLnJpZ2h0OmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnJpZ"
      + "2h0LWJvcmRlci0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLmVkaXQtYXR0YWNobWVudC1mcmFtZSAuZWRpdC1tZWRpYS1oZWFkZXIgW2Rpc2FibGVkXTpob3Zlcntjb2xvcjp2YXIoLS1k"
      + "YXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5lZGl0LWF0dGFjaG1lbnQtZnJhbWUgLmF0dGFjaG1lbnQtaW5mbyAuZmlsZW5hbWV7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9"
      + "kYXJrICN3cGNvbnRlbnQgLnVwbG9hZC1waHAgLm1lZGlhLW1vZGFsLWNsb3Nle2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC51cGxvYWQtcGhwIC5tZWRpYS1tb2RhbC1jbG9zZTpmb2N1c3"
      + "tiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC51cGxvYWQtcGhwIC5tZWRpYS1tb2RhbC1jbG9zZTpob3ZlcntiYWNrZ3Jvd"
      + "W5kLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5tZWRpYS1mcmFtZS1jb250ZW50e2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91"
      + "bmQtMyk7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLm1lZGlhLWZyYW1lLWNvbnRlbnQgLmF0dGFjaG1lbnQtaW5mb3tiYWNrZ3JvdW5kOnZ"
      + "hcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAuYXR0YWNobWVudC1pbmZve2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9Ym9keS53cC1hZG1pbi"
      + "5uYm5fZGFyayAjd3Bjb250ZW50IHNwYW4uYWNmLXN3aXRjaC1vZmZ7Y29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAubWNlLWJ0biBidXR0b257Ym9yZGVyOm5vbmU7Ym9yZGVyLXRvcC1jb2xvcjp0cmFuc"
      + "3BhcmVudDtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAubWNlLXRvb2xiYXIgLm1jZS1pY297Ym9yZGVyOm5vbmU7Ym9yZGVyLXRvcC1jb2xvcjp0cmFuc3BhcmVudDtjb2xvcjp2YXIoLS1mb3Jl"
      + "Z3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAubWNlLXRvb2xiYXIgLm1jZS1idG4tZ3JvdXAgLm1jZS1idG46Zm9jdXN7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCk7Ym9yZGVyLWNvbG9yOnZhcigtLXByaW1"
      + "hcnktYWNjZW50LWZvbnQtY29sb3IpO2JveC1zaGFkb3c6bm9uZTtjb2xvcjp2YXIoLS1wcmltYXJ5LWFjY2VudC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLm1jZS10b29sYmFyIC5tY2UtYnRuLWdyb3VwIC5tY2UtYnRuOmhvdmVye2"
      + "JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApO2JvcmRlci1jb2xvcjp2YXIoLS1wcmltYXJ5LWFjY2VudC1mb250LWNvbG9yKTtib3gtc2hhZG93Om5vbmU7Y29sb3I6dmFyKC0tcHJpbWFyeS1hY2NlbnQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZ"
      + "GFyayAjd3Bjb250ZW50IC5tY2UtdG9vbGJhciAubWNlLWJ0bi1ncm91cCAubWNlLWJ0bjpob3ZlciAubWNlLWljb3tjb2xvcjp2YXIoLS1wcmltYXJ5LWFjY2VudC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLm1jZS10b29sYmFyIC5t"
      + "Y2UtYnRuLWdyb3VwIC5tY2UtYnRuLm1jZS1saXN0Ym94e2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAucXQtZGZ3OmZvY3Vze2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApO2J"
      + "vcmRlci1jb2xvcjp2YXIoLS1wcmltYXJ5LWFjY2VudC1mb250LWNvbG9yKTtib3gtc2hhZG93Om5vbmU7Y29sb3I6dmFyKC0tcHJpbWFyeS1hY2NlbnQtZm9udC1jb2xvcil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5xdC1kZnc6aG92ZXJ7YmFja2dyb3"
      + "VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCk7Ym9yZGVyLWNvbG9yOnZhcigtLXByaW1hcnktYWNjZW50LWZvbnQtY29sb3IpO2JveC1zaGFkb3c6bm9uZTtjb2xvcjp2YXIoLS1wcmltYXJ5LWFjY2VudC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3c"
      + "GNvbnRlbnQgLm5vdGljZXtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKTtib3JkZXItYm90dG9tLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXJpZ2h0LWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMSk7Ym9yZGVyLXRvcC1jb2xvcjp2"
      + "YXIoLS1icmlnaHQtYm9yZGVyLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBkaXYuZXJyb3J7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCk7Ym9yZGVyLWJvdHRvbS1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1yaWd"
      + "odC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci10b3AtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgZGl2LnVwZGF0ZWR7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCk7Ym"
      + "9yZGVyLWJvdHRvbS1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci1yaWdodC1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTEpO2JvcmRlci10b3AtY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0xKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlb"
      + "nQgLnBvc3Rib3h7Ym9yZGVyLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLnBvc3Rib3g+ZGl2Lmluc2lkZXtkaXNwbGF5OmlubGluZS1ibG9jazttYXJnaW46MH1ib2R5LndwLWFkbWluLm5ibl9kYXJr"
      + "ICN3cGNvbnRlbnQgLnBvc3Rib3g+ZGl2Lmluc2lkZT5we21hcmdpbjowIDAgMWVtfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAucG9zdGJveCAucG9zdGJveC1oZWFkZXIgaDJ7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWF"
      + "kbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLnBvc3Rib3gtaGVhZGVye2JvcmRlci1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMSl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5xdWlja3RhZ3MtdG9vbGJhcntiYWNrZ3JvdW5kOnZhcigtLWRhcmstYm"
      + "Fja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBkaXYubWNlLXRvb2xiYXItZ3Jwe2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtLWZvcmVnc"
      + "m91bmQtZm9udC1jb2xvcik7Ym9yZGVyLWNvbG9yOnZhcigtLWJyaWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5odG1sLWFjdGl2ZSAuc3dpdGNoLWh0bWx7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyk7Y29sb3I6"
      + "dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLnRtY2UtYWN0aXZlIC5zd2l0Y2gtdG1jZXtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29"
      + "sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBoMntjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBoM3tjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3"
      + "AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBmb3JtI3lvdXItcHJvZmlsZSB0YWJsZS5mb3JtLXRhYmxlIHRoW3Njb3BlPXJvd117Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgZm9ybSN5b3VyL"
      + "XByb2ZpbGUgdGFibGUuZm9ybS10YWJsZSBsYWJlbHtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAubWVkaWEtZnJhbWUtdGl0bGUgaDF7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9y"
      + "KX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgbGFiZWxbZm9yPW5ld19hcHBsaWNhdGlvbl9wYXNzd29yZF9uYW1lXXtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZvbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAudXNlci1zZXN"
      + "zaW9ucy13cmFwLmhpZGUtaWYtbm8tanMgdGh7Y29sb3I6dmFyKC0tZm9yZWdyb3VuZC1mb250LWNvbG9yKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndyYXAgLmFkZC1uZXctaDJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMS"
      + "l9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC53cmFwIC5hZGQtbmV3LWgyOmFjdGl2ZXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndyYXAgLnBhZ2UtdGl0bGUtY"
      + "WN0aW9ue2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAud3JhcCAucGFnZS10aXRsZS1hY3Rpb246YWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEp"
      + "fWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAud3Atc3dpdGNoLWVkaXRvcntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0xKTtib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKTtjb2xvcjp2YXIoLS1mb3JlZ3JvdW5kLWZ"
      + "vbnQtY29sb3IpfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCA6cm9vdHstLWFjY2VudC1mb250LWNvbG9yOiMwMDgwZmY7LS1icmlnaHQtYm9yZGVyLTA6I2E3YWFhZDstLWJyaWdodC1ib3JkZXItMTojOUJBREJGOy0tZGFyay1iYWNrZ3JvdW5kLTA6IzAwMD"
      + "stLWRhcmstYmFja2dyb3VuZC0xOiMwMjAzMDM7LS1kYXJrLWJhY2tncm91bmQtMjojMDkwQjBEOy0tZGFyay1iYWNrZ3JvdW5kLTM6IzFkMjMyNzstLWZvcmVncm91bmQtZm9udC1jb2xvcjojZmZmfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBkaXYgcC5zd"
      + "WJtaXQgaW5wdXQjc2F2ZS5idXR0b257LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7YXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTEpO2JvcmRlci1jb2xvcjp2YXIoLS1zZWNvbmRhcnktYWNjZW50LWZvbnQtY29sb3IpO2Jv"
      + "cmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItd2lkdGg6MXB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDtjb2xvcjp2YXIoLS1zZWNvbmRhcnktYWNjZW50LWZvbnQtY29sb3IpO2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6aW5saW5lLWJsb2NrO2Rpc3B"
      + "sYXk6YmxvY2s7Zm9udC1zaXplOjEzcHg7bGluZS1oZWlnaHQ6Mi4xNTM4NDYxNTttYXJnaW46MDttYXJnaW4tYmxvY2stZW5kOjA7bWFyZ2luLWJsb2NrLXN0YXJ0OjA7bWFyZ2luLWlubGluZS1lbmQ6MDttYXJnaW4taW5saW5lLXN0YXJ0OjA7bWluLWhlaWdodDozMHB4O3"
      + "BhZGRpbmc6MCAxMHB4O3RleHQtYWxpZ246Y2VudGVyO3RleHQtZGVjb3JhdGlvbjpub25lO3doaXRlLXNwYWNlOm5vd3JhcH1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgZGl2I3ByZXZpZXctYWN0aW9ue2Rpc3BsYXk6LXdlYmtpdC1ib3h9Ym9keS53cC1hZ"
      + "G1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGRpdiNzYXZlLWFjdGlvbntkaXNwbGF5Oi13ZWJraXQtYm94fWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCBkaXYubWNlLXBhbmVse2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfWJvZHkud3AtYWRt"
      + "aW4ubmJuX2RhcmsgI3dwY29udGVudCAuc2VsZWN0Mi1jb250YWluZXItLWRlZmF1bHQgLnNlbGVjdDItc2VsZWN0aW9uLS1tdWx0aXBsZXtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLnNlbGV"
      + "jdDItZHJvcGRvd257YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5tZWRpYS1tb2RhbC1jb250ZW50e2JhY2tncm91bmQ6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTApfWJvZHkud3AtYWRtaW4ubm"
      + "JuX2RhcmsgI3dwY29udGVudCBmaWVsZHNldCNjb2xvci1waWNrZXIgLmNvbG9yLW9wdGlvbi5zZWxlY3RlZHtiYWNrZ3JvdW5kOnZhcigtLWRhcmstYmFja2dyb3VuZC0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgLndwLWVkaXRvci1leHBhbmQgI3dwL"
      + "WNvbnRlbnQtZWRpdG9yLXRvb2xze2JvcmRlci1jb2xvcjp2YXIoLS1icmlnaHQtYm9yZGVyLTApfWJvZHkud3AtYWRtaW4ubmJuX2RhcmsgI3dwY29udGVudCAuc2VsZWN0Mi1jb250YWluZXIuLWFjZiAuc2VsZWN0Mi1zZWxlY3Rpb257Ym9yZGVyLWNvbG9yOnZhcigtLWJy"
      + "aWdodC1ib3JkZXItMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IC5hY2YtdGF4b25vbXktZmllbGQgLmNhdGVnb3J5Y2hlY2tsaXN0LWhvbGRlcntib3JkZXItY29sb3I6dmFyKC0tYnJpZ2h0LWJvcmRlci0wKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN"
      + "3cGNvbnRlbnQgZGl2LnBvc3Rib3h7YmFja2dyb3VuZDp2YXIoLS1kYXJrLWJhY2tncm91bmQtMil9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IGRpdltkYXRhLXFyY29kZSo9b3RwYXV0aF0+aW1ne2ZpbHRlcjppbnZlcnQoMTAwJSl9bHQtaGlnaGxpZ2h0ZX"
      + "Jib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnR+I3RpbnltY2V7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMCl9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHAuc3VibWl0e2JvcmRlcjpub25lO2JvcmRlci1ib3R0b20tb"
      + "GVmdC1yYWRpdXM6MDtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czowO21hcmdpbjo1cHggMDttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOjAgMTBweDt0ZXh0LWFsaWduOmxlZnR9Ym9keS53cC1hZG1pbi5uYm5fZGFyayAjd3Bjb250ZW50IHVsI2FkbWlubWVudSBhLndwLWhh"
      + "cy1jdXJyZW50LXN1Ym1lbnU6YWZ0ZXJ7Ym9yZGVyLXJpZ2h0LWNvbG9yOnZhcigtLWRhcmstYmFja2dyb3VuZC0zKX1ib2R5LndwLWFkbWluLm5ibl9kYXJrICN3cGNvbnRlbnQgdWwjYWRtaW5tZW51PmxpLmN1cnJlbnQ+YS5jdXJyZW50OmFmdGVye2JvcmRlci1yaWdodC1"
      + "jb2xvcjp2YXIoLS1kYXJrLWJhY2tncm91bmQtMyl9"
      + "\"></link>");
    $("head").append("<link rel=\"stylesheet\" href=\""
      + "data:text/css;base64,OnJvb3R7LS1lLWdsb2JhbC1jb2xvci1hY2NlbnQtZGFyazojZWVlOy0tZS1nbG9iYWwtY29sb3Itc2Vjb25kYXJ5LWRhcms6Izc3NzstLWUtZ2xvYmFsLWNvbG9yLXByaW1hcnktZGFyazojZWVlfWh0bWwud3AtZGFyay1tb2RlLWFjdGl2ZSAuZW"
      + "xlbWVudG9yLXdpZGdldC1wb3N0cyAuZWxlbWVudG9yLXBvc3RfX3JlYWQtbW9yZXtjb2xvcjp2YXIoLS1lLWdsb2JhbC1jb2xvci1hY2NlbnQtZGFyayl9ZGl2W2RhdGEtd2lkZ2V0X3R5cGU9InRoZW1lLXNpdGUtbG9nby5kZWZhdWx0Il0gYSBpbWcsaHRtbC53cC1kYXJrL"
      + "W1vZGUtYWN0aXZlIGhlYWRlciAuZWxlbWVudG9yLXdpZGdldC1jb250YWluZXIgYSBpbWd7ZmlsdGVyOmludmVydCgxMDAlKX0uZWxlbWVudG9yLXdpZGdldC1wb3N0cyAuZWxlbWVudG9yLXBvc3RfX3RpdGxlIGEsaHRtbC53cC1kYXJrLW1vZGUtYWN0aXZlIC5lbGVtZW50"
      + "b3Itd2lkZ2V0LWF1dGhvci1ib3ggLmVsZW1lbnRvci1hdXRob3ItYm94X19uYW1lLGh0bWwud3AtZGFyay1tb2RlLWFjdGl2ZSAuZWxlbWVudG9yLXdpZGdldC1wb3N0cyAuZWxlbWVudG9yLXBvc3RfX3RpdGxle2NvbG9yOnZhcigtLWUtZ2xvYmFsLWNvbG9yLXNlY29uZGF"
      + "yeS1kYXJrKX1odG1sLndwLWRhcmstbW9kZS1hY3RpdmUgLmVsZW1lbnRvci13aWRnZXQtaGVhZGluZyAuZWxlbWVudG9yLWhlYWRpbmctdGl0bGV7Y29sb3I6dmFyKC0tZS1nbG9iYWwtY29sb3ItcHJpbWFyeS1kYXJrKX1idXR0b24uZWxlbWVudG9yLWJ1dHRvbi5hY3Rpb2"
      + "4tY29weS1hdXRob3J7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1lLWdsb2JhbC1jb2xvci1hY2NlbnQpO2ZvbnQtZmFtaWx5Om51bml0byBzYW5zLFNhbnMtc2VyaWY7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOmluaXRpYWw7dGV4dC1zaGFkb3c6cmdiYSgxMywxMywxMywuMykgM"
      + "CAwIDEwcHg7Y29sb3I6I2U1ZTBkODtib3JkZXItcmFkaXVzOjA7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO3RleHQtZGVjb3JhdGlvbjpub25lO2ZvbnQtc2l6ZToxM3B4O3dpZHRoOmF1dG87Ym94LXNoYWRvdzpub25lO2ZpbGw6I2U1ZTBkODtkaXNwbGF5OmlubGluZS1i"
      + "bG9jaztsaW5lLWhlaWdodDoxO3RleHQtYWxpZ246Y2VudGVyO3RyYW5zaXRpb246YWxsIC4zcztib3JkZXI6bm9uZTtib3gtc2hhZG93OjAgMCAwIDAgIzAwMDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnMgZWFzZSxib3gtc2hhZG9"
      + "3IC4ycyBlYXNlfWJ1dHRvbi5lbGVtZW50b3ItYnV0dG9uLmFjdGlvbi1jb3B5LWF1dGhvcjpmb2N1czpob3ZlcixidXR0b24uZWxlbWVudG9yLWJ1dHRvbi5hY3Rpb24tY29weS1hdXRob3I6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojMTA3MTE2IWltcG9ydGFudH1idXR0b2"
      + "4uZWxlbWVudG9yLWJ1dHRvbi5hY3Rpb24tY29weS1hdXRob3I6YWN0aXZle2JveC1zaGFkb3c6MCA1cHggMTBweCA1cHggIzAwMDt0cmFuc2Zvcm06dHJhbnNsYXRlWSg1cHgpO3RyYW5zaXRpb246dHJhbnNmb3JtIC4ycyBlYXNlLGJveC1zaGFkb3cgLjJzIGVhc2V9YnV0d"
      + "G9uLmVsZW1lbnRvci1idXR0b24uYWN0aW9uLWNvcHktYXV0aG9yOmZvY3Vze291dGxpbmU6MDtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWUtZ2xvYmFsLWNvbG9yLWFjY2VudCkhaW1wb3J0YW50fS5hY3Rpb24tY29weS1hdXRob3IgaW1nLmNsaXBib2FyZHttYXgtaGVpZ2h0"
      + "OmNhbGMoMThweCAqIHZhcigtLXdwLWRhcmstbW9kZS1zY2FsZSkpO21heC13aWR0aDpjYWxjKDE4cHggKiB2YXIoLS13cC1kYXJrLW1vZGUtc2NhbGUpKX0uZWxlbWVudG9yLWF1dGhvci1ib3hfX25hbWV7d2lkdGg6Zml0LWNvbnRlbnQ7ZGlzcGxheTppbmxpbmUtYmxvY2t"
      + "9ZGl2Om5vdCguZWxlbWVudG9yLWF1dGhvci1ib3gtLWJpb2dyYXBoeS15ZXMpW2RhdGEtd2lkZ2V0X3R5cGU9ImF1dGhvci1ib3guZGVmYXVsdCJdIGRpdi5lbGVtZW50b3Itd2lkZ2V0LWNvbnRhaW5lciBkaXYuZWxlbWVudG9yLWF1dGhvci1ib3ggLmVsZW1lbnRvci1hdX"
      + "Rob3ItYm94X190ZXh0e21pbi13aWR0aDoxMDAlO3dpZHRoOjEwMCV9ZGl2LmVsZW1lbnRvci1hdXRob3ItYm94X190ZXh0IGRpdjpub3QoLmVsZW1lbnRvci1idXR0b24td3JhcHBlcik6Zmlyc3QtY2hpbGR7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7LXdlY"
      + "mtpdC1ib3gtYWxpZ246Y2VudGVyOy1tcy1mbGV4LWFsaWduOmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXJ9LmVsZW1lbnRvci1hdXRob3ItYm94X190ZXh0IGF7YWxpZ24taXRlbXM6Y2VudGVyfS5jb3B5LWF1dGhvci13aWRnZXR7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6"
      + "Zml0LWNvbnRlbnQ7ZGlzcGxheTppbmxpbmUtYmxvY2t9LnBvc3Rib3g+ZGl2Lmluc2lkZXtkaXNwbGF5OmlubGluZS1ibG9jazttYXJnaW46MH0ucG9zdGJveD5kaXYuaW5zaWRlPnB7bWFyZ2luOjAgMCAxZW0gMH0="
      + "\"></link>");
    $("head").append(`<style id="darkFixStyle">html.wp-dark-mode-active .elementor-element>.elementor-background-overlay{background-image:linear-gradient(180deg,#FFFFFF00 60%,${defaultDarkBG} 100%) !important;}div.el`
      + `ementor-author-box__text div:first-child h4.elementor-author-box__name{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;${calcVariableCSS()}}div:not(.elementor-author-box--biography-yes)[data-widget_type="`
      + `author-box.default"] div.elementor-widget-container div.elementor-author-box .copy-author-widget{left:${variableTextLength()}}</style>`);
  };

  setupCSS();

  const handleIframes = () => {
    if (/https:\/\/(www\.)?glamourdresser\.com\/wp-admin\/post(-new)?\.php/gi.test(window.location.href)) {
      const iframes = $("iframe");
      for (const frame in iframes) {
        if (Object.prototype.hasOwnProperty.call(iframes, frame) && !isNaN(parseInt(frame, 10))) {
          $(iframes[frame]).ready(() => {
            const iframe = iframes[frame].contentWindow[0].document;
            $(iframe).find("head").append("<link rel=\"stylesheet\" href=\""
              + "data:text/css;base64,OnJvb3R7LS1mb3JlZ3JvdW5kLWZvbnQtY29sb3I6I2ZmZjstLWFjY2VudC1mb250LWNvbG9yOiMwMDgwZmY7LS1kYXJrLWJhY2tncm91bmQtMDojMDAwOy0tZGFyay1iYWNrZ3JvdW5kLTE6IzAyMDMwMzstLWRhcmstYmFja2dyb3VuZC"
              + "0yOiMwOTBCMEQ7LS1kYXJrLWJhY2tncm91bmQtMzojMWQyMzI3Oy0tYnJpZ2h0LWJvcmRlci0wOiNhN2FhYWQ7LS1icmlnaHQtYm9yZGVyLTE6IzlCQURCRn1ib2R5e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZGFyay1iYWNrZ3JvdW5kLTMpO2NvbG9yOnZhcigtL"
              + "WZvcmVncm91bmQtZm9udC1jb2xvcil9Ym9keSBwIGF7Y29sb3I6IzIyNzFiMX1ib2R5IHAgYTp2aXNpdGVke2NvbG9yOiMyMjcxYjF9"
              + "\"></link>");
          });
        }
      }
    }
  };

  $(window).on("hashchange", () => {
    handleIframes();
  });
});
