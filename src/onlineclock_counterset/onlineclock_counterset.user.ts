// ==UserScript==
// @name         Online Clock Counter Set
// @namespace    NekoBoiNick.Web.OnlineClock.Counter.SpecificSet
// @version      1.0.1
// @description  Adds a text box that allows you to set the Counter so you can count down.
// @author       Neko Boi Nick
// @match        https://counter.onlineclock.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlineclock.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/onlineclock_counterset/onlineclock_counterset.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, SetCounterCookie, formatCounterForTitle */
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  "use strict";
  function setCountNumber(number, form) {
    formatCounterForTitle(number);
    // eslint-disable-next-line new-cap
    SetCounterCookie("count", number);
    $(form).remove();
    $("#counter").text(number);
  }

  function createBox() {
    const number = $("#counter").text();
    $("#counter").text("");
    const form = document.createElement("form");
    $(form).attr("class", "setCountForm");
    const textbox = document.createElement("input");
    $(textbox).attr("class", "setCountNumber");
    $(textbox).attr("id", "SetCountNumberTextBox");
    $(textbox).attr("type", "number");
    $(textbox).attr("value", number);
    const submitbutton = document.createElement("input");
    $(submitbutton).attr("class", "setCountSubmit");
    $(submitbutton).attr("id", "SetCountSubmitBotton");
    $(submitbutton).attr("type", "submit");
    $(submitbutton).attr("value", ">");
    $(form).append(textbox);
    $(form).append(submitbutton);
    $(textbox).on("onkeypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        $(form).submit();
      }
    });
    $(form).submit(() => {
      setCountNumber($(textbox).val(), form);
    });
    $("#counter").append(form);
  }

  $("body").on("dblclick", "#counter", () => {
    createBox();
  });
  function loadCSS() {
    const appendedCSS = `
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
}`;
    const css = $(`<style id="nbnCSS">${appendedCSS}</style>`);
    css.append(appendedCSS);
    $("head").append(css);
  }

  loadCSS();
});
