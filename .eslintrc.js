module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'indent': ['off', 2],
    'semi': 0,
    "object-curly-newline": ["error", { "multiline": true, "minProperties": 4 }],
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
    "space-before-function-paren": 0,
    "quote-props":[0, "always"],
    'linebreak-style': [0, 'error', 'windows'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
