/* eslint-disable no-unused-vars */
export type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: Error) => void;

/**
 * Fancy type to transform methods in an object to asynchronous methods.
 * @author OrionTacoCat
 */
export type AwaitedMethods<O> = {
  [K in keyof O]: O[K] extends (...args: never[]) => unknown ? (...args: Parameters<O[K]>) => Promise<ReturnType<O[K]>> : (O[K] extends object ? AwaitedMethods<O[K]> : O[K])
};
