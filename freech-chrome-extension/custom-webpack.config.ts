import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: { import: 'src/background.ts', runtime: false },
    content: { import: 'src/content_script.ts', runtime: false },
    inject: { import: 'src/inject_script.ts', runtime: false }
  },
  node: { global: true },
  experiments:{
    topLevelAwait: false
  },
  resolve: {
    fallback: {
      "constants": require.resolve("constants-browserify")
    }
  },
} as Configuration;
