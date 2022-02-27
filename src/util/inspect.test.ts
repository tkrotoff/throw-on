/* eslint-disable unicorn/prefer-number-properties, func-names, @typescript-eslint/no-empty-function, new-cap, no-new-func,
no-new-object, no-new-wrappers, unicorn/new-for-builtins, no-regex-spaces, unicorn/error-message, no-inner-declarations */

import assert from 'node:assert';
import { inspect as nodeInspect } from 'node:util';

import { inspect } from './inspect';
import { noop } from './noop';

const breakLength = Number.MAX_VALUE;

function expectInspect(value: any, expected: string | RegExp) {
  if (typeof expected === 'string') {
    expect(inspect(value)).toEqual(expected);
    expect(nodeInspect(value, { breakLength })).toEqual(expected);
  } else {
    expect(inspect(value)).toMatch(expected);
    expect(nodeInspect(value, { breakLength })).toMatch(expected);
  }
}

function expectInspectFail(
  value: any,
  expected: string | RegExp,
  expectedNodeInspect: string | RegExp
) {
  if (typeof expected === 'string') {
    expect(inspect(value)).toEqual(expected);
  } else {
    expect(inspect(value)).toMatch(expected);
  }

  if (typeof expectedNodeInspect === 'string') {
    expect(nodeInspect(value, { breakLength })).toEqual(expectedNodeInspect);
  } else {
    expect(nodeInspect(value, { breakLength })).toMatch(expectedNodeInspect);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values
test('Primitive values', () => {
  // Boolean
  expectInspect(true, 'true');
  expectInspect(false, 'false');

  // Null & Undefined
  expectInspect(null, 'null');
  expectInspect(undefined, 'undefined');

  // Number
  expectInspect(10, '10');
  expectInspect(10.11, '10.11');
  expectInspect(Number.POSITIVE_INFINITY, 'Infinity');
  expectInspect(Number.NEGATIVE_INFINITY, '-Infinity');
  expectInspect(Number.NaN, 'NaN');
  expectInspect(Number.MIN_VALUE, '5e-324');
  expectInspect(Number.MAX_VALUE, '1.7976931348623157e+308');

  // BigInt
  expectInspect(10n, '10n');

  // String
  expectInspect('test 😀', "'test 😀'");

  // Symbol
  expectInspect(Symbol('test'), 'Symbol(test)');
});

// https://developer.mozilla.org/en-US/docs/Glossary/Primitive#primitive_wrapper_objects_in_javascript
test('Primitive wrapper objects ("boxed")', () => {
  {
    const i = new String('test 😀');
    expectInspect(i, "[String: 'test 😀']");
    // @ts-ignore
    i.extra = true;
    expectInspect(i, "[String: 'test 😀'] { extra: true }");
  }

  {
    const i = new Number(10);
    expectInspect(i, '[Number: 10]');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '[Number: 10] { extra: true }');
  }

  {
    const i = new Boolean(true);
    expectInspect(i, '[Boolean: true]');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '[Boolean: true] { extra: true }');
  }

  {
    const i = new Boolean(false);
    expectInspect(i, '[Boolean: false]');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '[Boolean: false] { extra: true }');
  }

  expectInspect(Boolean(0), 'false');
  expectInspect(Boolean(1), 'true');
  expectInspect(Boolean('0'), 'true');
  expectInspect(Boolean('1'), 'true');
  expectInspect(Boolean({ foo: 'bar' }), 'true');
  expectInspect(Boolean([1, 2, 3]), 'true');

  {
    const i = Object(Symbol('test'));
    expectInspect(i, '[Symbol: Symbol(test)]');
    i.extra = true;
    expectInspect(i, '[Symbol: Symbol(test)] { extra: true }');

    expectInspect(new Object(Symbol('test')), '[Symbol: Symbol(test)]');
  }

  expectInspect(BigInt(10), '10n');

  {
    const i = Object(BigInt(55));
    expectInspect(i, '[BigInt: 55n]');
    i.extra = true;
    expectInspect(i, '[BigInt: 55n] { extra: true }');

    expectInspect(new Object(BigInt(55)), '[BigInt: 55n]');
  }
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects
test('Object', () => {
  expectInspect({}, '{}');

  expectInspect(
    {
      key1: 'string',
      'key 2': 10,
      [Symbol('key3')]: {
        key31: 'string',
        'key 32': 10,
        [Symbol('key33')]: Symbol('symbol')
      },
      key4() {
        return 'function';
      },
      key5: undefined,
      key6: null
    },
    "{ key1: 'string', 'key 2': 10, key4: [Function: key4], key5: undefined, key6: null, [Symbol(key3)]: { key31: 'string', 'key 32': 10, [Symbol(key33)]: Symbol(symbol) } }"
  );

  {
    const i = new Object();
    expectInspect(i, '{}');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '{ extra: true }');
  }

  expectInspect(new Object(undefined), '{}');

  expectInspect(new Object(null), '{}');

  expectInspect(new Object(true), '[Boolean: true]');

  expectInspect(Object.create({ foo: 'bar' }), '{}');

  expectInspectFail(Object.create([1, 2, 3]), 'Array(3)', 'Array {}');

  {
    const i = Object.create(null);
    expectInspectFail(i, '[Object: null prototype]', '[Object: null prototype] {}');
    i.extra = true;
    expectInspect(i, '[Object: null prototype] { extra: true }');
  }
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dates
test('Date', () => {
  const i = new Date('Thu Feb 10 2022 20:32:22 GMT+0100 (Central European Standard Time)');
  expectInspect(i, '2022-02-10T19:32:22.000Z');
  // @ts-ignore
  i.extra = true;
  expectInspect(i, '2022-02-10T19:32:22.000Z { extra: true }');

  expectInspect(new Date(''), new Date('').toString());
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#indexed_collections_arrays_and_typed_arrays
test('Array & TypedArray', () => {
  {
    const i: any[] = [];
    expectInspect(i, '[]');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '[ extra: true ]');
  }

  {
    const i = [
      'string',
      10,
      {
        key31: 'string',
        'key 32': 10,
        [Symbol('key33')]: Symbol('symbol')
      },
      () => 'function',
      undefined,
      null
    ];

    expectInspect(
      i,
      "[ 'string', 10, { key31: 'string', 'key 32': 10, [Symbol(key33)]: Symbol(symbol) }, [Function (anonymous)], undefined, null ]"
    );
    // @ts-ignore
    i.extra = true;
    expectInspect(
      i,
      "[ 'string', 10, { key31: 'string', 'key 32': 10, [Symbol(key33)]: Symbol(symbol) }, [Function (anonymous)], undefined, null, extra: true ]"
    );
  }

  (
    [
      [Int8Array, [10, 11], 'Int8Array(2) [ 10, 11 ]'],
      [Uint8Array, [10, 11], 'Uint8Array(2) [ 10, 11 ]'],
      [Uint8ClampedArray, [10, 11], 'Uint8ClampedArray(2) [ 10, 11 ]'],
      [Int16Array, [10, 11], 'Int16Array(2) [ 10, 11 ]'],
      [Uint16Array, [10, 11], 'Uint16Array(2) [ 10, 11 ]'],
      [Int32Array, [10, 11], 'Int32Array(2) [ 10, 11 ]'],
      [Uint32Array, [10, 11], 'Uint32Array(2) [ 10, 11 ]'],
      [Float32Array, [10, 11], 'Float32Array(2) [ 10, 11 ]'],
      [Float64Array, [10, 11], 'Float64Array(2) [ 10, 11 ]'],
      [BigInt64Array, [10n, 11n], 'BigInt64Array(2) [ 10n, 11n ]'],
      [BigUint64Array, [10n, 11n], 'BigUint64Array(2) [ 10n, 11n ]']
    ] as const
  ).forEach(line => {
    const [Type, args, expected] = line;
    // @ts-ignore
    const i = new Type(args);
    expectInspect(i, expected);

    // @ts-ignore
    i.extra = true;
    expectInspect(i, expected.replace(' ]', ', extra: true ]'));
  });
});

test('ArrayBuffer & DataView', () => {
  const ab = new Uint8Array([1, 2, 3, 4]).buffer;
  const dv = new DataView(ab, 1, 2);

  expectInspectFail(
    ab,
    'ArrayBuffer',
    'ArrayBuffer { [Uint8Contents]: <01 02 03 04>, byteLength: 4 }'
  );

  expectInspectFail(
    dv,
    'DataView',
    'DataView { byteLength: 2, byteOffset: 1, buffer: ArrayBuffer { [Uint8Contents]: <01 02 03 04>, byteLength: 4 } }'
  );

  // @ts-ignore
  ab.x = 42;
  // @ts-ignore
  dv.y = 1337;

  expectInspectFail(
    ab,
    'ArrayBuffer { x: 42 }',
    'ArrayBuffer { [Uint8Contents]: <01 02 03 04>, byteLength: 4, x: 42 }'
  );

  expectInspectFail(
    dv,
    'DataView { y: 1337 }',
    'DataView { byteLength: 2, byteOffset: 1, buffer: ArrayBuffer { [Uint8Contents]: <01 02 03 04>, byteLength: 4, x: 42 }, y: 1337 }'
  );
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#keyed_collections_maps_sets_weakmaps_weaksets
test('Map, Set, WeakMap, WeakSet', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/Map#creating_a_new_map
  {
    const i = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three']
    ]);
    expectInspect(i, "Map(3) { 1 => 'one', 2 => 'two', 3 => 'three' }");

    // @ts-ignore
    i.extra = true;
    expectInspect(i, "Map(3) { 1 => 'one', 2 => 'two', 3 => 'three', extra: true }");
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set
  {
    const i = new Set([1, 'two', 3]);
    expectInspect(i, "Set(3) { 1, 'two', 3 }");

    // @ts-ignore
    i.extra = true;
    expectInspect(i, "Set(3) { 1, 'two', 3, extra: true }");
  }

  {
    const obj = {};
    const arr = ['foo'];
    const i = new WeakMap([
      [obj, arr],
      [arr, obj]
    ]);
    expectInspect(i, 'WeakMap { <items unknown> }');

    // @ts-ignore
    i.extra = true;
    expectInspect(i, 'WeakMap { <items unknown>, extra: true }');
  }

  {
    const obj = {};
    const arr = ['foo'];
    const i = new WeakSet([obj, arr]);
    expectInspect(i, 'WeakSet { <items unknown> }');

    // @ts-ignore
    i.extra = true;
    expectInspect(i, 'WeakSet { <items unknown>, extra: true }');
  }
});

test('Iterator', () => {
  expectInspectFail(['foo', 'bar'].keys(), '{}', 'Object [Array Iterator] {}');
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#more_objects_in_the_standard_library
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

test('Function', () => {
  {
    expectInspect(new Function('a', 'b', 'return a + b'), '[Function: anonymous]');

    expectInspect(function (a: number, b: number) {
      return a + b;
    }, '[Function (anonymous)]');

    expectInspect(function add(a: number, b: number) {
      return a + b;
    }, '[Function: add]');

    expectInspect((a: number, b: number) => a + b, '[Function (anonymous)]');

    const add = (a: number, b: number) => a + b;
    expectInspect(add, '[Function: add]');
  }

  {
    function add(a: number, b: number) {
      return a + b;
    }
    Object.setPrototypeOf(add, null);
    expectInspectFail(add, '[Unknown: add]', '[Function (null prototype): add]');
  }

  {
    function add(a: number, b: number) {
      return a + b;
    }
    expectInspect(add, '[Function: add]');
    add.extra = true;
    expectInspect(add, '[Function: add] { extra: true }');
  }
});

test('Getter & setter', () => {
  const obj = {
    foo: 'bar',

    get getter() {
      return 'getter';
    },
    set setter(foo: string) {
      this.foo = foo;
    },

    get getter_setter() {
      return 'getter_setter';
    },
    set getter_setter(foo: string) {
      this.foo = foo;
    }
  };

  expectInspect(
    obj,
    "{ foo: 'bar', getter: [Getter], setter: [Setter], getter_setter: [Getter/Setter] }"
  );
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
test('Error', () => {
  expectInspect(new Error(), /^Error: \n    at .*\)$/s);

  expectInspect(new Error('Whoops!'), /^Error: Whoops!\n    at .*\)$/s);

  {
    const i = new RangeError('The argument must be between -500 and 500');
    expectInspect(i, /^RangeError: The argument must be between -500 and 500\n    at .*\)$/s);
    // @ts-ignore
    i.extra = true;
    expectInspectFail(
      i,
      /^RangeError: The argument must be between -500 and 500\n    at .*\) { extra: true }$/s,
      /^RangeError: The argument must be between -500 and 500\n    at .*\) {\n  extra: true\n}$/s
    );
  }

  {
    class CustomError extends Error {
      foo: string;

      constructor(foo = 'bar', ...params: any[]) {
        super(...params);
        this.name = 'CustomError';
        this.foo = foo;
      }
    }

    expectInspectFail(
      new CustomError('baz', 'bazMessage'),
      /^CustomError: bazMessage\n    at .*\) { name: 'CustomError', foo: 'baz' }$/s,
      /^CustomError: bazMessage\n    at .*\) {\n  foo: 'baz'\n}/s
    );
  }

  {
    const i = new Error();
    delete i.stack;
    expectInspect(i, '[Error]');
  }
});

