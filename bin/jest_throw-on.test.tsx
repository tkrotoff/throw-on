/* eslint-disable react/no-deprecated, @typescript-eslint/no-empty-function */

import { render } from '@testing-library/react';
import { Component } from 'react';

import {
  restoreConsoleError,
  throwOnConsoleError,
  throwOnConsoleWarn
} from '../src/throwOnConsole';

test('throwOnConsoleError() Jest output fix', () => {
  restoreConsoleError();
  render(<input value="John" />);

  // Should display:
  //
  // console.error
  //   Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
  //       at input
  //
  //     at printWarning (node_modules/react-dom/cjs/react-dom.development.js:67:30)
  //     at error (node_modules/react-dom/cjs/react-dom.development.js:43:5)
  //     at checkControlledValueProps (node_modules/react-dom/cjs/react-dom.development.js:1323:7)
  //     at initWrapperState (node_modules/react-dom/cjs/react-dom.development.js:1495:5)
  //     at setInitialProperties (node_modules/react-dom/cjs/react-dom.development.js:9099:7)
  //     at finalizeInitialChildren (node_modules/react-dom/cjs/react-dom.development.js:10201:3)
  //     at completeWork (node_modules/react-dom/cjs/react-dom.development.js:19470:17)
  //
  // instead of:
  //
  // console.error
  //   Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
  //       at input
  //
  //     53 |
  //     54 |   if (shouldNotThrow) {
  //   > 55 |     originalConsoleMethod(...data);
  //        |     ^
  //     56 |   } else {
  //     57 |     // React adds its own stack trace to the console.error() message:
  //     58 |     // https://github.com/facebook/react/blob/v17.0.2/packages/shared/consoleWithStackDev.js#L33-L37
  //
  //     at throwError (src/throwOnConsole.ts:55:5)
  //     at console.error (src/throwOnConsole.ts:93:5)
  //     at printWarning (node_modules/react-dom/cjs/react-dom.development.js:67:30)
  //     at error (node_modules/react-dom/cjs/react-dom.development.js:43:5)
  //     at checkControlledValueProps (node_modules/react-dom/cjs/react-dom.development.js:1323:7)
  //     at initWrapperState (node_modules/react-dom/cjs/react-dom.development.js:1495:5)
  //     at setInitialProperties (node_modules/react-dom/cjs/react-dom.development.js:9099:7)
  throwOnConsoleError({
    ignore: ['You provided a `value` prop to a form field without an `onChange` handler']
  });
  expect(() => render(<input value="John" />)).not.toThrow();
});

test('throwOnConsoleWarn() Jest output fix', () => {
  class MyComponent extends Component {
    componentWillReceiveProps() {}

    render() {
      return <div />;
    }
  }

  // Should display:
  //
  // console.warn
  //   Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
  //
  //   * Move data fetching code or side effects to componentDidUpdate.
  //   * If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
  //   * Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.
  //
  //   Please update the following components: MyComponent
  //
  //     at printWarning (node_modules/react-dom/cjs/react-dom.development.js:67:30)
  //     at warn (node_modules/react-dom/cjs/react-dom.development.js:34:5)
  //     at Object.<anonymous>.ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings (node_modules/react-dom/cjs/react-dom.development.js:11530:7)
  //     at flushRenderPhaseStrictModeWarningsInDEV (node_modules/react-dom/cjs/react-dom.development.js:23822:31)
  //     at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:23005:3)
  //     at unstable_runWithPriority (node_modules/scheduler/cjs/scheduler.development.js:468:12)
  //     at runWithPriority$1 (node_modules/react-dom/cjs/react-dom.development.js:11276:10)
  //
  // instead of:
  //
  // console.warn
  //   Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
  //
  //   * Move data fetching code or side effects to componentDidUpdate.
  //   * If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
  //   * Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.
  //
  //   Please update the following components: MyComponent
  //
  //     53 |
  //     54 |   if (shouldNotThrow) {
  //   > 55 |     originalConsoleMethod(...data);
  //        |     ^
  //     56 |   } else {
  //     57 |     // React adds its own stack trace to the console.error() message:
  //     58 |     // https://github.com/facebook/react/blob/v17.0.2/packages/shared/consoleWithStackDev.js#L33-L37
  //
  //     at throwError (src/throwOnConsole.ts:55:5)
  //     at console.warn (src/throwOnConsole.ts:112:5)
  //     at printWarning (node_modules/react-dom/cjs/react-dom.development.js:67:30)
  //     at warn (node_modules/react-dom/cjs/react-dom.development.js:34:5)
  //     at Object.<anonymous>.ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings (node_modules/react-dom/cjs/react-dom.development.js:11530:7)
  //     at flushRenderPhaseStrictModeWarningsInDEV (node_modules/react-dom/cjs/react-dom.development.js:23822:31)
  //     at commitRootImpl (node_modules/react-dom/cjs/react-dom.development.js:23005:3)
  throwOnConsoleWarn({ ignore: ['componentWillReceiveProps has been renamed'] });
  expect(() => render(<MyComponent />)).not.toThrow();
});
