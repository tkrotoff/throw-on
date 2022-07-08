const original = globalThis.fetch;

/**
 * Makes fetch to throw if called.
 */
export function throwOnFetch() {
  globalThis.fetch = (input: RequestInfo | URL) => {
    throw new Error(`You must mock fetch: '${input.toString()}'`);
  };
}

/**
 * Restores the original fetch implementation.
 */
export function restoreFetch() {
  globalThis.fetch = original;
}
