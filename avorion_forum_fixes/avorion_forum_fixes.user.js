// ==UserScript==
// @name         Avorion Forum Fixes
// @namespace    NekoBoiNick.Avorion.ForumFixes
// @version      0.1
// @description  Changes some issues with the __old__ Avorion forums.
// @author       Neko Boi Nick
// @match        https://www.avorion.net/*
// @license      MIT
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/avorion_forum_fixes/avorion_forum_fixes.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==

(function() {
  'use strict';

  var newSpoilerTag = document.createElement("div");
  var oldSpoilerTag = document.getElementById("BBCBox_message_button_1_21");
  for (var i = 0; i < oldSpoilerTag.attributes.length; i++) {
    var attr = oldSpoilerTag.attributes.item(i);
    newSpoilerTag.setAttribute(attr.nodeName, attr.nodeValue);
  }
  newSpoilerTag.innerText = "Spoiler";
  newSpoilerTag.style.setProperty("background-size","cover");
  newSpoilerTag.style.setProperty("background-color","#E4E4E4","important");
  newSpoilerTag.style.setProperty("color","#000","important");
  newSpoilerTag.style.setProperty("padding","1px","important");
  newSpoilerTag.style.setProperty("padding-left","2px","important");
  newSpoilerTag.style.setProperty("padding-right","2px","important");
  newSpoilerTag.style.setProperty("font-size","12px","important");
  newSpoilerTag.style.setProperty("border","1px #BBB solid","important");
  newSpoilerTag.style.setProperty("margin-top","0px","important");
  newSpoilerTag.style.setProperty("min-height","22px","important");
  newSpoilerTag.style.setProperty("display","inline-block","important");
  newSpoilerTag.addEventListener("mouseover", function(event) {
    event.target.style.removeProperty("background-image");
    event.target.style.setProperty("background-color","#58BE5E","important");
    this.instanceRef.handleButtonMouseOver(this);
  });
  newSpoilerTag.addEventListener("mouseout", function(event) {
    event.target.style.removeProperty("background-image");
    event.target.style.setProperty("background-color","#E4E4E4","important");
    this.instanceRef.handleButtonMouseOut(this);
  });

  oldSpoilerTag.parentNode.replaceChild(newSpoilerTag, oldSpoilerTag);
})();
