/**
 * Like [console string substitutions](https://developer.mozilla.org/en-US/docs/Web/API/console#outputting_text_to_the_console)
 * and [Node.js util.format()](https://nodejs.org/docs/latest-v16.x/api/util.html#utilformatformat-args).
 *
 * - %s: String will be used.
 * - %d: Number will be used.
 * - %i: parseInt(value, 10) is used.
 * - %f: parseFloat(value) is used.
 * - %j: JSON. **Unsupported**.
 * - %o: Object. **Unsupported**.
 * - %O: Object. **Unsupported**.
 * - %c: CSS. This specifier is ignored and will skip any CSS passed in.
 * - %%: single percent sign ('%'). This does not consume an argument.
 */
export function format(str?: any, ...values: any[]) {
  if (str === undefined) return '';

  let o = str;
  let nbSpecifiers = 0;

  values.forEach(value => {
    if (o.includes('%s')) {
      o = o.replace('%s', String(value));
      nbSpecifiers++;
    } else if (o.includes('%d')) {
      o = o.replace('%d', Number(value).toString());
      nbSpecifiers++;
    } else if (o.includes('%i')) {
      o = o.replace('%i', Number.parseInt(value, 10).toString());
      nbSpecifiers++;
    } else if (o.includes('%f')) {
      o = o.replace('%f', Number.parseFloat(value).toString());
      nbSpecifiers++;
    } else if (o.includes('%c')) {
      o = o.replace('%c', '');
      nbSpecifiers++;
    }
  });

  // > If there are more arguments passed to the util.format() method than the number of specifiers,
  // > the extra arguments are concatenated to the returned string, separated by spaces
  for (let i = nbSpecifiers; i < values.length; i++) {
    o += ` ${values[i]}`;
  }

  return o;
}
