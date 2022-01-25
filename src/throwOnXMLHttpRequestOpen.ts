// XMLHttpRequest is undefined under Node.js if not polyfilled
// and thus accessing XMLHttpRequest.prototype.open fails when importing this file
//const original = XMLHttpRequest.prototype.open;
let original: typeof XMLHttpRequest.prototype.open | undefined;

/**
 * Makes XMLHttpRequest.open to throw if called.
 */
export function throwOnXMLHttpRequestOpen() {
  if (original === undefined) {
    original = XMLHttpRequest.prototype.open;
  }

  XMLHttpRequest.prototype.open = (_method: string, url: string) => {
    throw new Error(`You must mock XMLHttpRequest: '${url}'`);
  };
}

/**
 * Restores the original XMLHttpRequest.open implementation.
 */
export function restoreXMLHttpRequestOpen() {
  if (original === undefined) {
    throw new Error('Call throwOnXMLHttpRequestOpen() first');
  }

  XMLHttpRequest.prototype.open = original;
}
