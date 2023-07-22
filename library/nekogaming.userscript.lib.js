/**
 * Neko Gaming UserScript Library.
 *
 * A library for use in UserScripts, made by Neko Boi Nick.
 *
 * @link      https://github.com/thakyZ/Userscripts/blob/master/library
 * @file      This files defines the MyClass class.
 * @author    Neko Boi Nick.
 * @since     1.0.0
 * @copyright Neko Boi Nick 2023
 * @depends
 *   - jQuery 1.8+                     (http://api.jquery.com/)
 * @license   MIT https://nntoan.mit-license.org
 */

/* global window, jQuery, GM, XMLHttpRequest */

if (typeof window !== "undefined") {
  window.onload = function () {
    if (typeof jQuery === "undefined") {
      console.warn("JQuery not loaded do not process.");
    }
  };
}

/* eslint-disable-next-line no-shadow-restricted-names */
(function ($, undefined) {
  "use strict";
  let debug = false;

  /* (Old) Pulled from stack overflow: https://stackoverflow.com/a/2771544/1112800
  *
  * $.textWidth = () => {
  *   const htmlOrg = $(this).html();
  *   const htmlCalc = `<span>${htmlOrg}</span>`;
  *   $(this).html(htmlCalc);
  *   const width = $(this).find("span:first").width();
  *   $(this).html(htmlOrg);
  *   return width;
  * };
  */

  /* eslint-disable no-extend-native */
  String.prototype.width = function (font, size) {
    const f = font || "arial";
    const s = size || "12px";
    const o = $("<span></span>")
      .text(this)
      .css({ position: "absolute", float: "left", whiteSpace: "nowrap", visibility: "hidden", font: `${s} ${f}` })
      .appendTo($("body"));
    const w = o.width();

    o.remove();
    return w;
  };
  /* eslint-enable no-extend-native */

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
    $(this).each((_, element) => {
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
    $(this).each((_, element) => {
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
    $(this).each((_, element) => {
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

  function makeRequest(method, url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.readyState === this.DONE && this.status >= 200 && this.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(new Error({
            status: this.status,
            statusText: xhr.statusText
          }));
        }
      };

      xhr.onerror = function () {
        reject(new Error({
          status: this.status,
          statusText: xhr.statusText
        }));
      };

      xhr.send();
    });
  }

  $.fn.createElement = (resource, replaceObj = {}) => {
    const templateHtml = GM_getResourceText(resource);

    if (templateHtml === "") {
      return undefined;
    }

    const templateTruncated = templateHtml.replaceAll(/^<!DOCTYPE html>\r?\n<template>\r?\n {2}/gi, "").replaceAll(/\r?\n<\/template>$/gi, "");
    let template = $("<div />").append($(templateTruncated).clone()).html();
    for (const [key, value] of Object.entries(replaceObj)) {
      template = template.replaceAll(key, value);
    }

    return $(template);
  };

  $.fn.getUserNameAlts = async (site, id) => {
    let userNameAlt = "";
    if (typeof GM === "undefined" || typeof GM.xmlHttpRequest === "undefined") {
      try {
        const req = await makeRequest("GET", `https://api.nekogaming.xyz/ffxiv/modding/names/get.php?q=${site}&id=${id}`);
        userNameAlt = JSON.parse(req);
      } catch (error) {
        console.error("Failed to get the user's avatar. (Non-GreaseMonkey)");
        console.error(error);
      }
    } else {
      try {
        const request = await GM.xmlHttpRequest({
          method: "GET",
          url: `https://api.nekogaming.xyz/ffxiv/modding/names/get.php?q=${site}&id=${id}`,
          responseType: "",
          synchronous: true,
          timeout: 2000
        });

        if (request.readyState === request.DONE && request.status >= 200 && request.status < 300) {
          userNameAlt = JSON.parse(request.responseText);
        }
      } catch (error) {
        console.error("Failed to get the user's avatar. (GreaseMonkey)");
        console.error(error);
      }
    }

    return userNameAlt;
  };

  $.fn.getObjectAttr = function (...args) {
    if (args.length === 0) {
      if (this.length === 0) {
        return null;
      }

      const obj = {};
      $.each(this, function (index) {
        $.each(this[index].attributes, function () {
          if (this.specified) {
            obj[this.name] = this.value;
          }
        });
      });
      return obj;
    }
  };

  $.fn.onlyText = ($element) => $($element)
    .clone() // Clone the element
    .children() // Select all the children
    .remove() // Remove all the children
    .end() // Again go back to selected element
    .text();

  $.fn.detectOriginalText = function ($class) {
    if (debug) {
      console.log(`detectedStrings : ${$($class).length}`);
    }

    return $($class);
  };

  $.fn.toggleDebug = function () {
    debug = !debug;
  };
})(jQuery);
