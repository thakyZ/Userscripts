import { argv } from "node:process";

class Arguments {
  /** @type {Arguments | null} */
  static _instance_internal = null;

  /** @returns {typeof Arguments._instance_internal} */
  static get _instance() {
    if (Arguments._instance_internal === null) {
      Arguments._instance_internal = new Arguments();
    }

    return Arguments._instance_internal;
  }

  /** @type {[String, String | Boolean | Number][]} */
  _arguments = [];

  _constructor() {
    for (let i = 0; i < argv.length; i++) {
      /** @type {String} */
      const arg = argv[i];
      /** @type {String | undefined} */
      const nextArg = i < argv.length - 1 ? argv[i + 1] : undefined;
      /** @type {String | undefined} */
      let key;
      /** @type {String | Boolean | Number | undefined} */
      let value;
      if (arg.startsWith("--")) {
        key = arg.replace(/^--/, "");

        if (nextArg && !nextArg.startsWith("--")) {
          /** @type {Number} */
          const nextArgNumber = parseInt(nextArg, 10);
          if (isNaN(nextArgNumber)) {
            value = nextArgNumber;
          } else if (typeof Boolean(nextArg) === "undefined") {
            value = nextArg;
          } else {
            value = Boolean(nextArg);
          }
        }

        if (typeof value === "undefined") {
          value = true;
        }

        this._arguments.push([key, value]);
      }
    }
  }

  /**
   * @param {...([String, any] | String)} args
   * @returns {Boolean}
   */
  _hasArgumentImpl(...args) {
    for (const arg of args) {
      for (const [key, value] of this._arguments) {
        if (typeof arg === "string") {
          if (key === arg) {
            return true;
          }
        } else if (typeof arg === "object" && Array.isArray(arg)) {
          if (key === arg[0] && value === arg[1]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * @param {...([String, any] | String)} args
   * @returns {Boolean}
   */
  static hasArgument(...args) {
    return Arguments._instance?._hasArgumentImpl(...args) ?? false;
  }
}

export { Arguments };
