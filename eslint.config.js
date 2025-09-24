module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      '.env',
      'config.local.js',
    ],
  },
]);
