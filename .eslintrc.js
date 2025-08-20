module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    // 'import',
    // 'json5',
    '@typescript-eslint',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**', '.*/**', 'public/**'],
  rules: {
    'react/jsx-uses-react': ['off'],
    'react/jsx-props-no-spreading': ['warn'],
    'react/no-unescaped-entities': ['off'],
    'react/jsx-filename-extension': [1,
      {extensions: ['.js', '.jsx', 'ts', 'tsx']}],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-indent-props': ['error', 'first'],
    'max-len': ['error', {code: 120}],
    // 'indent': ['error', 2, {
    //   "SwitchCase": 1,
    // }],
    'import/no-extraneous-dependencies': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'linebreak-style': 'off',
    'class-methods-use-this': 'off',
    'react/no-unstable-nested-components': ['error', {allowAsProps: true}],
    'arrow-body-style': ['error', 'always'],
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': ['error', {args: 'none'}],
    'no-underscore-dangle': ['error', {
      allow: ['_form', '_id', '_index', '_raw', '_unset']
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    "react/jsx-no-duplicate-props": ['error', {"ignoreCase": false}],
    '@typescript-eslint/ban-ts-comment': ['error', {'ts-ignore': 'allow-with-description'}],
    'max-classes-per-file': 'off',
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["./", "../"],
            "message": "Relative imports are not allowed. Please use absolute paths or alias paths."
          }
        ]
      }
    ],
    'import/no-cycle': ['error', {
      maxDepth: 2
    }],
    // "quotes": [2, "single", {"avoidEscape": true}],
    'prettier/prettier': ['error', {
      printWidth: 120,
      singleQuote: true,
      semi: false,
      bracketSpacing: false,
      bracketSameLine: false,
      jsxBracketSameLine: false,
      trailingComma: "all",
      arrowParens: "always"
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.scss'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {
        'extensions': ['.js', '.jsx', '.ts', '.tsx']
      },
      'typescript': {
        'alwaysTryTypes': true,
        'project': './tsconfig.json',
      }
    },
  },
}
