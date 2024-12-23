import { PromiseReject, PromiseResolve } from "./promise.js";
import { assertIsString, assertIsType, isType } from "./asserts.js";
import EMath from "./e_math.js";
export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "TRACE"
  | "OPTIONS"
  | "CONNECT";
export type Headers = { [key: string]: string };
export type ReadyState = 0 | 1 | 2 | 3 | 4;
export type ResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";

export interface INetworkResponse<TContext = any> {
  /**
   * Returns client's state.
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/readystate} MDN Reference
   */
  readonly readyState: ReadyState | 0;
  /**
   * Returns the response body.
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/response} MDN Reference
   */
  readonly response: any;
  /**
   * Returns response as text.
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseText} MDN Reference
   */
  readonly responseText: string;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseURL} MDN Reference */
  readonly responseURL: string;
  readonly finalUrl: string;
  /**
   * Returns the response as document.
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseXML} MDN Reference
   */
  readonly responseXML: Document | (null | false);
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/status} MDN Reference */
  readonly status: number;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/statusText} MDN Reference */
  readonly statusText: string;
  readonly responseHeaders: string;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/getAllResponseHeaders} MDN Reference */
  getAllResponseHeaders(): string;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/getResponseHeader} MDN Reference */
  /* eslint-disable-next-line no-unused-vars */
  getResponseHeader(name: string): string | null;
  readonly UNSENT: 0;
  readonly OPENED: 1;
  readonly HEADERS_RECEIVED: 2;
  readonly LOADING: 3;
  readonly DONE: 4;
  readonly context?: GM.Response<TContext> | XMLHttpRequest;
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly total: number;
}

class NetworkResponse<TContext = any> implements INetworkResponse<TContext> {
  constructor(res: XMLHttpRequest | GM.Response<TContext> | GM.ProgressResponse<TContext>, prog?: ProgressEvent) {
    if (prog || isType<XMLHttpRequest>(res)) {
      assertIsType<XMLHttpRequest>(res);
      this._readyState = (EMath.clamp(res.readyState, 0, 4) as ReadyState);
      this._response = (res.response as unknown);
      this._responseText = res.responseText;
      this._responseURL = res.responseURL;
      this._responseXML = res.responseXML;
      this._responseHeaders = res.getAllResponseHeaders();
      this._status = res.status;
      this._statusText = res.statusText;

      if (prog) {
        this._lengthComputable = prog.lengthComputable;
        this._loaded = prog.loaded;
        this._total = prog.total;
      }

      return;
    }

    if (isType<GM.ProgressResponse<TContext>>(res)) {
      assertIsType<GM.ProgressResponse<TContext>>(res);
      this._readyState = res.readyState;
      this._response = (res.response as unknown);
      this._responseText = res.responseText;
      this._responseURL = res.finalUrl;
      this._responseXML = res.responseXML;
      this._responseHeaders = res.responseHeaders;
      this._status = res.status;
      this._statusText = res.statusText;
      this._lengthComputable = res.lengthComputable;
      this._loaded = res.loaded;
      this._total = res.total;

      return;
    }

    assertIsType<GM.Response<TContext>>(res);
    this._readyState = res.readyState;
    this._response = (res.response as unknown);
    this._responseText = res.responseText;
    this._responseURL = res.finalUrl;
    this._responseXML = res.responseXML;
    this._responseHeaders = res.responseHeaders;
    this._status = res.status;
    this._statusText = res.statusText;
  }

  private _readyState: ReadyState;
  /**
   * Returns client's state.
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/readystate} MDN Reference
   */
  get readyState(): ReadyState {
    return this._readyState;
  }

  private _response: any;
  /**
   * Returns the response body.
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/response} MDN Reference
   */
  get response(): any {
    return (this._response as unknown);
  }

  private _responseText: string;
  /**
   * Returns response as text.
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseText} MDN Reference
   */
  get responseText(): string {
    return this._responseText;
  }

