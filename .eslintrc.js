module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: [
    'react'
  ],
  rules: {
    'prettier/prettier': 0,
    'comma-dangle': [1, 'never'],
    'eol-last': 1,
    'func-style': [0, 'expression', { 'allowArrowFunctions': true }],
    'key-spacing': [1, {'beforeColon': false, 'afterColon': true}],
    'keyword-spacing': 0,
    'arrow-spacing': [1, {'before': true, 'after': true}],
    'no-var': 2,
    'prefer-const': [1, {'destructuring': 'all'}],
    'rest-spread-spacing': [2, 'never'],
    'curly': 0,
    'jsx-quotes': [1, 'prefer-double'],
    'react/prop-types': 1,
    'react/self-closing-comp': 0,
    'no-return-assign': 0
  }
};
