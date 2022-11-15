import { render } from '@testing-library/react';
import assert from 'node:assert';
import { Component } from 'react';

import { restoreConsole, throwOnConsole, ThrowOnError } from './throwOnConsole';

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('throw + restore console method', () => {
  const consoleMethodNames = ['assert', 'error', 'warn', 'info', 'log', 'dir', 'debug'] as const;

  consoleMethodNames.forEach(methodName => {
    restoreConsole(methodName);

    const original = console[methodName];
    expect(original).toEqual(console[methodName]);

    throwOnConsole(methodName);
    expect(original).not.toEqual(console[methodName]);

    restoreConsole(methodName);
    expect(original).toEqual(console[methodName]);
  });
});

describe('throwOnConsole()', () => {
  const consoleMethodNames = ['error', 'warn', 'info', 'log', 'dir', 'debug'] as const;

  consoleMethodNames.forEach(methodName => {
    test(`console.${methodName} - throw`, () => {
      throwOnConsole(methodName);

      expect(() => console[methodName]('message')).toThrow(
        `throw-on console.${methodName}: message`
      );

      restoreConsole(methodName);
    });

    test(`console.${methodName} - throw without stack trace`, () => {
      expect.assertions(1);

      throwOnConsole(methodName);

      try {
        console[methodName]('message');
      } catch (e) {
        assert(e instanceof ThrowOnError);
        expect(e.stack).toBeUndefined();
      }

      restoreConsole(methodName);
    });

    test(`console.${methodName} - ignore option`, () => {
      throwOnConsole(methodName, { ignore: ['message'] });
      expect(() => console[methodName]('message')).not.toThrow();
      restoreConsole(methodName);

      throwOnConsole(methodName, { ignore: [] });
      expect(() => console[methodName]('message')).toThrow(
        `throw-on console.${methodName}: message`
      );
      restoreConsole(methodName);
    });
  });
});

describe('console.assert', () => {
  // See console-assert.test.ts
});

describe('console.error', () => {
  beforeAll(() => {
    throwOnConsole('error');
  });

  afterAll(() => {
    restoreConsole('error');
  });

  test('ignore option - value prop without onChange', () => {
    expect(() => render(<input value="John" />)).toThrow(
      'throw-on console.error: Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
    );

    // substring
    throwOnConsole('error', {
      ignore: ['You provided a `value` prop to a form field without an `onChange` handler']
    });
    expect(() => render(<input value="John" />)).not.toThrow();
    restoreConsole('error');

    // regex
    throwOnConsole('error', {
      ignore: [
        /^Warning: You provided a `value` prop to a form field without an `onChange` handler/
      ]
    });
    expect(() => render(<input value="John" />)).not.toThrow();
    restoreConsole('error');
  });
});

describe('console.warn', () => {
  beforeAll(() => {
    throwOnConsole('warn');
  });

  afterAll(() => {
    restoreConsole('warn');
  });

  test('ignore option - componentWillReceiveProps', () => {
    class MyComponent extends Component {
      // eslint-disable-next-line react/no-deprecated, @typescript-eslint/no-empty-function
      componentWillReceiveProps() {}

      render() {
        return <DivComponent />;
      }
    }

    throwOnConsole('warn', { ignore: ['componentWillReceiveProps has been renamed'] });
    expect(() => render(<MyComponent />)).not.toThrow();
    restoreConsole('warn');

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactStrictModeWarnings.old.js#L68-L70
    expect(() => render(<MyComponent />)).not.toThrow();
  });
});
