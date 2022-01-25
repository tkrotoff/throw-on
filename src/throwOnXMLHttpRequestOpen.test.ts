import { restoreXMLHttpRequestOpen, throwOnXMLHttpRequestOpen } from './throwOnXMLHttpRequestOpen';

// Must be run first
test('throw if restoreXMLHttpRequestOpen() is called before throwOnXMLHttpRequestOpen()', () => {
  expect(() => restoreXMLHttpRequestOpen()).toThrow('Call throwOnXMLHttpRequestOpen() first');

  throwOnXMLHttpRequestOpen();
  expect(() => restoreXMLHttpRequestOpen()).not.toThrow();
});

test('throw + restore XMLHttpRequest.prototype.open', () => {
  const original = XMLHttpRequest.prototype.open;
  expect(original).toEqual(XMLHttpRequest.prototype.open);

  throwOnXMLHttpRequestOpen();
  expect(original).not.toEqual(XMLHttpRequest.prototype.open);

  restoreXMLHttpRequestOpen();
  expect(original).toEqual(XMLHttpRequest.prototype.open);
});

test('XMLHttpRequest.open should throw', () => {
  throwOnXMLHttpRequestOpen();

  const xhr = new XMLHttpRequest();

  expect(() => xhr.open('GET', 'https://www.google.com/')).toThrow(
    "You must mock XMLHttpRequest: 'https://www.google.com/'"
  );

  restoreXMLHttpRequestOpen();
});
