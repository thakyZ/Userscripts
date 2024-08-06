/* eslint-disable no-unused-vars */
// XXX temporary until the next gm-compat release

type CloneIntoOptions = {
  cloneFunctions?: boolean;
  target?: object;
  wrapReflectors?: boolean;
};

type ExportOptions = {
  target?: object;
};

type ExportFunctionOptions = {
  allowCrossOriginArguments?: boolean;
  defineAs?: string;
  target?: object;
};

interface GMCompatApply {
  <T, A extends IArguments, R>($this: T, fn: ((this: T, ...args: unknown[]) => R), args: A): R;
  <T, A extends readonly unknown[], R>($this: T, fn: ((this: T, ...args: A) => R), args: A): R;
}

interface GMCompatAPI {
  readonly apply: GMCompatApply;
  readonly call: <T, A extends readonly unknown[], R>($this: T, fn: ((this: T, ...args: A) => R), ...args: A) => R;
  readonly cloneInto: <T extends object>(object: T, options?: CloneIntoOptions) => T;
  readonly export: <T extends object>(value: T, options?: ExportOptions) => T;
  readonly exportFunction: <T extends (arg0?: unknown) => object>(fn: T, options?: ExportFunctionOptions) => T;
  readonly unsafeWindow: typeof window;
  readonly unwrap: <T extends object>(object: T) => T;
}

declare global {
  declare const GMCompat: GMCompatAPI;
}

export {
  GMCompatAPI, GMCompatApply, ExportFunctionOptions,
  ExportOptions, CloneIntoOptions,
};
