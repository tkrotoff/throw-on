const original = XMLHttpRequest.prototype.open;

/**
 * Makes XMLHttpRequest.open to throw if called.
 */
export function throwOnXMLHttpRequestOpen() {
  XMLHttpRequest.prototype.open = (_method: string, url: string) => {
    throw new Error(`You must mock XMLHttpRequest: '${url}'`);
  };
}

/**
 * Restores the original XMLHttpRequest.open implementation.
 */
export function restoreXMLHttpRequestOpen() {
  XMLHttpRequest.prototype.open = original;
}
