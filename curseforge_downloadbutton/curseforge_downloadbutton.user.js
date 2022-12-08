// ==UserScript==
// @name         Curse Forge Default Download Button
// @namespace    NekoBoiNick.Web.CurseForge.DownloadButton
// @version      1.0.0
// @description  Changes the "Install" button to a Download Button by default.
// @author       Neko Boi Nick
// @match        https://beta.curseforge.com/*/*
// @match        https://curseforge.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/curseforge_downloadbutton/curseforge_downloadbutton.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
  if ($(".project-header .actions #menuButton").length > 0) {
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").off("click");
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html("");
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").html($(".project-header .actions #menuButton .more-options li:last-child a").html());
    $(".project-header .actions #menuButton button:not(\".btn-more-options\")").on("click", function(e) {
      e.stopPropagation();
      window.open($(".project-header .actions #menuButton .more-options li:last-child a").attr("href"));
    });
  }
  if ($(".project-card").length > 0) {
    $(".project-card").each(function() {
      $("#menuButton button:not(\".btn-more-options\")", $(this)).html("");
      $("#menuButton button:not(\".btn-more-options\")", $(this)).html($("#menuButton .more-options li:last-child a").html());
      $("#menuButton button:not(\".btn-more-options\")", $(this)).on("click", function(e) {
        e.stopPropagation();
        window.open($(".more-options li:last-child a", $(this).parent()).attr("href"));
      });
    });
  }
  //let id = -1;
  //id = setInterval(function() {
  //  if ($("#menuButton button:not(\".btn-more-options\")").
  //}, 100);
});
