/* eslint-disable unicorn/new-for-builtins */

import { format as nodeFormat } from 'node:util';

import { format } from './format';
import { noop } from './noop';

function expectFormat(expected: string | RegExp, str?: any, ...values: any[]) {
  if (typeof expected === 'string') {
    expect(format(str, ...values)).toEqual(expected);
    expect(nodeFormat(str, ...values)).toEqual(expected);
  } else {
    expect(format(str, ...values)).toMatch(expected);
    expect(nodeFormat(str, ...values)).toMatch(expected);
  }
}

function expectFormatFail(
  expected: string | RegExp,
  expectedNodeFormat: string | RegExp,
  str?: any,
  ...values: any[]
) {
  if (typeof expected === 'string') {
    expect(format(str, ...values)).toEqual(expected);
  } else {
    expect(format(str, ...values)).toMatch(expected);
  }

  if (typeof expectedNodeFormat === 'string') {
    expect(nodeFormat(str, ...values)).toEqual(expectedNodeFormat);
  } else {
    expect(nodeFormat(str, ...values)).toMatch(expectedNodeFormat);
  }
}

test('no params', () => {
  const o = format();
  expect(o).toEqual('');
  expect(nodeFormat()).toEqual(o);
});

test('undefined', () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  expectFormatFail('', 'undefined', undefined);
});

test('null', () => {
  expectFormat('null', null);
});

test('empty string', () => {
  expectFormat('', '');
});

test('[]', () => {
  expectFormat('[]', []);
});

test('{}', () => {
  expectFormat('{}', {});
});

test('first argument is not a string', () => {
  expectFormat('3.14 foo', 3.14, 'foo');
});

test('false boolean vs string', () => {
  expectFormat('false', 'false');
  expectFormat('false', false);
  expectFormat("[ 3, 'false', false ]", [3, 'false', false]);
});

test('no values', () => {
  expectFormat('%s', '%s');
});

const object = { foo: { bar: 'baz' } };
const array = [object, object, object];

const valuesWithoutBigInt = [
  '08',
  '11px',
  3.14,
  '314e-2',
  'foo',
  Symbol('symbol'),
  false,
  null,
  undefined,
  object,
  array
];
const valuesWithBigInt = [...valuesWithoutBigInt, 8n];

test('no %', () => {
  expectFormatFail(
    "08 11px 3.14 314e-2 foo Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [ { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } } ] 8n",
    `08 11px 3.14 314e-2 foo Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } }
] 8n`,
    ...valuesWithBigInt
  );
});

test('more values than %', () => {
  expectFormat('foo bar', '%s', 'foo', 'bar');
});

test('more % than values', () => {
  expectFormat('foo %s', '%s %s', 'foo');
});

test('unknown %', () => {
  expectFormat('%z foo', '%z', 'foo');
});

test('%s', () => {
  expectFormatFail(
    '08 11px 3.14 314e-2 foo Symbol(symbol) false null undefined [object Object] [object Object],[object Object],[object Object] 8n',
    '08 11px 3.14 314e-2 foo Symbol(symbol) false null undefined { foo: [Object] } [ [Object], [Object], [Object] ] 8n',
    Array(valuesWithBigInt.length).fill('%s').join(' '),
    ...valuesWithBigInt
  );
});

test('%d', () => {
  expectFormat(
    '8 NaN 3.14 3.14 NaN NaN 0 0 NaN NaN NaN 8n',
    Array(valuesWithBigInt.length).fill('%d').join(' '),
    ...valuesWithBigInt
  );
});

test('%i', () => {
  expectFormat(
    '8 11 3 314 NaN NaN NaN NaN NaN NaN NaN 8n',
    Array(valuesWithBigInt.length).fill('%i').join(' '),
    ...valuesWithBigInt
  );
});

test('%f', () => {
  expectFormat(
    '8 11 3.14 3.14 NaN NaN NaN NaN NaN NaN NaN 8',
    Array(valuesWithBigInt.length).fill('%f').join(' '),
    ...valuesWithBigInt
  );
});

test('%j', () => {
  expectFormat(
    '"08" "11px" 3.14 "314e-2" "foo" undefined false null undefined {"foo":{"bar":"baz"}} [{"foo":{"bar":"baz"}},{"foo":{"bar":"baz"}},{"foo":{"bar":"baz"}}]',
    Array(valuesWithoutBigInt.length).fill('%j').join(' '),
    ...valuesWithoutBigInt
  );
});

test('%j - BigInt', () => {
  expect(() => format('%j', 8n)).toThrow('Do not know how to serialize a BigInt');
  expect(() => nodeFormat('%j', 8n)).toThrow('Do not know how to serialize a BigInt');
});

test('%j - circular', () => {
  const obj = {};
  // @ts-ignore
  obj.obj = obj;
  expectFormat('[Circular]', '%j', obj);
});

test('%o', () => {
  expectFormatFail(
    "'08' '11px' 3.14 '314e-2' 'foo' Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [ { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } } ] 8n",
    `'08' '11px' 3.14 '314e-2' 'foo' Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } },
  [length]: 3
] 8n`,
    Array(valuesWithBigInt.length).fill('%o').join(' '),
    ...valuesWithBigInt
  );
});

test('%O', () => {
  expectFormatFail(
    "'08' '11px' 3.14 '314e-2' 'foo' Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [ { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } }, { foo: { bar: 'baz' } } ] 8n",
    `'08' '11px' 3.14 '314e-2' 'foo' Symbol(symbol) false null undefined { foo: { bar: 'baz' } } [
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } },
  { foo: { bar: 'baz' } }
] 8n`,
    Array(valuesWithBigInt.length).fill('%O').join(' '),
    ...valuesWithBigInt
  );
});

test('%c', () => {
  expectFormat(
    '           ',
    Array(valuesWithBigInt.length).fill('%c').join(' '),
    ...valuesWithBigInt
  );
});

test('%%', () => {
  expectFormat('%% %%', '%% %%');
});

test('%%s%s', () => {
  expectFormat('%sfoo', '%%s%s', 'foo');
});

test('%%%s%%', () => {
  expectFormat('%foo%', '%%%s%%', 'foo');
});

test('1 %s 1 %d', () => {
  expectFormat('foo 8', '%s %d', 'foo', '08');
});

test('examples from Node.js documentation', () => {
  // https://nodejs.org/docs/latest-v16.x/api/util.html#utilformatformat-args

  expect(format('%s:%s', 'foo')).toEqual('foo:%s');
  expect(format('%s:%s', 'foo', 'bar', 'baz')).toEqual('foo:bar baz');
  expect(format(1, 2, 3)).toEqual('1 2 3');
  expect(format('%% %s')).toEqual('%% %s');
});

jest.doMock('../common', noop, { virtual: true });
jest.doMock('util', () => {
  return { ...jest.requireActual('node:util'), format };
});

// https://github.com/nodejs/node/blob/v17.4.0/test/parallel/test-util-format.js
test('test-util-format.js', async () => {
  // @ts-ignore
  await import('./test-util-format');
});