test('RegExp', () => {
  {
    const i = /ab+c/i;
    expectInspect(i, '/ab+c/i');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '/ab+c/i { extra: true }');
  }

  {
    // eslint-disable-next-line prefer-regex-literals
    const i = new RegExp('ab+c', 'i');
    expectInspect(i, '/ab+c/i');
    // @ts-ignore
    i.extra = true;
    expectInspect(i, '/ab+c/i { extra: true }');
  }
});

test('Promise', () => {
  expectInspectFail(Promise.resolve('resolved'), 'Promise', "Promise { 'resolved' }");

  const rejected = Promise.reject(new Error('rejected'));
  rejected.catch(() => {});
  expectInspectFail(rejected, 'Promise', /^Promise {.*<rejected> Error: rejected.*}$/s);
});

test('Generator & GeneratorFunction', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator#constructor
  expectInspect(function* generator() {
    yield 1;
    yield 2;
    yield 3;
  }, '[GeneratorFunction: generator]');

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
  const GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
  const g = new GeneratorFunction('a', 'yield a * 2');
  const iterator = g(10);

  expectInspect(GeneratorFunction, '[Function: GeneratorFunction]');
  expectInspect(g, '[GeneratorFunction: anonymous]');
  expectInspectFail(iterator, '{}', 'Object [Generator] {}');
});

