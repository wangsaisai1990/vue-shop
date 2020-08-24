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
    'camelcase': 0,
    "space-in-parens": ["off", "always"],
    "vue/no-unused-vars": 'off',
    "object-curly-newline": ["off", { "ObjectExpression": "always","ObjectPattern": { "multiline": true } }],
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
    "space-before-function-paren": 0,
    "quote-props":[0, "always"],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': [0, 'off', 'windows'],
  }
}