  private _responseURL: string;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseURL} MDN Reference */
  get responseURL(): string {
    return this._responseURL;
  }

  get finalUrl(): string {
    return this._responseURL;
  }

  private _responseXML: Document | (null | false);
  /**
   * Returns the response as document.
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
   * @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseXML} MDN Reference
   */
  get responseXML(): Document | (null | false) {
    return this._responseXML;
  }

  private _status: number;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/status} MDN Reference */
  get status(): number {
    return this._status;
  }

  private _statusText: string;
  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/statusText} MDN Reference */
  get statusText(): string {
    return this._statusText;
  }

  private _responseHeaders: string;
  get responseHeaders(): string {
    return this._responseHeaders;
  }

  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/getAllResponseHeaders} MDN Reference */
  getAllResponseHeaders(): string {
    return this._responseHeaders;
  }

  /**  @see {@link https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/getResponseHeader} MDN Reference */
  getResponseHeader(name: string): string | null {
    const record: Record<string, string> = {};

    for (const line of this.responseHeaders.split(/\r?\n/)) {
      const [key, value] = line.split(": ", 1);

      record[key] = value;
    }

    if (Object.hasOwn(record, name) && record[name] !== "undefined") {
      return record[name];
    }

    return null;
  }

  readonly UNSENT: 0 = 0 as const;
  readonly OPENED: 1 = 1 as const;
  readonly HEADERS_RECEIVED: 2 = 2 as const;
  readonly LOADING: 3 = 3 as const;
  readonly DONE: 4 = 4 as const;
  private _context: GM.Response<TContext> | XMLHttpRequest | undefined;
  /** The same object passed into the original request */
  get context(): GM.Response<TContext> | XMLHttpRequest | undefined {
    return this._context;
  }

  private _lengthComputable: boolean = false;
  get lengthComputable(): boolean {
    return this._lengthComputable;
  }

  private _loaded: number = 0;
  get loaded(): number {
    return this._loaded;
  }

  private _total: number = 0;
  get total(): number {
    return this._total;
  }
}

export interface INetworkRequest<TContext = any> {
  /**
   * The URL to make the request to. Must be an absolute URL, beginning
   * with the scheme. May be relative to the current page.
   */
  url: string;
  /** String type of HTTP request to make (E.G. "GET", "POST") */
  method: Method;
  /**
   * When true, the data is sent as a Blob
   * @default false
   */
  binary?: boolean | undefined;
  /**
   * Any object (Compatibility: 1.10+). This object will also be the
   * context property of the Response Object.
   */
  context?: TContext | undefined;
  /**
   * Data to send in the request body. Usually for POST method requests.
   * If the data field contains form-encoded data, you usually must also
   * set the header `'Content-Type': 'application/x-www-form-urlencoded'`
   * in the `headers` field.
   */
  data?: string | Record<string, any> | undefined;
  /** A set of headers to include in the request */
  headers?: Headers | undefined;
  /**
   * A MIME type to specify with the request (e.g.
   * "text/html; charset=ISO-8859-1")
   */
  overrideMimeType?: string | undefined;
  /** User name to use for authentication purposes. */
  user?: string | undefined;
  /** Password to use for authentication purposes */
  password?: string | undefined;
  /** Decode the response as specified type. Default value is "text" */
  responseType?: ResponseType | undefined;
  /**
   * When `true`, this is a synchronous request.
   * Be careful: The entire Firefox UI will be locked and frozen until the
   * request completes.In this mode, more data will be available in the
   * return value.
   */
  synchronous?: boolean | undefined;
  /**
   * The number of milliseconds to wait before terminating the call. Zero
   * (the default) means wait forever.
   */
  timeout?: number | undefined;
  /**
   * Object containing optional function callbacks to monitor the upload
   * of data.
   */
  upload?: {
      /* eslint-disable-next-line no-unused-vars */
      onabort?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onerror?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onload?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onprogress?: (response: INetworkResponse<TContext>) => void;
  } | undefined;

  // Event handlers

  /** Will be called when the request is aborted */
  /* eslint-disable-next-line no-unused-vars */
  onabort?: (response: INetworkResponse<TContext>) => void;
  /** Will be called if an error occurs while processing the request */
  /* eslint-disable-next-line no-unused-vars */
  onerror?: (response: INetworkResponse<TContext>) => void;
  /** Will be called when the request has completed successfully */
  /* eslint-disable-next-line no-unused-vars */
  onload?: (response: INetworkResponse<TContext>) => void;
  /** Will be called when the request progress changes */
  /* eslint-disable-next-line no-unused-vars */
  onprogress?: (response: INetworkResponse<TContext>) => void;
  /** Will be called repeatedly while the request is in progress */
  /* eslint-disable-next-line no-unused-vars */
  onreadystatechange?: (response: INetworkResponse<TContext>) => void;
  /** Will be called if/when the request times out */
  /* eslint-disable-next-line no-unused-vars */
  ontimeout?: (response: INetworkResponse<TContext>) => void;
}

