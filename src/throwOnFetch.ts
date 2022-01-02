const originalFetch = globalThis.fetch;
const originalXHR = XMLHttpRequest.prototype.open;

/**
 * Any fetch or XHR call will throw (causing the test to fail).
 */
export function throwOnFetch() {
  globalThis.fetch = (input: RequestInfo) => {
    throw new Error(`You must mock fetch: '${input.toString()}'`);
  };

  XMLHttpRequest.prototype.open = (_method: string, url: string) => {
    throw new Error(`You must mock XMLHttpRequest: '${url}'`);
  };
}

/**
 * Restore original fetch and XHR implementations.
 */
export function restoreFetch() {
  globalThis.fetch = originalFetch;
  XMLHttpRequest.prototype.open = originalXHR;
}
