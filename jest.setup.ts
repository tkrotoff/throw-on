import {
  throwOnConsoleAssert,
  throwOnConsoleError,
  throwOnConsoleWarn,
  throwOnFetch,
  throwOnXMLHttpRequestOpen
} from './src';

throwOnConsoleAssert();
throwOnConsoleError();
throwOnConsoleWarn();
throwOnFetch();
throwOnXMLHttpRequestOpen();
