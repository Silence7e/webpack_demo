module.exports = {
  root: true,
  extends: 'airbnb',
  plugins: ['html'],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  globals: {
    $: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off'
  }
}
