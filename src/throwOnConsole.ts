import assert from 'assert';
import { format } from 'util';

const originalConsoleAssert = console.assert;

/**
 * Any console.assert call will throw (causing the test to fail).
 */
export function throwOnConsoleAssert() {
  // [console.assert not throwing with v22.4.0](https://github.com/facebook/jest/issues/5634)
  console.assert = assert;
}

/**
 * Restore the original console.assert implementations.
 */
export function restoreConsoleAssert() {
  console.assert = originalConsoleAssert;
}

function throwError(...data: any[]) {
  let message = format(...data);

  // React adds its own stack trace to the console.error() message:
  // https://github.com/facebook/react/blob/v17.0.2/packages/shared/consoleWithStackDev.js#L33-L37
  //
  // Problem: when replacing console.error with throw, the "code snippet" generated by Jest (?)
  // uses this stack trace instead of the real one
  // By adding '.' at the end of each line of the "React stack trace" it forces Jest to ignore these lines
  message = message.replaceAll(
    // Example:
    // '    at Child (/src/utils/throwOnConsole.test.tsx:127:20)\n'
    // '    at Parent (/src/utils/throwOnConsole.test.tsx:133:26)'
    / {4}at .* \(.*:\d+:\d+\)/g,
    match => `${match}.`
  );

  const e = new Error(message);

  Error.captureStackTrace(
    e,
    // https://nodejs.org/docs/latest-v16.x/api/errors.html#errorcapturestacktracetargetobject-constructoropt
    //
    // > The optional constructorOpt argument accepts a function.
    // > If given, all frames above constructorOpt, including constructorOpt, will be omitted from the generated stack trace.
    console.error
  );

  throw e;
}

const originalConsoleError = console.error;

/**
 * Any console.error call will throw (causing the test to fail).
 */
export function throwOnConsoleError() {
  console.error = (...data: any[]) => {
    throwError(...data);
  };
}

/**
 * Restore the original console.error implementations.
 */
export function restoreConsoleError() {
  console.error = originalConsoleError;
}

const originalConsoleWarn = console.warn;

/**
 * Any console.warn call will throw (causing the test to fail).
 */
export function throwOnConsoleWarn() {
  console.warn = (...data: any[]) => {
    throwError(...data);
  };
}

/**
 * Restore the original console.error implementations.
 */
export function restoreConsoleWarn() {
  console.warn = originalConsoleWarn;
}
