import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

// FIXME This is fucked up in React 18.2.0
//
// Output generated:
//
// console.error
//   Warning: A component is changing an uncontrolled input to be controlled. [...]
//
// console.error
//   Error: Uncaught [ThrowOnError: throw-on console.error: Warning: A component is changing an uncontrolled input to be controlled. [...]
//
// console.error
//   Error: Uncaught [ThrowOnError: throw-on console.error: Error { detail: [ThrowOnError: throw-on console.error: Warning: A component is changing an uncontrolled input to be controlled. [...]
//
// console.error
//   Warning: Attempted to synchronously unmount a root while React was already rendering. [...]
//
// throw-on console.error: Warning: Attempted to synchronously unmount a root while React was already rendering. [...]
//
test.skip('A component is changing an uncontrolled input to be controlled', () => {
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
    'throw-on console.error: Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components'
  );
});
