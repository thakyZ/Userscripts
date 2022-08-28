// ==UserScript==
// @name         XIV Mod Archive Additions
// @namespace    NekoBoiNick.Web.XIVModArchive.Additions
// @version      1.0.3
// @description  Adds custom things to XIV Mod Archive
// @author       Neko Boi Nick
// @match        https://xivmodarchive.com/*
// @match        https://www.xivmodarchive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xivmodarchive.com
// @grant        GM_setClipboard
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/xivmodarchive_additions/xivmodarchive_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $, pako, unicode */

$(document).ready(function() {
  'use strict';
  const CreateFirstLastNavElements = function(num, domin, domax) {
    let endElements = [];

    $(".pagination").each(function(e) {
      const firstElement = $(`<li class="page-item page-number"><a class="bg-dark text-light page-link activated" style="border-color:#333;" href="javascript: goToPage(1)">1</a></li>`);
      // <a class="bg-dark text-light page-link activated" style="border-color: #333333;" href="javascript: goToPage(81)">81</a>
      const lastElement = $(`<li class="page-item page-number"><a class="bg-dark text-light page-link activated" style="border-color:#333;" href="javascript: goToPage(${num})">${num}</a></li>`);
      if (domin) {
        $(firstElement).insertAfter($("li", $(this))[0]);
      } if (domax) {
        $(lastElement).insertBefore($("li", $(this))[$("li", $(this)).length-1]);
      }
    });
  }
  const getDoMin = function() {
    const paginationChildren = $("li", $($(".pagination")[0]));
    if ($($(paginationChildren)[0]).text() !== "1") {
      if ($($(paginationChildren)[1]).text() === "1" && $($(paginationChildren)[0]).text() === "Previous") {
        return false;
      }
      return true;
    }
    return false;
  }
  const getDoMax = function(num) {
    const paginationChildren = $("li", $($(".pagination")[0]));
    const paginationChildLength = $(paginationChildren).length;
    if ($($(paginationChildren)[paginationChildLength-1]).text() === "Next") {
      if ($($(paginationChildren)[paginationChildLength-1]).text() === "Next" && $($(paginationChildren)[paginationChildLength-2]).text() === `${num}`) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  const getNumberOfPages = function() {
    let pages = 0;
    let data = undefined;
    if (location.href.match(/https?:\/\/www\.xivmodarchive\.com\/user\/[/d]+/i)) {
      data = $("body div.container.my-3 div.mod-meta-block").next().find("pre").text();
      data = data.split("\n");
      data = data[0].split(":");
      data = data[1].replace(/\s/i, "");
      pages = parseInt(data)/9;
      if (pages < 1) {
        pages = 0;
      } else {
        pages = Math.ceil(pages);
      }
    } else {
      data = $($("div", $("#search-form"))[$("div", $("#search-form")).length-1]).find("code").text();
      data = data.split(" ");
      data = data[data.length-1].split("\n");
      pages = parseInt(data[0]);
      if (pages <= 1) {
        pages = 0;
      } else {
        pages = pages;
      }
    }
    CreateFirstLastNavElements(pages, getDoMin(), getDoMax(pages));
  }
  getNumberOfPages();
  const CreateCustomStyles = function() {
    const styleElement = $(`<style>.page-number{width: auto !important;min-width: 2.5rem;}.col-7.col-7-extra{flex:0 0 60% !important;max-width:60% !important;-ms-flex:0 0 60%;}.col-2.col-2-less{-ms-flex:0 0 13%;flex:0 0 13%;max-width:13%;}</style>`);
    $("head").append(styleElement);
  }
  CreateCustomStyles();

  const CreateCopyName = function() {
    const authorColumn = $(".container.my-3.mod-page .jumbotron.py-3.px-3.my-0 .row.no-gutters.border.rounded");
    const authorName = $("div.col-8", $(authorColumn));
    $(authorName).attr("class", "col-7");
    $(authorName).addClass("col-7-extra");
    $(`<div class="col-2 col-2-less"><button id="copyNameButton" class="btn btn-primary" type="button"><i class="fa fa-clipboard"></i></button></div>`).insertAfter(authorName);
    $("#copyNameButton").on("click", (e) => {
      GM_setClipboard($($(".user-card-link")[1]).text().toString().normalize());
    });
  }
  CreateCopyName();
  $(window).on("load", () => {
    const image = $("img[alt=\"User Avatar\"]");
    if (!$(image).prop("complete") || $(image).prop("naturalHeight") === 0) {
      $(image).attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAhFBMVEV1fop9hpGgpq+ytr2prraXnqfT19vu7/H////29/iGjpju7/DCxszc3+K6vsS6v8WOlqD39/fLztPLz9OPlqDl5+nDx8ygpq6xtr6xtr3m5+iOlp/Dxsvc3+Hd3+GorraGjpnT19rT1tv29/eOlqHU19p+hpGprrWxt72or7bLz9Kfpq+ibmTzAAAEY0lEQVR4AezBAQEAAAQAIPB/swkMqAIAAAAAAAAAAAAAAAAAAAAAgBNZPfFWy86dLimOw3AAV5qYEXFicMKxHIFs03e///PtvaouagjRGMKfNr/vmhorsiMbpwcm+UZjN4PhD2YedR5TZpnZDgfmOww+L/h/jjoaS0iRG7pdk0HBQlECmeevisGEbpDJf7DQlUDJh2xlbm30noWmBGQFuOUcTMeej3CqFeCQzTOCl8i8bymBbPKQDlxeCecGqTH/Dc/ycUVK0LKx51ZVXs08H+WLoSu5la0yQmUK7sXQEKQ592ZOgFLukSE4meUe2YTQlCyinARTFnFOAss9swRlzL1zBCTj/o2ySFdAURCMBV+FiXQFFLP4esADvxGExPKVjJJIX4HCxbcJACyBkq/IxdkDQZVAyVfl4i4AgBIo+cpcvK8AiBJYMsddApY56hJIGcCSrmfFAAq6GsMQTKTvQDEEaILiXAZTBuEAlsAYl8E1wzCRLoEij7QLFKNYmwBhIp0BIo9tBgDMAcMc9xzYMJQcugvytl55VtCHWNx9wHaZ0d+mO6sP6Z7mBnQfYA2R2Fl1yMKCHov8zp3kycHKoQ9x3Mkj9Wv/i9s0FxCC9CJca8cv3JlDxBPecfgz/cwzt9j+etO5hFsCbEM/89I2e/QhoqI+2YBzGnfWEGHRuoBRQ6R9nu0hQJ3AIqgkNwEhLR6oPy7o/2MCQwC2AwWfltAxL/oifgFrhfZhtxitvpexAKug7nnU+gKqw2sO6DDk8bwJKKF6wZRPq8IToO28XqkvDnMK5FiNMB1n9SErqGZ4xeGvQV0IYV2f34ed05qgEIAjgZfAc9oyIATiPbgOvLZgA0IgtkMm7NpCGhCC8evIgkNKILHqEJIQjEZgGfR971wfMmasBLiQj5regkLaObifBd/p0Ls+xHBXOd7NgLH+YepDRIWXAK4yIpE9B4QAJaBgjcq0/3Wl8BDxiJUA4Yuqqob+YiGi7i0BiO4JuCfgnoB7Au4J6ME9AfcE3BNQMqjqnoAYrgkDnAc4BuWoH0sGtUS6J7xdWj4bu5wBHIqqL+yYZz6Lrek47wzOL0M7+kfjLAfyLpGJB3NDYrfnE2wq5VLagNF/GJl3nk/wS+pNM+PuKZAc6EefKP5m87ahPjnWpICMq1lllRsSpmCYxy8aq0sBJcbVnjvw23yR0OHwcR6/cPsuKcjoq+kir1d8lH3O0yl9lYw9oz1+0ZSqQ34SU5O6/KOuV/Zfdf3x4dJFltAB8+wZ9PErvoKqL7vxtp90TY5Pmlyy5ZI2QcDNg+qSZy9VQ9fX1Je7uDM91SNjMPZie/QN9vDFrtZ8OaXwsgcfvjB1y64owBJp+PrlsLrIGfSzIUzN4a7HNxSs2cO8+PSLwfLsJ3Dbh4QEfBlsz/xDjHcTQicHAPIGONck8LJBvpkc7OhMduxzk9CtmUL+U3+2BwcyAAAAAIP8re/xVQAAAAAAAAAAAAAAAAAAAAAAKwFiKavpSRGzHgAAAABJRU5ErkJggg==");
    }
  });
  const changeIconDesigns = function() {
    const container = $(".container.my-3.mod-page .col-4 .jumbotron.py-3.my-2 .emoji-set")
    const views = container.children(".emoji-block.views").children("div.inner");
    const downloads = container.children(".emoji-block.downloads").children("div.inner");
    const following = container.children(".emoji-block.following").children("div.inner");
    views.children("img").remove();
    downloads.children("img").remove();
    following.children("img").remove();
    views.prepend(`<i class="fa fa-eye"></i>`);
    downloads.prepend(`<i class="fa fa-save"></i>`);
    following.prepend(`<i class="fa fa-thumbtack"></i>`);
    $("head").append(`<style>.emoji-block i.fa{position:absolute;display:block;height:1.8rem;width:1.8rem;left:0.45rem;top:0.45rem;}</style>`);
  };
  changeIconDesigns();
});
