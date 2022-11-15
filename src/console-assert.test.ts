import assert from 'node:assert';

import { restoreConsole, throwOnConsole } from './throwOnConsole';

test('condition with message', () => {
  throwOnConsole('assert');

  expect(() => console.assert(true, 'assert message')).not.toThrow();
  expect(() => assert(true, 'assert message')).not.toThrow();

  expect(() => console.assert(false, 'assert message')).toThrow('assert message');
  expect(() => assert(false, 'assert message')).toThrow('assert message');

  restoreConsole('assert');
});

test('condition without message', () => {
  throwOnConsole('assert');

  expect(() => console.assert(true)).not.toThrow();
  expect(() => assert(true)).not.toThrow();

  // https://nodejs.org/docs/latest-v16.x/api/assert.html#assertokvalue-message

  expect(() => console.assert(1)).not.toThrow();
  expect(() => assert(1)).not.toThrow();

  expect(() => console.assert(typeof 123 === 'string')).toThrow('throw-on console.assert: ');
  // Wow that's messed up: the exception message matches a previous statement
  expect(() => assert(typeof 123 === 'string')).toThrow(
    'The expression evaluated to a falsy value:\n\n  expect(() => console.assert(1)).not.toThrow()\n'
  );

  expect(() => console.assert(false)).toThrow('throw-on console.assert: ');
  // Wow that's messed up: the exception message matches a previous statement
  expect(() => assert(false)).toThrow(
    "The expression evaluated to a falsy value:\n\n  console.assert(typeof 123 === 'string')\n"
  );

  expect(() => console.assert(0)).toThrow('throw-on console.assert: ');
  // Wow that's messed up: the exception message matches a previous statement
  expect(() => assert(0)).toThrow('0 == true');

  restoreConsole('assert');
});

test('no args', () => {
  throwOnConsole('assert');

  expect(() => console.assert()).toThrow('throw-on console.assert: ');
  // @ts-ignore
  expect(() => assert()).toThrow('No value argument passed to `assert.ok()`');

  restoreConsole('assert');
});

test('ignore option', () => {
  throwOnConsole('assert', { ignore: ['assert message'] });
  expect(() => console.assert(false, 'assert message')).not.toThrow();
  restoreConsole('assert');

  throwOnConsole('assert', { ignore: [] });
  expect(() => console.assert(false, 'assert message')).toThrow('assert message');
  restoreConsole('assert');
});
