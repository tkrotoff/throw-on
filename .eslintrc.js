// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {},
  extends: [
    // /!\ Order matters: the next one overrides rules from the previous one
    'plugin:testing-library/react',
    'plugin:jest/recommended',
    'plugin:unicorn/recommended',
    'airbnb',
    // Already done by Airbnb
    //'plugin:react/recommended'
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['simple-import-sort', 'react-hooks'],
  env: {
    browser: true,
    es2021: true
  },
  globals: {},
  settings: {
    // https://github.com/yannickcr/eslint-plugin-react/blob/v7.19.0/lib/util/version.js#L36
    react: {
      version: '999.999.999'
    },
    jest: {
      version: 999
    }
  },

  rules: {
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-prototype-builtins': 'off',
    'no-plusplus': 'off',
    'spaced-comment': 'off',
    'lines-between-class-members': 'off',
    'no-useless-constructor': 'off',
    'max-classes-per-file': 'off',
    // [no-return-assign should be configurable to ignore arrow-functions](https://github.com/eslint/eslint/issues/9471)
    'no-return-assign': 'off',
    // https://stackoverflow.com/a/50346856
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-restricted-syntax': 'off',

    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    // [Avoid Export Default](https://basarat.gitbook.io/typescript/main-1/defaultisbad)
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',

    'simple-import-sort/imports': [
      'error',
      {
        // https://github.com/lydell/eslint-plugin-simple-import-sort/blob/v7.0.0/src/imports.js#L5
        groups: [
          // Side effect imports
          ['^\\u0000'],

          // Packages
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter
          ['^@?\\w'],

          // Absolute imports and other imports such as Vue-style `@/foo`
          // Anything not matched in another group
          ['^'],

          // Relative imports
          [
            // https://github.com/lydell/eslint-plugin-simple-import-sort/issues/15

            // ../whatever/
            '^\\.\\./(?=.*/)',
            // ../
            '^\\.\\./',
            // ./whatever/
            '^\\./(?=.*/)',
            // Anything that starts with a dot
            '^\\.',
            // .html are not side effect imports
            '^.+\\.html$',
            // .scss/.css are not side effect imports
            '^.+\\.s?css$'
          ]
        ]
      }
    ],
    'simple-import-sort/exports': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/v4.1.0/packages/eslint-plugin/docs/rules/no-use-before-define.md
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/v4.1.0/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/catch-error-name': 'off',
    'unicorn/no-for-loop': 'off',
    'unicorn/no-null': 'off',
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v27.0.0/docs/rules/no-array-for-each.md
    // https://github.com/github/eslint-plugin-github/blob/v4.1.1/docs/rules/array-foreach.md
    // conflicts with
    // https://github.com/airbnb/javascript/issues/1271
    'unicorn/no-array-for-each': 'off',
    // FIXME Activate when ES modules are well supported
    'unicorn/prefer-module': 'off',

    'jsx-a11y/label-has-associated-control': 'off',

    'react/no-unescaped-entities': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // FIXME https://github.com/yannickcr/eslint-plugin-react/issues/3114#issuecomment-951725512
    'react/jsx-no-bind': 'off',
    'react/function-component-definition': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    'jest/expect-expect': 'off',
    'jest/no-conditional-expect': 'off'
  },

  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        'no-multi-str': 'off',

        'react/jsx-props-no-spreading': 'off',
        'react/jsx-boolean-value': 'off',

        'unicorn/consistent-function-scoping': 'off',

        'jest/no-disabled-tests': 'off'
      }
    }
  ]
};

module.exports = config;
