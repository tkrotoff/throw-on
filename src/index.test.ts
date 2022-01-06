import * as throwOn from './index';

test('functions are exported', () => {
  expect(throwOn).toEqual({
    throwOnConsoleAssert: expect.any(Function),
    restoreConsoleAssert: expect.any(Function),

    throwOnConsoleError: expect.any(Function),
    restoreConsoleError: expect.any(Function),

    throwOnConsoleWarn: expect.any(Function),
    restoreConsoleWarn: expect.any(Function),

    throwOnFetch: expect.any(Function),
    restoreFetch: expect.any(Function),

    throwOnXMLHttpRequestOpen: expect.any(Function),
    restoreXMLHttpRequestOpen: expect.any(Function)
  });
});
