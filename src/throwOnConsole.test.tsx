import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import path from 'path';
import { Component, createContext, useContext, useState } from 'react';

import {
  restoreConsoleAssert,
  restoreConsoleError,
  restoreConsoleWarn,
  throwOnConsoleAssert,
  throwOnConsoleError,
  throwOnConsoleWarn
} from './throwOnConsole';
import { wait } from './wait';

const filename = path.basename(__filename);

function at_Component_filename_lineNumber_dot(componentName: string) {
  return `    at ${componentName} \\(.*${filename}:\\d+:\\d+\\)\\.`;
}

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('throw + restore console.error', () => {
  restoreConsoleError();

  const originalConsoleError = console.error;
  expect(originalConsoleError).toEqual(console.error);

  throwOnConsoleError();
  expect(originalConsoleError).not.toEqual(console.error);

  restoreConsoleError();
  expect(originalConsoleError).toEqual(console.error);
});

test('throw + restore console.warn', () => {
  restoreConsoleWarn();

  const originalConsoleWarn = console.warn;
  expect(originalConsoleWarn).toEqual(console.warn);

  throwOnConsoleWarn();
  expect(originalConsoleWarn).not.toEqual(console.warn);

  restoreConsoleWarn();
  expect(originalConsoleWarn).toEqual(console.warn);
});

test('throw + restore console.assert', () => {
  restoreConsoleAssert();

  const originalConsoleAssert = console.assert;
  expect(originalConsoleAssert).toEqual(console.assert);

  throwOnConsoleAssert();
  expect(originalConsoleAssert).not.toEqual(console.assert);

  restoreConsoleAssert();
  expect(originalConsoleAssert).toEqual(console.assert);
});

test('throwOnConsoleAssert()', () => {
  throwOnConsoleAssert();

  expect(() => console.assert(false, 'error message')).toThrow('error message');

  restoreConsoleAssert();
});

describe('throwOnConsoleError()', () => {
  beforeAll(() => {
    throwOnConsoleError();
  });

  afterAll(() => {
    restoreConsoleError();
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
      /^Warning: An update to TestComponent inside a test was not wrapped in act.*/s
    );
  });

  // Works solo, not with the other tests
  test.skip('Each child in a list should have a unique "key" prop.', () => {
    expect(() =>
      render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)
    ).toThrow(
      new RegExp(
        '^Warning: Each child in a list should have a unique "key" prop.*' +
          `${at_Component_filename_lineNumber_dot(DivComponent.name)}$`,
        's'
      )
    );
  });

  test('Encountered two children with the same key', () => {
    expect(() =>
      render(<DivComponent>{[<DivComponent key="0" />, <DivComponent key="0" />]}</DivComponent>)
    ).toThrow(
      new RegExp(
        '^Warning: Encountered two children with the same key, `0`.*' +
          `    at div\n` +
          `${at_Component_filename_lineNumber_dot(DivComponent.name)}$`,
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
        expect(() => setState('Update state')).toThrow(
          new RegExp(
            `^Warning: Can't perform a React state update on an unmounted component.*` +
              `${at_Component_filename_lineNumber_dot(MyComponent.name)}$`,
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
        'Warning: React does not recognize the `unknownProp` prop on a DOM element.' +
          ' If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `unknownprop` instead.' +
          ' If you accidentally passed it from a parent component, remove it from the DOM element.\n' +
          '    at div',
        's'
      )
    );
  });

  test('Invalid DOM property', () => {
    // @ts-ignore
    // eslint-disable-next-line react/no-unknown-property
    expect(() => render(<div class="invalid" />)).toThrow(
      // eslint-disable-next-line no-regex-spaces
      'Warning: Invalid DOM property `class`. Did you mean `className`?\n    at div'
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
      new RegExp(
        '^Warning: Cannot update a component \\(`Parent`\\) while rendering a different component \\(`Child`\\).*' +
          `${at_Component_filename_lineNumber_dot(Child.name)}\n` +
          `${at_Component_filename_lineNumber_dot(Parent.name)}$`,
        's'
      )
    );
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
        '^Warning: React has detected a change in the order of Hooks called by MyComponent.*' +
          `${at_Component_filename_lineNumber_dot(MyComponent.name)}$`,
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
        '^Warning: A component is changing an uncontrolled input to be controlled.*' +
          `${at_Component_filename_lineNumber_dot(MyComponent.name)}$`,
        's'
      )
    );
  });

  test('You provided a `value` prop to a form field without an `onChange` handler', () => {
    function MyComponent() {
      return <input value="John" />;
    }

    expect(() => render(<MyComponent />)).toThrow(
      new RegExp(
        '^Warning: You provided a `value` prop to a form field without an `onChange` handler.*' +
          '    at input\n' +
          '    at MyComponent',
        's'
      )
    );
  });

  test('Unsupported style property', () => {
    function MyComponent() {
      // @ts-ignore
      return <div style={{ 'background-color': 'black' }} />;
    }

    expect(() => render(<MyComponent />)).toThrow(
      'Warning: Unsupported style property background-color. Did you mean backgroundColor?\n    at div\n    at MyComponent'
    );
  });
});

describe('throwOnConsoleWarn()', () => {
  beforeAll(() => {
    throwOnConsoleWarn();
  });

  afterAll(() => {
    restoreConsoleWarn();
  });

  test('componentWillMount has been renamed, and is not recommended for use', () => {
    class MyComponent extends Component {
      // eslint-disable-next-line react/no-deprecated, @typescript-eslint/no-empty-function
      componentWillMount() {}

      render() {
        return <DivComponent />;
      }
    }

    expect(() => render(<MyComponent />)).toThrow(
      new RegExp(
        '^Warning: componentWillMount has been renamed, and is not recommended for use.*' +
          'Please update the following components: MyComponent$',
        's'
      )
    );
  });
});
