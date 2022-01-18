#!/usr/bin/env node

// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires */

const { ErrorWithStack } = require('jest-util');
const { BufferedConsole } = require('@jest/console');

/**
 * https://github.com/facebook/jest/blob/v27.4.7/packages/jest-console/src/BufferedConsole.ts#L179-L183
 *
 * @param {unknown} condition
 * @param {string} [message]
 * @returns {asserts condition}
 */
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const originalBufferedConsoleWrite = BufferedConsole.write;

// Fix the Jest output by excluding throw-on source code from the stack trace
// https://github.com/facebook/jest/blob/v27.4.7/packages/jest-console/src/BufferedConsole.ts#L39-L63
// https://github.com/facebook/jest/blob/v27.4.7/packages/jest-runner/src/runTest.ts#L127
BufferedConsole.write = (buffer, type, message, level) => {
  // 2 = the console call is buried 2 stack frames deeper because of throwOnConsole
  const moreStackLevel = 2;

  const rawStack = new ErrorWithStack(
    undefined,
    BufferedConsole.write,
    Error.stackTraceLimit + moreStackLevel
  ).stack;

  invariant(rawStack, 'always have a stack trace');

  if (rawStack.match(/.*throwOnConsole.*/) === null) {
    // Nothing to do
    return originalBufferedConsoleWrite(buffer, type, message, level);
  }

  const stackLevel = level != null ? level : 2;

  const origin = rawStack
    .split('\n')
    .slice(stackLevel + moreStackLevel)
    .filter(Boolean)
    .join('\n');

  buffer.push({
    message,
    origin,
    type
  });

  return buffer;
};

// https://github.com/facebook/jest/blob/main/packages/jest-cli/bin/jest.js
require('jest-cli/bin/jest');