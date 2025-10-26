/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 80,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
