// ==UserScript==
// @name         Glamour Dresser Copy Author Name
// @namespace    NekoBoiNick.Web.GlamourDresser.CopyAuthorName
// @version      1.1.2
// @description  Adds a copy author name button to Nexus Mods mod page.
// @author       Neko Boi Nick
// @match        https://www.glamourdresser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glamourdresser.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://raw.githubusercontent.com/SloaneFox/code/master/GM4_registerMenuCommand_Submenu_JS_Module.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     admin https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/dark_admin.min.css
// @resource     fix https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/dark_fix_style.min.css
// @resource     iframe https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/dark_iframe.min.css
// @resource     blankAvatar https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/blankAvatar.base64
// @resource     placeholderImage https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/placeholderImage.base64
// @resource     blankAvatarJPG https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/blankAvatar.jpg
// @resource     placeholderImagePNG https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/placeholderImage.png
// @resource     copyButtonTemplate https://raw.githubusercontent.com/thakyZ/Userscripts/master/glamourdresser_copyauthorname/copyButton.template.html
// ==/UserScript==
/* global $, jQuery, MonkeyConfig */
this.$ = this.jQuery = jQuery.noConflict(true);

$.fn.setData = function (name, data) {
  $(this).each((index, element) => {
    const prevData = $(element).data(name) === undefined ? {} : $(this).data(name);
    if (prevData === undefined) {
      $(element).data(name, {});
    }

    for (const [key, value] of Object.entries(data)) {
      if (Object.prototype.hasOwnProperty.call(data, key) || !Object.prototype.hasOwnProperty.call(data, key)) {
        prevData[key] = value;
      }
    }

    $(element).data(name, prevData);
  });
  return $(this);
};

$.fn.addData = function (name, data) {
  $(this).each((index, element) => {
    const prevData = $(element).data(name) === undefined ? {} : $(this).data(name);
    if (prevData === undefined) {
      $(element).data(name, {});
    }

    for (const [key, value] of Object.entries(data)) {
      if (!Object.prototype.hasOwnProperty.call(prevData, key)) {
        prevData[key] = value;
      }
    }

    $(element).data(name, prevData);
  });
  return $(this);
};

$.fn.removeData = function (name, keys) {
  $(this).each((index, element) => {
    const prevData = $(element).data(name) === undefined ? {} : $(element).data(name);

    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(prevData, key)) {
        prevData.delete(key);
      }
    }

    $(element).data(name, prevData);
  });
  return $(this);
};

$.fn.modifyStyle = function (name) {
  $(this).each((index, element) => {
    const data = $(element).data(name);
    let stringBuilder = "";
    for (const [key, value] of Object.entries(data)) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        stringBuilder += `--${key}: ${value}; `;
      }
    }

    $(element).text(`:root { ${stringBuilder}}`);
  });
  return $(this);
};

