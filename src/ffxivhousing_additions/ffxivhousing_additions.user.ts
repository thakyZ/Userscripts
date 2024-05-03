// ==UserScript==
// @name         FFXIV Housing Preview Images
// @namespace    NekoBoiNick.Web.FFXIVHousing.Additions
// @version      1.0.2
// @description  Add Preview Popups to FFXIV Housing's Website
// @author       Neko Boi Nick
// @match        https://en.ff14housing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ff14housing.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivhousing_additions/ffxivhousing_additions.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/ffxivhousing_additions/ffxivhousing_additions.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */
// this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(() => {
  const crafterDictionary = {
    CRP: "carpenter",
    BSM: "blacksmith",
    ARM: "armorer",
    GSM: "goldsmith",
    LTW: "leatherworker",
    WVR: "weaver",
    ALC: "alchemist",
    CUL: "culinarian",
  };

  const crafterToLong = crafter => crafterDictionary[crafter];

  const genStars = stars => {
    let outString = "";
    for (let i = 0; i < stars; i++) {
      outString += "<i class=\"fa fa-star\"></i>";
    }

    return outString;
  };

  const crafterLabel = (crafter, level, stars) =>
    `<small class="label label-success"> <img src="./images/img/${crafterToLong(crafter)}.gif" alt="${crafter}"> ${crafter}：Lv.${level}${genStars(
      stars
    )}</small>`;

  const colorLabel = () => "<small class=\"label label-danger\">Color <i class=\"fa fa-circle-o\"></i></small>";

  const saleLabel = () => "<small class=\"label label-success\"><i class=\"fa fa-cog\"></i> Sale</small>";

  const processFooters = objectData => {
    let outString = "";

    if (objectData.crafter !== null) {
      outString += crafterLabel(objectData.crafter.class, objectData.crafter.level, objectData.crafter.stars);
    }

    if (objectData.color) {
      outString += colorLabel();
    }

    if (objectData.sale) {
      outString += saleLabel();
    }

    return outString;
  };

  /* Archived Modal Code:
   * <div id="nbnPreviewModal" class="modal fade" tabindex="-1" role="dialog">
   *   <div class="modal-dialog" role="document">
   *     <div class="modal-content">
   *       <div class="modal-header">
   *         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
   *         <h4 class="modal-title">${itemName}</h4>
   *       </div>
   *       <div class="modal-body">
   *         <div class="panel">
   *           <div class="panel-body">
   *             <div id="carousel-example-generic" class="carousel slide" data-interval="false" style="max-width:600px;margin: 0 auto;">
   *               <ol class="carousel-indicators">
   *                 <li data-target="#carousel-example-generic" data-slide-to="0" class=""></li>
   *                 <li data-target="#carousel-example-generic" data-slide-to="1" class="active"></li>
   *               </ol>
   *               <div class="carousel-inner">
   *                 <div class="item active">
   *                   <div><img src="./images/pic/${itemId}_img1.jpg" alt="${itemName}"></div>
   *                 </div>
   *                 <div class="item active">
   *                   <div><img src="./images/pic/${itemId}_img2.jpg" alt="${itemName}"></div>
   *                 </div>
   *               </div>
   *               <a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">
   *                 <span class="glyphicon glyphicon-chevron-left text-white"></span>
   *               </a>
   *               <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">
   *                 <span class="glyphicon glyphicon-chevron-right text-white"></span>
   *               </a>
   *             </div>
   *           </div>
   *         </div>
   *       </div>
   *       <div class="modal-footer">
   *         ${ProcessFooters(objectData)}
   *       </div>
   *     </div>
   *   </div>
   * </div>
   */

  const prepareModal = (itemId, itemName, objectData) =>
    $(
      `<div id="nbnPreviewModal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">${itemName}</h4></div><div class="modal-body"><div class="panel"><div class="panel-body"><div id="carousel-example-generic" class="carousel slide" data-interval="false" style="max-width:600px;margin: 0 auto;"><ol class="carousel-indicators"><li data-target="#carousel-example-generic" data-slide-to="0" class=""></li><li data-target="#carousel-example-generic" data-slide-to="1" class="active"></li></ol><div class="carousel-inner"><div class="item active"><div><img src="./images/pic/${itemId}_img1.jpg" alt="${itemName}"></div></div><div class="item"><div><img src="./images/pic/${itemId}_img2.jpg" alt="${itemName}"></div></div></div><a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"><span class="glyphicon glyphicon-chevron-left text-white"></span></a><a class="right carousel-control" href="#carousel-example-generic" data-slide="next"><span class="glyphicon glyphicon-chevron-right text-white"></span></a></div></div></div></div><div class="modal-footer">${processFooters(
        objectData
      )}</div></div></div></div>`
    );

  const handlePopUp = element => {
    const link = $(element).find("a").attr("href");
    $(element).find("a").removeAttr("href");
    $(element).find("a").prop("tagName", "div");
    $(element)
      .find("span.small-box-footer")
      .on("click", () => goToPage(link));
    const itemId = $(element)
      .find("img:first-child")
      .attr("src")
      .toString()
      .replaceAll(/\.\/images\/pic\/([0-9a-f]{8,12})_img1_150\.jpg/gi, "$1");
    const itemName = $(element)
      .find("span.small-box-footer")
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .toString()
      .replaceAll(/(^\s+|\s+$)/gim, "");
    const objectData = getObjectData(element);
    const modal = prepareModal(itemId, itemName, objectData);
    $("#nbnModalContainer").append(modal);
    $("#nbnPreviewModal").modal("show");
    $("#nbnPreviewModal").on("shown.bs.modal", () => {
      $("#nbnPreviewModal").focus();
      $("#nbnPreviewModal")
        .find(".carousel-inner > .item > div")
        .on("click", () => goToPage(link));
    });
    $("#nbnPreviewModal").on("hidden.bs.modal", () => {
      $("#nbnModalContainer").children("#nbnPreviewModal").remove();
    });
  };

  const goToPage = href => {
    window.location.href = `https://en.ff14housing.com/${href}`;
  };

  const getObjectData = element => {
    const labels = $(element).find(".small-box-icon > small.label");
    const objectData = { crafter: null, color: false, sale: false };
    for (const [, label] of Object.entries(labels)) {
      const test1 = $(label).text().replaceAll(/(^\s+|\s+$)/gim, "").split(/[\s：.]/);
      if (/^[A-Z]{3}$/g.test(test1[0])) {
        const testStars = $(label).html().toString().match(/fa-star/gi) === null ? 0 : $(label).html().toString().match(/fa-star/gi).length;
        objectData.crafter = { class: test1[0], level: test1[2], stars: testStars };
      } else if (test1[0] === "Color") {
        objectData.color = true;
      } else if (test1[0] === "Sale") {
        objectData.sale = true;
      }
    }

    return objectData;
  };

  const handleButton = element => {
    if (!/\.\/images\/ic\/[a-z0-9]{4,12}_ic\.png/gi.test($(element).find("img:first-child").attr("src"))) {
      $(element)
        .find("img:first-child")
        .on("click", () => handlePopUp(element));
    }
  };

  const addModalContainer = () => {
    $("<div id=\"nbnModalContainer\"></div>").insertAfter($("body > *:last-child"));
  };

  const addButtonHooks = () => {
    addModalContainer();

    let id = -1;
    id = setInterval(() => {
      const listItems = $("body #main-container > div.padding-md > div.row > div > div#container > div.row > div");
      if (listItems.length > 0) {
        for (const [, item] of Object.entries(listItems)) {
          const thumb = $(item);
          if (thumb) {
            handleButton($(thumb));
          }
        }

        clearInterval(id);
      }
    }, 100);
  };

  addButtonHooks();
});
