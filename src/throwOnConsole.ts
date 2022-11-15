import { format } from './util';

type Options = {
  /**
   * Messages to ignore (won't throw), each message to ignore can be a substring or a regex.
   *
   * Empty list by default.
   */
  ignore?: (string | RegExp)[];
};

type ConsoleMethodName = 'assert' | 'error' | 'warn' | 'info' | 'log' | 'dir' | 'debug';

function formatMessage(ignore: Options['ignore'], ...data: any[]) {
  ignore = ignore ?? [];
  const message = format(...data);

  return {
    shouldNotThrow: ignore.some(msgToIgnore =>
      typeof msgToIgnore === 'string' ? message.includes(msgToIgnore) : message.match(msgToIgnore)
    ),
    message
  };
}

const originalConsole = {
  assert: console.assert,
  error: console.error,
  warn: console.warn,
  info: console.info,
  log: console.log,
  dir: console.dir,
  debug: console.debug
};

export class ThrowOnError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ThrowOnError';

    // No stack trace
    this.stack = undefined;
  }
}

function getFirstLine(message: string) {
  const lines = message.split('\n');
  return lines.length > 1 ? lines[0] : message;
}

/**
 * Makes console method to throw if called.
 */
export function throwOnConsole(methodName: ConsoleMethodName, options: Options = {}) {
  const { ignore } = options;

  if (methodName === 'assert') {
    console.assert = (condition?: boolean, ...data: any[]) => {
      if (!condition) {
        const { shouldNotThrow, message } = formatMessage(ignore, ...data);
        if (!shouldNotThrow) {
          throw new ThrowOnError(`throw-on console.assert: ${getFirstLine(message)}`);
        }
      }
    };
  } else {
    console[methodName] = (...data: any[]) => {
      originalConsole[methodName](...data);
      const { shouldNotThrow, message } = formatMessage(ignore, ...data);
      if (!shouldNotThrow) {
        throw new ThrowOnError(`throw-on console.${methodName}: ${getFirstLine(message)}`);
      }
    };
  }
}

/**
 * Restores the original console method implementation.
 */
export function restoreConsole(methodName: ConsoleMethodName) {
  console[methodName] = originalConsole[methodName];
}