export class NetworkRequest<TContext = any> implements INetworkRequest<TContext> {
  constructor(input: INetworkRequest<TContext>) {
    this.url /*               */ = input.url;
    this.method /*            */ = input.method;
    this.binary /*            */ = input.binary;
    this.context /*           */ = input.context;
    this.data /*              */ = this.handleData(input.data);
    this.headers /*           */ = input.headers;
    this.overrideMimeType /*  */ = input.overrideMimeType;
    this.user /*              */ = input.user;
    this.password /*          */ = input.password;
    this.responseType /*      */ = input.responseType;
    this.synchronous /*       */ = input.synchronous;
    this.timeout /*           */ = input.timeout;
    this.upload /*            */ = input.upload;
    this.onabort /*           */ = input.onabort;
    this.onerror /*           */ = input.onerror;
    this.onload /*            */ = input.onload;
    this.onprogress /*        */ = input.onprogress;
    this.onreadystatechange /**/ = input.onreadystatechange;
    this.ontimeout /*         */ = input.ontimeout;
  }

  private handleData(input: string | Record<string, any> | undefined): string | undefined {
    if (typeof input === "string") {
      return input;
    }

    if (!input) {
      return input;
    }

    assertIsType<Record<string, any>>(input);

    if (typeof input["dataType"] !== "undefined" && input["dataType"] === "url") {
      let sb = "?";
      const entries: [string, any][] = Object.entries(input).filter((x: [string, any]) => x[0] === "dataType");

      for (let i = 0; i < entries.length; i++) {
        if (i !== 0) {
          sb += "&";
        }

        const [key, value] = (entries[i] as [string, unknown]);

        assertIsString(value);
        sb += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }

      this.url = sb;

      return undefined;
    }

    return JSON.stringify(input);
  }

  /**
   * The URL to make the request to. Must be an absolute URL, beginning
   * with the scheme. May be relative to the current page.
   */
  url: string;
  /** String type of HTTP request to make (E.G. "GET", "POST") */
  method: Method;
  /**
   * When true, the data is sent as a Blob
   * @default false
   */
  binary?: boolean | undefined;
  /**
   * Any object (Compatibility: 1.10+). This object will also be the
   * context property of the Response Object.
   */
  context?: TContext | undefined;
  /**
   * Data to send in the request body. Usually for POST method requests.
   * If the data field contains form-encoded data, you usually must also
   * set the header `'Content-Type': 'application/x-www-form-urlencoded'`
   * in the `headers` field.
   */
  data?: string | undefined;
  /** A set of headers to include in the request */
  headers?: Headers | undefined;
  /**
   * A MIME type to specify with the request (e.g.
   * "text/html; charset=ISO-8859-1")
   */
  overrideMimeType?: string | undefined;
  /** User name to use for authentication purposes. */
  user?: string | undefined;
  /** Password to use for authentication purposes */
  password?: string | undefined;
  /** Decode the response as specified type. Default value is "text" */
  responseType?: ResponseType | undefined;
  /**
   * When `true`, this is a synchronous request.
   * Be careful: The entire Firefox UI will be locked and frozen until the
   * request completes.In this mode, more data will be available in the
   * return value.
   */
  synchronous?: boolean | undefined;
  /**
   * The number of milliseconds to wait before terminating the call. Zero
   * (the default) means wait forever.
   */
  timeout?: number | undefined;
  /**
   * Object containing optional function callbacks to monitor the upload
   * of data.
   */
  upload?: {
      /* eslint-disable-next-line no-unused-vars */
      onabort?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onerror?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onload?: (response: INetworkResponse<TContext>) => void;
      /* eslint-disable-next-line no-unused-vars */
      onprogress?: (response: INetworkResponse<TContext>) => void;
  } | undefined;

  // Event handlers

  /** Will be called when the request is aborted */
  /* eslint-disable-next-line no-unused-vars */
  onabort?: (response: INetworkResponse<TContext>) => void;
  /** Will be called if an error occurs while processing the request */
  /* eslint-disable-next-line no-unused-vars */
  onerror?: (response: INetworkResponse<TContext>) => void;
  /** Will be called when the request has completed successfully */
  /* eslint-disable-next-line no-unused-vars */
  onload?: (response: INetworkResponse<TContext>) => void;
  /** Will be called when the request progress changes */
  /* eslint-disable-next-line no-unused-vars */
  onprogress?: (response: INetworkResponse<TContext>) => void;
  /** Will be called repeatedly while the request is in progress */
  /* eslint-disable-next-line no-unused-vars */
  onreadystatechange?: (response: INetworkResponse<TContext>) => void;
  /** Will be called if/when the request times out */
  /* eslint-disable-next-line no-unused-vars */
  ontimeout?: (response: INetworkResponse<TContext>) => void;
}

