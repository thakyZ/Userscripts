// ==UserScript==
// @name         Steam Workshop Delete Facebook
// @namespace    NekoBoiNick.Steam.Community.Workshop.Facebook
// @version      0.1
// @description  Deletes Facebook tags in SteamWorkshop Item Pages.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_deletefacebook/steamworkshop_deletefacebook.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/steamworkshop_deletefacebook/steamworkshop_deletefacebook.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, jQuery */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";

  const otherSearchClass = ".fbc-badge";
  let checkedForFbs = false;
  let fbsHidden = 0;
  const debug = false;

  const getFBs = () => $(otherSearchClass);

  const removeFacebook = (_, fb) => {
    fbsHidden += 1;
    $(fb).remove();
    if (debug) {
      console.log(`FBs hidden: ${fbsHidden}`);
    }
  };

  setInterval(() => {
    if (checkedForFbs) {
      return;
    }

    const fbs = getFBs();

    if (fbs.length) {
      Array.from(fbs).forEach(removeFacebook);
      checkedForFbs = true;
    }
  }, 500);

  $(window).on("hashchange", () => {
    $(otherSearchClass).each(() => {
      if (checkedForFbs) {
        return;
      }

      const fbs = getFBs();

      if ($(fbs).length > 0) {
        $(fbs).each(removeFacebook);
        checkedForFbs = true;
      }
    });
  });

  $(document).on("scroll", () => {
    $(getFBs()).each(removeFacebook);
  });
});
