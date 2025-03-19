/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/gm_config.d.ts" />
import { JQuery, } from "jquery";

declare type XMLHTTPRequestBody =
  | string
  | Document
  | XMLHttpRequestBodyInit
  | null;
declare type OptionalString = string | null | undefined;
declare type NumberLike = string | number;
declare type OptionalNumber = number | null | undefined;
declare type OptionalNumberLike = NumberLike | null | undefined;
declare type HTTPMethods = HTTPRequestMethods | string;
declare type HTTPStringifier = URL | string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type JSONLike = any;

/**
 * All of the callback functions defined in the `details` object, if called,
 * will receive this type of object as their first (and only) argument. The data
 * available will vary slightly, depending on the type of callback.
 *
 * @see https://wiki.greasespot.net/GM.xmlHttpRequest
 */
declare interface GM_ResponseObject {
  /**
   * Properties based on a standard
   * [XMLHttpRequest](https://developer.mozilla.org/en/xmlhttprequest#Properties)
   * object:
   */

  /** Returns client's state. */
  readyState: number;

  /**
   * The [`GM_ResponseObject`](https://wiki.greasespot.net/GM.xmlHttpRequest)
   * property `responseHeaders` returns all the response headers, separated by
   * [CRLF](https://developer.mozilla.org/en-US/docs/Glossary/CRLF), as a
   * string, or returns `null` if no response has been received.
   *
   * If a network error happened, an empty string is returned.
   */
  responseHeaders: string;

  /**
   * Returns response as text.
   *
   * Throws an "InvalidStateError" DOMException if responseType is not the empty
   * string or "text".
   */
  responseText: string;

  /**
   * The read-only `GM_ResponseObject.status` property returns the numerical
   * HTTP [status
   * code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) of the
   * `GM_ResponseObject`'s response.
   *
   * Before the request completes, the value of `status` is 0. Browsers also
   * report a status of 0 in case of `GM_ResponseObject` errors.
   */
  status: number;

  /**
   * The read-only `GM_ResponseObject.statusText` property returns a string
   * containing the response's status message as returned by the HTTP server.
   * Unlike
   * [`GM_ResponseObject.status`](https://wiki.greasespot.net/GM.xmlHttpRequest)
   * which indicates a numerical status code, this property contains the text of
   * the response status, such as "OK" or "Not Found". If the request's
   * [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
   * is in `UNSENT` or `OPENED` state, the value of `statusText` will be an
   * empty string.
   *
   * If the server response doesn't explicitly specify a status text,
   * `statusText` will assume the default value "OK".
   */
  statusText: string;

  /**
   * Greasemonkey custom properties
   *
   * @see https://wiki.greasespot.net/GM.xmlHttpRequest
   */

  /** The same object passed into the original request. */
  context?: object;

  /**
   * Properties for progress callbacks, based on
   * [nsIDOMProgressEvent](https://developer.mozilla.org/En/nsIDOMProgressEvent)
   */

  /**
   * A boolean flag indicating if the ratio between the size of the data already
   * transmitted or processed (`loaded`), and the total size of the data
   * (`total`), is calculable. In other words, it tells if the progress is
   * measurable or not.
   */
  lengthComputable?: boolean;

  /**
   * A 64-bit unsigned integer indicating the size, in bytes, of the data
   * already transmitted or processed. The ratio can be calculated by dividing
   * `ProgressEvent.total` by the value of this property. When downloading a
   * resource using HTTP, this only counts the body of the HTTP message, and
   * doesn't include headers and other overhead. Note that for compressed
   * requests of unknown total size, `loaded` might contain the size of the
   * compressed, or decompressed, data, depending on the browser. As of 2024, it
   * contains the size of the compressed data in Firefox, and the size of the
   * uncompressed data in Chrome.
   */
  loaded?: number;

  /**
   * A 64-bit unsigned integer indicating the total size, in bytes, of the data
   * being transmitted or processed. When downloading a resource using HTTP,
   * this value is taken from the `Content-Length` response header. It only
   * counts the body of the HTTP message, and doesn't include headers and other
   * overhead.
   */
  total?: number;
}

declare interface HTTPResponse {
  /** Returns client's state. */
  readyState: number;

  /**
   * The [`GM_ResponseObject`](https://wiki.greasespot.net/GM.xmlHttpRequest)
   * property `responseHeaders` returns all the response headers, separated by
   * [CRLF](https://developer.mozilla.org/en-US/docs/Glossary/CRLF), as a
   * string, or returns `null` if no response has been received.
   *
   * If a network error happened, an empty string is returned.
   */
  responseHeaders: string;

  /**
   * Returns response as text.
   *
   * Throws an "InvalidStateError" DOMException if responseType is not the empty
   * string or "text".
   */
  responseText: string;