test('Async function & AsyncFunction', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

  function resolveAfter(ms: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, ms);
    });
  }

  async function asyncCall() {
    await resolveAfter(0);
  }

  expectInspect(resolveAfter, '[Function: resolveAfter]');
  expectInspect(asyncCall, '[AsyncFunction: asyncCall]');
  expectInspectFail(asyncCall(), 'Promise', 'Promise { <pending> }');

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const a = new AsyncFunction('ms', 'return await resolveAfter(ms)');

  expectInspect(AsyncFunction, '[Function: AsyncFunction]');
  expectInspect(a, '[AsyncFunction: anonymous]');
  // Calling a(0) won't work: https://github.com/nodejs/node/issues/9474
});

test('Reflect', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
  function func1(a: number, b: number, c: number) {
    // @ts-ignore
    this.sum = a + b + c;
  }
  const args = [1, 2, 3];
  // @ts-ignore
  expectInspect(new func1(...args), 'func1 { sum: 6 }');
  expectInspect(Reflect.construct(func1, args), 'func1 { sum: 6 }');
});

test('Proxy', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#basic_example

  const handler = {
    // @ts-ignore
    get(obj, prop) {
      return prop in obj ? obj[prop] : 37;
    }
  };

  const p = new Proxy({}, handler);
  // @ts-ignore
  p.a = 1;
  // @ts-ignore
  p.b = undefined;

  expectInspect(handler, '{ get: [Function: get] }');
  expectInspect(p, '{ a: 1, b: undefined }');
});

