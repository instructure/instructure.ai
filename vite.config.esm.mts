/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const existing = (p: string) => {
  try {
    fs.accessSync(p);
    return p;
  } catch {
    return null;
  }
}
const CWD_TS = existing(path.resolve(process.cwd(), 'tsconfig.json'));
const ROOT_TS = existing(path.resolve(ROOT_DIR, 'tsconfig.json'));
const ROOT_NODE_TS = existing(path.resolve(ROOT_DIR, 'tsconfig.node.json'));
const PROJECTS = [CWD_TS, ROOT_TS, ROOT_NODE_TS].filter(Boolean) as string[];

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    lib: {
      entry: 'src/index.mts',
      formats: ['es'],
      fileName: () => "index.mjs",
    },
    rollupOptions: {
      output: { exports: "named" },
    },
    sourcemap: false,
    target: "esnext",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
        module: true,
        passes: 2,
        pure_getters: true,
        toplevel: true,
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      format: {
        comments: false,
      },
      mangle: {
        toplevel: true,
      },
    },
  },
  plugins: [
    tsconfigPaths({
      projects: PROJECTS,
      ignoreConfigErrors: true,
      loose: true,
    })
  ],
});
