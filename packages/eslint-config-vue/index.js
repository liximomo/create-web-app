module.exports = {
  extends: ['@fea/eslint-config-base', 'plugin:vue/essential'],

  plugins: ['vue'],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'vue/mustache-interpolation-spacing': ['error', 'never'],
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-multi-spaces': 'error',
    'vue/v-bind-style': 'error',
    'vue/v-on-style': 'error',
  },
};
