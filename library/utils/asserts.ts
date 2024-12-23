export const isValid = (value: unknown): boolean => typeof value !== "undefined" && value !== null;
export const isType = <T>(value: unknown): boolean => isValid((value as T));
/* eslint-disable-next-line brace-style */
export function assertIsType<T>(value: unknown): asserts value is T { if (!isType<T>(value)) { throw new TypeError("Type of value is not a string."); } }

export const isString = (value: unknown): boolean => typeof value === "string" || value instanceof String;
/* eslint-disable-next-line brace-style */
export function assertIsString(value: unknown): asserts value is string { if (!isString(value)) { throw new TypeError("Type of value is not a string."); } }

export const isNumber = (value: unknown): boolean => typeof value === "number" || !isNaN(Number(value)) || value instanceof Number;
/* eslint-disable-next-line brace-style */
export function assertIsNumber(value: unknown): asserts value is number { if (!isNumber(value)) { throw new TypeError("Type of value is not a number."); } }
export const isNotANumber = (value: unknown): boolean => typeof value !== "number" || isNaN(Number(value));

export const isObject = (value: unknown): boolean => typeof value === "object" || value instanceof Object;
/* eslint-disable-next-line brace-style */
export function assertIsObject(value: unknown): asserts value is object { if (!isObject(value)) { throw new TypeError("Type of value is not a object."); } }

export const isBigInt = (value: unknown): boolean => typeof value === "bigint" || value instanceof BigInt;
/* eslint-disable-next-line brace-style */
export function assertIsBigInt(value: unknown): asserts value is bigint { if (!isBigInt(value)) { throw new TypeError("Type of value is not a bigint."); } }

export const isBoolean = (value: unknown): boolean => typeof value === "boolean" || value instanceof Boolean;
/* eslint-disable-next-line brace-style */
export function assertIsBoolean(value: unknown): asserts value is boolean { if (!isBoolean(value)) { throw new TypeError("Type of value is not a boolean."); } }

export const isFunction = (value: unknown): boolean => typeof value === "function" || value instanceof Function;
/* eslint-disable-next-line brace-style, @typescript-eslint/no-unsafe-function-type */
export function assertIsFunction(value: unknown): asserts value is Function { if (!isFunction(value)) { throw new TypeError("Type of value is not a function."); } }

export const isSymbol = (value: unknown): boolean => typeof value === "symbol" || value instanceof Symbol;
/* eslint-disable-next-line brace-style */
export function assertIsSymbol(value: unknown): asserts value is symbol { if (!isSymbol(value)) { throw new TypeError("Type of value is not a symbol."); } }
