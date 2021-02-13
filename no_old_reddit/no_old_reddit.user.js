// ==UserScript==
// @name         No Old Reddit
// @namespace    NekoBoiNick.Reddit.NoOld
// @version      0.1
// @description  Changes links that redirect to old reddit so that they use the new design
// @author       Neko Boi Nick
// @match        *://*.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/no_old_reddit/no_old_reddit.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementsByTagName("a");
    var regex = new RegExp("^https?:\\/\\/(np|old)\.reddit\.com","g")
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].href = x[i].href.replace(regex,"https://reddit.com");
    }
})();
