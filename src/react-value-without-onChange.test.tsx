import { render } from '@testing-library/react';

test('You provided a `value` prop to a form field without an `onChange` handler', () => {
  expect(() => render(<input value="John" />)).toThrow(
    'throw-on console.error: Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
  );

  expect(() => render(<input value="John" />)).toThrow(
    'throw-on console.error: Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
  );
});
