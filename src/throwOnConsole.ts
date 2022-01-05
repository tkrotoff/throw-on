import assert from 'assert';
import { format } from 'util';

const originalConsoleAssert = console.assert;

/**
 * Makes console.assert to throw if called.
 */
export function throwOnConsoleAssert() {
  // [console.assert not throwing with v22.4.0](https://github.com/facebook/jest/issues/5634)
  console.assert = assert;
}

/**
 * Restores the original console.assert implementation.
 */
export function restoreConsoleAssert() {
  console.assert = originalConsoleAssert;
}

type Options = {
  /**
   * Messages to ignore (won't throw), each message to ignore can be a substring or a regex
   */
  ignore?: (string | RegExp)[];
};

function throwError(consoleMethod: () => void, options?: Options, ...data: any[]) {
  let message = format(...data);

  const ignore = options?.ignore;
  if (
    ignore?.some(msgToIgnore =>
      typeof msgToIgnore === 'string' ? message.includes(msgToIgnore) : message.match(msgToIgnore)
    )
  ) {
    return;
  }

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
    consoleMethod
  );

  throw e;
}

const originalConsoleError = console.error;

/**
 * Makes console.error to throw if called.
 */
export function throwOnConsoleError(options?: Options) {
  console.error = (...data: any[]) => {
    throwError(console.error, options, ...data);
  };
}

/**
 * Restores the original console.error implementation.
 */
export function restoreConsoleError() {
  console.error = originalConsoleError;
}

const originalConsoleWarn = console.warn;

/**
 * Makes console.warn to throw if called.
 */
export function throwOnConsoleWarn(options?: Options) {
  console.warn = (...data: any[]) => {
    throwError(console.warn, options, ...data);
  };
}

/**
 * Restores the original console.error implementation.
 */
export function restoreConsoleWarn() {
  console.warn = originalConsoleWarn;
}
