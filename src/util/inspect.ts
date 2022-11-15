// Taken and adapted from https://github.com/douglascrockford/JSON-js/blob/8e8b0407e475e35942f7e9461dab81929fcc7321/json2.js

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

function isTypedArray(object: any): object is TypedArray {
  // https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView
  // https://stackoverflow.com/a/29651223
  return ArrayBuffer.isView(object) && !(object instanceof DataView);
}

function quote(string: string) {
  return `'${string}'`;
}

const fakeRootKey = '__FAKE_ROOT_KEY__';

function strValue(value: any, recurseTimes: number) {
  // Make a fake root object containing our value under the key of fakeRootKey
  // Return the result of stringifying the value
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return str(fakeRootKey, { [fakeRootKey]: value }, recurseTimes);
}

type Key = string | symbol;

function strKey(key: Key, recurseTimes: number) {
  switch (typeof key) {
    case 'string': {
      // Because Object.keys() return (string | symbol)[] thus
      // const arr = []; arr[10] = 11;
      // returns 10 as a string instead of number
      // https://stackoverflow.com/q/175739
      if ((!Number.isNaN(key) && !Number.isNaN(Number.parseFloat(key))) || key === '') {
        return strValue(key, recurseTimes);
      }
      return key.includes(' ') ? strValue(key, recurseTimes) : key;
    }

    case 'symbol': {
      return `[${strValue(key, recurseTimes)}]`;
    }

    // istanbul ignore next
    default: {
      throw new Error(`Unknown type of key '${typeof key}'`);
    }
  }
}

function getName(object: any) {
  let name = '';

  if (object.constructor === undefined) {
    name = '[Object: null prototype]';
  } else if (object.constructor.name && object.constructor.name !== 'Object') {
    name =
      object instanceof String
        ? object.constructor.name
        : `${object.constructor.name}${
            (object.length !== undefined ? `(${object.length})` : '') ||
            (object.size !== undefined ? `(${object.size})` : '')
          }`;
  }

  return name;
}

function loopArray(array: any[] | TypedArray, recurseTimes: number) {
  const items: string[] = [];

  for (let i = 0; i < array.length; i++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      items.push(str(i, array, recurseTimes));
    } catch (e) {
      if (e instanceof RangeError && recurseTimes === 1) {
        items.push('[Circular]');
      } else {
        throw e;
      }
    }
  }

  return items;
}

function loopObject(keys: Key[], object: object, recurseTimes: number) {
  const items: string[] = [];

  for (const k of keys) {
    const key = strKey(k, recurseTimes);

    try {
      const desc = Object.getOwnPropertyDescriptor(object, k)!;
      if (desc.get && desc.set) {
        items.push(`${key}: [Getter/Setter]`);
      } else if (desc.get) {
        items.push(`${key}: [Getter]`);
      } else if (desc.set) {
        items.push(`${key}: [Setter]`);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        items.push(`${key}: ${str(k, object, recurseTimes)}`);
      }
    } catch (e) {
      if (e instanceof RangeError && recurseTimes === 1) {
        items.push(`${key}: [Circular]`);
      } else {
        throw e;
      }
    }
  }

  return items;
}

function loopSet(set: Set<any>, recurseTimes: number) {
  const items: string[] = [];

  for (const v of set) {
    try {
      items.push(`${strValue(v, recurseTimes)}`);
    } catch (e) {
      if (e instanceof RangeError && recurseTimes === 1) {
        items.push('[Circular]');
      } else {
        throw e;
      }
    }
  }

  return items;
}

function loopMap(map: Map<any, any>, recurseTimes: number) {
  const items: string[] = [];

  map.forEach((v, k) => {
    try {
      items.push(`${strValue(k, recurseTimes)} => ${strValue(v, recurseTimes)}`);
    } catch (e) {
      if (e instanceof RangeError && recurseTimes === 1) {
        items.push('[Circular]');
      } else {
        throw e;
      }
    }
  });

  return items;
}

// https://stackoverflow.com/q/31538010
// https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11743
function isObject(value: any) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

function str(key: string | number | symbol, holder: any, recurseTimes: number): string {
  recurseTimes++;

  const value = holder[key];

  const keys: (string | symbol)[] | undefined = value
    ? [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]
    : undefined;

  let showEmptyBraces = false;

  let res = '';

  switch (typeof value) {
    case 'string': {
      res = quote(value);
      break;
    }

    case 'undefined':
    case 'number':
    case 'boolean': {
      res = `${value}`;
      break;
    }

    case 'bigint': {
      res = `${value}n`;
      break;
    }

    case 'symbol': {
      res = value.toString();
      break;
    }

    case 'function': {
      //showEmptyBraces = true;
      res = `[${value.constructor !== undefined ? value.constructor.name : 'Unknown'}${
        value.name !== '' ? `: ${value.name}` : ' (anonymous)'
      }]`;
      break;
    }

    case 'object': {
      // typeof null is "object" :-/
      if (value === null) {
        res = 'null';
        break;
      }

      const name = getName(value);

      if (value instanceof String) {
        // For boxed Strings, we have to remove the 0-n indexed entries,
        // since they just noisy up the output and are redundant
        keys!.splice(0, value.length);

        res = `[${name}: ${quote(value.toString())}]`;
      } else if (value instanceof Number) {
        res = `[${name}: ${value}]`;
      } else if (value instanceof Boolean) {
        res = `[${name}: ${value}]`;
      } else if (value instanceof BigInt) {
        res = `[${name}: ${value}n]`;
      } else if (value instanceof Symbol) {
        res = `[${name}: ${value.toString()}]`;
      } else if (value instanceof Error) {
        res = value.stack ? `${value.stack}` : `[${value}]`;
      } else if (value instanceof RegExp) {
        try {
          res = `${value}`;
        } catch {
          // Keep going
        }
      } else if (value instanceof Date) {
        try {
          res = value.toISOString();
        } catch {
          try {
            res = value.toString();
          } catch {
            // Keep going
          }
        }
      } else if (Array.isArray(value) && name.startsWith('Array(')) {
        // No name
      } else {
        res = name;
      }

      break;
    }

    // istanbul ignore next
    default: {
      throw new Error(`Unknown type of value '${typeof value}'`);
    }
  }

  const partial: string[] = [];

  if (value instanceof Map) {
    showEmptyBraces = true;
    partial.push(...loopMap(value, recurseTimes));
  } else if (value instanceof Set) {
    showEmptyBraces = true;
    partial.push(...loopSet(value, recurseTimes));
  } else if (value instanceof WeakMap || value instanceof WeakSet) {
    partial.push('<items unknown>');
  }

  if (keys !== undefined) {
    if (Array.isArray(value) || isTypedArray(value)) {
      // Remove items processed by loopArray() so they are not also added by loopObject()
      keys.splice(0, value.length);

      partial.push(...loopArray(value, recurseTimes), ...loopObject(keys, value, recurseTimes));

      if (res.length > 0) res += ' ';
      res += partial.length === 0 ? '[]' : `[ ${partial.join(', ')} ]`;
    } else if (isObject(value)) {
      partial.push(...loopObject(keys, value, recurseTimes));

      if (partial.length === 0 && res.length > 0 && !showEmptyBraces) {
        // Do not display "{}"
      } else {
        if (res.length > 0) res += ' ';
        res += partial.length === 0 ? '{}' : `{ ${partial.join(', ')} }`;
      }
    }
  }

  return res;
}

/**
 * Simplified version of [Node.js util.inspect()](https://nodejs.org/docs/latest-v16.x/api/util.html#utilinspectobject-options).
 */
export function inspect(value: any) {
  return strValue(value, 0);
}
