/* eslint-disable react/no-unknown-property, react/no-deprecated, @typescript-eslint/no-empty-function */

import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import assert from 'node:assert';
import path from 'node:path';
import { Component, createContext, useContext, useState } from 'react';

import { restoreConsole, throwOnConsole } from './throwOnConsole';
import { wait } from './wait';

const zeroWidthSpace = '\u200B';
const space = ' ';

function space_at_Component_filename_lineNumber_space(
  componentName: string,
  filename = path.basename(__filename)
) {
  return `${zeroWidthSpace}    at ${componentName} \\(.*${filename}:\\d+:\\d+\\)${space}${zeroWidthSpace}`;
}

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

      expect(() => console[methodName]('message')).toThrow('message');

      restoreConsole(methodName);
    });

    test(`console.${methodName} - ignore option`, () => {
      throwOnConsole(methodName, { ignore: ['message'] });
      expect(() => console[methodName]('message')).not.toThrow();

      throwOnConsole(methodName, { ignore: [] });
      expect(() => console[methodName]('message')).toThrow('message');
    });

    test(`console.${methodName} - fullStackTrace option`, () => {
      // Check console.error test
    });
  });
});

describe('console.assert', () => {
  test('condition with message', () => {
    throwOnConsole('assert');

    expect(() => console.assert(true, 'assert message')).not.toThrow();
    expect(() => assert(true, 'assert message')).not.toThrow();

    expect(() => console.assert(false, 'assert message')).toThrow('assert message');
    expect(() => assert(false, 'assert message')).toThrow('assert message');

    restoreConsole('assert');
  });

  test('condition without message', () => {
    throwOnConsole('assert');

    expect(() => console.assert(true)).not.toThrow();
    expect(() => assert(true)).not.toThrow();

    // https://nodejs.org/docs/latest-v16.x/api/assert.html#assertokvalue-message

    expect(() => console.assert(1)).not.toThrow();
    expect(() => assert(1)).not.toThrow();

    expect(() => console.assert(typeof 123 === 'string')).toThrow('');
    expect(() => assert(typeof 123 === 'string')).toThrow('false == true');

    expect(() => console.assert(false)).toThrow('');
    // Wow that's messed up: the exception message matches a previous statement
    expect(() => assert(false)).toThrow(
      'The expression evaluated to a falsy value:\n\n  expect(() => assert(1)).not.toThrow()\n'
    );

    expect(() => console.assert(0)).toThrow('');
    // Wow that's messed up: the exception message matches a previous statement
    expect(() => assert(0)).toThrow(
      "The expression evaluated to a falsy value:\n\n  assert(typeof 123 === 'string')\n"
    );

    restoreConsole('assert');
  });

  test('no args', () => {
    throwOnConsole('assert');

    expect(() => console.assert()).toThrow('');
    // @ts-ignore
    expect(() => assert()).toThrow('No value argument passed to `assert.ok()`');

    restoreConsole('assert');
  });

  test('ignore option', () => {
    throwOnConsole('assert', { ignore: ['assert message'] });
    expect(() => console.assert(false, 'assert message')).not.toThrow();

    throwOnConsole('assert', { ignore: [] });
    expect(() => console.assert(false, 'assert message')).toThrow('assert message');
  });

  test('fullStackTrace option', () => {
    // Check console.error test
  });
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
      new RegExp(
        '^Warning: An update to TestComponent inside a test was not wrapped in act.*\n\n' +
          'When testing, code that causes React state updates should be wrapped into act.*\n\n' +
          'act.*\n' +
          '  /.*\n' +
          '}.*\n' +
          '.*\n\n' +
          "This ensures that you're testing the behavior the user would see in the browser.*\n" +
          `${space_at_Component_filename_lineNumber_space('TestComponent', '.*')}\n` +
          `${zeroWidthSpace}    at Suspense${space}${zeroWidthSpace}\n` +
          `${space_at_Component_filename_lineNumber_space('ErrorBoundary', '.*')}$`,
        's'
      )
    );
  });

  // Works solo, messes with the other tests (React 17.0.2)
  test.skip('Each child in a list should have a unique "key" prop.', () => {
    expect(() =>
      render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)
    ).toThrow(
      new RegExp(
        '^Warning: Each child in a list should have a unique "key" prop.*\n' +
          `${space_at_Component_filename_lineNumber_space(DivComponent.name)}$`,
        's'
      )
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
      new RegExp(
        '^Warning: Encountered two children with the same key, `0`.*\n' +
          `${zeroWidthSpace}    at div${space}${zeroWidthSpace}\n` +
          `${space_at_Component_filename_lineNumber_space(DivComponent.name)}$`,
        's'
      )
    );
  });

  test("Can't perform a React state update on an unmounted component", async () => {
    expect.assertions(1);

    function MyComponent() {
      const [, setState] = useState('Initial state');

      async function handleClick() {
        await wait(10);

        // React does not display this warning message if it has already been displayed
        // Subsequent calls after a throw won't throw because of
        // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L3025
        // @ts-ignore
        expect(() => setState('Update state')).toThrow(
          new RegExp(
            `^Warning: Can't perform a React state update on an unmounted component.*\n` +
              `${space_at_Component_filename_lineNumber_space(MyComponent.name)}$`,
            's'
          )
        );
      }

      return (
        <button type="button" onClick={handleClick}>
          button
        </button>
      );
    }

    const { unmount } = render(<MyComponent />);

    const button = screen.getByText<HTMLButtonElement>('button');

    fireEvent.click(button);

    unmount();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => wait(10 + 10));
  });

  test('React does not recognize the prop on a DOM element', () => {
    // @ts-ignore
    expect(() => render(<div unknownProp="value" />)).toThrow(
      new RegExp(
        '^Warning: React does not recognize the `unknownProp` prop on a DOM element.' +
          ' If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `unknownprop` instead.' +
          ' If you accidentally passed it from a parent component, remove it from the DOM element.\n' +
          `${zeroWidthSpace}    at div${space}${zeroWidthSpace}$`,
        's'
      )
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw will throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L165
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L29-L31
    // @ts-ignore
    expect(() => render(<div unknownProp="value" />)).toThrow();
  });

  test('Invalid DOM property', () => {
    // @ts-ignore
    expect(() => render(<div class="invalid" />)).toThrow(
      'Warning: Invalid DOM property `class`. Did you mean `className`?\n' +
        `${zeroWidthSpace}    at div${space}${zeroWidthSpace}`
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw will throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L150
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L29-L31
    // @ts-ignore
    expect(() => render(<div class="invalid" />)).toThrow();
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
      new RegExp(
        '^Warning: Cannot update a component \\(`Parent`\\) while rendering a different component \\(`Child`\\).*\n' +
          `${space_at_Component_filename_lineNumber_space(Child.name)}\n` +
          `${space_at_Component_filename_lineNumber_space(Parent.name)}$`,
        's'
      )
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L3210-L3211    // @ts-ignore
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
      new RegExp(
        '^Warning: React has detected a change in the order of Hooks called by MyComponent.*\n' +
          `${space_at_Component_filename_lineNumber_space(MyComponent.name)}$`,
        's'
      )
    );
  });

  test('A component is changing an uncontrolled input to be controlled', () => {
    function MyComponent() {
      const [name, setName] = useState<string | undefined>();
      return (
        <label>
          Name
          <input value={name} onChange={({ target }) => setName(target.value)} />
        </label>
      );
    }

    render(<MyComponent />);

    const input = screen.getByLabelText<HTMLInputElement>('Name');

    expect(() => fireEvent.change(input, { target: { value: 'John' } })).toThrow(
      new RegExp(
        '^Warning: A component is changing an uncontrolled input to be controlled.*\n' +
          `${space_at_Component_filename_lineNumber_space(MyComponent.name)}$`,
        's'
      )
    );
  });

  test('You provided a `value` prop to a form field without an `onChange` handler', () => {
    expect(() => render(<input value="John" />)).toThrow(
      new RegExp(
        '^Warning: You provided a `value` prop to a form field without an `onChange` handler.*\n' +
          `${zeroWidthSpace}    at input${space}${zeroWidthSpace}$`,
        's'
      )
    );

    // React always displays this warning message even if already displayed
    expect(() => render(<input value="John" />)).toThrow();
  });

  test('Unsupported style property', () => {
    // @ts-ignore
    expect(() => render(<div style={{ 'background-color': 'black' }} />)).toThrow(
      'Warning: Unsupported style property background-color. Did you mean backgroundColor?\n' +
        `${zeroWidthSpace}    at div${space}${zeroWidthSpace}`
    );

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/warnValidStyle.js#L35
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js#L29-L31
    // @ts-ignore
    expect(() => render(<div style={{ 'background-color': 'black' }} />)).not.toThrow();
  });

  test('ignore option', () => {
    expect(() => render(<input value="John" />)).toThrow();

    // substring
    throwOnConsole('error', {
      ignore: ['You provided a `value` prop to a form field without an `onChange` handler']
    });
    expect(() => render(<input value="John" />)).not.toThrow();

    // regex
    throwOnConsole('error', {
      ignore: [
        /^Warning: You provided a `value` prop to a form field without an `onChange` handler/
      ]
    });
    expect(() => render(<input value="John" />)).not.toThrow();
  });

  test('fullStackTrace option', () => {
    expect.assertions(5);

    try {
      render(<input value="John" />);
    } catch (e) {
      assert(e instanceof Error);
      expect(e.stack).not.toContain('at throwError');
    }

    throwOnConsole('error', { fullStackTrace: false });
    try {
      render(<input value="John" />);
    } catch (e) {
      assert(e instanceof Error);
      expect(e.stack).not.toContain('at throwError');
    }

    throwOnConsole('error', { fullStackTrace: true });
    try {
      render(<input value="John" />);
    } catch (e) {
      assert(e instanceof Error);
      expect(e.stack).toContain('at throwError');
    }

    try {
      render(<input value="John" />);
    } catch (e) {
      assert(e instanceof Error);
      expect(e.stack).toContain('at throwError');
    }

    throwOnConsole('error');
    try {
      render(<input value="John" />);
    } catch (e) {
      assert(e instanceof Error);
      expect(e.stack).not.toContain('at throwError');
    }
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
      new RegExp(
        '^Warning: componentWillMount has been renamed, and is not recommended for use.*\n' +
          'Please update the following components: MyComponent$',
        's'
      )
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
      new RegExp(
        '^Warning: componentWillUpdate has been renamed, and is not recommended for use.*\n' +
          'Please update the following components: MyComponent$',
        's'
      )
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

    // React does not display this warning message if it has already been displayed
    // Subsequent calls after a throw won't throw because of
    // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactStrictModeWarnings.old.js#L68-L70
    expect(() => render(<MyComponent />)).not.toThrow();
  });

  test('fullStackTrace option', () => {
    // Check console.error test
  });
});

test('with Error.captureStackTrace (V8) vs without', () => {
  expect.assertions(4);

  throwOnConsole('error');

  const original = Error.captureStackTrace;
  (Error.captureStackTrace as any) = undefined;
  try {
    console.error('error message');
  } catch (e) {
    assert(e instanceof Error);
    expect(e.stack).toContain('at throwError');
    expect(e.stack).toContain('at console.error');
  }
  Error.captureStackTrace = original;

  try {
    console.error('error message');
  } catch (e) {
    assert(e instanceof Error);
    expect(e.stack).not.toContain('at throwError');
    expect(e.stack).not.toContain('at console.error');
  }
});
