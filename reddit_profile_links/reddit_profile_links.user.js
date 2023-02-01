// ==UserScript==
// @name         Reddit User Profile Links
// @namespace    NekoBoiNick.Web.Reddit.UserProfileLinks.
// @version      1.0.1
// @description  Adds links to Reddit User Profiles if provided.
// @author       thakyZ
// @match        https://www.reddit.com/user/*
// @match        https://www.reddit.com/u/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const generateLinks = () => {
    const pageUrl = window.location.href;
    const usrUrl = pageUrl.replace(/^https?:\/\/(www.)?reddit.com\/(user|u)\//, "");
    const userProfileLnk = $(`.ListingLayout-outerContainer > div:last-child > div:last-child > div:last-child > div > div:first-child > div > a[href="/user/${usrUrl}/"] + button + div`);
    /* Old code
     * let outElement;
     * for (let i = 0, l = userProfileLnk.length; i < l; i++) {
     *   const element = userProfileLnk[i];
     *   if (/^u\/[a-zA-Z0-9]{3,20}\s·\s[1-9]{1,4}[ymdwsinecrs]$/gi.test(element.innerText)) {
     *     outElement = element;
     *     break;
     *   }
     * }
     */

    if (typeof userProfileLnk !== "undefined") {
      const root = $(userProfileLnk);
      const inputText = $(root).text();

      // URLs starting with http://, https://, or ftp://
      const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
      let replacedText = inputText.replaceAll(replacePattern1, "<a href=\"$1\" target=\"_blank\">$1</a>");

      // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      const replacePattern2 = /(^|[/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replaceAll(replacePattern2, "$1<a href=\"http://$2\" target=\"_blank\">$2</a>");

      // Change email addresses to mailto:: links.
      const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replaceAll(replacePattern3, "<a href=\"mailto:$1\">$1</a>");
      $(root).html(replacedText);
    }
  };

  window.onhashchange = function () {
    generateLinks();
  };

  /* Old Code
   * SetInterval(() => {
   *   test();
   * }, 500);
   */
  document.addEventListener("scroll", () => generateLinks());
})();
