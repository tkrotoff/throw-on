import { inspect } from './inspect';

/*
 * https://github.com/nodejs/node/blob/v17.4.0/lib/internal/util/inspect.js
 * https://github.com/hildjj/node-inspect-extracted
 * https://github.com/browserify/node-util
 * https://github.com/tmpfs/format-util
 * https://github.com/denoland/deno/blob/v1.18.1/ext/console/02_console.js#L1652
 * https://github.com/denoland/deno/blob/v1.18.1/ext/console/02_console.js#L2065
 */

/**
 * Simplified version of [Node.js util.format()](https://nodejs.org/docs/latest-v16.x/api/util.html#utilformatformat-args).
 */
export function format(str?: any, ...values: any[]) {
  if (typeof str !== 'string') {
    return (str === undefined ? values : [str, ...values])
      .map(value => (typeof value === 'string' ? value : inspect(value)))
      .join(' ');
  }

  if (values.length === 0) {
    return str;
  }

  let nbSpecifiers = 0;
  let o = str
    // eslint-disable-next-line unicorn/better-regex
    .replace(/%[%sdifjoOc]/g, match => {
      if (match === '%%') return '%';

      if (nbSpecifiers >= values.length) return match;

      const value = values[nbSpecifiers];

      switch (match) {
        case '%s': {
          nbSpecifiers++;
          switch (typeof value) {
            case 'bigint': {
              return `${value}n`;
            }
            case 'object': {
              return value !== null && typeof value.toString === 'function'
                ? value.toString()
                : inspect(value);
            }
            default: {
              return String(value);
            }
          }
        }

        case '%d': {
          nbSpecifiers++;
          switch (typeof value) {
            case 'bigint': {
              return `${value}n`;
            }
            default: {
              try {
                return Number(value).toString();
              } catch {
                return Number.NaN.toString();
              }
            }
          }
        }

        case '%i': {
          nbSpecifiers++;
          switch (typeof value) {
            case 'bigint': {
              return `${value}n`;
            }
            default: {
              try {
                return Number.parseInt(value, 10).toString();
              } catch {
                return Number.NaN.toString();
              }
            }
          }
        }

        case '%f': {
          nbSpecifiers++;
          try {
            return Number.parseFloat(value).toString();
          } catch {
            return Number.NaN.toString();
          }
        }

        case '%j': {
          nbSpecifiers++;
          try {
            return JSON.stringify(value);
          } catch (e) {
            if (e instanceof TypeError && e.message.includes('circular')) {
              return '[Circular]';
            }
            throw e;
          }
        }

        case '%o':
        case '%O': {
          nbSpecifiers++;
          return inspect(value);
        }

        case '%c': {
          nbSpecifiers++;
          return '';
        }

        // istanbul ignore next
        default: {
          throw new Error(`Unknown match '${match}'`);
        }
      }
    });

  // > If there are more arguments passed to the util.format() method than the number of specifiers,
  // > the extra arguments are concatenated to the returned string, separated by spaces
  while (nbSpecifiers < values.length) {
    const value = values[nbSpecifiers];
    o += ` ${typeof value === 'string' ? value : inspect(value)}`;
    nbSpecifiers++;
  }

  return o;
}
