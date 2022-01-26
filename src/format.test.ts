import { format as nodeFormat } from 'node:util';

import { format } from './format';

test('should not change input string', () => {
  const str = '%s';

  {
    const o = format(str, 'foo');
    expect(str).toEqual('%s');
    expect(o).toEqual('foo');
  }

  {
    const o = nodeFormat(str, 'foo');
    expect(str).toEqual('%s');
    expect(o).toEqual('foo');
  }
});

test('no params', () => {
  const o = format();
  expect(o).toEqual('');
  expect(o).toEqual(nodeFormat());
});

test('no values', () => {
  const i = 'foo';
  const o = format(i);
  expect(o).toEqual('foo');
  expect(o).toEqual(nodeFormat(i));
});

test('more % than values', () => {
  // Unsupported
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
