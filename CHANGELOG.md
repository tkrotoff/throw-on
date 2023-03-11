## 0.8.0 (2023/03/11)

- Update npm packages

## 0.7.0 (2022/11/15)

- Breaking change: always display the original console message before throwing

## 0.6.6 (2022/07/08)

- Remove comments from ESM build
- Test with Node.js 18
- Update some npm packages

## 0.6.5 (2022/03/03)

- Warn against possible infinite loop

## 0.6.4 (2022/02/27)

- Fix documentation: Node.js 14 supported

## 0.6.3 (2022/02/20)

- Fix: re-implement util.inspect() & util.format()

  Use https://github.com/hildjj/node-inspect-extracted instead or is this enough?

## 0.6.2 (2022/01/27)

- Fix format(), was not handling extra arguments 🤦

## 0.6.1 (2022/01/26)

- Fix clickable link in Chrome

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