  /**
   * The read-only `GM_ResponseObject.status` property returns the numerical
   * HTTP [status
   * code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) of the
   * `GM_ResponseObject`'s response.
   *
   * Before the request completes, the value of `status` is 0. Browsers also
   * report a status of 0 in case of `GM_ResponseObject` errors.
   */
  status: number;

  /**
   * The read-only `GM_ResponseObject.statusText` property returns a string
   * containing the response's status message as returned by the HTTP server.
   * Unlike
   * [`GM_ResponseObject.status`](https://wiki.greasespot.net/GM.xmlHttpRequest)
   * which indicates a numerical status code, this property contains the text of
   * the response status, such as "OK" or "Not Found". If the request's
   * [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
   * is in `UNSENT` or `OPENED` state, the value of `statusText` will be an
   * empty string.
   *
   * If the server response doesn't explicitly specify a status text,
   * `statusText` will assume the default value "OK".
   */
  statusText: string;

  /** The same object passed into the original request. */
  context?: object;

  /**
   * A boolean flag indicating if the ratio between the size of the data already
   * transmitted or processed (`loaded`), and the total size of the data
   * (`total`), is calculable. In other words, it tells if the progress is
   * measurable or not.
   */
  lengthComputable?: boolean;

  /**
   * A 64-bit unsigned integer indicating the size, in bytes, of the data
   * already transmitted or processed. The ratio can be calculated by dividing
   * `ProgressEvent.total` by the value of this property. When downloading a
   * resource using HTTP, this only counts the body of the HTTP message, and
   * doesn't include headers and other overhead. Note that for compressed
   * requests of unknown total size, `loaded` might contain the size of the
   * compressed, or decompressed, data, depending on the browser. As of 2024, it
   * contains the size of the compressed data in Firefox, and the size of the
   * uncompressed data in Chrome.
   */
  loaded?: number;

  /**
   * A 64-bit unsigned integer indicating the total size, in bytes, of the data
   * being transmitted or processed. When downloading a resource using HTTP,
   * this value is taken from the `Content-Length` response header. It only
   * counts the body of the HTTP message, and doesn't include headers and other
   * overhead.
   */
  total?: number;

  /** The response as an XML Document */
  responseXML?: XMLDocument;

  /** The response as an JSON Object */
  responseJSON?: JSONLike;
}

declare interface MakeRequestOptions {
  /** The HTTP query for the request */
  body?: XMLHTTPRequestBody;
  /** The mime type that should be requested. Defaults to 'text/xml'. */
  requestType: string;
  /** The mime type is expected to be recieved. Defaults to 'text/xml'. */
  responseType: string;
  /** The headers to send the request with. */
  headers: Record<string, string>;
  /**
   * The optional user name to use for authentication purposes; by default, this
   * is the `null` value.
   */
  username?: OptionalString;
  /**
   * The optional password to use for authentication purposes; by default, this
   * is the `null` value.
   */
  password?: OptionalString;
}

declare interface NekoGamingUserScriptLibrary {
  /** Specifies if the current script is in debug mode or not. */
  debug: boolean;

  Methods: HTTPRequestMethods;

  /**
   * Makes a request with XMLHttpRequest or GM.xmlHttpRequest (The latter taking
   * priority).
   *
   * @param method The [HTTP request
   *   method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to
   *   use, such as `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, etc. Ignored for
   *   non-HTTP(S) URLs.
   * @param url A string or any other object with a
   *   [stringifier](https://developer.mozilla.org/en-US/docs/Glossary/Stringifier)
   *   — including a
   *   [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) object —
   *   that provides the URL of the resource to send the request to.
   * @param options The url query arguments to pass.
   * @returns The response text of the request.
   */
  makeRequest(
    this: void,
    method: HTTPMethods,
    url: HTTPStringifier,
    options: MakeRequestOptions,
  ): Promise<string>;

  /**
   * Parses a GreaseMonkey XHR response object or a native XHR response object
   * into a universal object
   *
   * @param gmResponse The GreaseMonkey XHR response object
   * @param nativeResponse The native XHR response object
   * @param responseType The expected response type.
   * @returns The universal response object.
   * @throws {Error} When request or xhr are not both defined.
   */
  _parseResponse(
    this: void,
    gmResponse: GM_ResponseObject,
    nativeResponse: XMLHttpRequest,
    responseType: OptionalString,
  ): HTTPResponse;

  /**
   * Gets the alternate name of a user.
   *
   * @param site
   * @param id
   * @returns
   */
  getUserNameAlts(
    this: void,
    site: string,
    id: NumberLike,
  ): Promise<string | undefined>;

  /**
   * Sleep until number of milliseconds are over.
   *
   * @param ms Milliseconds to wait to continue.
   * @returns The completed sleep task.
   */
  sleep(this: void, ms: number): Promise<void>;

  /**
   * Creates a template from the UserScript meta resources.
   *
   * @param resource The template name from UserScript resources.
   * @param replaceObj The object containing information about replacement in
   *   the template.
   * @returns {HTMLElement} An element.
   */
  createElement(
    this: void,
    resource: string,
    replaceObj: Record<string, string>,
  ): JQuery<HTMLElement>;

