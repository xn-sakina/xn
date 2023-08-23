module.exports = [
  ...require('eslint-plugin-sakina/recommended')({
    tsconfig: ['./packages/*/tsconfig.json'],
    root: __dirname,
  }),
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
]
