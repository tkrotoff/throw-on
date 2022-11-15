/* eslint-disable react/no-unknown-property */

import { render } from '@testing-library/react';

test('React does not recognize the prop on a DOM element', () => {
  // @ts-ignore
  expect(() => render(<div unknownProp="value" />)).toThrow(
    'throw-on console.error: Warning: React does not recognize the `unknownProp` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `unknownprop` instead. If you accidentally passed it from a parent component, remove it from the DOM element.'
  );

  // @ts-ignore
  expect(() => render(<div unknownProp="value" />)).toThrow(
    'throw-on console.error: Warning: React does not recognize the `unknownProp` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `unknownprop` instead. If you accidentally passed it from a parent component, remove it from the DOM element.'
  );
});
