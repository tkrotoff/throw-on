import { format as nodeFormat } from 'node:util';

import { format } from './format';

test('should not change arguments', () => {
  const str = '%s';
  const values = ['foo', 'bar'];

  {
    const o = format(str, ...values);
    expect(str).toEqual('%s');
    expect(values).toEqual(['foo', 'bar']);
    expect(o).toEqual('foo bar');
  }

  {
    const o = nodeFormat(str, ...values);
    expect(str).toEqual('%s');
    expect(values).toEqual(['foo', 'bar']);
    expect(o).toEqual('foo bar');
  }
});

test('no params', () => {
  const o = format();
  expect(o).toEqual('');
  expect(o).toEqual(nodeFormat());
});

test('no values', () => {
  const str = '%s';
  const o = format(str);
  expect(o).toEqual('%s');
  expect(o).toEqual(nodeFormat(str));
});

test('no %', () => {
  const i = ['foo', 'bar'];
  const o = format(...i);
  expect(o).toEqual('foo bar');
  expect(o).toEqual(nodeFormat(...i));
});

test('more values than %', () => {
  const i = ['%s', 'foo', 'bar', 'baz', '08', '11px', '3.14', '314e-2'];
  const o = format(...i);
  expect(o).toEqual('foo bar baz 08 11px 3.14 314e-2');
  expect(o).toEqual(nodeFormat(...i));
});

test('1 %s', () => {
  const i = ['%s', 'foo'];
  const o = format(...i);
  expect(o).toEqual('foo');
  expect(o).toEqual(nodeFormat(...i));
});

test('2 %s, 1 param', () => {
  const i = ['%s %s', 'foo'];
  const o = format(...i);
  expect(o).toEqual('foo %s');
  expect(o).toEqual(nodeFormat(...i));
});

test('2 %s, 2 params', () => {
  const i = ['%s %s', 'foo', '08'];
  const o = format(...i);
  expect(o).toEqual('foo 08');
  expect(o).toEqual(nodeFormat(...i));
});

test('%d', () => {
  const i = ['%d %d %d %d', '08', '11px', '3.14', '314e-2'];
  const o = format(...i);
  expect(o).toEqual('8 NaN 3.14 3.14');
  expect(o).toEqual(nodeFormat(...i));
});

test('%i', () => {
  const i = ['%i %i %i %i', '08', '11px', '3.14', '314e-2'];
  const o = format(...i);
  expect(o).toEqual('8 11 3 314');
  expect(o).toEqual(nodeFormat(...i));
});

test('%f', () => {
  const i = ['%f %f %f %f', '08', '11px', '3.14', '314e-2'];
  const o = format(...i);
  expect(o).toEqual('8 11 3.14 3.14');
  expect(o).toEqual(nodeFormat(...i));
});

test('%j', () => {
  // Unsupported
});

test('%o', () => {
  // Unsupported
});

test('%O', () => {
  // Unsupported
});

test('%c', () => {
  const i = ['%c %c', 'foo', '08'];
  const o = format(...i);
  expect(o).toEqual(' ');
  expect(o).toEqual(nodeFormat(...i));
});

test('%%', () => {
  const i = ['%% %%'];
  const o = format(...i);
  expect(o).toEqual('%% %%');
  expect(o).toEqual(nodeFormat(...i));
});

test('1 %s 1 %d', () => {
  const i = ['%s %d', 'foo', '08'];
  const o = format(...i);
  expect(o).toEqual('foo 8');
  expect(o).toEqual(nodeFormat(...i));
});

test('examples from Node.js documentation', () => {
  // https://nodejs.org/docs/latest-v16.x/api/util.html#utilformatformat-args

  expect(format('%s:%s', 'foo')).toEqual('foo:%s');
  expect(format('%s:%s', 'foo', 'bar', 'baz')).toEqual('foo:bar baz');
  expect(nodeFormat(1, 2, 3)).toEqual('1 2 3');
  expect(format('%% %s')).toEqual('%% %s');
});
