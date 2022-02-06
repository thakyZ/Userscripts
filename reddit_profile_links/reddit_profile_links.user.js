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
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/reddit_profile_links/reddit_profile_links.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';
  function GenerateLinks () {
    var pageUrl = window.location.href;
    var usrUrl = pageUrl.replace(/^https?:\/\/(www.)?reddit.com\/(user|u)\//, "");
    var userProfileLnk = document.querySelectorAll('a[href="/user/'+usrUrl+'/"]');
    var element;
    for (var i = 0, l = userProfileLnk.length; i < l; i++) {
      var el = userProfileLnk[i];
      var innerText = el.innerText;
      if (new RegExp("^u\/[a-zA-Z0-9]{3,20}\s·\s[1-9]{1,4}[ymdwsinecrs]$").test(innerText))
      {
        element = el;
        break;
      }
    }
    if (typeof el !== 'undefined') {
      var root = el.parentElement;
      var description = root.children[6];
      var inputText = description.innerText;
      var replacedText, replacePattern1, replacePattern2, replacePattern3;

      //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
      description.innerHTML = replacedText;
    }
  }

  window.onhashchange = function() {
    GenerateLinks();
  }
  /*setInterval(() => {
    test();
  }, 500);*/
  document.addEventListener('scroll', () => GenerateLinks());
})();
