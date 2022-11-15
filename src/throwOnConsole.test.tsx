/* eslint-disable react/no-unknown-property, react/no-deprecated, @typescript-eslint/no-empty-function */

import { render, renderHook } from '@testing-library/react';
import assert from 'node:assert';
import { Component, createContext, useContext, useState } from 'react';

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

  test('An update inside a test was not wrapped in act(...)', () => {
    function useCounter() {
      const [count, setCount] = useState(0);

      function increment() {
        setCount(count + 1);
      }

      return { count, increment };
    }

    const { result } = renderHook(() => useCounter());
    const { increment } = result.current;

    expect(() => increment()).toThrow(
      'Warning: An update to TestComponent inside a test was not wrapped in act(...).'
    );
  });

  test('Each child in a list should have a unique "key" prop.', () => {
    expect(() =>
      render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)
    ).toThrow(
      'throw-on console.error: Warning: Each child in a list should have a unique "key" prop.'
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react/src/jsx/ReactJSXElementValidator.js#L142-L144
    expect(() =>
      render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)
    ).not.toThrow();
  });

  test('Encountered two children with the same key', () => {
    expect(() =>
      render(<DivComponent>{[<DivComponent key="0" />, <DivComponent key="0" />]}</DivComponent>)
    ).toThrow(
      'throw-on console.error: Warning: Encountered two children with the same key, `0`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.'
    );
  });

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

  test('Cannot update a component while rendering a different component', () => {
    function Child({ setState }: { setState: (newState: string) => void }) {
      setState('Update state');
      return <div />;
    }

    function Parent() {
      const [, setState] = useState('Initial state');
      return <Child setState={setState} />;
    }

    expect(() => render(<Parent />)).toThrow(
      'throw-on console.error: Warning: Cannot update a component (`Parent`) while rendering a different component (`Child`). To locate the bad setState() call inside `Child`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render'
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L3210-L3211
    expect(() => render(<Parent />)).not.toThrow();
  });

  test('React has detected a change in the order of Hooks', () => {
    const Context = createContext('context');

    const hook = {
      useContext: () => useContext(Context)
    };

    function MyComponent() {
      hook.useContext();
      useState('Initial state');
      return <DivComponent />;
    }

    // mockReturnValueOnce() is very important here
    // https://stackoverflow.com/a/68376129
    jest.spyOn(hook, 'useContext').mockReturnValueOnce('context');

    const { rerender } = render(<MyComponent />);

    expect(() => rerender(<MyComponent />)).toThrow(
      'throw-on console.error: Warning: React has detected a change in the order of Hooks called by MyComponent. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks'
    );
  });

  test('You provided a `value` prop to a form field without an `onChange` handler', () => {
    expect(() => render(<input value="John" />)).toThrow(
      'throw-on console.error: Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
    );

    // React always displays this warning message even if already displayed
    expect(() => render(<input value="John" />)).toThrow(
      'throw-on console.error: Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
    );
  });

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

  test('ignore option', () => {
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

  test('componentWillMount has been renamed, and is not recommended for use', () => {
    class MyComponent extends Component {
      componentWillMount() {}

      render() {
        return <DivComponent />;
      }
    }

    expect(() => render(<MyComponent />)).toThrow(
      'throw-on console.warn: Warning: componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.'
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactStrictModeWarnings.old.js#L68-L70
    expect(() => render(<MyComponent />)).not.toThrow();
  });

  test('componentWillUpdate has been renamed, and is not recommended for use', () => {
    class MyComponent extends Component {
      componentWillUpdate() {}

      render() {
        return <DivComponent />;
      }
    }

    expect(() => render(<MyComponent />)).toThrow(
      'throw-on console.warn: Warning: componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.'
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactStrictModeWarnings.old.js#L68-L70
    expect(() => render(<MyComponent />)).not.toThrow();
  });

  test('ignore option', () => {
    class MyComponent extends Component {
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
