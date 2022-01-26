## 0.6.0 (2022/01/26)

- Breaking change: pass the method name as a parameter
  - Example: throwOnConsoleError(...) becomes throwOnConsole('error', ...)
- Support for console.info, console.log, console.dir, console.debug
- Support for web browsers

## 0.5.0 (2022/01/19)

- Remove bin/jest_throw-on hack: half works :-/
- 1 extra line inside the stack trace instead of 2 when using the `ignore` option

## 0.4.1 (2022/01/18)

- Fix executable path: .bin/jest_throw-on instead of .bin/throw-on

## 0.4.0 (2022/01/18)

- Call the original console method if the message is ignored
- New executable `jest_throw-on` that fixes the Jest output when using the `ignore` option

## 0.3.0 (2022/01/06)

- Fix "ReferenceError: XMLHttpRequest is not defined"
- Extract throwOnXMLHttpRequestOpen()
- New fullStackTrace option

## 0.2.2 (2022/01/06)

- Bundlephobia does not support optional chaining (?.): https://github.com/pastelsky/bundlephobia/issues/413

## 0.2.1 (2022/01/06)

- Fix throwOnConsoleWarn stack trace

## 0.2.0 (2022/01/05)

- Add options to throwOnConsoleError and throwOnConsoleWarn
- Better documentation

## 0.1.0 (2022/01/02)

First release
