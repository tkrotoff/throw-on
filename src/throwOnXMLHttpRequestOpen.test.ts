import { restoreXMLHttpRequestOpen, throwOnXMLHttpRequestOpen } from './throwOnXMLHttpRequestOpen';

beforeEach(() => {
  throwOnXMLHttpRequestOpen();
});

afterEach(() => {
  restoreXMLHttpRequestOpen();
});

test('throw + restore XMLHttpRequest.prototype.open', () => {
  restoreXMLHttpRequestOpen();

  const original = XMLHttpRequest.prototype.open;
  expect(original).toEqual(XMLHttpRequest.prototype.open);

  throwOnXMLHttpRequestOpen();
  expect(original).not.toEqual(XMLHttpRequest.prototype.open);

  restoreXMLHttpRequestOpen();
  expect(original).toEqual(XMLHttpRequest.prototype.open);
});

test('XMLHttpRequest.open should throw', () => {
  const xhr = new XMLHttpRequest();

  expect(() => xhr.open('GET', 'https://www.google.com/')).toThrow(
    "You must mock XMLHttpRequest: 'https://www.google.com/'"
  );
});
