import { render } from '@testing-library/react';

test('Unsupported style property', () => {
  // @ts-ignore
  expect(() => render(<div style={{ 'background-color': 'black' }} />)).toThrow(
    'throw-on console.error: Warning: Unsupported style property background-color. Did you mean backgroundColor?'
  );

  // React does not display this warning message if it has already been displayed
  // Subsequent calls after a throw won't throw because of
  // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/warnValidStyle.js#L35
  // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L29-L31
  // @ts-ignore
  expect(() => render(<div style={{ 'background-color': 'black' }} />)).not.toThrow();
});