export function makeRequestGM<TContext = any>(request: NetworkRequest<TContext>): Promise<INetworkResponse<TContext>> {
  return new Promise<INetworkResponse<TContext>>((resolve: PromiseResolve<INetworkResponse<TContext>>, reject: PromiseReject) => {
    const _request: GM.Request<TContext> = {
      binary: request.binary,
      context: request.context,
      data: request.data,
      headers: request.headers,
      method: request.method,
      overrideMimeType: request.overrideMimeType,
      password: request.password,
      responseType: request.responseType,
      synchronous: false,
      timeout: request.timeout,
      upload: {
        onabort(response: GM.Response<TContext>) {
          const res = new NetworkResponse<TContext>(response);

          if (request.upload?.onabort) {
            request.upload.onabort(res);
          }

          resolve(res);
        },
        onerror(response: GM.Response<TContext>) {
          const res = new NetworkResponse<TContext>(response);

          if (request.upload?.onerror) {
            request.upload?.onerror(res);
          }

          reject(new Error(res.statusText));
        },
        onload(response: GM.Response<TContext>) {
          const res = new NetworkResponse<TContext>(response);

          if (request.upload?.onload) {
            request.upload?.onload(res);
          }

          resolve(res);
        },
        onprogress(response: GM.ProgressResponse<TContext>) {
          const res = new NetworkResponse<TContext>(response);

          if (request.upload?.onprogress) {
            request.upload?.onprogress(res);
          }
        },
      },
      url: request.url,
      user: request.user,
      onabort(response: GM.Response<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.onabort) {
          request.onabort(res);
        }

        resolve(res);
      },
      onerror(response: GM.Response<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.onerror) {
          request.onerror(res);
        }

        reject(new Error(res.statusText));
      },
      onload(response: GM.Response<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.onload) {
          request.onload(res);
        }

        resolve(res);
      },
      onprogress(response: GM.ProgressResponse<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.onprogress) {
          request.onprogress(res);
        }
      },
      onreadystatechange(response: GM.Response<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.onreadystatechange) {
          request.onreadystatechange(res);
        }
      },
      ontimeout(response: GM.Response<TContext>) {
        const res = new NetworkResponse<TContext>(response);

        if (request.ontimeout) {
          request.ontimeout(res);
        }

        reject(new Error(res.statusText));
      },
    };

    GM.xmlHttpRequest(_request);
  });
}

function makeRequestNative<TContext = any>(request: NetworkRequest): Promise<INetworkResponse<TContext>> {
  return new Promise<INetworkResponse<TContext>>((resolve: PromiseResolve<INetworkResponse<TContext>>, reject: PromiseReject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(request.method, request.url);

    xhr.onloadend = () => {
      const res = new NetworkResponse<TContext>(xhr);

      if (request.onload) {
        request.onload(res);
      }

      resolve(res);
    };

    xhr.onabort = () => {
      const res = new NetworkResponse<TContext>(xhr);

      if (request.onabort) {
        request.onabort(res);
      }

      reject(new Error(res.statusText));
    };

    xhr.onerror = () => {
      const res = new NetworkResponse<TContext>(xhr);

      if (request.onerror) {
        request.onerror(res);
      }

      reject(new Error(res.statusText));
    };

    xhr.onprogress = (event: ProgressEvent) => {
      const res = new NetworkResponse<TContext>(xhr, event);

      if (request.onprogress) {
        request.onprogress(res);
      }
    };

    xhr.onreadystatechange = () => {
      const res = new NetworkResponse<TContext>(xhr);

      if (request.onreadystatechange) {
        request.onreadystatechange(res);
      }
    };

    xhr.ontimeout = () => {
      const res = new NetworkResponse<TContext>(xhr);

      if (request.ontimeout) {
        request.ontimeout(res);
      }

      resolve(res);
    };

    xhr.send();
  });
}

export async function makeRequest<TContext = any>(request: NetworkRequest<TContext>): Promise<INetworkResponse<TContext>> {
  if (!GM || !GM.xmlHttpRequest) {
    return makeRequestNative<TContext>(request);
  }

  return makeRequestGM<TContext>(request);
}
