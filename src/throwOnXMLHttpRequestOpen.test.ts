import { restoreXMLHttpRequestOpen, throwOnXMLHttpRequestOpen } from './throwOnXMLHttpRequestOpen';

beforeAll(() => {
  throwOnXMLHttpRequestOpen();
});

afterAll(() => {
  restoreXMLHttpRequestOpen();
});

test('XHR call should throw', () => {
  const xhr = new XMLHttpRequest();

  expect(() => xhr.open('GET', 'https://www.google.com/')).toThrow(
    "You must mock XMLHttpRequest: 'https://www.google.com/'"
  );
});