  /**
   * Gets all attributes in an HTMLElement and returns them as a record.
   *
   * @param element The element to query the attributes of.
   * @param args The attribute names to filter for.
   * @returns A record of all attributes and their values.
   */
  getObjectAttr(
    this: void,
    element: HTMLElement,
    ...args: string[]
  ): Record<string, string>;

  /**
   * C# like method to get the hashcode of a string variable.
   *
   * @param value The value of the string to hash.
   * @returns The number associated with the string.
   */
  hashCode(this: void, value: string): number;

  /** Toggles debug for Neko Boi Nick's UserScripts. */
  toggleDebug(): void;
}

declare interface JQueryFunction {
  /**
   * Gets the width of the text provided.
   *
   * @returns
   * @note (Old) Pulled from stack overflow: https://stackoverflow.com/a/2771544/1112800
   */
  textWidth(): number;

  /**
   * Sets data within the element.
   *
   * @param name The data container name for the data.
   * @param data The data to set within the element
   * @returns The element that called this method.
   */
  setData(name: string, data: Record<string, unknown>): JQuery<HTMLElement>;

  /**
   * Adds data within the element.
   *
   * @param name The data container name for the data.
   * @param data The data to add within the element
   * @returns The element that called this method.
   */
  addData(name: string, data: Record<string, unknown>): JQuery<HTMLElement>;

  /**
   * Removes data from within the element.
   *
   * @param name The data container name for the data.
   * @param keys The list of keys to removed from the data.
   * @returns The element that called this method.
   */
  removeData(name: string, keys: string[]): JQuery<HTMLElement>;

  /**
   * Modifies the style of the element via the data container name.
   *
   * @param name The data container name for the data.
   * @returns The element that called this method.
   */
  modifyStyle(name: string): JQuery<HTMLElement>;

  /**
   * Gets the whole HTML of the element including the element itself.
   *
   * @returns The html contents of the element and itself.
   */
  outerHTML(): string;

  /**
   * Creates a template from the UserScript meta resources.
   *
   * @param resource The template name from UserScript resources.
   * @param replaceObj The object containing information about replacement in
   *   the template.
   * @returns An element.
   */
  createElement(
    resource: string,
    replaceObj: Record<string, string>,
  ): JQuery<HTMLElement>;

  /**
   * Gets the alternate name of a user.
   *
   * @param site
   * @param id
   * @returns
   */
  getUserNameAlts(site: string, id: NumberLike): Promise<string | undefined>;

  /**
   * Gets the attribute in an object.
   *
   * @param {...any} args The attributes to find.
   * @returns
   */
  getObjectAttr(...args: string[]): Record<string, string>;

  /**
   * Gets only text of the element and disregards all child elements.
   *
   * @returns Non trimmed text.
   */
  onlyText(): string;

  /**
   * Unknown method
   *
   * @deprecated
   * @param {unknown} item
   * @returns {JQuery<typeof item>}
   */
  detectOriginalText(item: unknown): JQuery<unknown>;

  /** Toggles debug for Neko Boi Nick's UserScripts. */
  toggleDebug(): void;
}

/**
 * HTTP defines a set of request methods to indicate the purpose of the request
 * and what is expected if the request is successful. Although they can also be
 * nouns, these request methods are sometimes referred to as HTTP verbs. Each
 * request method has its own semantics, but some characteristics are shared
 * across multiple methods, specifically request methods can be
 * [safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP),
 * [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent),
 * or [cacheable](https://developer.mozilla.org/en-US/docs/Glossary/Cacheable).
 *
 * @readonly
 * @enum {String}
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
declare enum HTTPRequestMethods {
  /**
   * The `GET` method requests a representation of the specified resource.
   * Requests using `GET` should only retrieve data and should not contain a
   * request
   * [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
   */
  GET = "GET",
  /**
   * The `HEAD` method asks for a response identical to a `GET` request, but
   * without a response body.
   */
  HEAD = "HEAD",
  /**
   * The `POST` method submits an entity to the specified resource, often
   * causing a change in state or side effects on the server.
   */
  POST = "POST",
  /**
   * The `PUT` method replaces all current representations of the target
   * resource with the request
   * [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
   */
  PUT = "PUT",
  /** The `DELETE` method deletes the specified resource. */
  DELETE = "DELETE",
  /**
   * The `CONNECT` method establishes a tunnel to the server identified by the
   * target resource.
   */
  CONNECT = "CONNECT",
  /**
   * The `OPTIONS` method describes the communication options for the target
   * resource.
   */
  OPTIONS = "OPTIONS",
  /**
   * The `TRACE` method performs a message loop-back test along the path to the
   * target resource.
   */
  TRACE = "TRACE",
  /** The `PATCH` method applies partial modifications to a resource. */
  PATCH = "PATCH",
}
