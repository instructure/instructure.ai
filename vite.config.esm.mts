/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.mts',
      formats: ['es'],
      fileName: () => "index.mjs",
    },
  },
  plugins: [dts()],
});