$(document).ready(() => {
  const config = new MonkeyConfig({
    title: "Configure",
    menuCommand: true,
    params: {
      darkDashboard: {
        type: "select",
        choices: ["Default", "Dark"],
        default: "Default"
      }
    },
    onSave: val => changeUI(val)
  });

  const createElements = (resource, replaceObj = {}) => {
    const templateHtml = GM_getResourceText(resource);
    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "")
      .replaceAll(/\r?\n<\/template>$/gi, "");
    const template = $(templateTruncated);
    for (const [key, value] of Object.entries(replaceObj)) {
      $(template).html($(template).html().replaceAll(key, value));
    }

    return template;
  };

  const mdiContentCopy = "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z";

  const changeUI = val => {
    if (!/https:\/\/(www\.)?glamourdresser\.com\/wp-admin/gi.test(window.location.href)) {
      return false;
    }

    if (val.darkDashboard === "Default") {
      if ($("body").attr("class").includes("nbn_dark")) {
        $("body").removeClass("nbn_dark");
      }
    } else if (!$("body").attr("class").includes("nbn_dark")) {
      $("body").addClass("nbn_dark");
    }
  };

  changeUI(config.get("darkDashboard"));

  const creatorInfo = () => {
    if (window.location.href.includes("mods") || window.location.href.includes("poses") || window.location.href.includes("presets") || window.location.href.includes("resources")) {
      return $("div.elementor-author-box__text");
    }

    if (window.location.href.includes("author")) {
      return $("div.elementor-author-box__text div:first-child h4");
    }
  };

  const defaultDarkBG = "#242525";

  const variableTextLength = () => {
    if ($(".elementor-author-box__name a h4").text().toString().length > "a quick brown fox".length) {
      return "calc((100% + 58px) * -1)";
    }

    return "-58px;";
  };

  const calcVariableCSS = () => {
    if ($(".elementor-author-box__name a h4").text().toString().length <= "a quick brown fox".length) {
      return {
        calcVariableCssWidth: "calc(100% - (58px * 2))",
        calcVariableCssMaxWidth: "calc(100% - (58px * 2))",
        calcVariableCssMarginLeft: "58px"
      };
    }

    return {};
  };

  const createObjects = () => {
    /* Old code
    const AuthorBoxHeight = () => {
      return (-1 * (33 + (($(creatorInfo()).outerHeight() - 33) / 2)));
    };
    const AuthorBoxWidth = () => {
      return (-1 * ((174.11 / 2) + ($(creatorInfo()).outerWidth() / 2)));
    };
    */
    const tempButton = $(createElements("copyButtonTemplate", { mdiContentCopy }));
    $(creatorInfo()).after($(tempButton));
    $(".action-copy-author").on("click", () => {
      GM_setClipboard($(".elementor-author-box__name").text().replace(/\s+$/g, "").replace(/^\s+/g, "").replace(" ", "_"));
    });
  };

  const encodeRawImageError = "Failed to encode raw image data. Falling back...";

  const getBlankAvatar = () => {
    try {
      const image = GM_getResourceText("blankAvatarJPG");
      const base64d = btoa(image);
      const dataUri = `data:image/jpeg;base64,${base64d}`;
      return dataUri;
    } catch (error) {
      console.group(encodeRawImageError);
      console.error(error);
      console.groupEnd(encodeRawImageError);
      return GM_getResourceText("blankAvatar");
    }
  };

  const blankAvatar = getBlankAvatar();

  const getPlaceholderImage = () => {
    try {
      const image = GM_getResourceText("placeholderImagePNG");
      const base64d = btoa(image);
      const dataUri = `data:image/png;base64,${base64d}`;
      return dataUri;
    } catch (error) {
      console.group(encodeRawImageError);
      console.error(error);
      console.groupEnd(encodeRawImageError);
      return GM_getResourceText("placeholderImage");
    }
  };

  const placeholderImage = getPlaceholderImage();

  const getPlaceholderThumb = () => {
    try {
      const image = GM_getResourceText("placeholderThumbPNG");
      const base64d = btoa(image);
      const dataUri = `data:image/png;base64,${base64d}`;
      return dataUri;
    } catch (error) {
      console.group(encodeRawImageError);
      console.error(error);
      console.groupEnd(encodeRawImageError);
      return GM_getResourceText("placeholderThumb");
    }
  };

  const placeholderThumb = getPlaceholderThumb();

  window.prototype += { nbnData: { blankAvatar, placeholderImage, placeholderThumb } };

  const createPlaceholderImage = () => {
    $(".elementor-post.mods").children(".elementor-post__text").each(function () {
      if ($(this).prev().length === 0) {
        const link = $(this).find(".elementor-post__read-more").attr("href");
        const banner = $(`<a class="elementor-post__thumbnail__link" href="${link}"><div class="elementor-post__thumbnail"><img width="1608" height="881" src="${placeholderImage}" class="attachment-grid size-grid" alt="" loading="lazy"></div></a>`);
        $(banner).insertBefore($(this));
      }
    });
  };

  createPlaceholderImage();

  createObjects();

  const addTempModPageImage = () => {
    if (/https:\/\/www\.glamourdresser\.com\/mods\/.+/gi.test(window.location.href)) {
      const mainCarousel = $(".elementor-swiper .elementor-main-swiper .elementor-carousel-image");
      if ($(mainCarousel).length > 0 && $(mainCarousel).first().css("background-image") === `url("${window.location.href}")`) {
        $(mainCarousel).first().css({ "background-image": `url("${placeholderImage}")` });
      }

      const thumbCarousel = $(".elementor-swiper .elementor-main-swiper .elementor-thumbnails-swiper");
      if ($(thumbCarousel).length > 0 && $(thumbCarousel).first().css("background-image") === `url("${window.location.href}")`) {
        $(thumbCarousel).first().css({ "background-image": `url("${placeholderThumb}")` });
      }
    }
  };

  addTempModPageImage();

  const iframeCSS = btoa(GM_getResourceText("iframe"));

  const setupCSS = () => {
    GM_addStyle(GM_getResourceText("admin"));
    GM_addStyle(GM_getResourceText("fix"));
    $("head").append("<style id=\"nbnDarkFixStyle\"></style>");
    $("#nbnDarkFixStyle").setData("css", calcVariableCSS()).addData("css", { defaultDarkBG, variableTextLength: variableTextLength() }).modifyStyle("css");
  };

  setupCSS();

  const handleIframes = () => {
    if (/https:\/\/(www\.)?glamourdresser\.com\/wp-admin\/post(-new)?\.php/gi.test(window.location.href)) {
      const iframes = $("iframe");
      for (const frame in iframes) {
        if (Object.prototype.hasOwnProperty.call(iframes, frame) && !isNaN(parseInt(frame, 10))) {
          $(iframes[frame]).ready(() => {
            if (iframes[frame].contentDocument !== undefined || iframes[frame].contentDocument !== null) {
              const iframe = iframes[frame].contentDocument;
              $(iframe).find("head").append(`<link rel="stylesheet" href="data:text/css;base64,${iframeCSS}"></link>`);
            } else {
              const iframe = iframes[frame].contentWindow[0].document;
              $(iframe).find("head").append(`<link rel="stylesheet" href="data:text/css;base64,${iframeCSS}"></link>`);
            }
          });
        }
      }
    }
  };

  handleIframes();
});
