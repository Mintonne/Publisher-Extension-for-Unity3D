module.exports = {
  root: true,
  env: {
    browser: true,
    webextensions: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
