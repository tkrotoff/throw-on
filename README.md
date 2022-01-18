# throw-on

[![npm version](https://badge.fury.io/js/throw-on.svg)](https://www.npmjs.com/package/throw-on)
[![Node.js CI](https://github.com/tkrotoff/throw-on/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/tkrotoff/throw-on/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a1d8efe9ec84a918822d/test_coverage)](https://codeclimate.com/github/tkrotoff/throw-on/test_coverage)
[![Bundle size](https://badgen.net/bundlephobia/minzip/throw-on)](https://bundlephobia.com/result?p=throw-on)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Airbnb Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

Force console.error and network requests to fail.

- Tiny: less than 100 lines of code
- No dependencies
- Fully tested
- Written in TypeScript

## Why?

Do you have warnings like _"An update inside a test was not wrapped in act"_ or _"Can't perform a React state update on an unmounted component"_ when running your React app tests?

Are your tests performing network requests when they shouldn't?

Solution: throw whenever there is a React warning (e.g. console.error) or a network request that isn't mocked.

- The sooner a test fails, the easier it is to fix it
- Improve the quality of your code (like an ESLint rule but at runtime)

Result:

- before (test passes)

  ![before](doc/was-not-wrapped-in-act-original.png)

  ![before](doc/state-update-on-unmounted-component-original.png)

- after (test fails)

  ![after](doc/was-not-wrapped-in-act-throwOnConsoleError.png)

  ![after](doc/state-update-on-unmounted-component-throwOnConsoleError.png)

## Usage

`npm install --save-dev throw-on`

```TypeScript
// Inside jest.setup.js for example
import {
  throwOnConsoleAssert,
  throwOnConsoleError,
  throwOnConsoleWarn,
  throwOnFetch,
  throwOnXMLHttpRequestOpen
} from 'throw-on';

throwOnConsoleAssert();
throwOnConsoleError();
throwOnConsoleWarn();
throwOnFetch();
throwOnXMLHttpRequestOpen();
```

Or copy-paste [throwOnConsole](src/throwOnConsole.ts) and/or [throwOnFetch](src/throwOnFetch.ts) and/or [throwOnXMLHttpRequestOpen](src/throwOnXMLHttpRequestOpen.ts) into your source code.

Requires Node.js >= 15 or a [String.replaceAll](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll) [polyfill](https://github.com/zloirock/core-js#stringreplaceall).

### Jest

Optionally, use [`jest_throw-on`](bin/jest_throw-on.js) instead of calling `jest`:

```JavaScript
// package.json

  "scripts": {
    "test": "jest_throw-on --verbose",
    "test:coverage": "jest_throw-on --coverage"
  }
```

This fixes the Jest output when using the `ignore` option by excluding throw-on source code from the stack trace.

## API

```TypeScript
/**
 * Makes console.assert to throw if called.
 */
function throwOnConsoleAssert(): void;

/**
 * Restores the original console.assert implementation.
 */
function restoreConsoleAssert(): void;

/**
 * Makes console.error to throw if called.
 */
function throwOnConsoleError(options?: Options): void;

/**
 * Restores the original console.error implementation.
 */
function restoreConsoleError(): void;

/**
 * Makes console.warn to throw if called.
 */
function throwOnConsoleWarn(options?: Options): void;

/**
 * Restores the original console.error implementation.
 */
function restoreConsoleWarn(): void;

/**
 * Makes fetch to throw if called.
 */
function throwOnFetch(): void;

/**
 * Restores the original fetch implementation.
 */
function restoreFetch(): void;

/**
 * Makes XMLHttpRequest.open to throw if called.
 */
function throwOnXMLHttpRequestOpen(): void;

/**
 * Restores the original XMLHttpRequest.open implementation.
 */
function restoreXMLHttpRequestOpen(): void;

type Options = {
  /**
   * Messages to ignore (won't throw), each message to ignore can be a substring or a regex.
   *
   * Empty list by default.
   */
  ignore?: (string | RegExp)[];

  /**
   * Displays the full stack trace including the 'throwError()' part if true; this helps for debugging.
   *
   * False by default.
   */
  fullStackTrace?: boolean;
};
```
