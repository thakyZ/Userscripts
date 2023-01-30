// ==UserScript==
// @name         Reddit User Profile Links
// @namespace    NekoBoiNick.Web.Reddit.UserProfileLinks.
// @version      1.0.0
// @description  Adds links to Reddit User Profiles if provided.
// @author       thakyZ
// @match        https://www.reddit.com/user/*
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
    const userProfileLnk = $(`a[href="/user/${usrUrl}/"]`);
    let outElement;
    for (let i = 0, l = userProfileLnk.length; i < l; i++) {
      const element = userProfileLnk[i];
      const { innerText } = element;
      if (/^u\/[a-zA-Z0-9]{3,20}\s·\s[1-9]{1,4}[ymdwsinecrs]$/gi.test(innerText)) {
        outElement = element;
        break;
      }
    }

    if (typeof outElement !== "undefined") {
      const root = $(outElement).parent();
      const description = root.children[6];
      const inputText = description.innerText;

      // URLs starting with http://, https://, or ftp://
      const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
      let replacedText = inputText.replace(replacePattern1, "<a href=\"$1\" target=\"_blank\">$1</a>");

      // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      const replacePattern2 = /(^|[/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, "$1<a href=\"http://$2\" target=\"_blank\">$2</a>");

      // Change email addresses to mailto:: links.
      const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, "<a href=\"mailto:$1\">$1</a>");
      description.innerHTML = replacedText;
    }
  };

  window.onhashchange = function () {
    generateLinks();
  };

  /* SetInterval(() => {
    test();
  }, 500); */
  document.addEventListener("scroll", () => generateLinks());
})();
