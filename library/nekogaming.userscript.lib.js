// @ts-check
/// <reference path="./nekogaming.userscript.lib.d.ts" />
/// <reference path="../types/gm_config.d.ts" />
/// <reference path="../node_modules/@types/jquery/JQuery.d.ts" />
/// <reference path="../node_modules/@types/tampermonkey/index.d.ts" />
/* eslint-disable camelcase */

/**
 * Neko Gaming UserScript Library.
 *
 * A library for use in UserScripts, made by Neko Boi Nick.
 *
 * @license MIT https://nntoan.mit-license.org
 * @file This files defines the MyClass class.
 * @author Neko Boi Nick.
 * @since 1.0.0
 * @link https://github.com/thakyZ/Userscripts/blob/master/library
 * @copyright Neko Boi Nick 2023
 * @depends
 *   - jQuery 1.8+                     (http://api.jquery.com/)
 */

/** @type {NekoGamingUserScriptLibrary} */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const NekoGamingUserScriptLibrary = {
  init(_window, _jquery) {
    "use strict";

    /**
     * Loads the jQuery methods.
     *
     * @param {JQueryStatic} $ Instance of JQuery
     * @param {unknown} _ Unknown discard.
     * @param {NekoGamingUserScriptLibrary} window_nbn_lib Reference to the NekoGamingUserScriptLibrary class.
     */
    function loadJQuery($, _, window_nbn_lib) {
      /**
       * Gets the width of the text provided.
       *
       * @returns {Number}
       * @note (Old) Pulled from stack overflow: https://stackoverflow.com/a/2771544/1112800
       */
      $.fn.textWidth = function () {
        return this.text().width();
      };

      /**
       * Sets data within the element.
       *
       * @param {String} name The data container name for the data.
       * @param {Record<String, any>} data The data to set within the element
       * @returns {JQuery<HTMLElement>} The element that called this method.
       */
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

      /**
       * Adds data within the element.
       *
       * @param {String} name The data container name for the data.
       * @param {Record<String, any>} data The data to add within the element
       * @returns {JQuery<HTMLElement>} The element that called this method.
       */
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

      /**
       * Removes data from within the element.
       *
       * @param {String} name The data container name for the data.
       * @param {String[]} keys The list of keys to removed from the data.
       * @returns {JQuery<HTMLElement>} The element that called this method.
       */
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

      /**
       * Modifies the style of the element via the data container name.
       *
       * @param {String} name The data container name for the data.
       * @returns {JQuery<HTMLElement>} The element that called this method.
       */
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

      /**
       * Gets the whole HTML of the element including the element itself.
       *
       * @returns {String} The html contents of the element and itself.
       */
      $.fn.outerHTML = function () {
        return $("<div />").append(this.eq(0).clone()).html();
      };

      /**
       * Creates a template from the UserScript meta resources.
       *
       * @param {String} resource The template name from UserScript resources.
       * @param {Record<String, String>} replaceObj The object containing information about replacement in the template.
       * @returns {JQuery<HTMLElement>} An element.
       */
      $.fn.createElement = function (resource, replaceObj = {}) {
        return $(window_nbn_lib.createElement(resource, replaceObj));
      };

      /**
       * @param {String} site
       * @param {NumberLike} id
       * @returns {Promise<String | undefined>}
       */
      $.fn.getUserNameAlts = function (site, id) {
        return window_nbn_lib.getUserNameAlts(site, id);
      };

      /**
       * Gets the attribute in an object.
       *
       * @param {...any} args The attributes to find.
       * @returns {String}
       */
      $.fn.getObjectAttr = function (...args) {
        return window_nbn_lib.getObjectAttr(this, ...args);
      };

      /**
       * Gets only text of the element and disregards all child elements.
       *
       * @returns {String} Non trimmed text.
       */
      $.fn.onlyText = function () {
        return $(this)
          .clone() // Clone the element
          .children() // Select all the children
          .remove() // Remove all the children
          .end() // Again go back to selected element
          .text();
      };

      /**
       * Unknown method
       *
       * @deprecated
       * @param {unknown} item
       * @returns {JQuery<typeof item>}
       */
      $.fn.detectOriginalText = function (item) {
        if (window_nbn_lib.debug) {
          console.debug(`detectedStrings : ${$(item).length}`);
        }

        return $(item);
      };

      /** Toggles debug for Neko Boi Nick's UserScripts. */
      $.fn.toggleDebug = function () {
        window_nbn_lib.toggleDebug();
      };
    }

    function loadLib(window) {
      return {
        /** Specifies if the current script is in debug mode or not. */
        debug: false,

        /**
         * HTTP defines a set of request methods to indicate the purpose of the request and what is expected if the request is successful. Although they
         * can also be nouns, these request methods are sometimes referred to as HTTP verbs. Each request method has its own semantics, but some
         * characteristics are shared across multiple methods, specifically request methods can be
         * [safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP),
         * [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent), or
         * [cacheable](https://developer.mozilla.org/en-US/docs/Glossary/Cacheable).
         *
         * @readonly
         * @enum {String}
         * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
         */
        Methods: {
          /**
           * The `GET` method requests a representation of the specified resource. Requests using `GET` should only retrieve data and should not contain
           * a request [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
           */
          GET: "GET",
          /** The `HEAD` method asks for a response identical to a `GET` request, but without a response body. */
          HEAD: "HEAD",
          /** The `POST` method submits an entity to the specified resource, often causing a change in state or side effects on the server. */
          POST: "POST",
          /**
           * The `PUT` method replaces all current representations of the target resource with the request
           * [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
           */
          PUT: "PUT",
          /** The `DELETE` method deletes the specified resource. */
          DELETE: "DELETE",
          /** The `CONNECT` method establishes a tunnel to the server identified by the target resource. */
          CONNECT: "CONNECT",
          /** The `OPTIONS` method describes the communication options for the target resource. */
          OPTIONS: "OPTIONS",
          /** The `TRACE` method performs a message loop-back test along the path to the target resource. */
          TRACE: "TRACE",
          /** The `PATCH` method applies partial modifications to a resource. */
          PATCH: "PATCH",
        },

        /**
         * Makes a request with XMLHttpRequest or GM.xmlHttpRequest (The latter taking priority).
         *
         * @param {HTTPMethods} method The [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use, such as `"GET"`,
         *   `"POST"`, `"PUT"`, `"DELETE"`, etc. Ignored for non-HTTP(S) URLs.
         * @param {HTTPStringifier} url A string or any other object with a [stringifier](https://developer.mozilla.org/en-US/docs/Glossary/Stringifier)
         *   — including a [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) object — that provides the URL of the resource to send the
         *   request to.
         * @param {MakeRequestOptions} options The url query arguments to pass.
         * @returns {Promise<String>} The response text of the request.
         */
        makeRequest(method, url, options = {}) {
          return new Promise((resolve, reject) => {
            if (typeof GM === "undefined" || typeof GM.xmlHttpRequest !== "function") {
              const xhr = new XMLHttpRequest();
              xhr.overrideMimeType(options.responseType);

              for (const [key, value] of options.headers) {
                xhr.setRequestHeader(key, value);
              }

              if (!options.headers.hasOwn("Content-Type")) {
                xhr.setRequestHeader("Content-Type", options.requestType);
              }

              xhr.addEventListener(
                "load",
                function () {
                  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    resolve(this.parseResponse(null, this, xhr));
                  } else {
                    reject(new Error(window.nbn.lib.parseResponse(null, this, xhr)));
                  }
                },
                false
              );

              xhr.addEventListener(
                "error",
                function () {
                  reject(new Error({ ...window.nbn.lib.parseResponse(null, this, xhr) }));
                },
                false
              );

              xhr.open(method, url, true, options.username, options.password);

              if (typeof options.body === "undefined") {
                xhr.send();
              } else {
                xhr.send(options.body);
              }
            } else {
              (async () => GM.xmlHttpRequest({
                method,
                url,
                headers: options.headers,
                timeout: 2000,
                onload(response) {
                  resolve(window.nbn.lib.parseResponse(response, null, null));
                },
                onfailure(response) {
                  reject(new Error(...window.nbn.lib.parseResponse(response, null, null)));
                },
              }))().then(
                /** @type {Tampermonkey.Response<any>} */
                (value) => {
                  console.log(value);
                },
                /** @type {Error | undefined | unknown} */
                (reason) => {
                  if (typeof reason === "string") {
                    reject(new Error(reason));
                  } else if (reason instanceof Error) {
                    reject(reason);
                  } else {
                    reject(new Error("Failed to send \"GM.xmlHttpRequest\"."));
                  }
                }
              );
            }
          });
        },

        /**
         * Parses a GreaseMonkey XHR response object or a native XHR response object into a universal object
         *
         * @param {GM_ResponseObject} gmResponse The GreaseMonkey XHR response object
         * @param {XMLHttpRequest} nativeResponse The native XHR response object
         * @param {OptionalString} responseType The expected response type.
         * @returns {HTTPResponse} The universal response object.
         * @throws {Error} When request or xhr are not both defined.
         */
        // eslint-disable-next-line complexity
        parseResponse(gmResponse, nativeResponse, responseType) {
          if (gmResponse !== null && nativeResponse !== null) {
            console.warn("Issue in method parseResponse. Both response and request/xhr are not null, using GM_Response Object");
          }

          /** @type {HTTPResponse} */
          let output = {};

          if (gmResponse !== null) {
            output = {
              status: gmResponse.status,
              statusText: gmResponse.statusText,
              response: gmResponse.response,
              responseText: gmResponse.responseText,
              finalUrl: gmResponse.finalUrl,
              responseHeaders: gmResponse.responseHeaders,
              readyState: gmResponse.readyState,
            };

            if (!gmResponse.responseXML && (responseType === "text/xml" || responseType === "xml")) {
              output.responseXML = new DOMParser().parseFromString(gmResponse.responseText, "text/xml");
            }

            if (!gmResponse.responseJson && (responseType === "application/json" || responseType === "json")) {
              output.responseJson = JSON.parse(gmResponse.responseText);
            }

            if (typeof output.responseJson !== "undefined" && typeof output.responseJson !== "object" && !Array.isArray(output.responseJson)) {
              throw new TypeError("Type of json response is not a string array.");
            }

            return output;
          }

          if (nativeResponse !== null) {
            output = {
              status: nativeResponse.status,
              statusText: nativeResponse.statusText,
              response: nativeResponse.response,
              responseText: nativeResponse.responseText,
              finalUrl: nativeResponse.finalUrl,
              responseHeaders: nativeResponse.responseHeaders,
              readyState: nativeResponse.readyState,
            };

            if (!nativeResponse.responseXML && (responseType === "text/xml" || responseType === "xml")) {
              output.responseXML = new DOMParser().parseFromString(nativeResponse.responseText, "text/xml");
            }

            if (!nativeResponse.responseJson && (responseType === "application/json" || responseType === "json")) {
              output.responseJson = JSON.parse(nativeResponse.responseText);
            }

            if (typeof output.responseJson !== "undefined" && typeof output.responseJson !== "object" && !Array.isArray(output.responseJson)) {
              throw new TypeError("Type of json response is not a string array.");
            }

            return output;
          }

          throw new Error("Reached end of method when not supposed to.");
        },

        /**
         * @param {String} site
         * @param {NumberLike} id
         * @returns {Promise<String[]>}
         */
        async getUserNameAlts(site, id) {
          /** @type {String[]} */
          let userNameAlt = [];

          try {
            const request = await window.nbn.lib.makeRequest(
              this.Methods.GET,
              `https://api.nekogaming.xyz/ffxiv/modding/names/get.php?q=${site}&id=${id}`,
              {
                responseType: "json",
              }
            );

            if (request.status === 404 || request.status === 500) {
              console.error(request);
            } else if (request.DONE === 4 && request.status === 200) {
              userNameAlt = request.responseJson;
            } else {
              console.error(request);
            }
          } catch (error) {
            console.error("Failed to get the user's avatar. (Non-GreaseMonkey)");
            console.error(error);
          }

          return userNameAlt;
        },

        /**
         * Sleep until number of milliseconds are over.
         *
         * @param {Number} ms Milliseconds to wait to continue.
         * @returns {Promise<void>} The completed sleep task.
         */
        sleep(ms) {
          return new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
        },

        /**
         * Creates a template from the UserScript meta resources.
         *
         * @param {String} resource The template name from UserScript resources.
         * @param {Record<String, String>} replaceObj The object containing information about replacement in the template.
         * @returns {HTMLElement} An element.
         */
        createElement(resource, replaceObj = {}) {
          const templateHtml = GM_getResourceText(resource);

          if (templateHtml === "") {
            return undefined;
          }

          let templateTruncated = templateHtml.replaceAll(/^(<!DOCTYPE html>\r?\n)?<template>\r?\n {2}/gi, "").replaceAll(/\r?\n<\/template>$/gi, "");

          for (const [key, value] of Object.entries(replaceObj)) {
            templateTruncated = templateTruncated.replaceAll(key, value);
          }

          const template = new DOMParser().parseFromString(templateTruncated, "text/html");

          return template;
        },

        /**
         * Gets all attributes in an HTMLElement and returns them as a record.
         *
         * @param {HTMLElement} this The element to query the attributes of.
         * @param {...string[]} args The attribute names to filter for.
         * @returns {Record<String, String> | null} A record of all attributes and their values.
         */
        getObjectAttr(...args) {
          if (args.length === 0) {
            if (this.length === 0) {
              return null;
            }

            const obj = {};
            for (const [, element] of this) {
              for (const [, item] of element.attributes) {
                if (item.specified) {
                  obj[item.name] = item.value;
                }
              }
            }

            return obj;
          }
        },

        /**
         * C# like method to get the hashcode of a string variable.
         *
         * @param {String} value The value of the string to hash.
         * @returns {Number} The number associated with the string.
         */
        hashCode(value) {
          let hash = 0;
          for (let i = 0; i < value.length; i++) {
            const code = value.charCodeAt(i);
            // eslint-disable-next-line no-bitwise
            hash = (hash << 5) - hash + code;
            // eslint-disable-next-line no-bitwise
            hash &= hash; // Convert to 32bit integer
          }

          return hash;
        },

        /** Toggles debug for Neko Boi Nick's UserScripts. */
        toggleDebug() {
          window.nbn.lib.debug = !window.nbn.lib.debug;
        },
      };
    }

    function loadStringPrototype() {
      /**
       * Converts camelCase string into snake_case.
       *
       * @param {String} str The input string which should be camelCase.
       * @returns {String} The input converted to snake_case.
       */
      String.prototype.camelToSnakeCase = function (str) {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      };

      /**
       * Gets the width of the text provided.
       *
       * @param {String | undefined} font The font to use otherwise will use sans-serif.
       * @param {String | Number | undefined} size The size of the font with or without the units.
       * @returns {Number} The width of the string.
       */
      String.prototype.width = function (font, size) {
        /**
         * @param {String | Number | undefined | any} s
         * @returns {String}
         */
        function parseSize(s) {
          switch (typeof s) {
            case "undefined":
              return "12px";
            case "number":
              return `${s}px`;
            case "string":
              return s;
            default:
              throw new TypeError(`Type of provided size in String.width(font, size) not a String, Number, or undefined, got ${typeof s}`);
          }
        }

        /** @type {String} */
        const f = font || "sans-serif";
        /** @type {String} */
        const s = parseSize(size);
        /** @type {HTMLSpanElement} */
        const o = document.createElement("span");
        o.innerText = this;
        o.attributeStyleMap.append("position", "absolute");
        o.attributeStyleMap.append("float", "left");
        o.attributeStyleMap.append("whiteSpace", "nowrap");
        o.attributeStyleMap.append("visibility", "hidden");
        o.attributeStyleMap.append("font", `${s} ${f}`);
        document.body.appendChild(o);
        /** @type {Number} */
        const w = o.props.width;

        o.remove();
        return w;
      };
    }

    let useWindow = _window;

    if (!_window) {
      useWindow = window;
    }

    if (unsafeWindow) {
      useWindow = unsafeWindow;
    }

    if (!Object.hasOwn(useWindow, "nbn") || !useWindow.nbn || typeof useWindow.nbn !== "object") {
      useWindow.nbn = {};
    }

    if (typeof useWindow === "undefined") {
      console.warn("Window object not found do not process.");
    } else {
      try {
        if (!Object.hasOwn(useWindow.nbn, "lib") || !useWindow.nbn.lib || typeof useWindow.nbn.lib !== "object") {
          useWindow.nbn.lib = loadLib(useWindow);
        }

        if (typeof this.jQuery === "undefined") {
          if (typeof _jquery === "undefined") {
            console.warn("JQuery not loaded do not process.");
          } else {
            loadJQuery(_jquery, undefined, useWindow.nbn.lib);
          }
        } else {
          loadJQuery(this.jQuery, undefined, useWindow.nbn.lib);
        }
      } catch (error) {
        console.error(error);
      }

      try {
        loadStringPrototype();
      } catch (error) {
        console.error(error);
      }
    }
  },
};
