import { restoreFetch, throwOnFetch } from './throwOnFetch';

beforeEach(() => {
  throwOnFetch();
});

afterEach(() => {
  restoreFetch();
});

test('throw + restore fetch', () => {
  restoreFetch();

  const original = fetch;
  expect(original).toEqual(fetch);

  throwOnFetch();
  expect(original).not.toEqual(fetch);

  restoreFetch();
  expect(original).toEqual(fetch);
});

test('fetch should throw', () => {
  expect(() => fetch('https://www.google.com/')).toThrow(
    "You must mock fetch: 'https://www.google.com/'"
  );
});
