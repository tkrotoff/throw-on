import { restoreFetch, throwOnFetch } from './throwOnFetch';

beforeAll(() => {
  throwOnFetch();
});

afterAll(() => {
  restoreFetch();
});

test('fetch call should throw', () => {
  expect(() => fetch('https://www.google.com/')).toThrow(
    "You must mock fetch: 'https://www.google.com/'"
  );
});
