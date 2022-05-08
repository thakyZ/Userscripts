// ==UserScript==
// @name         Online Clock Counter Set
// @namespace    NekoBoiNick.Web.OnlineClock.Counter.SpecificSet
// @version      1.0.0
// @description  Adds a text box that allows you to set the Counter so you can count down.
// @author       Neko Boi Nick
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://counter.onlineclock.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlineclock.net
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, SetCounterCookie, formatCounterForTitle */

(function() {
  'use strict';
  function SetCountNumber(number,form) {
    formatCounterForTitle(number);
    SetCounterCookie("count", number);
    $(form).remove();
    $("#counter").text(number);
  }
  function createBox() {
    var number = $("#counter").text();
    $("#counter").text("");
    var form = document.createElement("form");
    $(form).attr("class","setCountForm");
    var textbox = document.createElement("input");
    $(textbox).attr("class","setCountNumber");
    $(textbox).attr("id","SetCountNumberTextBox");
    $(textbox).attr("type","number");
    $(textbox).attr("value",number);
    var submitbutton = document.createElement("input");
    $(submitbutton).attr("class","setCountSubmit");
    $(submitbutton).attr("id","SetCountSubmitBotton");
    $(submitbutton).attr("type","submit");
    $(submitbutton).attr("value",">");
    $(form).append(textbox);
    $(form).append(submitbutton);
    $(textbox).on("onkeypress",function(e) {
      if (event.keyCode == 13 || event.which == 13) {
        $(form).submit();
      }
    });
    $(form).submit(function(e){
      SetCountNumber($(textbox).val(),form);
    });
    $("#counter").append(form);
  }
  $("body").on("dblclick","#counter",function(e) {
    createBox();
  });
  function loadCSS() {
    var css = document.createElement("style");
    var appendedCSS = `
.setCountForm {
  height: 275px;
  margin-bottom: unset;
  display: flex;
}
#SetCountSubmitBotton, #SetCountNumberTextBox {
  height: 275px;
  font-size: 239px;
  border: unset;
  background: rgba(0, 0, 0, 0);
  color: red;
  text-align: center;
  font-weight: 900;
  font-family: helvetica, arial;
}
#SetCountSubmitBotton {
  width: 170px;
  flex: none;
}
#SetCountNumberTextBox {
  max-width: calc(100% - 170px - 170px);
  margin-left: 170px;
  -moz-appearance: textfield;
  flex: none;
}
#SetCountSubmitBotton, #SetCountNumberTextBox {
  padding: 0px;
}
#SetCountNumberTextBox::-webkit-outer-spin-button, #SetCountNumberTextBox::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;

#SetCountSubmitBotton:hover {
  text-decoration: underline;
}
    `
    css.append(appendedCSS);
    $("head").append(css);
  }
  loadCSS();
})();