test('Class', () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#prototype_methods
  {
    class Rectangle {
      height: number;
      width: number;

      constructor(height: number, width: number) {
        this.height = height;
        this.width = width;
      }

      get area() {
        return this.calcArea();
      }

      calcArea() {
        return this.height * this.width;
      }
    }

    expectInspectFail(Rectangle, '[Function: Rectangle]', '[class Rectangle]');
    expectInspect(new Rectangle(10, 10), 'Rectangle { height: 10, width: 10 }');
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#generator_methods
  {
    class Polygon {
      sides: number[];

      constructor(...sides: number[]) {
        this.sides = sides;
      }

      *getSides() {
        for (const side of this.sides) {
          yield side;
        }
      }
    }

    expectInspectFail(Polygon, '[Function: Polygon]', '[class Polygon]');

    const pentagon = new Polygon(1, 2, 3, 4, 5);
    expectInspect(pentagon, 'Polygon { sides: [ 1, 2, 3, 4, 5 ] }');
    expectInspectFail(pentagon.getSides(), '{}', 'Object [Generator] {}');
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#static_methods_and_properties
  {
    class Point {
      x: number;
      y: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
      }

      static displayName = 'Point';
      static distance(a: Point, b: Point) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
      }
    }

    expectInspectFail(
      Point,
      "[Function: Point] { displayName: 'Point' }",
      "[class Point] { displayName: 'Point' }"
    );
    expectInspect(new Point(5, 5), 'Point { x: 5, y: 5 }');
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#binding_this_with_prototype_and_static_methods
  {
    function Animal() {}

    Animal.prototype.speak = function () {
      return this;
    };

    Animal.eat = function () {
      return this;
    };

    expectInspect(Animal, '[Function: Animal] { eat: [Function (anonymous)] }');
    // @ts-ignore
    expectInspectFail(new Animal(), 'Animal', 'Animal {}');
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#sub_classing_with_extends
  {
    class Animal {
      name: string;

      constructor(name: string) {
        this.name = name;
      }

      speak() {
        console.log(`${this.name} makes a noise.`);
      }
    }

    class Dog extends Animal {
      constructor(name: string) {
        super(name);
      }

      speak() {
        console.log(`${this.name} barks.`);
      }
    }

    expectInspectFail(Dog, '[Function: Dog]', '[class Dog extends Animal]');
    expectInspect(new Dog('Mitzie'), "Dog { name: 'Mitzie' }");
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#species
  {
    class MyArray extends Array {}

    expectInspectFail(MyArray, '[Function: MyArray]', '[class MyArray extends Array]');
    // @ts-ignore
    expectInspect(new MyArray(1, 2, 3), 'MyArray(3) [ 1, 2, 3 ]');
  }
});

test('Circular', () => {
  const obj = { 1: 'a', 2: 'b', 3: 'c' };
  // @ts-ignore
  obj.obj = obj;
  expectInspectFail(
    obj,
    "{ '1': 'a', '2': 'b', '3': 'c', obj: [Circular] }",
    "<ref *1> { '1': 'a', '2': 'b', '3': 'c', obj: [Circular *1] }"
  );

  const arr = [1, obj, 3];
  expectInspectFail(
    arr,
    '[ 1, [Circular], 3 ]',
    "[ 1, <ref *1> { '1': 'a', '2': 'b', '3': 'c', obj: [Circular *1] }, 3 ]"
  );

  {
    const set = new Set([1, obj, 3]);
    expectInspectFail(
      set,
      'Set(3) { 1, [Circular], 3 }',
      "Set(3) { 1, <ref *1> { '1': 'a', '2': 'b', '3': 'c', obj: [Circular *1] }, 3 }"
    );
  }

  {
    const set = new Set();
    set.add(set);
    expectInspectFail(set, 'Set(1) { [Circular] }', '<ref *1> Set(1) { [Circular *1] }');
  }

  {
    // @ts-ignore
    const map = new Map([
      [1, 'one'],
      [2, obj],
      [3, 'three']
    ]);
    expectInspectFail(
      map,
      "Map(3) { 1 => 'one', [Circular], 3 => 'three' }",
      "Map(3) { 1 => 'one', 2 => <ref *1> { '1': 'a', '2': 'b', '3': 'c', obj: [Circular *1] }, 3 => 'three' }"
    );
  }

  {
    const map = new Map();
    map.set(map, 'map');
    expectInspectFail(map, 'Map(1) { [Circular] }', "<ref *1> Map(1) { [Circular *1] => 'map' }");
  }

  {
    const obj2 = {};
    // @ts-ignore
    obj2.obj2 = [obj2];
    expectInspectFail(obj2, '{ obj2: [Circular] }', '<ref *1> { obj2: [ [Circular *1] ] }');
  }
});

// Taken and adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#examples
test('JSON.stringify() examples from MDN', () => {
  expectInspect({}, '{}');
  expectInspect(true, 'true');
  expectInspect('foo', "'foo'");
  expectInspect([1, 'false', false], "[ 1, 'false', false ]");
  expectInspect([NaN, null, Infinity], '[ NaN, null, Infinity ]');
  expectInspect({ x: 5 }, '{ x: 5 }');

  expectInspect(new Date(2006, 0, 2, 15, 4, 5), '2006-01-02T14:04:05.000Z');

  expectInspect({ x: 5, y: 6 }, '{ x: 5, y: 6 }');

  expectInspect(
    [new Number(3), new String('false'), new Boolean(false)],
    "[ [Number: 3], [String: 'false'], [Boolean: false] ]"
  );

  const a = ['foo', 'bar'];
  // @ts-ignore
  a.baz = 'quux';
  expectInspect(a, "[ 'foo', 'bar', baz: 'quux' ]");

  expectInspect(
    { x: [10, undefined, function () {}, Symbol('')] },
    '{ x: [ 10, undefined, [Function (anonymous)], Symbol() ] }'
  );

  // Standard data structures
  expectInspect(
    [new Set([1]), new Map([[1, 2]]), new WeakSet([{ a: 1 }]), new WeakMap([[{ a: 1 }, 2]])],
    '[ Set(1) { 1 }, Map(1) { 1 => 2 }, WeakSet { <items unknown> }, WeakMap { <items unknown> } ]'
  );

  // TypedArray
  expectInspect(
    [new Int8Array([1]), new Int16Array([1]), new Int32Array([1])],
    '[ Int8Array(1) [ 1 ], Int16Array(1) [ 1 ], Int32Array(1) [ 1 ] ]'
  );
  expectInspect(
    [new Uint8Array([1]), new Uint8ClampedArray([1]), new Uint16Array([1]), new Uint32Array([1])],
    '[ Uint8Array(1) [ 1 ], Uint8ClampedArray(1) [ 1 ], Uint16Array(1) [ 1 ], Uint32Array(1) [ 1 ] ]'
  );
  expectInspect(
    [new Float32Array([1]), new Float64Array([1])],
    '[ Float32Array(1) [ 1 ], Float64Array(1) [ 1 ] ]'
  );

  // toJSON()
  expectInspect(
    {
      x: 5,
      y: 6,
      toJSON() {
        return this.x + this.y;
      }
    },
    '{ x: 5, y: 6, toJSON: [Function: toJSON] }'
  );

  // Symbols
  expectInspect(
    { x: undefined, y: Object, z: Symbol('') },
    '{ x: undefined, y: [Function: Object], z: Symbol() }'
  );
  expectInspect({ [Symbol('foo')]: 'foo' }, "{ [Symbol(foo)]: 'foo' }");
  expectInspect(
    [{ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]],
    "[ { [Symbol(foo)]: 'foo' }, [ Symbol(foo) ] ]"
  );

  // Non-enumerable properties
  expectInspect(
    Object.create(null, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true }
    }),
    "[Object: null prototype] { y: 'y' }"
  );

  // BigInt
  expectInspect({ x: 2n }, '{ x: 2n }');
});

jest.doMock('../common', noop, { virtual: true });
jest.doMock('util', () => {
  return { ...jest.requireActual('node:util'), inspect };
});

function getNodeMajorVersion() {
  const match = process.version.match(/^v(\d{1,2})\..*$/);
  assert(match !== null);
  return parseInt(match[1], 10);
}

// https://github.com/nodejs/node/blob/v17.4.0/test/parallel/test-util-inspect.js
test('test-util-inspect.js', async () => {
  if (getNodeMajorVersion() >= 16) {
    // @ts-ignore
    await import('./test-util-inspect');
  }
});
