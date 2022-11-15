import * as throwOn from './index';

test('functions are exported', () => {
  expect(throwOn).toEqual({
    ThrowOnError: expect.any(Function),

    throwOnConsole: expect.any(Function),
    restoreConsole: expect.any(Function),

    throwOnFetch: expect.any(Function),
    restoreFetch: expect.any(Function),

    throwOnXMLHttpRequestOpen: expect.any(Function),
    restoreXMLHttpRequestOpen: expect.any(Function)
  });
});
