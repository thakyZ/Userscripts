// ==UserScript==
// @name         Glamour Dresser Copy Author Name
// @namespace    NekoBoiNick.Web.GlamourDresser.CopyAuthorName
// @version      1.2.0
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
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// @resource     fix https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/dark_fix_style.min.css
// @resource     iframe https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/dark_iframe.min.css
// @resource     blankAvatar https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/blankAvatar.base64
// @resource     placeholderImage https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/placeholderImage.base64
// @resource     blankAvatarJPG https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/blankAvatar.jpg
// @resource     placeholderImagePNG https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/placeholderImage.png
// @resource     copyButtonTemplate https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/copyButton.template.html
// @resource     GMConfigCSS https://cdn.jsdelivr.net/gh/thakyz/Userscripts/glamourdresser_copyauthorname/GM_config-style.min.css
// ==/UserScript==
/* global jQuery, GM_config */
this.jQuery = jQuery.noConflict(true);

this.jQuery(($) => {
  $.fn.setData = function (name, data) {
    $(this).each((_, element) => {
      const prevData = $(element).data(name) === undefined ? {} : $(this).data(name);
      if (prevData === undefined) {
        $(element).data(name, {});
      }

      for (const [key, value] of Object.entries(data)) {
        if (Object.hasOwn(data, key) || !Object.hasOwn(data, key)) {
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
        if (!Object.hasOwn(prevData, key)) {
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
        if (Object.hasOwn(prevData, key)) {
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
        if (Object.hasOwn(data, key)) {
          stringBuilder += `--${key}: ${value}; `;
        }
      }

      $(element).text(`:root { ${stringBuilder}}`);
    });
    return $(this);
  };

  const setupGMConfigFrame = () => {
    const configWrapper = $("<div class=\"config-wrapper\"></div>");
    const element = $("<div id=\"GlamourDresser_Additions_Config\"></div>");
    $(configWrapper).append($(element));
    $("body").append($(configWrapper));
    return element[0];
  };

  const gmConfigFrame = setupGMConfigFrame();

  function convertFromMonkeyToGMConfig() {
    const old = GM_getValue("_MonkeyConfig_Configure_cfg");
    if (typeof old !== "undefined") {
      const rawJSON = old.replaceAll("\\", "");
      const json = JSON.parse(rawJSON);
      GM_config.set("darkDashboard", json.darkDashboard);
      GM_deleteValue("_MonkeyConfig_Configure_cfg");
    }
  }

  function createElements(resource, replaceObj = {}) {
    const templateHtml = GM_getResourceText(resource);
    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "")
      .replaceAll(/\r?\n<\/template>$/gi, "");
    const template = $(templateTruncated);
    for (const [key, value] of Object.entries(replaceObj)) {
      $(template).html($(template).html().replaceAll(key, value));
    }

    return template;
  }

  function changeUI() {
    if (!/https:\/\/(www\.)?glamourdresser\.com\/wp-admin/gi.test(window.location.href)) {
      return false;
    }

    const val = GM_config.get("darkDashboard");

    if (val === "Default") {
      if ($("body").attr("class").includes("nbn_dark")) {
        $("body").removeClass("nbn_dark");
      }
    } else if (!$("body").attr("class").includes("nbn_dark")) {
      $("body").addClass("nbn_dark");
    }
  }

  function creatorInfo() {
    if (window.location.href.includes("mods") || window.location.href.includes("poses") || window.location.href.includes("presets") || window.location.href.includes("resources")) {
      return { type: "item", elements: [$("li[itemprop=\"author\"] a"), $("li[itemprop=\"author\"]")] };
    }

    if (window.location.href.includes("author")) {
      return { type: "author", elements: [$("div.elementor-author-box__text a:first-child"), $("div.elementor-author-box__text")] };
    }
  }

  /* Old Code
   * const defaultDarkBG = "#242525";
   *
   * function variableTextLength() {
   *   if ($(".elementor-author-box__name a h4").text().toString().length > "a quick brown fox".length) {
   *     return "calc((100% + 58px) * -1)";
   *   }
   *
   *   return "-58px;";
   * }
   *
   * function calcVariableCSS() {
   *   if ($(".elementor-author-box__name a h4").text().toString().length <= "a quick brown fox".length) {
   *     return {
   *       calcVariableCssWidth: "calc(100% - (58px * 2))",
   *       calcVariableCssMaxWidth: "calc(100% - (58px * 2))",
   *       calcVariableCssMarginLeft: "58px"
   *     };
   *   }
   *
   *   return {};
   * }
   */

  const translateNames = {
    "♰ 𝕹𝖎𝖌𝖍𝖙𝖎𝖓𝖌𝖆𝖑𝖊 𝕮𝖚𝖑𝖙 ♰": "Nightingale Cult",
    nevereatdirt: "Jax",
    Shylenced: "Shy",
    超级樱花: "Megasakura"
  };

  function processName(name) {
    let pre = name.replace(/\s+$/g, "").replace(/^\s+/g, "");
    for (const [key, value] of Object.entries(translateNames)) {
      if (pre === key) {
        pre = value;
      }
    }

    return pre.replace(" ", "_");
  }

  function createObjects() {
    /* Old code
    const AuthorBoxHeight = () => {
      return (-1 * (33 + (($(creatorInfo()).outerHeight() - 33) / 2)));
    };
    const AuthorBoxWidth = () => {
      return (-1 * ((174.11 / 2) + ($(creatorInfo()).outerWidth() / 2)));
    };
    */
    const creatorInfoData = creatorInfo();
    if (!creatorInfoData) {
      return;
    }

    const tempButton = $(createElements("copyButtonTemplate"));
    $(creatorInfoData.elements[0]).after($(tempButton));

    if (creatorInfoData.type === "item" && !creatorInfoData.elements[1].hasClass("elementor-kit-5")) {
      creatorInfoData.elements[1].addClass("elementor-kit-5");
    } else if (creatorInfoData.type === "author" && true) {
      // Blank for now.
    }

    $(".action-copy-author").on("click", () => {
      const test = $(creatorInfoData.elements[1]).clone();
      $($(test).find("span")[1]).remove();
      const authorName = $(test).text();
      $(test).remove();
      const processed = processName(authorName);
      GM_setClipboard(processed);
    });
  }

  const encodeRawImageError = "Failed to encode raw image data. Falling back...";

  function getBlankAvatar() {
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
  }

  const blankAvatar = getBlankAvatar();

  function getPlaceholderImage() {
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
  }

  const placeholderImage = getPlaceholderImage();

  function getPlaceholderThumb() {
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
  }

  const placeholderThumb = getPlaceholderThumb();

  window.prototype += { nbnData: { blankAvatar, placeholderImage, placeholderThumb } };

  function createPlaceholderImage() {
    $(".elementor-post.mods").children(".elementor-post__text").each(function () {
      if ($(this).prev().length === 0) {
        const link = $(this).find(".elementor-post__read-more").attr("href");
        const banner = $(`<a class="elementor-post__thumbnail__link" href="${link}"><div class="elementor-post__thumbnail"><img width="1608" height="881" src="${placeholderImage}" class="attachment-grid size-grid" alt="" loading="lazy"></div></a>`);
        $(banner).insertBefore($(this));
      }
    });
  }

  function addTempModPageImage() {
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
  }

  const swiperTooDarkRegex = /background-image: (linear-gradient\(rgba\(\d+, \d+, \d+, [\d.]+\), rgba\(\d+, \d+, \d+, [\d.]+\)\), )/gi;

  function testImageSwiperIsDarker() {
    // CSpell:ignoreRegExp /darkmysite_dark_mode_enabled/
    if (!$("html").hasClass("darkmysite_dark_mode_enabled")) {
      return;
    }

    const styles = $("div.elementor-carousel-image[style*=\"linear-gradient(rgba(\"][aria-label]");

    for (const [index, element] of Object.entries(styles)) {
      if (isNaN(index)) {
        break;
      }

      if (swiperTooDarkRegex.test($(element).attr("style"))) {
        const newStyle = $(element).attr("style").replace(swiperTooDarkRegex, "background-image: ");
        $(element).attr("style", newStyle);
      }
    }
  }

  const iframeCSS = btoa(GM_getResourceText("iframe"));

  function callback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        if ($(mutation.target).hasClass("elementor-carousel-image")) {
          testImageSwiperIsDarker();
        }
      }
    }
  }

  function setupMutationObserver() {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function setupCSS() {
    GM_addStyle(GM_getResourceText("fix"));
    /* Old code.
     * $("head").append("<style id=\"nbnDarkFixStyle\"></style>");
     * $("#nbnDarkFixStyle").setData("css", calcVariableCSS()).addData("css", { defaultDarkBG, variableTextLength: variableTextLength() }).modifyStyle("css");
     */
  }

  function handleIframes() {
    if (/https:\/\/(www\.)?glamourdresser\.com\/wp-admin\/post(-new)?\.php/gi.test(window.location.href)) {
      const iframes = $("iframe");
      for (const frame in iframes) {
        if (Object.hasOwn(iframes, frame) && !isNaN(parseInt(frame, 10))) {
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
  }

  if (/https:\/\/(www\.)?glamourdresser\.com\/wp-admin/gi.test(window.location.href)) {
    GM_registerMenuCommand("Config", () => {
      GM_config.open();
    });
  }

  const gmConfigCSS = GM_getResourceText("GMConfigCSS");

  GM_config.init({
    id: "GlamourDresser_Additions_Config",
    title: "The Glamour Dresser Additions Config",
    fields: {
      darkDashboard: {
        label: "Dark Dashboard",
        type: "select",
        options: ["Default", "Dark"],
        default: "Default"
      }
    },
    events: {
      init() {
        GM_config.frame.setAttribute("style", "display:none;");
        convertFromMonkeyToGMConfig();
        changeUI();
        createObjects();
        createPlaceholderImage();
        addTempModPageImage();
        setupCSS();
        handleIframes();
        setupMutationObserver();
      },
      open() {
        GM_config.frame.setAttribute("style", "display:block;");
      },
      save(val) {
        changeUI(val);
      },
      close() {
        GM_config.frame.setAttribute("style", "display:none;");
      }
    },
    css: gmConfigCSS,
    frame: gmConfigFrame
  });
});
