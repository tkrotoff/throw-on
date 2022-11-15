/* eslint-disable react/no-unknown-property */

import { render } from '@testing-library/react';

test('Invalid DOM property', () => {
  // @ts-ignore
  expect(() => render(<div class="invalid" />)).toThrow(
    'throw-on console.error: Warning: Invalid DOM property `class`. Did you mean `className`?'
  );

  // @ts-ignore
  expect(() => render(<div class="invalid" />)).toThrow(
    'throw-on console.error: Warning: Invalid DOM property `class`. Did you mean `className`?'
  );
});
